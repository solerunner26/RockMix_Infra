# Administrator and CMS User Guide - Rockmix Infra

This guide provides instructions for utilizing the redesigned Admin Panel to manage the website content, products catalog, media library, and customer leads database.

---

## 🔑 1. Logging In
* **Admin URL:** Go to `http://localhost:3000/admin` (or the corresponding live domain URL).
* **Default Username:** `rockmin`
* **Default Password:** `Rock@2026#mix`

---

## 📊 2. Dashboard Analytics
The dashboard is the main screen of the admin panel, providing real-time business insights:
* **Inquiry Metrics:** Displays Total leads, Leads today, Leads this week, and Total registered products.
* **Leads Distribution:** Interactive charts and breakdown tables summarizing form submissions by type (e.g. Get a Quote, Contact Us, Dealership App, Download Brochure).
* **Top Inquired Products:** Lists machinery with the most customer interest.
* **Recent Activity Feed:** Shows the 5 most recent submissions for rapid response.

---

## 📝 3. Page Content Manager
The **Page Content** tab allows editing all copy dynamically:
* **Branding:** Customize the global Company Name and Footer brand statement.
* **Hero Section:** Edit the main Tagline heading, Sub-Tagline, and Description text.
* **About Us Section:** Modify the title, subtitle, and body description, or toggle section visibility.
* **Dealership Section:** Edit titles, body content, and section visibility.
* **Image Replacements:** Change section background graphics by uploading images locally.
* *All changes take effect immediately on the public website.*

---

## 🏗️ 4. Product Catalog Manager
Manage products shown in the showcase carousel, catalogs, and quote selectors:
* **Add Product:** Click **Register New Product**. Fill out the specifications sheet, features bullet list, description, and highlights.
* **Edit/Delete:** Modify existing products, or click the Trash icon to remove them.
* **Reordering:** Use the Up/Down arrows to change the order in which products appear in the public slideshow.
* **Brochures and Images:** Map newly uploaded files directly to products.

---

## 📂 5. Media Library Manager
Track and manage uploaded brochures and files:
* **File Uploads:** Drag and drop or browse to upload pictures (PNG, JPG, WEBP) or brochures (PDF).
* **Storage Path:** Uploaded assets are saved to the server in `/public/uploads`.
* **Removal:** Click the Trash icon on any asset to remove it from disk. Note: Make sure the file is not currently mapped to a product before deleting it, to prevent broken links!

---

## 📋 6. Leads & Inquiries Manager
The **Leads** panel centralizes form submissions:
* **Data Fields:** Tracks Date, Source Form, Customer details (Name, Email, Mobile, Company, City, Country), Inquired products list, and Message.
* **In-line management:** 
  - Change status (New, Contacted, In Progress, Closed) to track follow-ups.
  - Add administrative notes (e.g., "Sent commercial quote on Monday").
* **Communications:** Click email addresses to open `mailto:`, or click phone numbers to initiate WhatsApp chats or direct calls.
* **Exporting:** Click **Export CSV** to download all leads as an Excel-compatible spreadsheet.

---

## ⚙️ 7. System Settings & Credentials
* **Credential Updates:** Update the admin username and password. The password must be at least 12 characters and contain uppercase, lowercase, numeric, and special characters. 
* **Backups:** Download a JSON backup of the entire database to your computer, or restore a previous JSON backup file to sync all leads and content.
* **Factory Reset:** Trigger a system reset to roll back all CMS content to original default files.
