# Deployment Guide - Rockmix Infra

This guide provides instructions for deploying the SQLite-backed Node/Express/React application to public preview hosting platforms, highlighting limitations and persistence recommendations.

---

## 🛠️ Build & Start Configuration

The application compiles the frontend into `dist/` and bundles the Express server into `dist/server.cjs` for optimized server-side execution.

* **Build Command:**
  ```bash
  npm run build
  ```
* **Start Command (Production):**
  ```bash
  npm run start
  ```
* **Environment Variables:**
  - `PORT`: Define custom binding port (Defaults to `3000`).
  - `NODE_ENV`: Set to `production` for optimized static serving.
  - `SESSION_SECRET`: Secure cryptographic phrase used for signing admin JWT/session tokens.

---

## ☁️ Recommended Hosting Options (Free & Low-Cost)

Since the project uses a local SQLite database (`data/rockmix.db`) and saves uploaded brochures/images to the local disk (`public/uploads`), the hosting platform must support a persistent local filesystem. Otherwise, **any lead entries or CMS changes will be wiped out when the server restarts or goes to sleep.**

### Option A: Render.com (Free Tier)
Render offers a 100% free tier for Node.js apps.
* **Setup:** Create a new "Web Service", connect your Git repository, set the build command to `npm install && npm run build`, and the start command to `npm run start`.
* **🔴 Critical Limitation:** Render's free tier is **ephemeral**. The application goes to sleep after 15 minutes of inactivity. When it wakes up, or when a new commit is pushed, the SQLite database and all uploaded files will reset to default.
* **Production Recommendation:** Upgrade to Render's starter plan ($7/month) and attach a **Persistent Disk** ($0.25/GB/month) mapped to the `/data` and `/public/uploads` directories.

### Option B: Fly.io (Low-Cost)
Fly.io runs applications close to users in containers and offers a small free allowance.
* **Setup:** Install the `flyctl` CLI, run `fly launch`, and configure a **Persistent Volume** of 1GB to hold the database file.
* **Pros:** SQLite data is persistent, and container spin-ups are extremely fast.

### Option C: ngrok / Local Tunnel (100% Free & Easy Client Preview)
If you want to share a live working preview link with your client *instantly* without configuring server infrastructure, you can tunnel your running local server to the public web.
1. Run the server locally:
   ```bash
   npm run dev
   ```
2. Install `localtunnel` globally:
   ```bash
   npm install -g localtunnel
   ```
3. Expose port 3000:
   ```bash
   lt --port 3000
   ```
4. Share the generated public URL (e.g. `https://cool-plants-grow.localtunnel.me`) with your client. All edits and leads will remain fully persistent on your local hard drive!

---

## ⚠️ Database Backup and Disaster Recovery
To prevent data loss on ephemeral hosting:
1. Navigate to the **Admin Panel > System Settings**.
2. Click **Download JSON Backup** to save all current leads, settings, and products.
3. If the host restarts and resets the database, simply log in, go to settings, click **Select JSON File**, and upload your backup to restore everything instantly!
