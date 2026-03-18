-- Create member_directory table with all signup form fields
CREATE TABLE IF NOT EXISTS public.member_directory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  job_title TEXT,
  department TEXT,
  rank TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  atomy_id TEXT,
  image_url TEXT,
  linkedin_url TEXT,
  bio TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_member_directory_is_active ON public.member_directory(is_active);
CREATE INDEX IF NOT EXISTS idx_member_directory_display_order ON public.member_directory(display_order);
CREATE INDEX IF NOT EXISTS idx_member_directory_atomy_id ON public.member_directory(atomy_id);

-- Enable Row Level Security
ALTER TABLE public.member_directory ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public can view active members
CREATE POLICY "Public can view active member directory"
  ON public.member_directory
  FOR SELECT
  USING (is_active = true);

-- RLS Policy: Admins can view all members
CREATE POLICY "Admins can view all member directory"
  ON public.member_directory
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = auth.email()
    )
  );

-- RLS Policy: Admins can insert members
CREATE POLICY "Admins can insert member directory"
  ON public.member_directory
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = auth.email()
    )
  );

-- RLS Policy: Admins can update members
CREATE POLICY "Admins can update member directory"
  ON public.member_directory
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = auth.email()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = auth.email()
    )
  );

-- RLS Policy: Admins can delete members
CREATE POLICY "Admins can delete member directory"
  ON public.member_directory
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = auth.email()
    )
  );
