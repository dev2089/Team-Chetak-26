-- Create user_guide_sections table
CREATE TABLE IF NOT EXISTS user_guide_sections (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  icon text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_guide_sections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Public can view all guide sections
CREATE POLICY "Public can view user guide sections" ON user_guide_sections
  FOR SELECT
  USING (true);

-- Admins can view all sections
CREATE POLICY "Admins can view all user guide sections" ON user_guide_sections
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.email = auth.jwt() ->> 'email'
  ));

-- Admins can insert sections
CREATE POLICY "Admins can insert user guide sections" ON user_guide_sections
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.email = auth.jwt() ->> 'email'
  ));

-- Admins can update sections
CREATE POLICY "Admins can update user guide sections" ON user_guide_sections
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.email = auth.jwt() ->> 'email'
  ));

-- Admins can delete sections
CREATE POLICY "Admins can delete user guide sections" ON user_guide_sections
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.email = auth.jwt() ->> 'email'
  ));

-- Create index for display order
CREATE INDEX idx_user_guide_sections_display_order ON user_guide_sections(display_order);

-- Insert default guide sections
INSERT INTO user_guide_sections (title, description, content, icon, display_order) VALUES
('Getting Started', 'Learn the basics of Team Chetak ATOMY platform', 'Welcome to Team Chetak ATOMY! This guide will help you get started with our platform. First, create your account by clicking the Join button. Then, explore our Income Sources section to understand the different ways you can earn. Connect with our team on WhatsApp for personalized support and guidance.', '🚀', 0),
('Joining the Team', 'How to join Team Chetak ATOMY', 'Joining Team Chetak ATOMY is easy! Click the Join button on our website and fill out the signup form with your basic information. Our team will review your application within 24 hours. Once approved, you will be added to our member directory and receive welcome materials. You can also contact our team on WhatsApp for faster onboarding.', '👥', 1),
('Income Sources', 'Understand our 14 different ways to earn', 'Team Chetak ATOMY offers 14 different income sources including Sales Commission, Team Bonus, Referral Incentives, Leadership Bonus, and more. Each income source has different requirements and earning potential. Visit our Income Sources page to see detailed information about each opportunity. Our training resources will help you maximize your earnings through each channel.', '💰', 2),
('Training & Resources', 'Access our training materials and resources', 'We provide comprehensive training to help you succeed. Visit our Training page to access video tutorials, guides, and webinars. Our resources cover product knowledge, sales techniques, team building, and business strategy. Members can also attend live training sessions and workshops held regularly.', '📚', 3),
('Member Directory', 'Connect with our team members', 'Our Member Directory shows successful team members and their achievements. You can view member profiles, success stories, and contact information. This is a great way to network, get inspiration, and learn from top performers. Connect with mentors and build your network within Team Chetak.', '👤', 4),
('Success Stories', 'Read inspiring stories from our members', 'Our Success Stories section features real stories from Team Chetak members who have achieved financial freedom. Learn about their journey, challenges overcome, and current achievements. These stories show what is possible with dedication and the right support. Use them as inspiration for your own success journey.', '🏆', 5),
('FAQs & Support', 'Get answers to common questions', 'Visit our FAQ section for answers to common questions about joining, earning, products, and more. If you cannot find your answer there, contact our team through the Contact page or WhatsApp. Our support team is available 24/7 to help you. We also have a feedback section where you can share your suggestions.', '❓', 6)
ON CONFLICT DO NOTHING;
