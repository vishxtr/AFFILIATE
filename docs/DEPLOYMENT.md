# Deployment Guide

Complete guide for deploying the AFFILIATE platform to production.

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Deployment Options](#deployment-options)
- [Vercel Deployment](#vercel-deployment)
- [Netlify Deployment](#netlify-deployment)
- [Custom Server Deployment](#custom-server-deployment)
- [Environment Configuration](#environment-configuration)
- [Post-Deployment Steps](#post-deployment-steps)
- [Monitoring and Maintenance](#monitoring-and-maintenance)

---

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] All environment variables configured
- [ ] Supabase database tables created
- [ ] RLS policies properly configured
- [ ] Admin account created and tested
- [ ] Sample products added (optional)
- [ ] Production build tested locally
- [ ] SSL certificate ready (if custom domain)
- [ ] Analytics configured (optional)
- [ ] Error tracking setup (optional)

---

## Deployment Options

### Recommended Platforms

1. **Vercel** (Recommended)
   - ✅ Zero configuration for Vite apps
   - ✅ Automatic deployments from Git
   - ✅ Built-in CDN and SSL
   - ✅ Free tier available
   - ✅ Custom domains

2. **Netlify**
   - ✅ Simple drag-and-drop deployment
   - ✅ Automatic Git deployments
   - ✅ Free tier with generous limits
   - ✅ Built-in forms (can replace contact form)

3. **Custom Server**
   - ✅ Full control over infrastructure
   - ✅ Can run on VPS/Cloud
   - ❌ Requires more setup
   - ❌ Need to manage SSL, CDN, etc.

---

## Vercel Deployment

### Method 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Project Directory**
   ```bash
   cd /path/to/AFFILIATE
   vercel
   ```

4. **Follow the prompts:**
   ```
   ? Set up and deploy "AFFILIATE"? [Y/n] y
   ? Which scope do you want to deploy to? Your Account
   ? Link to existing project? [y/N] n
   ? What's your project's name? affiliate
   ? In which directory is your code located? ./
   ```

5. **Configure Build Settings:**
   - Build Command: `pnpm build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`

6. **Add Environment Variables:**
   ```bash
   vercel env add VITE_SUPABASE_URL production
   vercel env add VITE_SUPABASE_ANON_KEY production
   ```
   
   Or via dashboard: Settings → Environment Variables

7. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

### Method 2: Using Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)**

2. **Click "Add New" → "Project"**

3. **Import Git Repository**
   - Connect your GitHub/GitLab/Bitbucket account
   - Select the AFFILIATE repository

4. **Configure Project**
   - Framework Preset: `Vite`
   - Build Command: `pnpm build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`

5. **Add Environment Variables**
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

6. **Click "Deploy"**

7. **Wait for Build** (~2-5 minutes)

8. **Access Your Site**
   - Default URL: `https://affiliate-xxx.vercel.app`
   - Custom domain: Settings → Domains

### Vercel Configuration File

Create `vercel.json` in project root:

```json
{
  "version": 2,
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "vite",
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@vite_supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@vite_supabase_anon_key"
  }
}
```

---

## Netlify Deployment

### Method 1: Using Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Site**
   ```bash
   cd /path/to/AFFILIATE
   netlify init
   ```

4. **Configure Build Settings:**
   - Build command: `pnpm build`
   - Publish directory: `dist`

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Method 2: Using Netlify Dashboard

1. **Go to [netlify.com](https://netlify.com)**

2. **Click "Add new site" → "Import an existing project"**

3. **Connect to Git Provider**
   - Choose GitHub/GitLab/Bitbucket
   - Authorize Netlify
   - Select AFFILIATE repository

4. **Configure Build Settings**
   - Build command: `pnpm build`
   - Publish directory: `dist`
   - Base directory: (leave empty)

5. **Add Environment Variables**
   - Site settings → Environment → Environment variables
   - Add: `VITE_SUPABASE_URL`
   - Add: `VITE_SUPABASE_ANON_KEY`

6. **Click "Deploy site"**

7. **Wait for Build** (~2-5 minutes)

### Method 3: Drag and Drop

1. **Build Locally**
   ```bash
   pnpm build
   ```

2. **Go to [netlify.com/drop](https://app.netlify.com/drop)**

3. **Drag the `dist` folder** to the drop zone

4. **Configure Environment Variables** (Settings → Environment)

### Netlify Configuration File

Create `netlify.toml` in project root:

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/assets/*"
  [headers.values]
    cache-control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## Custom Server Deployment

### Using Nginx

1. **Build the Application**
   ```bash
   pnpm build
   ```

2. **Copy Build to Server**
   ```bash
   scp -r dist/* user@server:/var/www/affiliate/
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name affiliate.example.com;

       root /var/www/affiliate;
       index index.html;

       # Gzip compression
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

       # Cache static assets
       location /assets/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # SPA routing
       location / {
           try_files $uri $uri/ /index.html;
       }

       # Security headers
       add_header X-Frame-Options "DENY";
       add_header X-Content-Type-Options "nosniff";
       add_header Referrer-Policy "strict-origin-when-cross-origin";
   }
   ```

4. **Enable Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/affiliate /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Setup SSL with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d affiliate.example.com
   ```

### Using Apache

1. **Build the Application**
   ```bash
   pnpm build
   ```

2. **Copy Build to Server**
   ```bash
   scp -r dist/* user@server:/var/www/html/affiliate/
   ```

3. **Create .htaccess**
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>

   # Cache static assets
   <FilesMatch "\.(jpg|jpeg|png|gif|svg|css|js|woff|woff2)$">
     Header set Cache-Control "max-age=31536000, public"
   </FilesMatch>

   # Security headers
   Header set X-Frame-Options "DENY"
   Header set X-Content-Type-Options "nosniff"
   Header set Referrer-Policy "strict-origin-when-cross-origin"
   ```

### Using Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine as builder
   
   WORKDIR /app
   COPY package*.json pnpm-lock.yaml ./
   RUN npm install -g pnpm && pnpm install
   COPY . .
   RUN pnpm build

   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create nginx.conf**
   ```nginx
   server {
       listen 80;
       location / {
           root /usr/share/nginx/html;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. **Build and Run**
   ```bash
   docker build -t affiliate .
   docker run -p 80:80 affiliate
   ```

---

## Environment Configuration

### Production Environment Variables

Create `.env.production`:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key

# Analytics
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Environment
VITE_ENV=production
```

### Security Best Practices

1. **Never commit `.env` files**
   ```bash
   # .gitignore
   .env
   .env.local
   .env.production
   ```

2. **Use Environment Variables Manager**
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment → Environment Variables
   - Custom: Use secrets management (AWS Secrets Manager, etc.)

3. **Rotate Keys Regularly**
   - Change Supabase keys periodically
   - Update deployed environment variables

---

## Post-Deployment Steps

### 1. Verify Deployment

```bash
# Check if site is accessible
curl -I https://your-site.com

# Check SSL certificate
openssl s_client -connect your-site.com:443 -servername your-site.com
```

### 2. Test Core Features

- [ ] Homepage loads correctly
- [ ] Products display properly
- [ ] Contact form works
- [ ] Admin login functions
- [ ] Admin dashboard accessible
- [ ] Product CRUD operations work
- [ ] Images load correctly
- [ ] Navigation works

### 3. Configure Custom Domain

**Vercel:**
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

**Netlify:**
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS

### 4. Setup Analytics

**Google Analytics:**
1. Create GA4 property
2. Get Measurement ID
3. Add to environment variables: `VITE_GOOGLE_ANALYTICS_ID`

### 5. Configure Error Tracking (Optional)

**Sentry:**
```bash
pnpm add @sentry/react
```

```javascript
// src/main.tsx
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: import.meta.env.MODE,
})
```

---

## Monitoring and Maintenance

### Performance Monitoring

1. **Use Lighthouse**
   ```bash
   npx lighthouse https://your-site.com --view
   ```

2. **Monitor Core Web Vitals**
   - Use Google Search Console
   - Check PageSpeed Insights

3. **Set Up Uptime Monitoring**
   - [UptimeRobot](https://uptimerobot.com/) (Free)
   - [Pingdom](https://www.pingdom.com/)
   - [StatusCake](https://www.statuscake.com/)

### Regular Maintenance

- [ ] Update dependencies monthly
- [ ] Review and rotate API keys quarterly
- [ ] Check analytics for issues weekly
- [ ] Backup database regularly
- [ ] Monitor error logs
- [ ] Review security advisories
- [ ] Test admin functions monthly

### Database Backups

**Supabase:**
- Free tier: Automatic daily backups (7-day retention)
- Pro tier: Point-in-time recovery

**Manual Backup:**
```bash
# Export database
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql
```

### Rolling Back Deployments

**Vercel:**
```bash
# List deployments
vercel list

# Rollback to previous deployment
vercel rollback [deployment-url]
```

**Netlify:**
- Go to Deploys → Select previous deploy → Publish deploy

---

## Troubleshooting

### Build Fails

**Issue:** Dependencies not installing
```bash
# Solution: Clear cache
pnpm store prune
rm -rf node_modules
pnpm install
```

**Issue:** TypeScript errors
```bash
# Solution: Check types
pnpm type-check
```

### Site Not Loading

**Issue:** 404 errors on routes
- Ensure SPA routing is configured (see Nginx/Apache configs)
- Check `vercel.json` or `netlify.toml` redirects

**Issue:** Environment variables not working
- Verify variables are prefixed with `VITE_`
- Rebuild after adding/changing variables
- Check browser console for undefined values

### Performance Issues

**Issue:** Slow page loads
- Enable Gzip compression
- Optimize images (use WebP format)
- Implement lazy loading
- Use CDN for static assets

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)

---

**Next:** [Contributing Guidelines](./CONTRIBUTING.md) | [Back to API Docs](./API.md)
