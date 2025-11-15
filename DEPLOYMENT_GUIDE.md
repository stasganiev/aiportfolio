# 🚀 DEPLOYMENT GUIDE - GitHub Pages

## 📋 Overview
This guide will help you deploy your portfolio website to GitHub Pages with automatic deployment.

---

## 🎯 Prerequisites

1. ✅ GitHub account
2. ✅ Git installed locally
3. ✅ Repository created on GitHub
4. ✅ Python 3.x installed (for production build)

---

## 📦 Step 1: Production Build (Optional but Recommended)

The production build minifies CSS and JavaScript files for better performance.

### Run Production Build:

```bash
# Navigate to project directory
cd D:\git\temp\ailanding

# Run build script
python build_production.py
```

### What it does:
- ✅ Minifies all CSS files
- ✅ Minifies all JavaScript files
- ✅ Creates `dist/` directory with optimized files
- ✅ Updates paths in HTML files
- ✅ Shows size reduction statistics

### Output Example:
```
🚀 Starting production build...

📦 Minifying CSS files...
  ✓ style.css: 45,234 → 32,156 bytes (28.9% smaller)
  ✓ timeline.css: 12,345 → 8,234 bytes (33.3% smaller)
  ...

📦 Minifying JavaScript files...
  ✓ main.js: 23,456 → 15,678 bytes (33.2% smaller)
  ...

✅ Production build complete!
Total saved: 45,678 bytes
```

---

## 🔧 Step 2: GitHub Repository Setup

### 2.1 Create Repository on GitHub

