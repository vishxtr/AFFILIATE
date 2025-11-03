# Setup Guide

This guide will walk you through setting up the AFFILIATE platform from scratch.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation Steps](#installation-steps)
- [Supabase Configuration](#supabase-configuration)
- [Database Setup](#database-setup)
- [Admin Account Setup](#admin-account-setup)
- [Development Setup](#development-setup)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
  ```bash
  node --version  # Should be >= 18.0.0
  ```

- **pnpm** (recommended) or npm
  ```bash
  npm install -g pnpm
  ```

- **Git**
  ```bash
  git --version
  ```

- **Supabase Account** - Sign up at [supabase.com](https://supabase.com)

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/vishxtr/AFFILIATE.git
cd AFFILIATE
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all required dependencies listed in `package.json`.

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## Supabase Configuration

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in project details:
   - **Name:** AFFILIATE (or your preferred name)
   - **Database Password:** Choose a strong password
   - **Region:** Select closest to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (~2 minutes)

### 2. Get API Keys

1. In your Supabase project dashboard, go to **Settings > API**
2. Copy the following values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
3. Add these to your `.env` file

---

## Database Setup

### 1. Create Database Tables

Open the **SQL Editor** in your Supabase dashboard and run the following SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2),
  original_price NUMERIC(10, 2),
  discount INTEGER,
  image_url TEXT,
  affiliate_link TEXT,
  category TEXT,
  rating NUMERIC(2, 1),
  reviews INTEGER DEFAULT 0,
  features JSONB,
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Create website_settings table
CREATE TABLE IF NOT EXISTS website_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admin_users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  event_data JSONB,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_activity_logs_admin ON activity_logs(admin_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_website_settings_updated_at BEFORE UPDATE ON website_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. Set Up Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Public read access for products
CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (is_active = true);

-- Public can submit contact forms
CREATE POLICY "Anyone can submit contact forms" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Public can read website settings
CREATE POLICY "Public can view website settings" ON website_settings
  FOR SELECT USING (true);

-- Public can create analytics events
CREATE POLICY "Anyone can create analytics events" ON analytics_events
  FOR INSERT WITH CHECK (true);
```

### 3. Insert Sample Data

```sql
-- Insert sample products
INSERT INTO products (title, description, price, original_price, discount, image_url, category, rating, features, is_featured) VALUES
('Premium Wireless Headphones', 'High-quality noise-canceling headphones with 30-hour battery life', 199.99, 299.99, 33, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 'Electronics', 4.8, '["Noise Canceling", "30hr Battery", "Bluetooth 5.0"]'::jsonb, true),
('Smart Fitness Tracker', 'Track your health and fitness with advanced sensors', 149.99, 199.99, 25, 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6', 'Fitness', 4.6, '["Heart Rate Monitor", "GPS", "Water Resistant"]'::jsonb, true),
('Ergonomic Office Chair', 'Comfortable chair designed for long work hours', 399.99, 599.99, 33, 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8', 'Furniture', 4.7, '["Lumbar Support", "Adjustable Height", "Breathable Mesh"]'::jsonb, false),
('4K Ultra HD Monitor', 'Crystal clear 27-inch display for work and gaming', 449.99, 599.99, 25, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf', 'Electronics', 4.9, '["4K Resolution", "HDR Support", "144Hz"]'::jsonb, true);

-- Insert default website settings
INSERT INTO website_settings (key, value) VALUES
('site_name', '"AFFILIATE"'::jsonb),
('site_description', '"Modern affiliate marketing platform"'::jsonb),
('contact_email', '"support@affiliate.com"'::jsonb),
('analytics_enabled', 'true'::jsonb);
```

---

## Admin Account Setup

### Option 1: Using Supabase Dashboard

1. Go to **Authentication > Users** in Supabase dashboard
2. Click "Add user" > "Create new user"
3. Fill in:
   - **Email:** your-email@example.com
   - **Password:** Choose a strong password
4. Click "Create user"

Then, add admin record:

```sql
INSERT INTO admin_users (username, email, password_hash, full_name)
VALUES ('admin', 'your-email@example.com', 'your-hashed-password', 'Admin User');
```

### Option 2: Using SQL (Development Only)

```sql
-- Create admin user (use proper password hashing in production!)
INSERT INTO admin_users (username, email, password_hash, full_name, role)
VALUES (
  'hui',
  'hui@admin.local',
  -- This is a bcrypt hash of '1090' - CHANGE IN PRODUCTION!
  '$2a$10$rYCFvEDJ1qOzN5H8WFfRUe8tYpHC0kF0YbxLnqjJBW1u8aBx7QOVW',
  'Admin User',
  'admin'
);
```

> ⚠️ **Security Warning:** Always use proper password hashing (bcrypt, argon2) in production!

---

## Development Setup

### 1. Start Development Server

```bash
pnpm dev
```

The application will start at `http://localhost:5173`

### 2. Access Admin Panel

1. Navigate to `http://localhost:5173/admin/login`
2. Log in with your admin credentials:
   - **Username:** hui
   - **Password:** 1090 (or your custom password)

### 3. First Steps

1. **Change Admin Password**
   - Go to `/admin/password`
   - Update to a secure password

2. **Configure Settings**
   - Go to `/admin/settings`
   - Update site name, description, contact info

3. **Add Products**
   - Go to `/admin/products`
   - Click "Add Product"
   - Fill in product details

4. **Test Contact Form**
   - Go to `/contact`
   - Submit a test inquiry
   - Check `/admin/queries` to see it

---

## Build for Production

```bash
# Create production build
pnpm build

# Preview production build locally
pnpm preview
```

The build output will be in the `dist/` directory.

---

## Troubleshooting

### Issue: "Module not found" errors

**Solution:**
```bash
# Clean install
pnpm clean
pnpm install
```

### Issue: Supabase connection fails

**Solution:**
1. Verify `.env` file exists and has correct values
2. Check Supabase project is running (green status in dashboard)
3. Verify API keys are correct
4. Check browser console for specific error messages

### Issue: Admin login not working

**Solution:**
1. Verify admin user exists in `admin_users` table
2. Check password hash is correct
3. Ensure RLS policies allow admin operations
4. Clear browser cache and try again

### Issue: Port 5173 already in use

**Solution:**
```bash
# Kill process using the port
lsof -ti:5173 | xargs kill -9

# Or use a different port
pnpm dev --port 5174
```

### Issue: Build fails with TypeScript errors

**Solution:**
```bash
# Check for errors
pnpm lint

# Fix TypeScript errors
pnpm type-check
```

### Issue: Styles not loading correctly

**Solution:**
```bash
# Rebuild Tailwind CSS
rm -rf node_modules/.vite
pnpm dev
```

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

## Need Help?

If you encounter any issues not covered here:

1. Check [GitHub Issues](https://github.com/vishxtr/AFFILIATE/issues)
2. Open a new issue with detailed information
3. Join our community discussions

---

**Next Steps:** [Deployment Guide](./DEPLOYMENT.md) | [API Documentation](./API.md)
