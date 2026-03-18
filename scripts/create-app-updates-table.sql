-- Create app_updates table
CREATE TABLE IF NOT EXISTS app_updates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE app_updates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Public can view active updates
CREATE POLICY "Public can view active app updates" ON app_updates
  FOR SELECT
  USING (is_active = true);

-- Admins can view all updates
CREATE POLICY "Admins can view all app updates" ON app_updates
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.email = auth.jwt() ->> 'email'
  ));

-- Admins can insert updates
CREATE POLICY "Admins can insert app updates" ON app_updates
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.email = auth.jwt() ->> 'email'
  ));

-- Admins can update updates
CREATE POLICY "Admins can update app updates" ON app_updates
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.email = auth.jwt() ->> 'email'
  ));

-- Admins can delete updates
CREATE POLICY "Admins can delete app updates" ON app_updates
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.email = auth.jwt() ->> 'email'
  ));

-- Create index for faster queries
CREATE INDEX idx_app_updates_is_active ON app_updates(is_active);
CREATE INDEX idx_app_updates_created_at ON app_updates(created_at DESC);
