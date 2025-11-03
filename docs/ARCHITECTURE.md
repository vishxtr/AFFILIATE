# Architecture Documentation

Technical architecture overview of the AFFILIATE platform.

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Data Flow](#data-flow)
- [Security Architecture](#security-architecture)
- [Performance Optimizations](#performance-optimizations)
- [Scalability Considerations](#scalability-considerations)

---

## Overview

AFFILIATE is a modern single-page application (SPA) built with a JAMstack architecture, leveraging Supabase as a Backend-as-a-Service (BaaS) platform.

### Technology Stack

```
┌─────────────────────────────────────────┐
│           Frontend (React)              │
├─────────────────────────────────────────┤
│  • React 18.3 + TypeScript 5.6         │
│  • Vite 6.0 (Build Tool)                │
│  • React Router 6 (Routing)             │
│  • Tailwind CSS 3.4 (Styling)           │
│  • Radix UI (Components)                │
│  • Framer Motion (Animations)           │
└─────────────────────────────────────────┘
              ↕ HTTP/WebSocket
┌─────────────────────────────────────────┐
│          Backend (Supabase)             │
├─────────────────────────────────────────┤
│  • PostgreSQL (Database)                │
│  • PostgREST (Auto API)                 │
│  • GoTrue (Authentication)              │
│  • Realtime (WebSocket)                 │
│  • Storage (File Storage)               │
└─────────────────────────────────────────┘
```

---

## System Architecture

### High-Level Architecture

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │
       ↓
┌──────────────────────────────────────────┐
│         CDN / Edge Network               │
│  (Vercel/Netlify Edge Servers)          │
└──────┬───────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────┐
│         Static Assets (SPA)              │
│  • HTML, CSS, JS bundles                 │
│  • Images, Fonts                         │
└──────┬───────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────┐
│         Supabase API Layer               │
│  • REST API (PostgREST)                  │
│  • Realtime WebSocket                    │
│  • Authentication (GoTrue)               │
└──────┬───────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────┐
│       PostgreSQL Database                │
│  • Products, Users, Settings             │
│  • Row Level Security (RLS)              │
│  • Automated Backups                     │
└──────────────────────────────────────────┘
```

### Component Architecture

```
App.tsx
  └── BrowserRouter
      ├── AuthProvider (Context)
      │   └── Routes
      │       ├── Public Routes
      │       │   ├── HomePage
      │       │   ├── AboutPage
      │       │   ├── ContactPage
      │       │   └── Legal Pages
      │       │
      │       └── Admin Routes (Protected)
      │           ├── AdminLogin
      │           ├── AdminDashboard
      │           │   ├── Overview
      │           │   ├── Products
      │           │   ├── Queries
      │           │   ├── Analytics
      │           │   ├── Settings
      │           │   └── Logs
      │           └── AdminPasswordChange
```

---

## Frontend Architecture

### Directory Structure

```
src/
├── components/          # React components
│   ├── admin/          # Admin-specific components
│   │   ├── AdminHeader.tsx
│   │   ├── AdminSidebar.tsx
│   │   └── ...
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── ProductCard.tsx
│   └── ...
│
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
│
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   ├── useProducts.ts
│   └── ...
│
├── lib/                # Third-party library configs
│   ├── supabase.ts    # Supabase client
│   └── utils.ts       # Helper utilities
│
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── AdminDashboard.tsx
│   └── ...
│
├── types/              # TypeScript type definitions
│   ├── product.types.ts
│   ├── user.types.ts
│   └── ...
│
├── utils/              # Utility functions
│   ├── formatPrice.ts
│   ├── validateForm.ts
│   └── ...
│
├── App.tsx            # Root component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

### State Management

**Local State:**
- React useState for component-level state
- React Context for global state (Auth)

**Server State:**
- Supabase Realtime for live updates
- React Query pattern for data fetching (future enhancement)

**State Flow:**
```
User Action
    ↓
Event Handler
    ↓
API Call (Supabase)
    ↓
Database Update
    ↓
Realtime Subscription (Optional)
    ↓
UI Update
```

### Routing Strategy

**Route Types:**
1. **Public Routes** - Accessible to everyone
2. **Protected Routes** - Require authentication
3. **Lazy-Loaded Routes** - Code-split for performance

**Route Configuration:**
```typescript
<Routes>
  {/* Public */}
  <Route path="/" element={<HomePage />} />
  
  {/* Protected */}
  <Route 
    path="/admin/*" 
    element={
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    }
  />
</Routes>
```

### Code Splitting

```typescript
// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/HomePage'))
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'))

// Wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
  </Routes>
</Suspense>
```

---

## Backend Architecture

### Supabase Services

**1. PostgreSQL Database**
- Relational database with JSONB support
- Automated migrations
- Full ACID compliance
- Indexes for performance

**2. PostgREST API**
- Auto-generated REST API from database schema
- Supports filtering, sorting, pagination
- Full CRUD operations
- OpenAPI documentation

**3. Row Level Security (RLS)**
- Database-level access control
- Policies define who can access what
- Executed at query time

**4. Authentication (GoTrue)**
- JWT-based authentication
- Email/password, OAuth providers
- Session management
- Password reset flows

**5. Realtime**
- WebSocket-based live updates
- Subscribe to database changes
- Broadcast messages
- Presence tracking

### Database Schema

**Entity-Relationship Diagram:**

```
┌────────────────┐         ┌─────────────────┐
│   Products     │         │  Admin Users    │
├────────────────┤         ├─────────────────┤
│ id (PK)        │         │ id (PK)         │
│ title          │         │ username        │
│ description    │         │ email           │
│ price          │         │ password_hash   │
│ category       │         │ role            │
│ is_featured    │         │ is_active       │
│ is_active      │         └─────────────────┘
│ created_at     │                 │
│ updated_at     │                 │
└────────────────┘                 │
                                   │
                          ┌────────┴────────┐
                          │                 │
┌────────────────┐   ┌────────────────┐    │
│ Contact Forms  │   │ Activity Logs  │────┘
├────────────────┤   ├────────────────┤
│ id (PK)        │   │ id (PK)        │
│ name           │   │ admin_id (FK)  │
│ email          │   │ action         │
│ message        │   │ resource_type  │
│ status         │   │ details        │
│ created_at     │   │ created_at     │
└────────────────┘   └────────────────┘

┌────────────────┐   ┌─────────────────┐
│ Settings       │   │ Analytics       │
├────────────────┤   ├─────────────────┤
│ id (PK)        │   │ id (PK)         │
│ key (UNIQUE)   │   │ event_type      │
│ value (JSON)   │   │ event_data      │
│ updated_at     │   │ user_agent      │
└────────────────┘   │ created_at      │
                     └─────────────────┘
```

### API Patterns

**REST API Structure:**
```
/rest/v1/products           # Collection endpoint
/rest/v1/products?id=eq.1   # Single resource
/rest/v1/products?select=*  # Select specific columns
/rest/v1/products?order=created_at.desc  # Sorting
/rest/v1/products?limit=10&offset=0      # Pagination
```

**Realtime Subscription:**
```typescript
supabase
  .channel('products')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'products' },
    (payload) => {
      // Handle changes
    }
  )
  .subscribe()
```

---

## Data Flow

### Product Display Flow

```
1. User navigates to homepage
   ↓
2. HomePage component mounts
   ↓
3. useEffect triggers fetchProducts()
   ↓
4. Supabase query: SELECT * FROM products WHERE is_active = true
   ↓
5. PostgreSQL returns results
   ↓
6. PostgREST formats as JSON
   ↓
7. Frontend receives data
   ↓
8. State updates (setProducts)
   ↓
9. React re-renders ProductCard components
   ↓
10. User sees products
```

### Admin Product Update Flow

```
1. Admin edits product in form
   ↓
2. Form validation (React Hook Form + Zod)
   ↓
3. Submit triggers updateProduct()
   ↓
4. Supabase UPDATE query with RLS check
   ↓
5. PostgreSQL validates RLS policy
   ↓
6. Update executed if authorized
   ↓
7. Trigger updates updated_at timestamp
   ↓
8. Activity log entry created
   ↓
9. Realtime broadcast to subscribers
   ↓
10. Frontend updates local state
    ↓
11. UI reflects changes
    ↓
12. Success notification shown
```

### Authentication Flow

```
1. User enters credentials
   ↓
2. Frontend validates input
   ↓
3. Query admin_users table
   ↓
4. Password hash comparison
   ↓
5. Generate JWT token
   ↓
6. Store token in context + localStorage
   ↓
7. Set Authorization header for future requests
   ↓
8. Redirect to admin dashboard
   ↓
9. Log login activity
```

---

## Security Architecture

### Authentication & Authorization

**JWT Token Structure:**
```json
{
  "sub": "user-uuid",
  "role": "admin",
  "email": "admin@example.com",
  "iat": 1640000000,
  "exp": 1640086400
}
```

**RLS Policy Example:**
```sql
-- Only authenticated admins can update products
CREATE POLICY "Admins can update products" ON products
  FOR UPDATE
  USING (
    auth.role() = 'admin' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND is_active = true
    )
  );
```

### Security Layers

```
┌──────────────────────────────────────┐
│  1. Network Layer (HTTPS/TLS)       │
├──────────────────────────────────────┤
│  2. CDN/WAF (DDoS Protection)       │
├──────────────────────────────────────┤
│  3. Frontend Validation              │
├──────────────────────────────────────┤
│  4. JWT Authentication               │
├──────────────────────────────────────┤
│  5. API Gateway (Supabase)           │
├──────────────────────────────────────┤
│  6. Row Level Security (RLS)         │
├──────────────────────────────────────┤
│  7. Database (PostgreSQL)            │
└──────────────────────────────────────┘
```

### Security Best Practices

1. **Environment Variables** - Never commit secrets
2. **HTTPS Only** - Enforce TLS in production
3. **JWT Expiration** - Short-lived tokens (15 min)
4. **Password Hashing** - Bcrypt with high cost factor
5. **Input Validation** - Client + Server side
6. **SQL Injection Prevention** - Parameterized queries
7. **XSS Protection** - React's built-in escaping
8. **CSRF Protection** - SameSite cookies
9. **Rate Limiting** - Supabase built-in limits
10. **Regular Updates** - Dependencies kept current

---

## Performance Optimizations

### Frontend Optimizations

**1. Code Splitting**
```typescript
// Lazy load routes
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
```

**2. Image Optimization**
- Use WebP format
- Implement lazy loading
- Responsive images
- CDN delivery

**3. Bundle Optimization**
```javascript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'ui-vendor': ['@radix-ui/react-*'],
      }
    }
  }
}
```

**4. Caching Strategy**
- Static assets: 1 year cache
- API responses: Short-lived cache
- Service worker for offline support (future)

### Database Optimizations

**1. Indexes**
```sql
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_created ON products(created_at DESC);
```

**2. Query Optimization**
- Select only needed columns
- Use pagination
- Avoid N+1 queries
- Implement database views for complex queries

**3. Connection Pooling**
- Supabase handles automatically
- PgBouncer for connection management

### Monitoring Performance

**Metrics to Track:**
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Cumulative Layout Shift (CLS)

**Tools:**
- Lighthouse
- Web Vitals
- Vercel Analytics
- Supabase Dashboard

---

## Scalability Considerations

### Horizontal Scaling

**Frontend:**
- Served via CDN (globally distributed)
- Automatically scales with traffic
- No server management needed

**Backend (Supabase):**
- Auto-scaling database connections
- Read replicas for read-heavy workloads
- Connection pooling with PgBouncer

### Vertical Scaling

**Database:**
- Upgrade instance size as needed
- Increase storage capacity
- Add more CPU/RAM

### Caching Strategy

```
┌─────────┐    ┌─────────┐    ┌──────────┐
│ Browser │ ─→ │   CDN   │ ─→ │ Supabase │
│  Cache  │    │  Cache  │    │    DB    │
└─────────┘    └─────────┘    └──────────┘
```

### Future Scalability

**When to Scale:**
- \>10K daily active users
- \>1M database rows
- \>100 req/sec sustained

**Scaling Options:**
1. Database read replicas
2. Redis for session/cache
3. Microservices architecture
4. Message queue for async tasks
5. CDN for media assets

---

## Deployment Architecture

### CI/CD Pipeline

```
┌──────────────┐
│  Git Push    │
└──────┬───────┘
       │
       ↓
┌──────────────────────┐
│  GitHub Actions      │
│  • Lint              │
│  • Type Check        │
│  • Build             │
│  • Test              │
└──────┬───────────────┘
       │
       ↓ (on success)
┌──────────────────────┐
│  Vercel/Netlify      │
│  • Deploy to Preview │
│  • Deploy to Prod    │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│  Production          │
│  • Global CDN        │
│  • Auto SSL          │
│  • Edge Functions    │
└──────────────────────┘
```

---

## Technology Decisions

### Why React?
- Component reusability
- Large ecosystem
- TypeScript support
- Virtual DOM performance

### Why Vite?
- Fast HMR
- Modern build tool
- ESM-based
- Great DX

### Why Supabase?
- PostgreSQL (powerful, proven)
- Built-in auth
- Realtime capabilities
- Auto-generated API
- Cost-effective

### Why Tailwind CSS?
- Utility-first approach
- Great customization
- Small bundle size
- Fast development

---

## Future Architecture

### Planned Enhancements

1. **Server-Side Rendering (SSR)**
   - Migrate to Next.js for SEO benefits
   - Improved initial load time

2. **GraphQL API**
   - More efficient data fetching
   - Reduce over-fetching

3. **Microservices**
   - Separate services for different domains
   - Independent scaling

4. **Event-Driven Architecture**
   - Message queues for async processing
   - Better decoupling

5. **Advanced Caching**
   - Redis for session management
   - Edge caching for API responses

---

## Conclusion

The AFFILIATE platform is built on a modern, scalable architecture that prioritizes:
- **Performance** - Fast load times and smooth interactions
- **Security** - Multiple layers of protection
- **Scalability** - Ready to grow with demand
- **Maintainability** - Clean code and clear structure
- **Developer Experience** - Modern tools and practices

---

**Related Documentation:**
- [Setup Guide](./SETUP.md)
- [API Documentation](./API.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
