# Vercel Deployment Guide for AFFILIATE Project

## Current Issue
There are permission issues with npm global installation. However, since your project is already on GitHub, let's use the more reliable GitHub integration instead.

## Option 1: GitHub Integration (Recommended)
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository: `vishxtr/AFFILIATE`
5. Configure project settings:
   - **Project Name:** affiliate
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

## Option 2: Environment Variables
Add these in Vercel dashboard under Project Settings > Environment Variables:

```
VITE_SUPABASE_URL=https://idlphiaatjwouuovxexk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkbHBoaWFhdHdvdXVvdnhleGsiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczMzQ2NjcyNCwiZXhwIjoyMDQ5MDQyNzI0fQ.TDYPzBT7P8IuKEhJOWtN1yEGGONuKS-5Q5gXw_VnvY
VITE_ENV=production
```

## Build Configuration
Your project should build successfully now with:
- ✅ Fixed missing adminActivity.ts file
- ✅ Fixed all @ path imports to relative imports
- ✅ All 18 files updated and pushed to GitHub

## Admin Credentials
- Username: `hui`
- Password: `1090`