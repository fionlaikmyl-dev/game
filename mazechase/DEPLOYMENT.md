# Deployment Guide

## Quick Start

Choose any of these free hosting options to deploy your Maze Chase game online:

---

## 1. **Netlify** (Recommended for beginners)

### Steps:
1. Create a free account at [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Click **"Deploy site"**

**That's it!** Your game will be live at a netlify.app URL.

### Automatic deploys:
- Every push to GitHub automatically updates your site

---

## 2. **Vercel** (Great for performance)

### Steps:
1. Create a free account at [vercel.com](https://vercel.com)
2. Click **"Create"** → **"Import Project"**
3. Paste your GitHub repository URL
4. Click **"Import"** then **"Deploy"**

**Done!** Your game is now on a vercel.app URL.

### Auto-deployment:
- Connects to your GitHub repo
- Deploys on every commit

---

## 3. **GitHub Pages** (Free with GitHub repo)

### Steps:
1. Push your code to a GitHub repository
2. Go to repository **Settings** → **Pages**
3. Under "Source", select **"Deploy from a branch"**
4. Choose **"main"** branch and **"/(root)"** folder
5. Click **"Save"**

**Wait 2-3 minutes**, then your site appears at `username.github.io/repository-name`

### File structure:
```
repository/
├── index.html
├── styles.css
├── game.js
├── README.md
└── (other files)
```

---

## 4. **Firebase Hosting** (Google's offering)

### Steps:
1. Install Firebase tools: `npm install -g firebase-tools`
2. Log in: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

**Your site is now at `yourproject.firebaseapp.com`**

---

## 5. **Traditional Web Host** (Bluehost, GoDaddy, etc.)

### Steps:
1. Sign up for a hosting plan
2. Use FTP or file manager to upload:
   - `index.html`
   - `styles.css`
   - `game.js`
   - `README.md`
3. Access your domain in browser

---

## 6. **Docker + Cloud Run** (Advanced)

Create a `Dockerfile`:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY . .
EXPOSE 8000
CMD ["npx", "http-server", "-p", "8000"]
```

Then deploy to any Docker-compatible platform (Google Cloud Run, AWS, etc.)

---

## Local Development Server

Before deploying, test locally:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# npm (if using package.json)
npm start
```

Then visit `http://localhost:8000`

---

## Domain Setup (Optional)

Most platforms let you connect a custom domain:

1. Buy a domain from GoDaddy, Namecheap, etc.
2. Point nameservers to your hosting platform
3. Configure in platform dashboard

**Popular platforms with custom domains:**
- ✅ Netlify (free)
- ✅ Vercel (free)
- ✅ GitHub Pages (free)
- ✅ Firebase (free)

---

## Environment Variables

This project doesn't need environment variables, but if you add features that do:

- **Netlify**: Settings → Build & deploy → Environment
- **Vercel**: Settings → Environment Variables
- **Firebase**: Use `.env` file locally, configure in console

---

## Performance Tips

1. **Enable Gzip compression** (usually automatic)
2. **Minimize files** for production
3. **Cache busting** - Add `?v=1.0.0` to file imports
4. **Use CDN** - Most platforms include this

---

## Monitoring & Analytics

### Free options:
- **Google Analytics** - Add tracking script to `index.html`
- **Netlify Analytics** - Built-in option
- **Vercel Analytics** - Built-in option

---

## Troubleshooting Deployment

### Game doesn't load:
- Check file paths are relative (`game.js`, not `/game.js`)
- Verify all files uploaded to hosting
- Check browser console for errors (F12)

### Game is slow:
- Enable gzip compression
- Check hosting platform performance stats
- Consider hosting closer to your users

### CORS errors:
- Not an issue for static files on same domain
- Ensure files are in public folder

### 404 errors:
- Verify index.html and resource paths
- Check platform's public directory setting
- May need `_redirects` or `netlify.toml` file

---

## Keeping Your Site Updated

After deployment, updating is easy:

**Git-based platforms (Netlify, Vercel, GitHub Pages):**
```bash
git add .
git commit -m "Update game"
git push origin main
```
*Site automatically updates!*

**Traditional FTP hosting:**
- Re-upload modified files via FTP
- Usually takes 5-15 minutes to update

---

## Comparison Table

| Platform | Cost | Setup Time | Custom Domain | Auto-Deploy | Best For |
|----------|------|-----------|---|---|---|
| Netlify | Free | 5 min | Yes | Yes | Beginners |
| Vercel | Free | 5 min | Yes | Yes | Performance |
| GitHub Pages | Free | 10 min | Yes | Yes | Developers |
| Firebase | Free | 15 min | Yes | Yes | Google ecosystem |
| Bluehost | $2-6/mo | 30 min | Yes | No | Full control |

---

## Next Steps

1. ✅ Choose a platform
2. ✅ Deploy your game
3. ✅ Share the URL with others
4. ✅ Celebrate! 🎉

**Questions?** Check the platform's documentation or ask their support team.
