# Rindon Johnson Portfolio Site

A minimalist portfolio website with Prismic CMS integration.

## ✨ Features

- **Black navigation bar** with Shows & Works dropdowns
- **Full-width gray color blocks** for gallery items
- **Red cursor dot** that follows mouse movement
- **Click-to-enlarge lightbox** image gallery
- **Uniform 14px text** throughout
- **Prismic CMS integration** for easy content management
- **Fully responsive** mobile design

## 🚀 DEPLOYMENT INSTRUCTIONS

### Prerequisites
- Vercel account (you already have this)
- GitHub account
- SiteGround DNS access
- Prismic repository: "rindon"

---

## STEP 1: Push to GitHub

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it: `rindon-portfolio` (or any name you prefer)
   - Make it **Public** or **Private**
   - **DON'T** initialize with README
   - Click "Create repository"

2. **In your terminal, navigate to this project folder:**
   ```bash
   cd rindon-site-nextjs
   ```

3. **Initialize git and push:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Rindon Johnson portfolio site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/rindon-portfolio.git
   git push -u origin main
   ```

---

## STEP 2: Deploy to Vercel

1. **Go to Vercel:**
   - Visit https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import your GitHub repository:**
   - Click "Import Git Repository"
   - Select `rindon-portfolio` (or whatever you named it)

3. **Configure the project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** `next build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)

4. **No environment variables needed** (Prismic repo name is hardcoded)

5. **Click "Deploy"**
   - Wait 1-2 minutes for deployment
   - You'll get a URL like: `rindon-portfolio-abc123.vercel.app`

6. **Test your site:**
   - Visit the Vercel URL
   - Make sure shows appear as gray blocks
   - Check that navigation works
   - Verify Prismic content loads

---

## STEP 3: Connect Your Domain (rinjohnson.com)

### In Vercel:

1. **Add your domain:**
   - Go to your project in Vercel
   - Click "Settings" → "Domains"
   - Click "Add"
   - Enter: `rinjohnson.com`
   - Click "Add"

2. **Also add www subdomain:**
   - Click "Add" again
   - Enter: `www.rinjohnson.com`
   - Click "Add"

3. **Vercel will show you DNS records to add**

### In SiteGround:

1. **Log into SiteGround:**
   - Go to https://my.siteground.com
   - Navigate to: **Site Tools** → **Domain** → **DNS Zone Editor**

2. **Find rinjohnson.com domain**

3. **Add/Update A Record:**
   ```
   Type: A
   Host: @
   Points to: 76.76.19.61
   TTL: 1 Hour
   ```

4. **Add/Update CNAME Record (for www):**
   ```
   Type: CNAME
   Host: www
   Points to: cname.vercel-dns.com
   TTL: 1 Hour
   ```

5. **Delete old records:**
   - Remove any existing A records pointing elsewhere
   - Remove any conflicting CNAME records

6. **Save changes**

### Wait for DNS Propagation:
- Usually takes 15-30 minutes
- Can take up to 24 hours
- Check status: https://www.whatsmydns.net

### Verify in Vercel:
- Go back to Vercel → Settings → Domains
- You should see:
  - ✅ rinjohnson.com
  - ✅ www.rinjohnson.com

---

## STEP 4: Verify Everything Works

Visit https://rinjohnson.com and check:

- ✅ Black navigation bar appears
- ✅ Gray color blocks for shows
- ✅ Dropdowns work (Shows, Works)
- ✅ Red cursor dot follows mouse
- ✅ Click a show → images appear
- ✅ Click an image → lightbox opens
- ✅ All text is 14px
- ✅ Images load from Prismic
- ✅ **NO white rectangle under navigation!**

---

## 📝 Managing Content in Prismic

### Your Prismic Setup:
- Repository: `rindon`
- Content Type: `work_item`

### Required Fields in Prismic:
Make sure your `work_item` type has these fields:
- `title` (text)
- `year` (text)
- `venue` (text)
- `location` (text)
- `description` (rich text)
- `gallery` (gallery/image group)
- `video_embed` (embed)
- `tags` (text - for grouping works)

### How to Add a New Show:

1. **Go to Prismic:**
   - https://prismic.io/dashboard
   - Select "rindon" repository

2. **Create new work_item:**
   - Click "Create New" → "work_item"
   - Fill in all fields
   - Add images to the `gallery` field
   - Click "Save" then "Publish"

3. **Auto-updates:**
   - Changes appear on your site immediately!
   - Vercel rebuilds on each Prismic change

### How to Group Works (for Works Dropdown):

Add **tags** to your work items:
- `coeval-propositions`
- `vr-works`
- `law-of-large-numbers`
- `rawhide-works`

Example: Tag a work with `vr-works` and it appears under "VR Works" in the dropdown.

---

## 🎨 Customizing Colors

Edit `app/globals.css` (lines 5-8):

```css
:root {
  --cursor-color: #ff0000;      /* Red cursor dot */
  --nav-background: #000000;    /* Black navigation */
  --text-color: #000000;        /* Black text */
}
```

Try:
- Cursor: `#ffff00` (yellow), `#ff006e` (pink)
- Nav: `#808080` (gray), `#2c3e50` (slate)

After changing:
```bash
git add .
git commit -m "Updated colors"
git push
```
Vercel auto-deploys in ~1 minute!

---

## 🐛 Troubleshooting

### Site not loading?
- Check Vercel build logs
- Verify DNS records in SiteGround
- Clear browser cache

### Images not showing?
- Check images exist in Prismic
- Verify repository name is "rindon"
- Check browser console for errors

### White rectangle under nav?
- This has been **FIXED** in the CSS
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Dropdown not working?
- Hard refresh browser
- Check JavaScript console for errors

---

## 📁 Project Structure

```
rindon-site-nextjs/
├── app/
│   ├── page.js              # Homepage (gray blocks)
│   ├── layout.js            # Root layout
│   ├── globals.css          # ALL STYLING HERE
│   ├── work/[uid]/page.js   # Individual show pages
│   ├── series/[tag]/page.js # Series/works pages
│   ├── contact/page.js      # Contact page
│   ├── cv/page.js           # CV page
│   ├── news/page.js         # News page
│   ├── press/page.js        # Press page
│   └── writing/page.js      # Writing page
├── components/
│   ├── Navigation.js        # Nav with dropdowns
│   ├── CursorTracker.js     # Red cursor dot
│   └── Lightbox.js          # Image gallery
├── prismicio.js             # Prismic config
├── next.config.js           # Next.js config
└── package.json             # Dependencies
```

---

## 🎉 You're Done!

Your site is now live with:
- ✅ Beautiful minimal design
- ✅ Prismic CMS integration
- ✅ Auto-deployment via Vercel
- ✅ Custom domain (rinjohnson.com)
- ✅ NO spacing issues!

**Questions?**
- Vercel docs: https://vercel.com/docs
- Prismic docs: https://prismic.io/docs
- Next.js docs: https://nextjs.org/docs

---

## 🔄 Making Updates

To update your site:

1. Make changes to files
2. Commit and push:
   ```bash
   git add .
   git commit -m "Your change description"
   git push
   ```
3. Vercel automatically deploys!

---

Built with ❤️ using Next.js 14 + Prismic
