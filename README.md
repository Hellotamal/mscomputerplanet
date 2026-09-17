# M/S COMPUTER PLANET — IT & Renewable Energy Business Website

Official enterprise website for **M/S COMPUTER PLANET** (`www.mscomputerplanet.com`), catering to both **IT Solutions & AMC Services** and **Renewable Green Energy (Solar Power)** sales and support.

---

## 🏛️ Business Credentials & Registrations

- **Company Name:** M/S COMPUTER PLANET
- **Registration:** Registered Trader under MSME Registration, Government of India
- **MSME Reg. No:** `UDYAM-AS-05-0019941`
- **GSTIN:** `18ASTPR6755J1Z0`
- **Trade License:** Municipal Trade Licence Holder (Silchar Municipal Authority)
- **Registered Address:** West Kachudharam, Chincoorie, Silchar, Cachar, Assam - 788007
- **Phone:** `+91-8638083712`
- **Email:** `computerplanetpkd@gmail.com`
- **Verified Clientele:** 
  - Punjab National Bank (Circle Office Silchar & 49 Branches, Certificate Ref: `PNB/CO/SIL/021/2023-24`)
  - Indian Post (Cachar Division & Post Offices)
  - Assam Gramin Bikash Bank (Silchar Regional Office & Branches)
  - Regional commercial & educational institutions in Barak Valley

---

## 🚀 Key Features

1. **Responsive Multi-Screen Architecture**: Optimized for mobile phones, tablets, laptops, and ultra-wide desktops.
2. **Dual Business Verticals**:
   - **IT Services & Hardware AMC**: Hardware maintenance, operating system & software patches, dedicated on-site manpower, and 2-4 hour emergency response SLAs.
   - **Renewable Solar Energy**: On-grid, hybrid, and off-grid rooftop solar systems, commercial bank branch backup, solar inverters, lithium & tubular batteries, and solar water pumps.
3. **Interactive Solar ROI Calculator**: Real-time computation of recommended kW capacity, roof space in sq. ft., monthly bill savings, and 25-year lifetime savings.
4. **Product Catalog**: Multi-category hardware and solar component showcase with direct WhatsApp inquiry triggers.
5. **Verified Trust & Clientele Showcase**: Details official PNB 49-branch contract satisfaction and government trade credentials.
6. **Instant Lead Capture & WhatsApp Integration**: Quote modal and contact form configured for immediate dispatch to WhatsApp (+91-8638083712) and email.
7. **Cloudflare Pages & SEO Ready**: Includes `_headers`, `_redirects`, `robots.txt`, `sitemap.xml`, and Schema.org LocalBusiness JSON-LD markup.

---

## 🛠️ Technology Stack

- **Frontend:** React 19 + Vite 8
- **Styling:** Tailwind CSS + custom glassmorphism and gradient design system
- **Icons:** Lucide React
- **Hosting Target:** Cloudflare Pages (Global CDN with 100/100 Lighthouse performance)
- **Version Control:** GitHub

---

## 📦 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 🌐 Deployment to GitHub & Cloudflare Pages

### Step 1: Push Code to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: M/S Computer Planet IT & Renewable Energy Website"

# Rename branch to main
git branch -M main

# Link to your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git

# Push code to GitHub
git push -u origin main
```

### Step 2: Deploy to Cloudflare Pages (Free & Automatic)

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation, click on **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your GitHub account and choose the repository you just pushed.
4. In the **Set up builds and deployments** section:
   - **Project Name:** `mscomputerplanet` (or your preferred name)
   - **Production branch:** `main`
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Click **Save and Deploy**. Cloudflare Pages will build and deploy your website in less than 60 seconds with a free `*.pages.dev` domain.

### Step 3: Connect Custom Domain (`www.mscomputerplanet.com`)

1. In Cloudflare Pages, go to your project > **Custom domains**.
2. Click **Set up a custom domain**.
3. Enter `www.mscomputerplanet.com` and `mscomputerplanet.com`.
4. Follow the automatic DNS activation (Cloudflare provisions free SSL/TLS certificates automatically).
