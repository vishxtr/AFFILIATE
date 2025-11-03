# Contact Form Database Setup Instructions

## Required Action
The contact form is now integrated with Supabase but requires the database table to be created.

## SQL to Execute in Supabase Dashboard

1. Go to Supabase Dashboard: https://iedahpatfvywhtyyslui.supabase.co
2. Navigate to SQL Editor
3. Execute the following SQL:

```sql
-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new'
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert (for contact form submissions)
CREATE POLICY "Allow anonymous inserts" ON contact_submissions
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow authenticated users (admin) to view all submissions
CREATE POLICY "Allow authenticated users to view all" ON contact_submissions
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users (admin) to update submissions
CREATE POLICY "Allow authenticated users to update" ON contact_submissions
  FOR UPDATE TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS contact_submissions_status_idx ON contact_submissions(status);
```

## What This Enables

- Contact form submissions are saved to the database
- Admin users can view all submissions
- Anonymous users can submit forms
- Submissions are timestamped and tracked by status
- Optimized queries with proper indexes

## Verification

After running the SQL:
1. Visit the contact page: /contact
2. Fill out and submit the form
3. Check the `contact_submissions` table in Supabase to see the submission
4. Admin panel can be extended to view submissions

## Alternative: Email Integration

If email notifications are preferred instead of database storage, a Supabase Edge Function can be created to send emails using a service like SendGrid or Resend.
