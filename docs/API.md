# API Documentation

This document describes the API endpoints and database structure for the AFFILIATE platform.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Overview

The AFFILIATE platform uses Supabase as its backend, which provides:

- **PostgreSQL Database** - Relational database with JSONB support
- **Row Level Security (RLS)** - Fine-grained access control
- **Real-time Subscriptions** - Live data updates
- **RESTful API** - Auto-generated from database schema
- **Authentication** - Built-in user authentication

### Base URL

```
https://your-project-id.supabase.co/rest/v1
```

### Headers

All API requests should include:

```http
apikey: YOUR_SUPABASE_ANON_KEY
Content-Type: application/json
```

For authenticated requests, also include:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## Authentication

### Admin Login

Admin authentication is handled through the custom admin_users table.

**Endpoint:** Custom implementation in frontend
**Method:** POST
**Body:**
```json
{
  "username": "admin",
  "password": "your_password"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  },
  "token": "jwt_token_here"
}
```

---

## Database Schema

### Products Table

Stores all affiliate products.

```sql
CREATE TABLE products (
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
```

**Fields:**
- `id` - Unique product identifier
- `title` - Product name
- `description` - Product description
- `price` - Current price
- `original_price` - Original/MSRP price
- `discount` - Discount percentage
- `image_url` - Product image URL
- `affiliate_link` - Affiliate/redirect link
- `category` - Product category
- `rating` - Average rating (0-5)
- `reviews` - Number of reviews
- `features` - Array of features (JSONB)
- `tags` - Product tags (array)
- `is_featured` - Featured product flag
- `is_active` - Active/published flag
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Contact Submissions Table

Stores user inquiries from the contact form.

```sql
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);
```

**Status Values:**
- `pending` - New, unread inquiry
- `in_progress` - Being handled
- `resolved` - Completed
- `spam` - Marked as spam

### Website Settings Table

Stores configurable website settings.

```sql
CREATE TABLE website_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Common Keys:**
- `site_name` - Website name
- `site_description` - Site description
- `contact_email` - Contact email
- `analytics_enabled` - Analytics flag
- `theme_color` - Primary color
- `social_links` - Social media links (JSON)

### Admin Users Table

Stores admin user accounts.

```sql
CREATE TABLE admin_users (
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
```

**Roles:**
- `admin` - Full access
- `editor` - Can manage products and content
- `viewer` - Read-only access

### Activity Logs Table

Tracks all admin actions for audit trail.

```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admin_users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Action Types:**
- `create` - Created resource
- `update` - Updated resource
- `delete` - Deleted resource
- `login` - User login
- `logout` - User logout

### Analytics Events Table

Stores analytics and tracking data.

```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  event_data JSONB,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Event Types:**
- `page_view` - Page visit
- `product_view` - Product detail view
- `affiliate_click` - Affiliate link click
- `contact_submit` - Contact form submission

---

## API Endpoints

### Products

#### Get All Products

```http
GET /products?select=*&is_active=eq.true&order=created_at.desc
```

**Query Parameters:**
- `category=eq.Electronics` - Filter by category
- `is_featured=eq.true` - Get featured products only
- `limit=10` - Limit results
- `offset=0` - Pagination offset

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Product Name",
    "description": "Product description",
    "price": 199.99,
    "original_price": 299.99,
    "discount": 33,
    "image_url": "https://...",
    "affiliate_link": "https://...",
    "category": "Electronics",
    "rating": 4.8,
    "reviews": 250,
    "features": ["Feature 1", "Feature 2"],
    "tags": ["tag1", "tag2"],
    "is_featured": true,
    "is_active": true,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
]
```

#### Get Single Product

```http
GET /products?id=eq.{product_id}&select=*
```

#### Create Product (Admin)

```http
POST /products
Authorization: Bearer {admin_token}
```

**Body:**
```json
{
  "title": "New Product",
  "description": "Product description",
  "price": 199.99,
  "original_price": 299.99,
  "discount": 33,
  "image_url": "https://...",
  "affiliate_link": "https://...",
  "category": "Electronics",
  "features": ["Feature 1", "Feature 2"],
  "tags": ["tag1", "tag2"],
  "is_featured": false,
  "is_active": true
}
```

#### Update Product (Admin)

```http
PATCH /products?id=eq.{product_id}
Authorization: Bearer {admin_token}
```

**Body:** Same as create, but all fields optional

#### Delete Product (Admin)

```http
DELETE /products?id=eq.{product_id}
Authorization: Bearer {admin_token}
```

### Contact Submissions

#### Submit Contact Form

```http
POST /contact_submissions
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about product",
  "message": "I have a question..."
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "pending",
  "created_at": "2025-01-01T00:00:00Z"
}
```

#### Get Contact Submissions (Admin)

```http
GET /contact_submissions?select=*&order=created_at.desc
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `status=eq.pending` - Filter by status
- `limit=20` - Limit results

#### Update Submission Status (Admin)

```http
PATCH /contact_submissions?id=eq.{submission_id}
Authorization: Bearer {admin_token}
```

**Body:**
```json
{
  "status": "resolved",
  "resolved_at": "2025-01-01T00:00:00Z"
}
```

### Website Settings

#### Get All Settings

```http
GET /website_settings?select=*
```

**Response:**
```json
[
  {
    "id": "uuid",
    "key": "site_name",
    "value": "AFFILIATE",
    "updated_at": "2025-01-01T00:00:00Z"
  }
]
```

#### Update Setting (Admin)

```http
PATCH /website_settings?key=eq.{setting_key}
Authorization: Bearer {admin_token}
```

**Body:**
```json
{
  "value": "new_value"
}
```

### Analytics Events

#### Create Event

```http
POST /analytics_events
```

**Body:**
```json
{
  "event_type": "product_view",
  "event_data": {
    "product_id": "uuid",
    "source": "home_page"
  },
  "user_agent": "Mozilla/5.0...",
  "ip_address": "192.168.1.1"
}
```

#### Get Analytics (Admin)

```http
GET /analytics_events?select=*&order=created_at.desc
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `event_type=eq.product_view` - Filter by event type
- `created_at=gte.2025-01-01` - Date range filter
- `limit=100` - Limit results

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional details if available"
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `PGRST301` | 400 | Invalid request body |
| `PGRST204` | 404 | Resource not found |
| `PGRST116` | 401 | Unauthorized - missing/invalid auth token |
| `42501` | 403 | Forbidden - RLS policy violation |
| `23505` | 409 | Unique constraint violation |
| `PGRST000` | 500 | Internal server error |

### Example Error Response

```json
{
  "error": {
    "code": "PGRST116",
    "message": "JWT expired",
    "details": "The JWT token has expired. Please refresh your token."
  }
}
```

---

## Rate Limiting

Supabase applies rate limiting based on your plan:

- **Free Tier:** 500 requests per minute
- **Pro Tier:** 1000 requests per minute
- **Enterprise:** Custom limits

### Rate Limit Headers

Response headers include:
```http
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 450
X-RateLimit-Reset: 1640000000
```

### Handling Rate Limits

When rate limited (status 429):

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "retry_after": 60
  }
}
```

**Best Practices:**
- Implement exponential backoff
- Cache frequently accessed data
- Use webhooks for real-time updates instead of polling

---

## Real-time Subscriptions

Subscribe to database changes:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Subscribe to product changes
const subscription = supabase
  .channel('products-channel')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'products' },
    (payload) => {
      console.log('Change detected:', payload)
    }
  )
  .subscribe()

// Unsubscribe when done
subscription.unsubscribe()
```

