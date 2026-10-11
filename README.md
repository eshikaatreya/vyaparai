# VyaparAI 🚀
### Smart Billing, AI Data Analyst & Inventory Management System

[![GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-brightgreen?logo=github)](https://mxhi-04.github.io/VyaparAI/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/Mxhi-04/VyaparAI)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**VyaparAI** is an all-in-one Single-Page Web Application designed specifically for small businesses (cafes, retail boutiques, kirana stores, handmade creator studios). Packed with an executive dashboard, natural language Voice POS simulator, automated supplier invoice OCR verification, predictive runout alerts, and EOD cash drawer reconciliation.

---

## 🌟 Live Demo

- **GitHub Pages:** [https://mxhi-04.github.io/VyaparAI/](https://mxhi-04.github.io/VyaparAI/)
- **Vercel 1-Click Deploy:** Import this repository into [Vercel](https://vercel.com/new) with zero configuration!

---

## ✨ Core Modules & Features

1. **Dashboard & AI Business Coach:**
   - Real-time revenue, gross and net profit (post-overheads calculation), idle dead stock capital tracking.
   - Interactive Chart.js sales vs net profit trend & category inventory value breakdown.
   - Algorithmic plain-language insight cards with actionable recommendations.

2. **Smart Billing & Voice POS Counter:**
   - Fast itemized counter supporting fractional units (e.g., 1.5 kg, 0.5 L, custom piece counts).
   - Voice POS simulator powered by natural language fuzzy matching and Web Speech API.
   - Multi-mode checkout: Cash tendered with exact change calculator, UPI QR code with green soundbox simulation and audio chime, and Razorpay sandbox gateway.
   - ESC/POS 58/80mm thermal receipt preview and print simulation.

3. **Net Profit Tracking & Dead Stock Analytics:**
   - Itemized unit economics ledger showing cost price vs selling price, gross margin %, and monthly overheads deduction.
   - Dead stock capital analyzer highlighting stock idle for 30/45+ days with one-click clearance markdowns.

4. **Supplier Invoice OCR & Damage Restock:**
   - Computer vision OCR simulation extracting vendor details, invoice totals, and line items.
   - Restock verification workflow: routes undamaged goods to live inventory while directing damaged goods into a dedicated shrinkage & supplier credit note log.

5. **Predictive Stock & Runout Alerts:**
   - Daily sales velocity calculation vs supplier lead times with dynamic countdown badges.
   - Automated reorder purchase order (PO) generator with WhatsApp-ready supplier messages.

6. **Staff Permissions & EOD Cash Drawer Reconciler:**
   - Role switcher: Store Owner (full financial ledger and price edits) vs Cashier (protected billing and drawer entry).
   - Physical denomination counter with automated shortage/overage discrepancy detection.

7. **Market Intelligence API:**
   - Real-time regional demand surge index, search volume trends, and competitor price advice benchmarks across Home Decor, Cafe/Bakery, Grocery, and Fashion Boutiques.

8. **Aesthetic Dark & Light Mode:**
   - Deep midnight obsidian palette with neon emerald and indigo accents, glassmorphic panels, 3D tilt micro-interactions, and instant theme switching.

---

## 🛠️ Local Development

Simply clone and serve with any static web server:

```bash
# Clone the repository
git clone https://github.com/Mxhi-04/VyaparAI.git
cd VyaparAI

# Run locally using Python
python3 -m http.server 8080

# Or using Node
npx serve .
```

Open `http://localhost:8080` in your browser.

---

## 🚢 Deploy to Vercel

1. Push this repository to your GitHub account (`Mxhi-04/VyaparAI`).
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Click **"Import"** on `VyaparAI`.
4. Deploy! No build commands or environment variables required.

---

## 📄 License

MIT License © 2026 VyaparAI / Mxhi-04
