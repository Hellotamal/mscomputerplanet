# 📖 Complete Installation, Setup & Deployment Manual
### **M/S COMPUTER PLANET — IT & Renewable Energy Website**
**Website URL:** [www.mscomputerplanet.com](https://www.mscomputerplanet.com)  
**Project Path:** `d:\Projects\IT_website_MCP`

---

## 📑 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Project Structure Overview](#2-project-structure-overview)
3. [Local Development & Testing](#3-local-development--testing)
4. [Pushing Code to GitHub](#4-pushing-code-to-github)
5. [Deploying to Cloudflare Pages](#5-deploying-to-cloudflare-pages)
6. [Configuring Custom Domain (`www.mscomputerplanet.com`)](#6-configuring-custom-domain)
7. [How to Edit Content & Information](#7-how-to-edit-content--information)
8. [Troubleshooting & Maintenance](#8-troubleshooting--maintenance)

---

## 1. Prerequisites

Before starting, ensure you have the following installed and set up:

| Requirement | Description | Check Command |
| :--- | :--- | :--- |
| **Node.js** | Version 18+ or 20+ (Node v24 is already installed) | `node -v` |
| **NPM** | Version 9+ or higher | `npm -v` |
| **Git** | Version Control System | `git --version` |
| **GitHub Account** | Free account at [github.com](https://github.com/) | — |
| **Cloudflare Account** | Free account at [cloudflare.com](https://dash.cloudflare.com/) | — |
| **Domain Registrar** | Access to where `mscomputerplanet.com` is purchased (GoDaddy, Namecheap, Hostinger, etc.) | — |

---

## 2. Project Structure Overview

```text
d:\Projects\IT_website_MCP/
├── public/
│   ├── _headers             # Cloudflare Pages security & caching headers
│   ├── _redirects           # Cloudflare Pages SPA client-side routing
│   ├── favicon.svg          # Branded IT circuit + Solar leaf favicon
│   ├── robots.txt           # Search engine crawling rules
│   └── sitemap.xml          # XML sitemap for Google SEO
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Header with MSME/GSTIN bar, contacts & mobile drawer
│   │   ├── Hero.jsx             # Dual-vertical showcase (IT & Solar) with stats
│   │   ├── TrustBar.jsx         # MSME, GSTIN, Trade License, Bank vendor badges
│   │   ├── ServicesIT.jsx       # 6 IT & AMC services and benefits
│   │   ├── ServicesSolar.jsx    # 6 Solar energy & backup services
│   │   ├── SolarCalculator.jsx  # Interactive Solar ROI & kW capacity estimator
│   │   ├── ProductsCatalog.jsx  # Categorized hardware & solar product showcase
│   │   ├── ClienteleTrack.jsx   # Punjab National Bank, India Post, AGBB credentials
│   │   ├── ContactSection.jsx   # Office address, phone, email & inquiry form
│   │   ├── QuoteModal.jsx       # Instant WhatsApp quote dispatch modal
│   │   ├── FloatingActions.jsx  # Sticky WhatsApp and mobile quick-call bar
│   │   └── Footer.jsx           # Full legal credentials, sitemap & contact links
│   ├── data/
│   │   ├── businessInfo.js      # Central phone, email, address, GSTIN & MSME data
│   │   └── productsServices.js  # Catalog items, specs, services & benefits data
│   ├── App.jsx                  # Main application orchestrator
│   ├── index.css                # Tailwind CSS styling & custom effects
│   └── main.jsx                 # Application entry point
├── dist/                        # Production build ready for deployment
├── index.html                   # HTML template with SEO & Google Schema markup
├── package.json                 # Project dependencies & build scripts
├── tailwind.config.js           # Theme colors, fonts & shadows configuration
└── vite.config.js               # Vite build tool configuration
```

---

## 3. Local Development & Testing

Open **PowerShell** or **Command Prompt** in the project directory (`d:\Projects\IT_website_MCP`):

### 3.1 Install Dependencies (if cloned freshly)
```powershell
npm install
```

### 3.2 Start Local Development Server (Live Reload)
```powershell
npm run dev
```
- Open your browser at: `http://localhost:5173/`
- Any changes you save in `src/` will instantly update in the browser.

### 3.3 Test the Production Build
```powershell
# 1. Compile production build
npm run build

# 2. Preview the compiled production build
npm run preview
```
- Preview URL: `http://localhost:4173/`

---

## 4. Pushing Code to GitHub

### Step 4.1: Create a New GitHub Repository
1. Log in to [GitHub](https://github.com/).
2. In the top-right corner, click **+** > **New repository**.
3. Fill in the repository details:
   - **Repository name:** `mscomputerplanet` (or `it-website-mcp`)
   - **Visibility:** Select **Public** or **Private** (Cloudflare Pages supports both for free).
   - **Do NOT** initialize with a README, .gitignore, or license (these already exist locally).
4. Click **Create repository**.
5. Copy your repository HTTPS URL (e.g., `https://github.com/YOUR_USERNAME/mscomputerplanet.git`).

### Step 4.2: Push Local Files to GitHub
In your terminal at `d:\Projects\IT_website_MCP`, run:

```powershell
# 1. Ensure all changes are staged and committed
git add .
git commit -m "feat: complete M/S Computer Planet business website"

# 2. Set default branch to main
git branch -M main

# 3. Add your remote repository (replace with YOUR GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/mscomputerplanet.git

# 4. Push code to GitHub
git push -u origin main
```

---

## 5. Deploying to Cloudflare Pages

Cloudflare Pages provides global edge hosting, unlimited bandwidth, free automated SSL/TLS certificates, and auto-deployments on every `git push`.

### Step 5.1: Create Application on Cloudflare
1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. On the left sidebar, click **Compute (Workers & Pages)** or **Workers & Pages**.
3. Click the **Create application** button.
4. Select the **Pages** tab.
5. Click **Connect to Git**.

### Step 5.2: Connect GitHub & Select Repository
1. Authorize Cloudflare to access your GitHub account.
2. Under **Select a repository**, choose `mscomputerplanet`.
3. Click **Begin setup**.

### Step 5.3: Configure Build Settings
Fill in the deployment configuration:

| Setting | Value |
| :--- | :--- |
| **Project name** | `mscomputerplanet` (or your preferred name) |
| **Production branch** | `main` |
| **Framework preset** | **`Vite`** |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | Leave blank / default (`/`) |

*Note: In the Environment variables section, no special variables are needed.*

### Step 5.4: Deploy
1. Click **Save and Deploy**.
2. Cloudflare will clone your repository, run `npm run build`, and deploy your website in approximately 30–60 seconds.
3. Once finished, Cloudflare will provide a temporary free domain like:  
   `https://mscomputerplanet.pages.dev`

---

## 6. Configuring Custom Domain (`www.mscomputerplanet.com`)

### Step 6.1: Add Domain in Cloudflare Pages
1. In your Cloudflare Pages dashboard, click on your project (`mscomputerplanet`).
2. Navigate to the **Custom domains** tab.
3. Click **Set up a custom domain**.
4. Enter `www.mscomputerplanet.com` and click **Continue**.
5. Repeat for the apex domain `mscomputerplanet.com`.

### Step 6.2: DNS Configuration
Depending on where your domain's DNS is managed:

#### Option A: Your DNS is managed directly in Cloudflare (Recommended)
- Cloudflare will automatically configure the CNAME and Apex DNS records for you with one click.
- Status will change to **Active** with automatic SSL within 2 to 5 minutes.

#### Option B: Your DNS is managed at another registrar (GoDaddy, Namecheap, BigRock, etc.)
Add the following DNS records in your domain provider's DNS management panel:

| Type | Name / Host | Target / Value | Proxy Status / TTL |
| :--- | :--- | :--- | :--- |
| **CNAME** | `www` | `mscomputerplanet.pages.dev` | DNS Only (or Automatic) |
| **CNAME / ALIAS** | `@` | `mscomputerplanet.pages.dev` | DNS Only (or Automatic) |

*SSL Certificate:* Cloudflare automatically provisions and renews a free SSL certificate for both `www.mscomputerplanet.com` and `mscomputerplanet.com`.

---

## 7. How to Edit Content & Information

All business details are centralized so you can modify them easily:

### 7.1 Editing Firm Contact, Address, Phone, GSTIN, MSME
Open `src/data/businessInfo.js`:
- Phone: edit `phone`, `phoneRaw`, `phoneDisplay`
- Email: edit `email`
- Address: edit `address.line1`, `address.city`, `address.pincode`
- Legal Registrations: edit `legal.udyamRegNo`, `legal.gstin`, etc.

### 7.2 Editing Services, Products & Brands
Open `src/data/productsServices.js`:
- To add or modify IT services: edit `IT_SERVICES`
- To add or modify Solar systems: edit `SOLAR_SERVICES`
- To add or modify Hardware items / Solar panels: edit `PRODUCTS_LIST`

### 7.3 Publishing Changes
Whenever you edit files locally, publish the update to Cloudflare Pages by running:
```powershell
git add .
git commit -m "Update contact and product pricing"
git push origin main
```
Cloudflare Pages will automatically detect the push, rebuild, and update the live website within 60 seconds!

---

## 8. Troubleshooting & Maintenance

### Common Questions:

1. **How do I verify the build locally before pushing?**
   ```powershell
   npm run build
   ```
   If it outputs `✓ built in X.XXs` with 0 errors, the site is 100% ready for deployment.

2. **How does the WhatsApp quote button work?**
   It formats the customer's selected service, system count, and name into a WhatsApp message link targeting `+91-8638083712`. It works on both mobile WhatsApp app and desktop WhatsApp Web without requiring any third-party API or recurring fees.

3. **Does the site have SEO for Silchar & Assam?**
   Yes! `index.html` includes Schema.org `LocalBusiness` JSON-LD markup with Silchar geolocation coordinates, MSME details, Google meta tags, and `sitemap.xml`.

4. **Need to run preview on port 4173?**
   ```powershell
   npm run preview
   ```

---
*Document prepared for M/S COMPUTER PLANET (`www.mscomputerplanet.com`)*
