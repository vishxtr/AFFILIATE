# AFFILIATE - Modern Affiliate Marketing Platform

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0.1-646CFF?logo=vite)

A professional, feature-rich affiliate marketing platform built with React, TypeScript, and Supabase.

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Demo](#demo)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Admin Panel](#admin-panel)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

AFFILIATE is a modern, full-featured affiliate marketing platform designed to help you showcase and manage affiliate products effectively. Built with cutting-edge technologies, it provides a seamless experience for both end-users and administrators.

### Key Highlights

- ✨ **Modern UI/UX** - Beautiful, responsive design with smooth animations
- 🔐 **Secure Admin Panel** - Complete administrative control with role-based access
- 📊 **Analytics Dashboard** - Real-time insights and performance metrics
- 🗃️ **Product Management** - Easy-to-use product CRUD operations
- 📧 **Contact Management** - Built-in contact form with query management
- 🎨 **Customizable** - Fully customizable themes and settings
- 🚀 **Performance Optimized** - Fast load times with code splitting and lazy loading
- 📱 **Responsive** - Works perfectly on all devices

---

## ✨ Features

### Public Features

- **Product Showcase** - Display affiliate products with rich details and images
- **Category Filtering** - Easy navigation with category-based filtering
- **Search Functionality** - Quick product search
- **Product Details** - Comprehensive product information pages
- **Contact Form** - User inquiries and support requests
- **About Page** - Company/project information
- **Legal Pages** - Privacy Policy and Terms of Service

### Admin Features

- **Dashboard Overview** - Key metrics and statistics at a glance
- **Product Management** - Add, edit, delete, and manage products
- **Query Management** - View and respond to user inquiries
- **Analytics** - Traffic, conversion, and engagement analytics
- **Settings** - Website configuration and customization
- **Activity Logs** - Track all admin actions and changes
- **Password Management** - Secure password change functionality
- **System Health** - Monitor application performance and status

---

## 🛠️ Tech Stack

### Frontend

- **React 18.3.1** - UI library
- **TypeScript 5.6.3** - Type-safe JavaScript
- **Vite 6.0.1** - Build tool and dev server
- **React Router DOM 6** - Client-side routing
- **Tailwind CSS 3.4.16** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Radix UI** - Accessible component primitives

### Backend & Database

- **Supabase** - Backend as a Service (BaaS)
  - PostgreSQL Database
  - Authentication
  - Real-time subscriptions
  - Row Level Security (RLS)

### UI Components

- **shadcn/ui** - High-quality React components
- **Lucide React** - Beautiful icon library
- **Recharts** - Data visualization

### Form Handling

- **React Hook Form** - Performant form management
- **Zod** - TypeScript-first schema validation

### Additional Tools

- **date-fns** - Date utility library
- **Sonner** - Toast notifications
- **React Share** - Social sharing buttons

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- pnpm (recommended) or npm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vishxtr/AFFILIATE.git
   cd AFFILIATE
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - See [SETUP.md](./docs/SETUP.md) for detailed instructions
   - Run the SQL scripts in the `supabase/migrations` folder (if available)

5. **Start the development server**
   ```bash
   pnpm dev
   ```
   
   The application will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
AFFILIATE/
├── src/
│   ├── components/          # React components
│   │   ├── admin/          # Admin panel components
│   │   ├── ui/             # Reusable UI components (shadcn/ui)
│   │   └── ...             # Other components
│   ├── contexts/           # React Context providers
│   │   └── AuthContext.tsx # Authentication context
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx    # Landing/home page
│   │   ├── AdminLogin.tsx  # Admin login
│   │   └── ...            # Other pages
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main App component
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── docs/                   # Documentation files
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.ts         # Vite configuration
└── README.md              # This file
```

---

## 👤 Admin Panel

### Access

- **URL:** `/admin/login`
- **Default Credentials:**
  - Username: `hui`
  - Password: `1090`

> ⚠️ **Important:** Change the default password immediately after first login!

### Admin Routes

- `/admin/dashboard` - Overview and statistics
- `/admin/products` - Product management
- `/admin/queries` - Customer inquiries
- `/admin/analytics` - Analytics and reports
- `/admin/settings` - Website settings
- `/admin/system` - System information
- `/admin/activity-logs` - Activity tracking
- `/admin/password` - Change password

### Admin Features

1. **Dashboard** - View key metrics, recent activities, and quick stats
2. **Products** - CRUD operations for products with image upload
3. **Queries** - Manage and respond to user inquiries
4. **Analytics** - Track visitors, conversions, and revenue
5. **Settings** - Configure website details, SEO, and appearance
6. **Logs** - Monitor all admin actions for security
7. **Security** - Change password and manage sessions

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: Analytics
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Optional: Other Services
VITE_API_BASE_URL=https://api.example.com
```

See [.env.example](./.env.example) for a complete list of environment variables.

---

## 📜 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript compiler check

# Maintenance
pnpm clean            # Clean node_modules and reinstall
pnpm install-deps     # Install/update dependencies
```

---

## 📚 Documentation

Detailed documentation is available in the `docs/` directory:

- [Setup Guide](./docs/SETUP.md) - Complete setup instructions
- [API Documentation](./docs/API.md) - API endpoints and usage
- [Deployment Guide](./docs/DEPLOYMENT.md) - Deploy to production
- [Contributing Guidelines](./docs/CONTRIBUTING.md) - How to contribute
- [Architecture](./docs/ARCHITECTURE.md) - Technical architecture overview

---

## 🎨 Customization

### Styling

- **Tailwind CSS** - Modify `tailwind.config.js` for theme customization
- **CSS Variables** - Edit `src/index.css` for color schemes
- **Components** - All components are in `src/components/` and fully customizable

### Content

- **Products** - Manage via Admin Panel (`/admin/products`)
- **Pages** - Edit page components in `src/pages/`
- **Settings** - Configure via Admin Panel (`/admin/settings`)

---

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run e2e tests
pnpm test:e2e

# Generate coverage report
pnpm test:coverage
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build
pnpm build

# Deploy dist folder to Netlify
```

### Other Platforms

The `dist` folder after running `pnpm build` can be deployed to any static hosting service.

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions.

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](./docs/CONTRIBUTING.md) before submitting a PR.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - The library for web and native user interfaces
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Supabase](https://supabase.com/) - The open source Firebase alternative
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components

---

## 📞 Support

If you encounter any issues or have questions:

- 📧 Email: support@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/vishxtr/AFFILIATE/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/vishxtr/AFFILIATE/discussions)

---

## 🗺️ Roadmap

- [ ] Multi-language support (i18n)
- [ ] Dark mode toggle
- [ ] Advanced analytics dashboard
- [ ] Product comparison feature
- [ ] User reviews and ratings
- [ ] Email notification system
- [ ] Social media integration
- [ ] SEO optimization tools
- [ ] Mobile app (React Native)

---

<div align="center">

**[⬆ Back to Top](#affiliate---modern-affiliate-marketing-platform)**

Made with ❤️ by the AFFILIATE Team

</div>