1. Go to [github.com](https://github.com)
2. Click **"New repository"** (green button)
3. Repository settings:
   - **Name:** `portfolio` (or any name you prefer)
   - **Description:** "My professional portfolio website"
   - **Visibility:** Public (required for free GitHub Pages)
   - **Don't** initialize with README (you already have files)

4. Click **"Create repository"**

### 2.2 Connect Local Repository to GitHub

```bash
# If you haven't initialized git yet:
git init

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git

# Or if using SSH:
git remote add origin git@github.com:YOUR_USERNAME/portfolio.git

# Verify remote
git remote -v
```

### 2.3 Push Your Code

```bash
# Check status
git status

# Add all files
git add .

# Commit
git commit -m "Initial commit - Portfolio website ready for deployment"

# Push to GitHub
git push -u origin main

# If your branch is named 'master', use:
git push -u origin master
# Then rename to main:
git branch -m master main
git push -u origin main
```

---

## 🌐 Step 3: Enable GitHub Pages

### 3.1 Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** tab
3. In the left sidebar, click **"Pages"**
4. Under **"Build and deployment"**:
   - **Source:** Select **"GitHub Actions"**
   
5. Save (if there's a save button)

### 3.2 Workflow Will Auto-Deploy

The `.github/workflows/deploy.yml` file will automatically:
- ✅ Trigger on every push to `main` branch
- ✅ Build and deploy your site
- ✅ Make it live at: `https://YOUR_USERNAME.github.io/REPO_NAME/`

---

## 🎉 Step 4: Verify Deployment

### Check Deployment Status:

1. Go to your repository on GitHub
2. Click **"Actions"** tab
3. You should see a workflow running: **"Deploy to GitHub Pages"**
4. Wait for it to complete (green checkmark ✓)

### Access Your Live Site:

Your site will be available at:
```
https://YOUR_USERNAME.github.io/REPO_NAME/
```

Example:
```
https://stasganiev.github.io/portfolio/
```

### Custom Domain (Optional):

If you want to use `ganiev.pro` instead:

1. In repository Settings → Pages
2. Under **"Custom domain"**, enter: `ganiev.pro`
3. Add DNS records at your domain provider:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   
   Type: CNAME
   Name: www
   Value: YOUR_USERNAME.github.io
   ```
4. Wait for DNS propagation (can take 24-48 hours)

---

## 🔄 Step 5: Future Updates

Every time you want to update your site:

```bash
# Make your changes...

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Update: Added new project"

# Push to GitHub
git push

# GitHub Actions will automatically deploy! 🚀
```

### Check Deployment:
1. Go to Actions tab
2. Watch the deployment progress
3. Site updates in 1-2 minutes

---

## 🛠️ Troubleshooting

### Issue: Site not loading / 404 Error

**Solution 1: Check branch name**
```bash
# Ensure you're on 'main' branch
git branch

# If on 'master', rename to 'main':
git branch -m master main
git push -u origin main
```

**Solution 2: Update GitHub Pages source**
- Settings → Pages
- Source: GitHub Actions (not "Deploy from a branch")

**Solution 3: Check repository visibility**
- Settings → General
- Ensure repository is **Public**

### Issue: Workflow fails

**Check workflow logs:**
1. Go to Actions tab
2. Click on failed workflow
3. Read error messages
4. Common fixes:
   - Enable Pages in Settings → Pages
   - Check file permissions
   - Verify .github/workflows/deploy.yml exists

### Issue: CSS/JS not loading

**Check paths in HTML:**
- Development paths: `./css/style.css`, `./js/main.js`
- Production paths: `./dist/css/style.css`, `./dist/js/main.js`

**If using production build:**
- Ensure `dist/` folder is committed
- Check that paths are updated in HTML

---

## 📊 Performance Tips

### 1. Production Build
Always run production build before major updates:
```bash
python build_production.py
git add dist/
git commit -m "Production build"
git push
```

### 2. Image Optimization
- Use WebP format (already implemented ✓)
- Compress images before upload
- Use lazy loading (already implemented ✓)

### 3. Cache Control
GitHub Pages automatically caches static assets.

### 4. Monitor Performance
Use Google PageSpeed Insights:
```
https://pagespeed.web.dev/
```

---

## 🔐 Security

### HTTPS
✅ GitHub Pages automatically provides HTTPS
✅ Your site will be served over `https://`

### Custom Domain HTTPS
✅ Enable **"Enforce HTTPS"** in Settings → Pages
✅ Automatic Let's Encrypt certificate

---

## 📱 Testing Before Deploy

### Local Testing:
```bash
# Simple HTTP server (Python)
python -m http.server 8000

# Open browser
http://localhost:8000
```

### Test Different Devices:
- Use browser DevTools (F12)
- Responsive mode
- Test mobile, tablet, desktop

---

## 📈 Analytics (Optional)

Want to track visitors?

### Google Analytics:
1. Get tracking ID from Google Analytics
2. Add to `<head>` in index.html:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

---

## 🎯 Quick Reference

### Essential Commands:
```bash
# Build production
python build_production.py

# Check status
git status

# Stage all changes
git add .

# Commit
git commit -m "Your message"

# Push and deploy
git push

# View remote URL
git remote -v

# Check current branch
git branch
```

### Essential URLs:
- **Repository:** `https://github.com/YOUR_USERNAME/REPO_NAME`
- **Live Site:** `https://YOUR_USERNAME.github.io/REPO_NAME/`
- **Actions:** `https://github.com/YOUR_USERNAME/REPO_NAME/actions`
- **Settings:** `https://github.com/YOUR_USERNAME/REPO_NAME/settings/pages`

---

## ✅ Deployment Checklist

Before first deployment:
- [ ] Production build completed
- [ ] All changes committed
- [ ] GitHub repository created
- [ ] Remote origin added
- [ ] Code pushed to main branch
- [ ] GitHub Pages enabled (Actions)
- [ ] Workflow triggered successfully
- [ ] Site accessible at GitHub Pages URL
- [ ] Tested on mobile
- [ ] Tested on different browsers

---

## 🎉 You're Live!

Congratulations! Your portfolio is now:
- ✅ Live on the internet
- ✅ Automatically deployed on every push
- ✅ Optimized for performance
- ✅ Accessible from anywhere
- ✅ Free hosting forever!

---

## 📞 Need Help?

**GitHub Pages Documentation:**
https://docs.github.com/en/pages

**GitHub Actions Documentation:**
https://docs.github.com/en/actions

**Issues?**
Check Actions tab for deployment logs

---

**Ready to launch? Run the commands and watch your site go live! 🚀**
