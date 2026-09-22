# 2_DEPLOYMENT.md - Enterprise Deployment & Hosting Manual

This document provides complete instructions for building, validating, and deploying the Executive Cybersecurity Portfolio across various hosting providers, with special troubleshooting for GitHub Pages, Vercel, Netlify, and Cloud Run.

---

## 1. Quick Start & Local Verification

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Package Manager**: npm or bun

### Local Development
```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev
```

### Production Build Verification
Always run the production build before committing or deploying:
```bash
npm run build
```
This runs `vite build` to output the optimized client bundle to `dist/`, and bundles `server.ts` into `dist/server.cjs` via esbuild.

---

## 2. GitHub Pages Deployment (Automated via GitHub Actions)

The repository includes a ready-to-use GitHub Actions workflow at `.github/workflows/deploy.yml`.

### Resolving the "404 - There isn't a GitHub Pages site here" Error
If you see the GitHub Pages 404 message after pushing:

1. **Enable GitHub Actions as the Pages Source**:
   - Open your repository on GitHub.
   - Navigate to **Settings** > **Pages** (in the left sidebar under *Code and automation*).
   - Under **Build and deployment** > **Source**, change the dropdown from **"Deploy from a branch"** to **"GitHub Actions"**.
   - Save the change.

2. **Verify Repository URL Path**:
   - For a project repository (e.g. `github.com/username/portfolio`), the URL is:
     `https://<username>.github.io/<repository-name>/`
   - Ensure you are not accessing the root user domain `https://<username>.github.io/` unless the repo is named `<username>.github.io`.

3. **Check Workflow Execution Status**:
   - Go to the **Actions** tab in your GitHub repository.
   - Look for **"Deploy static content to Pages"**.
   - If it hasn't run yet or failed, click **"Re-run jobs"** or push a small commit to `main` to trigger the build.
   - Once all steps (Checkout, Setup Node, Build, Setup Pages, Deploy) show green checkmarks, the deployment is live.

4. **Vite Base Path**:
   - In `vite.config.ts`, `base: './'` is configured so all asset links are relative and resolve properly under any repository subfolder.

---

## 3. Alternative Hosting Platforms

### A. Vercel
1. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Import your GitHub repository.
3. Configure project settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variables if utilizing Firebase or Resend email services (`RESEND_API_KEY`, etc.).
5. Click **Deploy**.

### B. Netlify
1. Sign in to [Netlify](https://netlify.com) and choose **"Import from Git"**.
2. Select your repository.
3. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Deploy the site.

### C. Cloud Run / Containerized Hosting
For full-stack operation with the custom Express security layer and API proxying:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.cjs"]
```

---

## 4. Custom Domain Setup (Optional)
If using a custom domain (e.g., `munishdhiman.com`):
1. In GitHub repo **Settings** > **Pages** > **Custom domain**, enter your domain name.
2. In your DNS provider (Cloudflare, GoDaddy, Route53), configure:
   - **Apex domain**: Add 4 `A` records pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **Subdomain (`www`)**: Add a `CNAME` record pointing to `<username>.github.io`.
3. Check the box **"Enforce HTTPS"** once the TLS certificate generates.
