export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string | null
  image_url: string | null
  email: string | null
  linkedin_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DirectoryMember {
  id: string
  name: string
  title: string | null
  department: string | null
  email: string | null
  phone: string | null
  image_url: string | null
  bio: string | null
  linkedin_url: string | null
  atomy_id: string | null
  rank: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description: string | null
  location: string | null
  start_date: string
  end_date: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface NewsPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  image_url: string | null
  author_name: string | null
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  author_name: string
  author_role: string | null
  author_company: string | null
  author_image_url: string | null
  content: string
  rating: number | null
  is_featured: boolean
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface GalleryImage {
  id: string
  title: string | null
  description: string | null
  image_url: string
  category: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
  category: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  is_read: boolean
  created_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: string | null
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  is_super_admin: boolean
  invited_by: string | null
  created_at: string
}

export interface UserSignup {
  id: string
  full_name: string
  atomy_id: string | null
  email: string
  phone: string | null
  created_at: string
  is_reviewed: boolean
}

export interface IncomeSource {
  id: string
  name: string
  description: string | null
  icon: string | null
  category: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MonthlyAward {
  id: string
  award_type: string
  member_name: string
  member_image_url: string | null
  member_atomy_id: string | null
  achievement: string | null
  month: number
  year: number
  is_active: boolean
  created_at: string
}

export interface Feedback {
  id: string
  name: string
  email: string
  phone: string | null
  atomy_id: string | null
  category: string
  subject: string
  message: string
  rating: number | null
  is_read: boolean
  admin_response: string | null
  created_at: string
}

export interface TrainingResource {
  id: string
  title: string
  description: string | null
  resource_type: string
  url: string
  thumbnail_url: string | null
  category: string | null
  duration: string | null
  is_featured: boolean
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SuccessStory {
  id: string
  member_name: string
  member_image_url: string | null
  member_atomy_id: string | null
  previous_occupation: string | null
  current_rank: string | null
  story_title: string
  story_content: string
  monthly_income: string | null
  join_date: string | null
  is_featured: boolean
  is_active: boolean
  created_at: string
}

export interface RankLevel {
  id: string
  rank_name: string
  rank_order: number
  min_pv: number | null
  min_team_members: number | null
  benefits: string | null
  icon: string | null
  color: string | null
  is_active: boolean
  created_at: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  announcement_type: string
  image_url: string | null
  link_url: string | null
  is_pinned: boolean
  is_active: boolean
  expires_at: string | null
  created_at: string
}

export interface DownloadableFile {
  id: string
  title: string
  description: string | null
  file_url: string
  file_type: string
  file_size: string | null
  category: string | null
  download_count: number
  is_active: boolean
  created_at: string
}

export interface Notification {
  id: string
  title: string
  message: string
  notification_type: string
  link_url: string | null
  is_read: boolean
  user_email: string | null
  created_at: string
}

export interface WorkshopSession {
  id: string
  title: string
  description: string | null
  session_date: string
  start_time: string | null
  end_time: string | null
  location: string | null
  host_name: string | null
  max_attendees: number | null
  is_active: boolean
  created_at: string
}

export interface AttendanceRecord {
  id: string
  session_id: string
  member_name: string
  member_email: string | null
  member_phone: string | null
  atomy_id: string | null
  check_in_time: string
  status: string
  notes: string | null
  created_at: string
}

export interface ChatMessage {
  id: string
  sender_name: string
  sender_email: string | null
  sender_phone: string | null
  message: string
  is_from_admin: boolean
  is_read: boolean
  session_id: string | null
  created_at: string
}

export type Language = "en" | "hi" | "te" | "ta" | "pa"

export interface Translations {
  [key: string]: {
    en: string
    hi: string
    te: string
    ta: string
    pa: string
  }
}