**Events:**
- `INSERT` - New record created
- `UPDATE` - Record updated
- `DELETE` - Record deleted
- `*` - All events

---

## Authentication Flow

### Admin Login Flow

1. **Submit Credentials**
   ```javascript
   const response = await fetch('/api/admin/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ username, password })
   })
   ```

2. **Store Token**
   ```javascript
   const { token } = await response.json()
   localStorage.setItem('admin_token', token)
   ```

3. **Use Token for Requests**
   ```javascript
   const response = await fetch('/api/products', {
     headers: {
       'Authorization': `Bearer ${token}`,
       'apikey': SUPABASE_ANON_KEY
     }
   })
   ```

4. **Logout**
   ```javascript
   localStorage.removeItem('admin_token')
   ```

---

## Code Examples

### Fetching Products with Supabase Client

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Get all active products
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('is_active', true)
  .order('created_at', { ascending: false })

if (error) {
  console.error('Error fetching products:', error)
} else {
  console.log('Products:', data)
}
```

### Creating a Product (Admin)

```javascript
const { data, error } = await supabase
  .from('products')
  .insert([
    {
      title: 'New Product',
      description: 'Product description',
      price: 199.99,
      category: 'Electronics',
      is_active: true
    }
  ])
  .select()

if (error) {
  console.error('Error creating product:', error)
} else {
  console.log('Product created:', data)
}
```

### Submitting Contact Form

```javascript
const { data, error } = await supabase
  .from('contact_submissions')
  .insert([
    {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Question',
      message: 'I have a question about...'
    }
  ])

if (error) {
  console.error('Error submitting form:', error)
} else {
  console.log('Form submitted successfully')
}
```

---

## Additional Resources

- [Supabase REST API Documentation](https://supabase.com/docs/guides/api)
- [PostgREST API Reference](https://postgrest.org/en/stable/api.html)
- [Supabase Client Library](https://supabase.com/docs/reference/javascript/introduction)

---

**Next:** [Deployment Guide](./DEPLOYMENT.md) | [Back to Setup](./SETUP.md)
