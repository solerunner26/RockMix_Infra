# Rockmix Infra Website & CMS Portal

A premium, high-performance, and fully responsive website for **Rockmix Infra**, a leading manufacturer of construction machinery, concrete batching plants, planetary mixers, and heavy engineering equipment.

The website features an independent, self-contained, and billing-free architecture. It does not require any paid AI APIs or external cloud databases. It includes a custom, local SQLite-backed CMS admin dashboard, allowing the client to edit every aspect of the site (texts, images, brochures, and products) and manage all customer leads.

---

## 🚀 Key Features

* **SQLite Relational Database**: Replaced Excel with a robust, local SQLite database (`data/rockmix.db`) for high-speed, concurrent form entries, CMS content caching, and transactions.
* **Fully Custom CMS Dashboard (`/admin`)**: A redesigned, state-of-the-art dark theme control panel to manage page content, product catalogs, brochures, media files, and system settings.
* **Complete Website Editability**: Admin users can edit Hero taglines, About/Dealership sections, contact info, branding settings, button labels, and reorder products dynamically.
* **Centralized Leads Manager**: Logs all website inquiries, quote requests, dealership applications, and brochure downloads with search, sort, filter, administrative notes, and CSV spreadsheet export capabilities.
* **Secure Token-Based Authentication**: Secure admin logins with pbkdf2 password hashing (using random salts) and cryptographically signed session tokens for API route protection.
* **Robust Local Media Manager**: Directly upload, select, and manage product pictures (PNG, JPG, WEBP) and technical brochure documents (PDF) with type/size validation and clean disk cleanups.

---

## 🛠️ Tech Stack & Requirements

* **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Motion (Animations)
* **Backend**: Express.js (Node.js) with `better-sqlite3`
* **Database**: Local relational SQLite database (`data/rockmix.db`)
* **Requirements**: Node.js v18.x or higher (v20+ recommended)

---

## 💻 Getting Started

### 1. Installation
Install the required npm packages:
```bash
npm install
```

### 2. Database Bootstrap & Seeding
Initialize the SQLite database schema, seed default CMS content, and migrate historical Excel leads:
```bash
npx tsx dbInit.ts
```

### 3. Launch Development Server
Start the Express backend and Vite development environment:
```bash
npm run dev
```
The application will be accessible at: `http://localhost:3000`

### 4. Build for Production
Compile the client-side SPA into static assets and bundle the server into a single file:
```bash
npm run build
```

### 5. Start Production Server
Run the compiled application in production mode:
```bash
npm run start
```

---

## 📂 Project Architecture

* `data/rockmix.db`: Local SQLite database file containing all CMS, product, and lead tables.
* `server.ts`: Express backend server handling routing, API controllers, session token validation, and file uploads.
* `dbInit.ts`: Database migration and bootstrap script.
* `src/components/AdminPanel.tsx`: Redesigned CMS dashboard interface.
* `src/context/SiteContentContext.tsx`: Client-side content synchronizer and authentication coordinator.
* `public/uploads/`: Directory for uploaded user media and PDF brochures.

---

## 📑 System Documentation
For further configuration and setup guides, refer to:
* **[DEPLOYMENT.md](file:///c:/Users/jaldi/OneDrive/Desktop/rockmix-infra/DEPLOYMENT.md)** - Hosting and deployment instructions.
* **[ADMIN_GUIDE.md](file:///c:/Users/jaldi/OneDrive/Desktop/rockmix-infra/ADMIN_GUIDE.md)** - Administrator and CMS user guide.
