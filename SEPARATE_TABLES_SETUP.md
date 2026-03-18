# Separate Tables Setup: Team Leaders vs Member Directory

## Overview

The system now has **two separate tables** for different purposes:

1. **`team_members`** - For team leaders/leadership team (displayed at `/directory`)
2. **`member_directory`** - For regular members who signed up (displayed at `/member-directory`)

---

## Database Tables

### 1. team_members Table
Used to showcase team leaders and key team members.

**Fields:**
- id (UUID)
- name (TEXT)
- role (TEXT)
- email (TEXT)
- image_url (TEXT)
- linkedin_url (TEXT)
- bio (TEXT)
- is_active (BOOLEAN)
- display_order (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**Pages:**
- Public: `/directory`
- Admin: `/admin/directory`

---

### 2. member_directory Table (NEW)
For members who joined through the signup form.

**Fields:**
- id (UUID)
- full_name (TEXT) - From signup form
- job_title (TEXT) - From signup form
- department (TEXT) - From signup form
- rank (TEXT) - From signup form
- email (TEXT) - From signup form
- phone (TEXT) - From signup form
- atomy_id (TEXT) - From signup form
- image_url (TEXT) - From signup form
- linkedin_url (TEXT) - From signup form
- bio (TEXT) - From signup form
- is_active (BOOLEAN)
- display_order (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**Pages:**
- Public: `/member-directory` (NEW!)
- Admin: (Managed via "Add to Directory" button in signups)

---

## Workflow

### Adding a Member to Member Directory

1. User fills join form at `/join`
   - Data saved to `user_signups` table
   - Fields: full_name, job_title, department, rank, email, phone, atomy_id, image_url, linkedin_url, bio

2. Admin reviews signup at `/admin/signups`
   - Views all 10 signup fields
   - Clicks "Add to Directory" button

3. System inserts into `member_directory`
   - All fields from `user_signups` are preserved
   - Member marked as active
   - Signup marked as reviewed

4. Member appears in public `/member-directory`
   - Searchable by name, email, ATOMY ID, rank
   - Filterable by department
   - Shows all 10 fields with contact info

---

## Navigation

**User Navigation (Header):**
- `/directory` - Team Leaders (team_members)
- `/member-directory` - All Members (member_directory) - NEW!

**Admin Navigation (Sidebar):**
- `/admin/directory` - Manage Team Leaders (team_members)
- `/admin/signups` - Review & Add Members to Directory (user_signups → member_directory)

---

## Database Queries

### Query member_directory
```sql
-- Get all active members
SELECT * FROM member_directory 
WHERE is_active = true 
ORDER BY display_order ASC;

-- Search members
SELECT * FROM member_directory 
WHERE is_active = true 
AND (full_name ILIKE '%search%' OR email ILIKE '%search%')
ORDER BY display_order ASC;

-- Filter by department
SELECT * FROM member_directory 
WHERE is_active = true 
AND department = 'Sales'
ORDER BY display_order ASC;
```

### Query team_members
```sql
-- Get all active team leaders
SELECT * FROM team_members 
WHERE is_active = true 
ORDER BY display_order ASC;
```

---

## Code Files Modified

1. **`/scripts/create-member-directory-table.sql`** - NEW
   - Creates `member_directory` table
   - Adds RLS policies
   - Creates indexes

2. **`/app/admin/signups/signups-content.tsx`** - MODIFIED
   - Changed from `team_members` insert to `member_directory` insert
   - Maps all 10 signup fields correctly

3. **`/app/member-directory/page.tsx`** - NEW
   - Public page showing member_directory
   - Search & filter functionality
   - Mobile responsive

4. **`/lib/types.ts`** - MODIFIED
   - Added `MemberDirectory` interface
   - Matches all signup form fields

5. **`/components/header.tsx`** - MODIFIED
   - Added `/member-directory` link to navigation

---

## Features

### Member Directory Page (`/member-directory`)
- Search by name, email, ATOMY ID, rank
- Filter by department
- Shows all 10 fields per member
- Contact information (email, phone, ATOMY ID)
- LinkedIn profile links
- Profile images
- Mobile responsive grid (1-4 columns)
- Member count display
- No results message

### Admin Signups
- "Add to Directory" button with loading state
- Inserts all signup fields to member_directory
- Auto-marks signup as reviewed
- Success/error alerts
- Complete form field display during signup

---

## Testing Checklist

- [ ] Migration script executed successfully
- [ ] `member_directory` table created in Supabase
- [ ] RLS policies applied correctly
- [ ] Admin can view signups at `/admin/signups`
- [ ] Admin clicks "Add to Directory" → saves to member_directory
- [ ] Member appears in `/member-directory`
- [ ] Search works (name, email, ID, rank)
- [ ] Filter by department works
- [ ] Mobile responsive design works
- [ ] Contact info displays correctly
- [ ] LinkedIn links work
- [ ] No broken links in navigation

---

## Environment Variables

None additional required. Uses existing Supabase connection.

---

## Summary

✅ **Two separate tables** keep team leaders and members organized  
✅ **Complete signup data** preserved in member_directory  
✅ **Clean workflow** from signup → admin review → directory listing  
✅ **Full admin control** via intuitive "Add to Directory" button  
✅ **Public member discovery** with search & filter  
✅ **Mobile-first responsive** design  
