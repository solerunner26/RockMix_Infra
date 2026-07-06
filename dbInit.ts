import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import xlsx from 'xlsx';
import Database from 'better-sqlite3';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.resolve(DATA_DIR, 'rockmix.db');
const EXCEL_PATH = path.resolve(process.cwd(), 'database.xlsx');
const CONTENT_PATH = path.resolve(process.cwd(), 'siteContent.json');
const BOOTSTRAP_PATH = path.resolve(process.cwd(), 'src', 'data', 'siteContent.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma('foreign_keys = ON');

function initDb() {
  console.log('Initializing SQLite Database schema...');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      short_desc TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      accent_color TEXT NOT NULL,
      badge_color TEXT NOT NULL,
      image TEXT NOT NULL,
      brochure TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      is_visible INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS product_features (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      feature_text TEXT NOT NULL,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS product_specifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      label TEXT NOT NULL,
      value TEXT NOT NULL,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS product_highlights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      highlight_text TEXT NOT NULL,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      image_path TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      source_form TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      company TEXT NOT NULL,
      city TEXT NOT NULL,
      country TEXT NOT NULL,
      products TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'New',
      notes TEXT DEFAULT '',
      submitted_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS media_assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_name TEXT NOT NULL,
      file_path TEXT UNIQUE NOT NULL,
      file_size TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      uploaded_at TEXT NOT NULL
    );
  `);

  console.log('✅ Tables created/verified.');

  // Create default admin user if none exists
  const adminCountRow = db.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number };
  if (adminCountRow.count === 0) {
    console.log('Seeding default administrator account...');
    const username = 'rockmin';
    const rawPass = 'Rock@2026#mix';
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(rawPass, salt, 10000, 64, 'sha512').toString('hex');
    const now = new Date().toISOString();

    db.prepare('INSERT INTO admin_users (username, password_hash, salt, created_at) VALUES (?, ?, ?, ?)').run(
      username,
      hash,
      salt,
      now
    );
    console.log(`✅ Admin account created. Username: ${username}`);
  }

  // Seed CMS settings and products from siteContent.json
  const settingsCountRow = db.prepare('SELECT COUNT(*) as count FROM site_settings').get() as { count: number };
  const productsCountRow = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };

  if (settingsCountRow.count === 0 && productsCountRow.count === 0) {
    console.log('Loading configuration source for initial data seed...');
    let sourcePath = CONTENT_PATH;
    if (!fs.existsSync(sourcePath)) {
      sourcePath = BOOTSTRAP_PATH;
    }

    if (fs.existsSync(sourcePath)) {
      try {
        const contentStr = fs.readFileSync(sourcePath, 'utf8');
        const content = JSON.parse(contentStr);

        console.log('Seeding site settings...');
        const keys = ['global', 'home', 'about', 'support', 'dealership', 'contact', 'buttons', 'forms', 'theme', 'footer', 'productsPage', 'inquiry', 'terms'];
        keys.forEach(key => {
          if (content[key]) {
            db.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)').run(
              key,
              JSON.stringify(content[key])
            );
          }
        });

        console.log('Seeding products...');
        if (Array.isArray(content.products)) {
          content.products.forEach((prod: any, idx: number) => {
            db.prepare(`
              INSERT INTO products (id, name, short_desc, description, category, accent_color, badge_color, image, brochure, order_index)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
              prod.id,
              prod.name,
              prod.shortDesc || '',
              prod.description || '',
              prod.category || 'Concrete Batching Plants',
              prod.accentColor || 'indigo',
              prod.badgeColor || '',
              prod.image || '',
              prod.brochure || '',
              idx
            );

            if (Array.isArray(prod.features)) {
              prod.features.forEach((feat: string) => {
                db.prepare('INSERT INTO product_features (product_id, feature_text) VALUES (?, ?)').run(
                  prod.id,
                  feat
                );
              });
            }

            if (Array.isArray(prod.specifications)) {
              prod.specifications.forEach((spec: any) => {
                db.prepare('INSERT INTO product_specifications (product_id, label, value) VALUES (?, ?, ?)').run(
                  prod.id,
                  spec.label || '',
                  spec.value || ''
                );
              });
            }

            if (Array.isArray(prod.highlights)) {
              prod.highlights.forEach((hl: string) => {
                db.prepare('INSERT INTO product_highlights (product_id, highlight_text) VALUES (?, ?)').run(
                  prod.id,
                  hl
                );
              });
            }

            if (Array.isArray(prod.additionalImages)) {
              prod.additionalImages.forEach((img: string, imgIdx: number) => {
                db.prepare('INSERT INTO product_images (product_id, image_path, order_index) VALUES (?, ?, ?)').run(
                  prod.id,
                  img,
                  imgIdx
                );
              });
            }
          });
        }
        console.log('✅ CMS settings and products seeded successfully.');
      } catch (err) {
        console.error('Failed to parse content seed file:', err);
      }
    }
  }

  // Import Leads from Excel if present
  const leadsCountRow = db.prepare('SELECT COUNT(*) as count FROM leads').get() as { count: number };
  if (leadsCountRow.count === 0 && fs.existsSync(EXCEL_PATH)) {
    console.log('Importing historical leads from database.xlsx...');
    try {
      const wb = xlsx.readFile(EXCEL_PATH);

      // 1. Process "Contact Us"
      if (wb.SheetNames.includes('Contact Us')) {
        const rows = xlsx.utils.sheet_to_json(wb.Sheets['Contact Us']) as any[];
        rows.forEach((row, index) => {
          const timestamp = row['Submitted At'] || new Date().toISOString();
          const id = `lead-contact-${index}-${Date.parse(timestamp) || Date.now()}`;
          const name = `${row['First Name'] || ''} ${row['Last Name'] || ''}`.trim() || 'N/A';
          db.prepare(`
            INSERT OR IGNORE INTO leads (id, source_form, name, email, phone, company, city, country, products, message, status, submitted_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            id,
            'Contact Us',
            name,
            row['Email ID'] || 'N/A',
            row['Mobile No.'] || 'N/A',
            row['Organization'] || 'N/A',
            row['City'] || 'N/A',
            'India', // Default country for older Contact Us rows
            'N/A',
            row['Message'] || 'N/A',
            'New',
            timestamp
          );
        });
        console.log(`✅ Imported ${rows.length} records from 'Contact Us' sheet.`);
      }

      // 2. Process "Dealership Application"
      if (wb.SheetNames.includes('Dealership Application')) {
        const rows = xlsx.utils.sheet_to_json(wb.Sheets['Dealership Application']) as any[];
        rows.forEach((row, index) => {
          const timestamp = row['Submitted At'] || new Date().toISOString();
          const id = `lead-dealer-${index}-${Date.parse(timestamp) || Date.now()}`;
          const name = row['Key Contact Person'] || row['Owner/MD Name'] || 'N/A';
          const details = `Activities: ${row['Current Business Activities'] || 'N/A'}. Experience: ${row['Experience (Years)'] || 'N/A'} Years. Annual Turnover: ${row['Annual Turnover'] || 'N/A'}`;
          db.prepare(`
            INSERT OR IGNORE INTO leads (id, source_form, name, email, phone, company, city, country, products, message, status, submitted_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            id,
            'Dealership App',
            name,
            row['Email Address'] || 'N/A',
            row['Mobile Number'] || row['Phone Number'] || 'N/A',
            row['Company Name'] || 'N/A',
            row['City State Country'] || 'N/A',
            row['Area Working Country'] || 'India',
            'N/A',
            details,
            'New',
            timestamp
          );
        });
        console.log(`✅ Imported ${rows.length} records from 'Dealership Application' sheet.`);
      }

      // 3. Process "getAquote"
      if (wb.SheetNames.includes('getAquote')) {
        const rows = xlsx.utils.sheet_to_json(wb.Sheets['getAquote']) as any[];
        rows.forEach((row, index) => {
          const timestamp = row['Submitted At'] || new Date().toISOString();
          const id = `lead-quote-${index}-${Date.parse(timestamp) || Date.now()}`;
          db.prepare(`
            INSERT OR IGNORE INTO leads (id, source_form, name, email, phone, company, city, country, products, message, status, submitted_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            id,
            'Get a Quote',
            row['Full Name'] || 'N/A',
            row['Email Address'] || 'N/A',
            row['Phone Number'] || 'N/A',
            row['Company Name'] || 'N/A',
            row['Address'] || 'N/A',
            'India',
            row['Product Selection'] || 'N/A',
            row['Message / Custom Requirement'] || 'N/A',
            'New',
            timestamp
          );
        });
        console.log(`✅ Imported ${rows.length} records from 'getAquote' sheet.`);
      }
      console.log('✅ Excel database migration complete.');
    } catch (err) {
      console.error('Failed to migrate Excel leads:', err);
    }
  }

  db.close();
  console.log('🎉 SQLite Database setup completed successfully!');
}

initDb();
