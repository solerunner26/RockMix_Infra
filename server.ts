import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import crypto from "crypto";
import Database from "better-sqlite3";

dotenv.config();

const DATA_DIR = path.resolve(process.cwd(), "data");
const DB_PATH = path.resolve(DATA_DIR, "rockmix.db");
const UPLOAD_DIR = path.resolve(process.cwd(), "public", "uploads");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Open Database connection
const db = new Database(DB_PATH);
db.pragma("foreign_keys = ON");

// Generate secure session secret
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

// JWT-style simple stateless signed tokens
const generateToken = (username: string) => {
  const payload = {
    username,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  };
  const payloadStr = JSON.stringify(payload);
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(payloadStr).digest("hex");
  return Buffer.from(payloadStr).toString("base64") + "." + signature;
};

const verifyToken = (token: string): string | null => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  try {
    const payloadStr = Buffer.from(parts[0], "base64").toString("utf8");
    const signature = parts[1];
    const expectedSignature = crypto.createHmac("sha256", SESSION_SECRET).update(payloadStr).digest("hex");
    if (signature !== expectedSignature) return null;
    const payload = JSON.parse(payloadStr);
    if (payload.expiresAt < Date.now()) return null;
    return payload.username;
  } catch (e) {
    return null;
  }
};

// Security Route Middleware
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  let token = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    const cookies = req.headers.cookie ? Object.fromEntries(req.headers.cookie.split(";").map(c => c.trim().split("="))) : {};
    token = cookies["rockmix_session"] || "";
  }

  const username = verifyToken(token);
  if (!username) {
    return res.status(401).json({ error: "Unauthorized access. Invalid or expired session." });
  }
  (req as any).username = username;
  next();
};

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Hashing Helper matching dbInit.ts
  const hashPasswordWithSalt = (password: string, salt: string) => {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  };

  // Helper: Get Site Content from SQLite
  const getSiteContent = (): any => {
    const contentObj: any = {};
    
    // Get Site Settings
    const settings = db.prepare("SELECT key, value FROM site_settings").all() as { key: string; value: string }[];
    settings.forEach(row => {
      try {
        contentObj[row.key] = JSON.parse(row.value);
      } catch (e) {
        contentObj[row.key] = row.value;
      }
    });

    // Get Products
    const products = db.prepare("SELECT * FROM products ORDER BY order_index ASC").all() as any[];
    contentObj.products = products.map(prod => {
      const features = db.prepare("SELECT feature_text FROM product_features WHERE product_id = ?").all(prod.id) as { feature_text: string }[];
      const specs = db.prepare("SELECT label, value FROM product_specifications WHERE product_id = ?").all(prod.id) as { label: string; value: string }[];
      const highlights = db.prepare("SELECT highlight_text FROM product_highlights WHERE product_id = ?").all(prod.id) as { highlight_text: string }[];
      const images = db.prepare("SELECT image_path FROM product_images WHERE product_id = ? ORDER BY order_index ASC").all(prod.id) as { image_path: string }[];

      return {
        id: prod.id,
        name: prod.name,
        shortDesc: prod.short_desc,
        description: prod.description,
        category: prod.category,
        accentColor: prod.accent_color,
        badgeColor: prod.badge_color,
        image: prod.image,
        brochure: prod.brochure,
        features: features.map(f => f.feature_text),
        specifications: specs.map(s => ({ label: s.label, value: s.value })),
        highlights: highlights.map(h => h.highlight_text),
        additionalImages: images.map(i => i.image_path)
      };
    });

    return contentObj;
  };

  // Helper: Save Site Content to SQLite (Transactional)
  const saveSiteContent = db.transaction((content: any) => {
    const keys = ["global", "home", "about", "support", "dealership", "contact", "buttons", "forms", "theme", "footer", "productsPage", "inquiry", "terms"];
    keys.forEach(key => {
      if (content[key]) {
        db.prepare("INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)").run(
          key,
          JSON.stringify(content[key])
        );
      }
    });

    if (Array.isArray(content.products)) {
      db.prepare("DELETE FROM products").run(); // CASCADE drops features, specs, highlights, images
      
      content.products.forEach((prod: any, idx: number) => {
        db.prepare(`
          INSERT INTO products (id, name, short_desc, description, category, accent_color, badge_color, image, brochure, order_index)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          prod.id,
          prod.name,
          prod.shortDesc || "",
          prod.description || "",
          prod.category || "Concrete Batching Plants",
          prod.accentColor || "indigo",
          prod.badgeColor || "",
          prod.image || "",
          prod.brochure || "",
          idx
        );

        if (Array.isArray(prod.features)) {
          prod.features.forEach((feat: string) => {
            if (feat.trim()) {
              db.prepare("INSERT INTO product_features (product_id, feature_text) VALUES (?, ?)").run(prod.id, feat);
            }
          });
        }

        if (Array.isArray(prod.specifications)) {
          prod.specifications.forEach((spec: any) => {
            if (spec.label.trim() && spec.value.trim()) {
              db.prepare("INSERT INTO product_specifications (product_id, label, value) VALUES (?, ?, ?)").run(
                prod.id,
                spec.label,
                spec.value
              );
            }
          });
        }

        if (Array.isArray(prod.highlights)) {
          prod.highlights.forEach((hl: string) => {
            if (hl.trim()) {
              db.prepare("INSERT INTO product_highlights (product_id, highlight_text) VALUES (?, ?)").run(prod.id, hl);
            }
          });
        }

        if (Array.isArray(prod.additionalImages)) {
          prod.additionalImages.forEach((img: string, imgIdx: number) => {
            if (img.trim()) {
              db.prepare("INSERT INTO product_images (product_id, image_path, order_index) VALUES (?, ?, ?)").run(
                prod.id,
                img,
                imgIdx
              );
            }
          });
        }
      });
    }
  });

  // Helper: Save Lead Submissions
  const saveLead = (lead: {
    source_form: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    city: string;
    country: string;
    products: string;
    message: string;
  }) => {
    const cleanFormName = lead.source_form.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const id = `lead-${cleanFormName}-${Date.now()}`;
    db.prepare(`
      INSERT INTO leads (id, source_form, name, email, phone, company, city, country, products, message, status, notes, submitted_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      lead.source_form,
      lead.name || "N/A",
      lead.email || "N/A",
      lead.phone || "N/A",
      lead.company || "N/A",
      lead.city || "N/A",
      lead.country || "India",
      lead.products || "N/A",
      lead.message || "N/A",
      "New",
      "",
      new Date().toISOString()
    );
  };

  // API Route: Get Site Content
  app.get("/api/content", (req, res) => {
    try {
      const content = getSiteContent();
      res.json(content);
    } catch (error: any) {
      console.error("Error retrieving site content:", error);
      res.status(500).json({ error: "Failed to read site content." });
    }
  });

  // API Route: Update Site Content (Protected)
  app.post("/api/content/update", authMiddleware, (req, res) => {
    try {
      saveSiteContent(req.body);
      res.json({ success: true, message: "Site content updated successfully." });
    } catch (error: any) {
      console.error("Error in POST /api/content/update:", error);
      res.status(500).json({ error: "Failed to save site content update." });
    }
  });

  // API Route: Reset Site Content (Protected)
  app.post("/api/content/reset", authMiddleware, (req, res) => {
    try {
      const BOOTSTRAP_PATH = path.join(process.cwd(), "src", "data", "siteContent.json");
      if (fs.existsSync(BOOTSTRAP_PATH)) {
        const bootstrapStr = fs.readFileSync(BOOTSTRAP_PATH, "utf8");
        const bootstrapData = JSON.parse(bootstrapStr);
        saveSiteContent(bootstrapData);
        res.json({ success: true, message: "Site content reset to default successfully." });
      } else {
        res.status(404).json({ error: "Bootstrap config file not found." });
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

      const admin = db.prepare("SELECT password_hash, salt FROM admin_users WHERE username = ?").get(username) as any;
      if (admin && hashPasswordWithSalt(password, admin.salt) === admin.password_hash) {
        const token = generateToken(username);
        res.json({ success: true, token });
      } else {
        res.status(401).json({ error: "Invalid username or password." });
      }
    } catch (error: any) {
      console.error("Error in login controller:", error);
      res.status(500).json({ error: "Authentication system failure." });
    }
  });

  // API Route: Admin Change Password (Protected)
  app.post("/api/admin/change-password", authMiddleware, (req, res) => {
    try {
      const { currentPassword, newUsername, newPassword } = req.body;
      const sessionUser = (req as any).username;

      const admin = db.prepare("SELECT password_hash, salt FROM admin_users WHERE username = ?").get(sessionUser) as any;
      if (!admin || hashPasswordWithSalt(currentPassword, admin.salt) !== admin.password_hash) {
        return res.status(400).json({ error: "Current password verification failed." });
      }

      const nextUsername = newUsername ? newUsername.trim() : sessionUser;
      let nextHash = admin.password_hash;
      let nextSalt = admin.salt;

      if (newPassword) {
        // Password strength validation
        if (newPassword.length < 12) {
          return res.status(400).json({ error: "Password must be at least 12 characters." });
        }
        if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
          return res.status(400).json({ error: "Password must contain uppercase, lowercase, number, and special character." });
        }
        if (newPassword.toLowerCase().includes(nextUsername.toLowerCase())) {
          return res.status(400).json({ error: "Password must not contain the username." });
        }
        const weak = ["password", "admin", "rockmix", "qwerty", "123456"];
        for (const w of weak) {
          if (newPassword.toLowerCase().includes(w)) {
            return res.status(400).json({ error: `Password cannot contain weak phrase: ${w}` });
          }
        }

        nextSalt = crypto.randomBytes(16).toString("hex");
        nextHash = hashPasswordWithSalt(newPassword, nextSalt);
      }

      // If username changed, validate formats
      if (newUsername) {
        const userClean = newUsername.trim();
        if (userClean.length < 4 || userClean.length > 30 || !/^[a-zA-Z0-9_-]+$/.test(userClean)) {
          return res.status(400).json({ error: "Username must be 4-30 chars, alphanumeric, hyphens, underscores." });
        }
      }

      db.prepare("UPDATE admin_users SET username = ?, password_hash = ?, salt = ? WHERE username = ?").run(
        nextUsername,
        nextHash,
        nextSalt,
        sessionUser
      );

      res.json({ success: true, message: "Account credentials updated successfully." });
    } catch (error: any) {
      console.error("Change password controller failure:", error);
      res.status(500).json({ error: "Failed to update admin account." });
    }
  });

  // API Route: Get Unified Leads (Protected)
  app.get("/api/admin/leads", authMiddleware, (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM leads ORDER BY submitted_at DESC").all();
      res.json(rows);
    } catch (error: any) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to retrieve leads." });
    }
  });

  // API Route: Update Lead (Protected)
  app.put("/api/admin/leads/:id", authMiddleware, (req, res) => {
    try {
      const { status, notes } = req.body;
      const { id } = req.params;
      db.prepare("UPDATE leads SET status = ?, notes = ? WHERE id = ?").run(status, notes || "", id);
      res.json({ success: true, message: "Lead updated successfully." });
    } catch (error: any) {
      console.error("Error updating lead:", error);
      res.status(500).json({ error: "Failed to update lead." });
    }
  });

  // API Route: Delete Lead (Protected)
  app.delete("/api/admin/leads/:id", authMiddleware, (req, res) => {
    try {
      const { id } = req.params;
      db.prepare("DELETE FROM leads WHERE id = ?").run(id);
      res.json({ success: true, message: "Lead deleted successfully." });
    } catch (error: any) {
      console.error("Error deleting lead:", error);
      res.status(500).json({ error: "Failed to delete lead." });
    }
  });

  // API Route: Get Analytics Statistics (Protected)
  app.get("/api/admin/analytics", authMiddleware, (req, res) => {
    try {
      const now = new Date();
      const todayStr = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekAgoStr = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const monthAgoStr = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const yearAgoStr = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();

      const totalLeads = (db.prepare("SELECT COUNT(*) as count FROM leads").get() as any).count;
      const leadsToday = (db.prepare("SELECT COUNT(*) as count FROM leads WHERE submitted_at >= ?").get(todayStr) as any).count;
      const leadsWeek = (db.prepare("SELECT COUNT(*) as count FROM leads WHERE submitted_at >= ?").get(weekAgoStr) as any).count;
      const leadsMonth = (db.prepare("SELECT COUNT(*) as count FROM leads WHERE submitted_at >= ?").get(monthAgoStr) as any).count;
      const leadsYear = (db.prepare("SELECT COUNT(*) as count FROM leads WHERE submitted_at >= ?").get(yearAgoStr) as any).count;

      const sourceWise = db.prepare("SELECT source_form as source, COUNT(*) as count FROM leads GROUP BY source_form").all() as any[];
      const recent = db.prepare("SELECT * FROM leads ORDER BY submitted_at DESC LIMIT 5").all();

      // Top products summary
      const productSummary = db.prepare("SELECT products, COUNT(*) as count FROM leads WHERE products != 'N/A' AND products != '' GROUP BY products ORDER BY count DESC").all() as any[];
      
      // Location summary
      const citySummary = db.prepare("SELECT city, COUNT(*) as count FROM leads WHERE city != 'N/A' GROUP BY city ORDER BY count DESC LIMIT 8").all();

      res.json({
        stats: {
          totalLeads,
          leadsToday,
          leadsWeek,
          leadsMonth,
          leadsYear
        },
        sourceWise,
        productSummary,
        citySummary,
        recent
      });
    } catch (error: any) {
      console.error("Error gathering analytics statistics:", error);
      res.status(500).json({ error: "Failed to load analytics statistics." });
    }
  });

  // API Route: Inquiry submit (Get a Quote)
  app.post("/api/inquiry/submit", (req, res) => {
    try {
      const { name, email, phone, company, projectType, products, estimatedVolume, timeline, customNotes, address } = req.body;
      
      saveLead({
        source_form: "Get a Quote",
        name,
        email,
        phone,
        company,
        city: address || "N/A",
        country: "India",
        products: Array.isArray(products) ? products.join(", ") : products || "N/A",
        message: customNotes || "N/A"
      });

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
      res.status(500).json({ error: "Failed to submit quote proposal." });
    }
  });

  // API Route: Contact Us submit
  app.post("/api/contact/submit", (req, res) => {
    try {
      const { firstName, lastName, emailId, mobileNo, organization, city, subject, message } = req.body;
      saveLead({
        source_form: "Contact Us",
        name: `${firstName || ""} ${lastName || ""}`.trim() || "N/A",
        email: emailId,
        phone: mobileNo,
        company: organization,
        city,
        country: "India",
        products: "N/A",
        message: `Subject: ${subject || "N/A"}. Message: ${message || "N/A"}`
      });
      res.json({ success: true, message: "Contact submission stored successfully." });
    } catch (error: any) {
      console.error("Error in contact submit:", error);
      res.status(500).json({ error: "Failed to save contact submission." });
    }
  });

  // API Route: Dealership Application submit
  app.post("/api/dealership/submit", (req, res) => {
    try {
      const d = req.body;
      const name = d.keyContactPerson || d.ownerMdName || "N/A";
      const details = `Activities: ${d.currentBusinessActivities || "N/A"}. Established: ${d.yearEstablished || "N/A"}. Turnover: ${d.annualTurnover || "N/A"}. Address: ${d.registeredAddress || "N/A"}`;
      
      saveLead({
        source_form: "Dealership App",
        name,
        email: d.emailAddress,
        phone: d.mobileNumber || d.phoneNumber,
        company: d.companyName,
        city: d.cityStateCountry || "N/A",
        country: d.areaWorkingCountry || "India",
        products: "N/A",
        message: details
      });
      res.json({ success: true, message: "Dealership application stored successfully." });
    } catch (error: any) {
      console.error("Error in dealership submit:", error);
      res.status(500).json({ error: "Failed to save dealership submission." });
    }
  });

  // API Route: Download Brochure Form submit
  app.post("/api/brochure/submit", (req, res) => {
    try {
      const { fullName, email, mobile, organizationName, city, country, productName, brochurePath } = req.body;
      saveLead({
        source_form: "Download Brochure",
        name: fullName,
        email,
        phone: mobile,
        company: organizationName,
        city,
        country: country || "India",
        products: productName,
        message: `Downloaded brochure from: ${brochurePath}`
      });
      res.json({ success: true, message: "Brochure lead saved successfully." });
    } catch (error: any) {
      console.error("Error in brochure submit:", error);
      res.status(500).json({ error: "Failed to save brochure download." });
    }
  });

  // API Route: PDF List (Protected)
  app.get("/api/admin/pdfs", authMiddleware, (req, res) => {
    try {
      const pdfs: any[] = [];
      const uploads = fs.existsSync(UPLOAD_DIR) ? fs.readdirSync(UPLOAD_DIR) : [];
      uploads.forEach(file => {
        if (file.toLowerCase().endsWith(".pdf")) {
          const stats = fs.statSync(path.join(UPLOAD_DIR, file));
          pdfs.push({
            name: file,
            url: `/uploads/${file}`,
            size: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
            uploadedAt: stats.mtime.toISOString(),
            isUserUploaded: true
          });
        }
      });

      // Default subdirectories scan
      const publicDir = path.join(process.cwd(), "public");
      const subdirs = ["prd1", "prd2", "prd3", "prd4", "prd5", "prd6"];
      subdirs.forEach(subdir => {
        const dirPath = path.join(publicDir, subdir);
        if (fs.existsSync(dirPath)) {
          const files = fs.readdirSync(dirPath);
          files.forEach(file => {
            if (file.toLowerCase().endsWith(".pdf")) {
              const stats = fs.statSync(path.join(dirPath, file));
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
      console.error("PDF Scan Failure:", error);
      res.status(500).json({ error: "Failed to gather brochures." });
    }
  });

  // API Route: List Media Library Assets (Protected)
  app.get("/api/admin/media", authMiddleware, (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM media_assets ORDER BY uploaded_at DESC").all();
      res.json(rows);
    } catch (error: any) {
      console.error("Error reading media library:", error);
      res.status(500).json({ error: "Failed to read media library." });
    }
  });

  // API Route: Delete Media Asset (Protected)
  app.delete("/api/admin/media/:id", authMiddleware, (req, res) => {
    try {
      const { id } = req.params;
      const asset = db.prepare("SELECT file_path FROM media_assets WHERE id = ?").get(id) as any;
      if (asset) {
        const fullDiskPath = path.join(process.cwd(), "public", asset.file_path);
        if (fs.existsSync(fullDiskPath)) {
          fs.unlinkSync(fullDiskPath);
        }
        db.prepare("DELETE FROM media_assets WHERE id = ?").run(id);
      }
      res.json({ success: true, message: "Asset deleted successfully." });
    } catch (error: any) {
      console.error("Error deleting media asset:", error);
      res.status(500).json({ error: "Failed to delete media asset." });
    }
  });

  // API Route: PDF upload (Protected)
  app.post("/api/pdf/upload", authMiddleware, (req, res) => {
    try {
      const { fileName, fileData } = req.body;
      if (!fileName || !fileData) {
        return res.status(400).json({ error: "Missing required upload parameters." });
      }

      if (!fileName.toLowerCase().endsWith(".pdf")) {
        return res.status(400).json({ error: "Only PDF extensions are allowed." });
      }

      const base64Clean = fileData.replace(/^data:application\/pdf;base64,/, "");
      
      // Signature check: PDF magic bytes (%PDF)
      const buffer = Buffer.from(base64Clean, "base64");
      const magicBytes = buffer.subarray(0, 4).toString("ascii");
      if (magicBytes !== "%PDF") {
        return res.status(400).json({ error: "Uploaded binary is not a valid PDF file." });
      }

      const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
      const targetPath = path.join(UPLOAD_DIR, cleanFileName);
      fs.writeFileSync(targetPath, buffer);

      const sizeMB = `${(buffer.byteLength / 1024 / 1024).toFixed(2)} MB`;
      const webPath = `/uploads/${cleanFileName}`;

      db.prepare(`
        INSERT OR REPLACE INTO media_assets (file_name, file_path, file_size, mime_type, uploaded_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(cleanFileName, webPath, sizeMB, "application/pdf", new Date().toISOString());

      res.json({ success: true, filePath: webPath });
    } catch (error: any) {
      console.error("PDF upload failure:", error);
      res.status(500).json({ error: "Failed to save PDF." });
    }
  });

  // API Route: Image upload (Protected)
  app.post("/api/image/upload", authMiddleware, (req, res) => {
    try {
      const { fileName, fileData } = req.body;
      if (!fileName || !fileData) {
        return res.status(400).json({ error: "Missing required upload parameters." });
      }

      // Check format signature
      const matches = fileData.match(/^data:(image\/\w+);base64,/);
      if (!matches) {
        return res.status(400).json({ error: "Invalid data URL format." });
      }

      const mimeType = matches[1];
      const validTypes = ["image/png", "image/jpeg", "image/webp"];
      if (!validTypes.includes(mimeType)) {
        return res.status(400).json({ error: "Only PNG, JPG, or WEBP images are allowed." });
      }

      const base64Clean = fileData.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Clean, "base64");

      const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
      const targetPath = path.join(UPLOAD_DIR, cleanFileName);
      fs.writeFileSync(targetPath, buffer);

      const sizeMB = `${(buffer.byteLength / 1024 / 1024).toFixed(2)} MB`;
      const webPath = `/uploads/${cleanFileName}`;

      db.prepare(`
        INSERT OR REPLACE INTO media_assets (file_name, file_path, file_size, mime_type, uploaded_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(cleanFileName, webPath, sizeMB, mimeType, new Date().toISOString());

      res.json({ success: true, filePath: webPath });
    } catch (error: any) {
      console.error("Image upload failure:", error);
      res.status(500).json({ error: "Failed to save image." });
    }
  });

  // API Route: Backup Export (Protected)
  app.get("/api/admin/export", authMiddleware, (req, res) => {
    try {
      const settings = db.prepare("SELECT * FROM site_settings").all();
      const products = db.prepare("SELECT * FROM products").all();
      const features = db.prepare("SELECT * FROM product_features").all();
      const specs = db.prepare("SELECT * FROM product_specifications").all();
      const highlights = db.prepare("SELECT * FROM product_highlights").all();
      const pImages = db.prepare("SELECT * FROM product_images").all();
      const leads = db.prepare("SELECT * FROM leads").all();
      const media = db.prepare("SELECT * FROM media_assets").all();

      res.json({
        exportDate: new Date().toISOString(),
        settings,
        products,
        features,
        specs,
        highlights,
        pImages,
        leads,
        media
      });
    } catch (error: any) {
      console.error("Error exporting database:", error);
      res.status(500).json({ error: "Failed to export data." });
    }
  });

  // API Route: Backup Import (Protected)
  app.post("/api/admin/import", authMiddleware, (req, res) => {
    const importTx = db.transaction((data: any) => {
      if (Array.isArray(data.settings)) {
        db.prepare("DELETE FROM site_settings").run();
        data.settings.forEach((s: any) => {
          db.prepare("INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)").run(s.key, s.value);
        });
      }

      if (Array.isArray(data.products)) {
        db.prepare("DELETE FROM products").run(); // CASCADE drops features, specs, highlights, images
        
        data.products.forEach((p: any) => {
          db.prepare(`
            INSERT INTO products (id, name, short_desc, description, category, accent_color, badge_color, image, brochure, order_index, is_visible)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(p.id, p.name, p.short_desc, p.description, p.category, p.accent_color, p.badge_color, p.image, p.brochure, p.order_index, p.is_visible);
        });
      }

      if (Array.isArray(data.features)) {
        data.features.forEach((f: any) => {
          db.prepare("INSERT INTO product_features (product_id, feature_text) VALUES (?, ?)").run(f.product_id, f.feature_text);
        });
      }

      if (Array.isArray(data.specs)) {
        data.specs.forEach((s: any) => {
          db.prepare("INSERT INTO product_specifications (product_id, label, value) VALUES (?, ?, ?)").run(s.product_id, s.label, s.value);
        });
      }

      if (Array.isArray(data.highlights)) {
        data.highlights.forEach((h: any) => {
          db.prepare("INSERT INTO product_highlights (product_id, highlight_text) VALUES (?, ?)").run(h.product_id, h.highlight_text);
        });
      }

      if (Array.isArray(data.pImages)) {
        data.pImages.forEach((img: any) => {
          db.prepare("INSERT INTO product_images (product_id, image_path, order_index) VALUES (?, ?, ?)").run(img.product_id, img.image_path, img.order_index);
        });
      }

      if (Array.isArray(data.leads)) {
        db.prepare("DELETE FROM leads").run();
        data.leads.forEach((l: any) => {
          db.prepare(`
            INSERT INTO leads (id, source_form, name, email, phone, company, city, country, products, message, status, notes, submitted_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(l.id, l.source_form, l.name, l.email, l.phone, l.company, l.city, l.country, l.products, l.message, l.status, l.notes, l.submitted_at);
        });
      }

      if (Array.isArray(data.media)) {
        db.prepare("DELETE FROM media_assets").run();
        data.media.forEach((m: any) => {
          db.prepare(`
            INSERT INTO media_assets (id, file_name, file_path, file_size, mime_type, uploaded_at)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(m.id, m.file_name, m.file_path, m.file_size, m.mime_type, m.uploaded_at);
        });
      }
    });

    try {
      importTx(req.body);
      res.json({ success: true, message: "Database import completed successfully." });
    } catch (error: any) {
      console.error("Database import failure:", error);
      res.status(500).json({ error: "Failed to restore backup." });
    }
  });

  // API Route: AI Technical Advisor Chat (offline fallback)
  app.post("/api/inquiry/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages format" });
      }

      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
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

      res.json({ text: fallbackText });
    } catch (error: any) {
      console.error("Local Advisor Chat Route Error:", error);
      res.status(500).json({ error: "An error occurred with the advisor." });
    }
  });

  // Serve static files from /uploads
  app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

  // Serve public folder as static fallback
  app.use(express.static(path.join(process.cwd(), "public")));

  // Serve Vite app or Static dist assets
  const distPath = path.join(process.cwd(), "dist");
  const hasDist = fs.existsSync(path.join(distPath, "index.html"));

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
      console.warn("Vite is not available. Falling back to static serving.", viteError);
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  } else {
    console.log("Serving production build from:", distPath);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Rockmix Infra server running on port ${PORT}`);
  });
}

startServer();
