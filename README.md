# Rockmix Infra Website

A premium, high-performance, and fully responsive website for **Rockmix Infra**, a leading manufacturer of construction machinery, concrete batching plants, planetary mixers, and heavy engineering equipment. 

The website has been engineered to be **100% independent, self-contained, and billing-free**. It does not require any paid AI APIs, external cloud databases, or Google AI Studio accounts. All technical chat responses and machinery proposals are generated locally and instantaneously with highly optimized offline-ready simulation engines, and all lead forms are stored locally into a portable Excel database (`database.xlsx`)!

---

## 🚀 Key Features

* **100% Local and Offline-Ready**: Completely free of Google AI Studio, Gemini API, or paid subscription billing risks. Highly responsive technical chat advisor and proposal engines operate entirely locally.
* **Excel-Backed Portable Database**: Form submissions (Contact Requests, Get a Quote inquiries, and Dealership Applications) are automatically recorded locally into `/database.xlsx` using a highly resilient, server-side Excel database system.
* **Modern Aesthetic & Performance**: Built using React 19, TypeScript, and Tailwind CSS. Smooth transitions and stagger animations powered by `motion`.
* **Zero Config Deployment**: Standard Express + Vite setup that requires no initial configuration or environment variables to start.

---

## 🛠️ Tech Stack & Requirements

* **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Motion (Animations)
* **Backend**: Express.js (Node.js)
* **Database**: Portable Local Excel Database (`xlsx` engine)
* **Requirements**: Node.js v18.x or higher (v20+ recommended)

---

## 💻 Getting Started

### 1. Installation

Install the required npm packages:

```bash
npm install
```

### 2. Development Mode

Launch the Express backend and Vite development environment:

```bash
npm run dev
```

The application will be accessible at: `http://localhost:3000`

### 3. Production Build

Compile the client-side SPA into static assets and bundle the server into a single file:

```bash
npm run build
```

This generates:
* `dist/`: Clean, optimized static HTML, JS, and CSS assets.
* `dist/server.cjs`: The bundled Express server file.

### 4. Run Production Build

Start the compiled application in production mode:

```bash
npm run start
```

---

## 📁 Important Asset Paths

All public assets are served cleanly from the `/public` directory:
* **Logo**: `/public/LOGO.png`
* **Product Images**: `/public/p1.webp` through `/public/p7.webp`
* **Brochure PDFs**: Fully optimized product brochures are located at:
  * `/public/prd1/rb1.pdf` — Rockmix Mobile Batching Plant (RMP)
  * `/public/prd2/rb2.pdf` — Rockmix Mini Mobile Batching Plant (RMP)
  * `/public/prd3/rb3.pdf` — Rockmix Wetmix Macadam Plant (RWMM)
  * `/public/prd4/rb4.pdf` — Rockmix Compact Concrete Batching Plant (RCP)
  * `/public/prd5/rb5.pdf` — Rockmix Stationary Concrete Batching Plant (RSP)
  * `/public/prd6/rb6.pdf` — Rockmix Compact Mobility Concrete Batching Plant (RCMP)

---

## 📊 Lead Form Handling & Storage

The website handles 3 primary business intake flows:
1. **Get a Quote** (Inquiry Form): Pre-selection integrated. Generates a customized mechanical proposal letter locally.
2. **Dealership Registration**: Standard multi-step partner registration form.
3. **Contact Us & Support request**: General inquiry form.

### Excel Database Structure
All submissions are appended to `/database.xlsx` in real-time. It contains three dedicated sheets:
* `Contact Us`
* `Dealership Application`
* `getAquote`

---

## 🌐 Production Deployment Guide

You can deploy this application using two methods:

### Method A: Full-Stack Node.js Deployment (Recommended)
This retains the Excel database. Great for hosting on virtual private servers (VPS), Docker environments, or normal Node.js app hosting.
1. Run `npm install` and `npm run build` on your server.
2. Ensure port `3000` is exposed or configured through a reverse proxy (e.g., Nginx).
3. Start the application with `npm run start` (or manage with `pm2 start dist/server.cjs --name "rockmix-website"`).

### Method B: Fully Static Web Hosting
If you prefer 100% static hosting (e.g. Vercel, Netlify, GitHub Pages, or normal static web hosting):
1. Run `npm run build`.
2. Upload the contents of the `dist/` directory to your static hosting provider.
3. *Note on Forms*: On fully static hosting, the Express server is bypassed. Forms will perform standard validation, local storage fallback, and display success screens, but will not append to `database.xlsx`.

---

## 🔧 Future Backend Integration Notes

When transitioning from the Excel database to CRM systems or email auto-responders, you can easily plug in external endpoints inside `/server.ts` or directly within the frontend forms:
* **Contact Submissions**: Modify `/api/contact/submit` in `server.ts` or `src/components/ContactSection.tsx`.
* **Dealership Submissions**: Modify `/api/dealership/submit` in `server.ts` or `src/components/DealershipSection.tsx`.
* **Inquiry Submissions**: Modify `/api/inquiry/submit` in `server.ts` or `src/components/InquirySection.tsx`.
