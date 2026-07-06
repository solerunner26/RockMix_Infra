import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import crypto from "crypto";
import xlsx from "xlsx";
import { initExcelDb, saveContactUs, saveDealershipApplication, saveGetAQuote } from "./excelDb";

dotenv.config();

// Initialize Excel Database
initExcelDb();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Configure payload limit for base64 image uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Helper files for CMS persistence
  const CONTENT_FILE_PATH = path.join(process.cwd(), "siteContent.json");
  const PASSWORD_FILE_PATH = path.join(process.cwd(), "adminPassword.json");
  const CREDENTIALS_FILE_PATH = path.join(process.cwd(), "adminCredentials.json");
  const BOOTSTRAP_CONTENT_PATH = path.join(process.cwd(), "src", "data", "siteContent.json");

  // Helper: Hash password with SHA-256
  const hashPassword = (password: string) => {
    return crypto.createHash("sha256").update(password).digest("hex");
  };

  // Ensure uploads directory exists
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // API Route: Get Site Content
  app.get("/api/content", (req, res) => {
    try {
      if (fs.existsSync(CONTENT_FILE_PATH)) {
        const data = fs.readFileSync(CONTENT_FILE_PATH, "utf8");
        return res.json(JSON.parse(data));
      } else if (fs.existsSync(BOOTSTRAP_CONTENT_PATH)) {
        const data = fs.readFileSync(BOOTSTRAP_CONTENT_PATH, "utf8");
        // Save it to root siteContent.json as the editable copy
        fs.writeFileSync(CONTENT_FILE_PATH, data, "utf8");
        return res.json(JSON.parse(data));
      } else {
        return res.status(404).json({ error: "Site content source not found." });
      }
    } catch (error: any) {
      console.error("Error in GET /api/content:", error);
      res.status(500).json({ error: "Failed to read site content." });
    }
  });

  // API Route: Update Site Content
  app.post("/api/content/update", (req, res) => {
    try {
      const updatedContent = req.body;
      fs.writeFileSync(CONTENT_FILE_PATH, JSON.stringify(updatedContent, null, 2), "utf8");
      console.log("Site content updated persistently in siteContent.json.");
      res.json({ success: true, message: "Site content updated successfully." });
    } catch (error: any) {
      console.error("Error in POST /api/content/update:", error);
      res.status(500).json({ error: "Failed to save site content update." });
    }
  });

  // API Route: Reset Site Content
  app.post("/api/content/reset", (req, res) => {
    try {
      if (fs.existsSync(BOOTSTRAP_CONTENT_PATH)) {
        const data = fs.readFileSync(BOOTSTRAP_CONTENT_PATH, "utf8");
        fs.writeFileSync(CONTENT_FILE_PATH, data, "utf8");
        console.log("Site content reset to factory defaults.");
        res.json({ success: true, message: "Site content reset to default successfully." });
      } else {
        res.status(404).json({ error: "Factory default site content not found." });
      }
    } catch (error: any) {
      console.error("Error in POST /api/content/reset:", error);
      res.status(500).json({ error: "Failed to reset site content." });
    }
  });

  // API Route: Admin Login
  app.post("/api/admin/login", (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
      }

      let correctUsername = "rockmin";
      let correctHash = "";

      if (fs.existsSync(CREDENTIALS_FILE_PATH)) {
        try {
          const creds = JSON.parse(fs.readFileSync(CREDENTIALS_FILE_PATH, "utf8"));
          correctUsername = creds.username || "rockmin";
          correctHash = creds.passwordHash || "";
        } catch (e) {
          console.error("Error reading credentials file, using fallbacks:", e);
        }
      }

      if (!correctHash) {
        if (fs.existsSync(PASSWORD_FILE_PATH)) {
          correctHash = fs.readFileSync(PASSWORD_FILE_PATH, "utf8").trim();
        } else {
          // Default password is Rock@2026#mix
          correctHash = hashPassword("Rock@2026#mix");
        }
      }

      if (username === correctUsername && hashPassword(password) === correctHash) {
        return res.json({ success: true });
      } else {
        return res.status(401).json({ error: "Invalid username or password." });
      }
    } catch (error: any) {
      console.error("Error in POST /api/admin/login:", error);
      res.status(500).json({ error: "Authentication system failure." });
    }
  });

  // API Route: Admin Change Password & Account Details
  app.post("/api/admin/change-password", (req, res) => {
    try {
      const { currentPassword, newUsername, newPassword } = req.body;
      if (!currentPassword) {
        return res.status(400).json({ error: "Current password is required for verification." });
      }

      let currentUsername = "rockmin";
      let correctHash = "";

      if (fs.existsSync(CREDENTIALS_FILE_PATH)) {
        try {
          const creds = JSON.parse(fs.readFileSync(CREDENTIALS_FILE_PATH, "utf8"));
          currentUsername = creds.username || "rockmin";
          correctHash = creds.passwordHash || "";
        } catch (e) {}
      }

      if (!correctHash) {
        if (fs.existsSync(PASSWORD_FILE_PATH)) {
          correctHash = fs.readFileSync(PASSWORD_FILE_PATH, "utf8").trim();
        } else {
          correctHash = hashPassword("Rock@2026#mix");
        }
      }

      if (hashPassword(currentPassword) !== correctHash) {
        return res.status(400).json({ error: "Current password verification failed." });
      }

      // Prepare updated values
      const finalUsername = newUsername ? newUsername.trim() : currentUsername;
      let finalHash = correctHash;

      if (newPassword) {
        // Password rule checks
        if (newPassword.length < 12) {
          return res.status(400).json({ error: "New password must be at least 12 characters long." });
        }
        if (!/[A-Z]/.test(newPassword)) {
          return res.status(400).json({ error: "New password must contain at least one uppercase letter." });
        }
        if (!/[a-z]/.test(newPassword)) {
          return res.status(400).json({ error: "New password must contain at least one lowercase letter." });
        }
        if (!/[0-9]/.test(newPassword)) {
          return res.status(400).json({ error: "New password must contain at least one number." });
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
          return res.status(400).json({ error: "New password must contain at least one special character." });
        }

        // Weak word checks
        const weakWords = ["password", "admin", "rockmix", "qwerty", "123456", "welcome"];
        const lowerPass = newPassword.toLowerCase();
        if (lowerPass.includes(finalUsername.toLowerCase())) {
          return res.status(400).json({ error: "Password must not contain the username." });
        }
        for (const word of weakWords) {
          if (lowerPass.includes(word)) {
            return res.status(400).json({ error: `Password cannot contain weak word "${word}".` });
          }
        }

        finalHash = hashPassword(newPassword);
      }

      // Validate new username if changed
      if (newUsername) {
        const userTrim = newUsername.trim();
        if (userTrim.length < 4 || userTrim.length > 30) {
          return res.status(400).json({ error: "Username must be between 4 and 30 characters." });
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(userTrim)) {
          return res.status(400).json({ error: "Username can only contain letters, numbers, hyphens, and underscores." });
        }
      }

      // Save updated credentials to adminCredentials.json
      fs.writeFileSync(CREDENTIALS_FILE_PATH, JSON.stringify({
        username: finalUsername,
        passwordHash: finalHash
      }, null, 2), "utf8");

      // Sync with adminPassword.json for backwards compatibility
      fs.writeFileSync(PASSWORD_FILE_PATH, finalHash, "utf8");

      console.log(`Admin credentials updated successfully. Username: ${finalUsername}`);
      res.json({ success: true, message: "Account credentials updated successfully." });
    } catch (error: any) {
      console.error("Error in POST /api/admin/change-password:", error);
      res.status(500).json({ error: "Failed to update admin credentials." });
    }
  });

  // API Route: Get Unified Leads from Excel Database
  app.get("/api/admin/leads", (req, res) => {
    try {
      const EXCEL_FILE_PATH = path.resolve(process.cwd(), "database.xlsx");
      if (!fs.existsSync(EXCEL_FILE_PATH)) {
        return res.json([]);
      }

      const wb = xlsx.readFile(EXCEL_FILE_PATH);
      const unifiedLeads: any[] = [];

      // 1. Process "Contact Us" Sheet
      if (wb.SheetNames.includes("Contact Us")) {
        const sheet = wb.Sheets["Contact Us"];
        const rows: any[] = xlsx.utils.sheet_to_json(sheet);
        rows.forEach((row, index) => {
          unifiedLeads.push({
            id: `contact-${index}-${row["Submitted At"] || Date.now()}`,
            name: `${row["First Name"] || ""} ${row["Last Name"] || ""}`.trim() || "N/A",
            email: row["Email ID"] || "N/A",
            phone: row["Mobile No."] || "N/A",
            company: row["Organization"] || "N/A",
            city: row["City"] || "N/A",
            message: row["Message"] || "N/A",
            products: "N/A",
            source: "Contact Us",
            submittedAt: row["Submitted At"] || new Date().toISOString()
          });
        });
      }

      // 2. Process "Dealership Application" Sheet
      if (wb.SheetNames.includes("Dealership Application")) {
        const sheet = wb.Sheets["Dealership Application"];
        const rows: any[] = xlsx.utils.sheet_to_json(sheet);
        rows.forEach((row, index) => {
          unifiedLeads.push({
            id: `dealer-${index}-${row["Submitted At"] || Date.now()}`,
            name: row["Key Contact Person"] || row["Owner/MD Name"] || "N/A",
            email: row["Email Address"] || "N/A",
            phone: row["Mobile Number"] || row["Phone Number"] || "N/A",
            company: row["Company Name"] || "N/A",
            city: row["City State Country"] || "N/A",
            message: `Activities: ${row["Current Business Activities"] || "N/A"}. Existing Dealerships: ${row["Existing Dealerships"] || "N/A"}. Annual Turnover: ${row["Annual Turnover"] || "N/A"}`,
            products: "N/A",
            source: "Dealership App",
            submittedAt: row["Submitted At"] || new Date().toISOString()
          });
        });
      }

      // 3. Process "getAquote" Sheet
      if (wb.SheetNames.includes("getAquote")) {
        const sheet = wb.Sheets["getAquote"];
        const rows: any[] = xlsx.utils.sheet_to_json(sheet);
        rows.forEach((row, index) => {
          unifiedLeads.push({
            id: `quote-${index}-${row["Submitted At"] || Date.now()}`,
            name: row["Full Name"] || "N/A",
            email: row["Email Address"] || "N/A",
            phone: row["Phone Number"] || "N/A",
            company: row["Company Name"] || "N/A",
            city: row["Address"] || "N/A",
            message: row["Message / Custom Requirement"] || "N/A",
            products: row["Product Selection"] || "N/A",
            source: "Get a Quote",
            submittedAt: row["Submitted At"] || new Date().toISOString()
          });
        });
      }

      // Sort newest first
      unifiedLeads.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

      res.json(unifiedLeads);
    } catch (error: any) {
      console.error("Error retrieving unified leads:", error);
      res.status(500).json({ error: "Failed to retrieve leads from Excel database." });
    }
  });

  // API Route: List All Uploaded and Default Product PDFs/Brochures
  app.get("/api/admin/pdfs", (req, res) => {
    try {
      const pdfs: any[] = [];
      const uploadsDir = path.join(process.cwd(), "public", "uploads");

      // 1. Scan public/uploads
      if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir);
        files.forEach(file => {
          if (file.toLowerCase().endsWith(".pdf")) {
            const filePath = path.join(uploadsDir, file);
            const stats = fs.statSync(filePath);
            pdfs.push({
              name: file,
              url: `/uploads/${file}`,
              size: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
              uploadedAt: stats.mtime.toISOString(),
              isUserUploaded: true
            });
          }
        });
      }

      // 2. Scan default product directories for pre-existing brochures
      const publicDir = path.join(process.cwd(), "public");
      const subdirs = ["prd1", "prd2", "prd3", "prd4", "prd5", "prd6"];
      subdirs.forEach(subdir => {
        const dirPath = path.join(publicDir, subdir);
        if (fs.existsSync(dirPath)) {
          const files = fs.readdirSync(dirPath);
          files.forEach(file => {
            if (file.toLowerCase().endsWith(".pdf")) {
              const filePath = path.join(dirPath, file);
              const stats = fs.statSync(filePath);
              pdfs.push({
                name: `${subdir}/${file}`,
                url: `/${subdir}/${file}`,
                size: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
                uploadedAt: stats.mtime.toISOString(),
                isUserUploaded: false
              });
            }
          });
        }
      });

      res.json(pdfs);
    } catch (error: any) {
      console.error("Error listing PDFs:", error);
      res.status(500).json({ error: "Failed to retrieve brochure PDFs." });
    }
  });

  // API Route: PDF Brochure Upload (Saves base64 directly to public/uploads)
  app.post("/api/pdf/upload", (req, res) => {
    try {
      const { fileName, fileData } = req.body;
      if (!fileName || !fileData) {
        return res.status(400).json({ error: "Missing required fileName or fileData fields." });
      }

      if (!fileName.toLowerCase().endsWith(".pdf")) {
        return res.status(400).json({ error: "Only PDF documents are allowed for upload." });
      }

      // Ensure upload directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Safe clean filename
      const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
      const targetPath = path.join(uploadDir, cleanFileName);

      // Convert base64 back to binary buffer
      const base64Clean = fileData.replace(/^data:application\/pdf;base64,/, "");
      fs.writeFileSync(targetPath, Buffer.from(base64Clean, "base64"));

      console.log(`Uploaded PDF saved at: ${targetPath}`);
      res.json({ success: true, filePath: `/uploads/${cleanFileName}` });
    } catch (error: any) {
      console.error("Error in POST /api/pdf/upload:", error);
      res.status(500).json({ error: "Failed to upload PDF brochure." });
    }
  });

  // API Route: Image Upload (Saves base64 directly to public/uploads)
  app.post("/api/image/upload", (req, res) => {
    try {
      const { fileName, fileData } = req.body;
      if (!fileName || !fileData) {
        return res.status(400).json({ error: "Missing required fileName or fileData fields." });
      }

      // Safe clean filename
      const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
      const targetPath = path.join(uploadDir, cleanFileName);

      // Convert base64 back to binary buffer
      const base64Clean = fileData.replace(/^data:image\/\w+;base64,/, "");
      fs.writeFileSync(targetPath, Buffer.from(base64Clean, "base64"));
      
      console.log(`Uploaded image saved at: ${targetPath}`);
      res.json({ success: true, filePath: `/uploads/${cleanFileName}` });
    } catch (error: any) {
      console.error("Error in POST /api/image/upload:", error);
      res.status(500).json({ error: "Failed to upload image." });
    }
  });

  // API Route: AI-powered Technical Advisor Chat
  app.post("/api/inquiry/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages format" });
      }

      // Helper to generate a contextual offline response
      const getFallbackChatText = (msgList: any[]) => {
        const lastMessage = msgList[msgList.length - 1]?.content?.toLowerCase() || "";
        let fallbackText = "Thank you for reaching out to **Rockmix Infra Technical Support**. \n\nBased on your message, we recommend exploring our high-performance **Concrete Batching Plants** or **Twin Shaft Mixers** for optimal durability. Please feel free to submit an inquiry using our **Inquiry Form** to receive detailed technical catalogues and pricing!";
        
        if (lastMessage.includes("batching") || lastMessage.includes("plant")) {
          fallbackText = "Rockmix Infra specializes in both **Stationary & Mobile Concrete Batching Plants** (30 m³/hr to 120 m³/hr). Equipped with Twin Shaft or Planetary mixers, they ensure excellent concrete homogeneity. Our engineers provide full on-site foundation design, installation, and commissioning support.";
        } else if (lastMessage.includes("mixer") || lastMessage.includes("shaft") || lastMessage.includes("planetary")) {
          fallbackText = "We offer **Twin Shaft Mixers** (1.0 to 3.0 m³ batch sizes) with horizontal dual-shaft technology for heavy structural mixes, and **Planetary Mixers** for counter-current zero-dead-zone blending (ideal for precast and block plants). Both feature wear-resistant lining plates.";
        } else if (lastMessage.includes("silo") || lastMessage.includes("storage")) {
          fallbackText = "Our **Cement Storage Silos** range from 50 to 200 tons. We offer bolted modular silos (highly compact for cost-effective shipping) and welded monolithic silos, complete with safety valves, filters, and screw feeders.";
        } else if (lastMessage.includes("precast") || lastMessage.includes("mould")) {
          fallbackText = "Rockmix custom designs heavy-duty steel **Concrete Precast Moulds** for bridge girders, retaining walls, box culverts, boundary walls, and columns. Featuring modular alignment and rapid shuttering.";
        } else if (lastMessage.includes("wet mix") || lastMessage.includes("macadam") || lastMessage.includes("road")) {
          fallbackText = "Our **Wet Mix Macadam (WMM) Plants** are rated at 100 to 250 TPH, ideal for sub-base highway layering. Features include multi-bin cold feeders, synchronized water spraying, and highly reliable continuous pugmill mixers.";
        }
        return fallbackText;
      };

      res.json({ text: getFallbackChatText(messages) });
    } catch (error: any) {
      console.error("Local Advisor Chat Route Error:", error);
      res.status(500).json({ error: error?.message || "An error occurred with the advisor." });
    }
  });

  // API Route: Custom Technical Proposal Generation on Inquiry Submission
  app.post("/api/inquiry/submit", async (req, res) => {
    try {
      const { name, email, phone, company, projectType, products, estimatedVolume, timeline, customNotes, address } = req.body;

      // Save quote request into Excel database under 'getAquote' sheet
      saveGetAQuote({
        name,
        company,
        email,
        phone,
        address: address || "",
        selectedProducts: products || [],
        customNotes: customNotes || ""
      });

      // Helper to generate a highly professional layout
      const getFallbackProposalText = () => {
        return `# TECHNICAL EQUIPMENT SPECIFICATION & GENERAL PROPOSAL
        
**Prepared for:** ${name}  
**Company:** ${company || "Not Specified"}  
**Contact:** ${email} | ${phone}  
**Date:** ${new Date().toLocaleDateString()}

---

### 1. Executive Project Evaluation
We have analyzed your requirement for a **${projectType || "General Construction & Infrastructure"}** project. With an estimated production scale of **${estimatedVolume || "Medium Scale"}** and a timeline target of **${timeline || "Immediate Setup"}**, our engineering team recommends high-availability equipment to maximize your concrete and aggregate production efficiency.

### 2. Configured Equipment Recommendations
Based on your selection of **${products?.join(", ") || "Rockmix Construction Equipment"}**:
- **Tailored Batching & Mixing Strategy**: We recommend selecting a plant size with an extra 15% safety buffer to handle peak surges comfortably (e.g. Twin Shaft mixing systems).
- **Core Advantages**: Wear-resistant cast alloy lining plates, robust steel structures, and state-of-the-art PLC automation panels.
- **Support Strategy**: Fully backed by our 4-pillar customer support system (Technical Guidance, On-Site Installation, Financial Flexibility, and Long-Term Wear Parts Partnership).

### 3. Comprehensive Rockmix Infra On-Site Commitment
- **Civil Foundation**: We provide complete structural engineering drawings for the concrete foundation.
- **Commissioning**: Our service engineers will travel on-site for installation, dry-run testing, calibration, and PLC operator training.
- **Genuine Parts**: Lifetime stock of chromium-cast liners and mixer blades guaranteed.

### 4. Suggested Deployment Roadmap
1. **Contract Signing & Engineering Review** (Weeks 1-2)
2. **Civil Foundation Engineering Drawings** (Weeks 2-3)
3. **Factory Test Assembly & Quality Checks** (Weeks 4-6)
4. **Transport & Ocean Freight Logistics** (Weeks 6-8)
5. **Erection, Dry-Run Testing, and Live Wet Calibration** (Week 9)

*Note: Our sales team has received your contact details and will email full brochures, layouts, and a detailed commercial quote shortly.*`;
      };

      res.json({ success: true, proposal: getFallbackProposalText() });
    } catch (error: any) {
      console.error("Local Proposal Route Error:", error);
      res.status(500).json({ error: error?.message || "Failed to generate customized proposal" });
    }
  });

  // API Route: Contact Us Form Submission
  app.post("/api/contact/submit", (req, res) => {
    try {
      const success = saveContactUs(req.body);
      if (success) {
        return res.json({ success: true, message: "Contact submission stored successfully in Excel!" });
      } else {
        return res.status(500).json({ error: "Failed to store contact submission in Excel." });
      }
    } catch (error: any) {
      console.error("Error in /api/contact/submit:", error);
      res.status(500).json({ error: error?.message || "Internal server error" });
    }
  });

  // API Route: Dealership Application Submission
  app.post("/api/dealership/submit", (req, res) => {
    try {
      const success = saveDealershipApplication(req.body);
      if (success) {
        return res.json({ success: true, message: "Dealership application stored successfully in Excel!" });
      } else {
        return res.status(500).json({ error: "Failed to store dealership application in Excel." });
      }
    } catch (error: any) {
      console.error("Error in /api/dealership/submit:", error);
      res.status(500).json({ error: error?.message || "Internal server error" });
    }
  });

  // Serve the uploaded Homepage image.png from root workspace if requested
  const serveHomepageImage = (req: express.Request, res: express.Response) => {
    const imagePath = path.join(process.cwd(), 'Homepage image.png');
    res.sendFile(imagePath, (err) => {
      if (err) {
        res.status(404).end();
      }
    });
  };
  app.get('/Homepage%20image.png', serveHomepageImage);
  app.get('/Homepage image.png', serveHomepageImage);

  // Serve persistent uploads folder
  app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

  // Serve public folder as static fallback for assets and brochures
  app.use(express.static(path.join(process.cwd(), "public")));

  // Serve Vite app or Static dist assets
  const distPath = path.join(process.cwd(), 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));

  if (process.env.NODE_ENV !== "production") {
    try {
      const { createServer } = await import("vite");
      const vite = await createServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("Serving application in Development mode via Vite middleware");
    } catch (viteError) {
      console.warn("Vite is not available or failed to load. Falling back to static serving.", viteError);
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        const ext = path.extname(req.path);
        if (ext && ext !== '.html') {
          return res.status(404).send('File not found');
        }
        res.sendFile(path.join(distPath, 'index.html'), (err) => {
          if (err) {
            res.status(200).send(`
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <title>Rockmix Infra - Starting Up</title>
                <style>
                  body { font-family: sans-serif; background-color: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
                  .container { padding: 2rem; max-width: 480px; }
                  h1 { font-size: 1.5rem; margin-bottom: 1rem; color: #38bdf8; }
                  p { color: #94a3b8; font-size: 0.875rem; margin-bottom: 1.5rem; }
                  .spinner { border: 3px solid rgba(255,255,255,0.1); border-top: 3px solid #38bdf8; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 0 auto; }
                  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                </style>
                <script>
                  setTimeout(() => { window.location.reload(); }, 3000);
                </script>
              </head>
              <body>
                <div class="container">
                  <div class="spinner"></div>
                  <h1 style="margin-top: 1.5rem;">Connecting to Rockmix Infra...</h1>
                  <p>The application is preparing and building its resources. This will take only a moment. We are automatically reconnecting you.</p>
                </div>
              </body>
              </html>
            `);
          }
        });
      });
    }
  } else {
    console.log("Serving production build from:", distPath);
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const ext = path.extname(req.path);
      if (ext && ext !== '.html') {
        return res.status(404).send('File not found');
      }
      res.sendFile(path.join(distPath, 'index.html'), (err) => {
        if (err) {
          res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>Rockmix Infra - Starting Up</title>
              <style>
                body { font-family: sans-serif; background-color: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
                .container { padding: 2rem; max-width: 480px; }
                h1 { font-size: 1.5rem; margin-bottom: 1rem; color: #38bdf8; }
                p { color: #94a3b8; font-size: 0.875rem; margin-bottom: 1.5rem; }
                .spinner { border: 3px solid rgba(255,255,255,0.1); border-top: 3px solid #38bdf8; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 0 auto; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              </style>
              <script>
                setTimeout(() => { window.location.reload(); }, 3000);
              </script>
            </head>
            <body>
              <div class="container">
                <div class="spinner"></div>
                <h1 style="margin-top: 1.5rem;">Preparing Rockmix Infra...</h1>
                <p>The application is preparing and building its resources. This will take only a moment. We are automatically reconnecting you.</p>
              </div>
            </body>
            </html>
          `);
        }
      });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Rockmix Infra server running on port ${PORT}`);
  });
}

startServer();
