# Quick Reference: Team Leaders vs Member Directory

## Two Separate Systems

### System 1: Team Leaders (`team_members` table)
- **Purpose:** Showcase leadership team
- **Location:** `/directory` (public), `/admin/directory` (admin)
- **Fields:** name, role, email, image_url, linkedin_url, bio
- **Manage by:** Admin manually adds/edits team members

### System 2: Member Directory (`member_directory` table)
- **Purpose:** Member profiles from signup form
- **Location:** `/member-directory` (public)
- **Fields:** All 10 join form fields (full_name, job_title, department, rank, email, phone, atomy_id, image_url, linkedin_url, bio)
- **Manage by:** Admin adds via "Add to Directory" button in signups

---

## How It Works

**User Journey:**
```
User fills join form (/join)
        ↓
Saved to user_signups table
        ↓
Admin reviews at /admin/signups
        ↓
Admin clicks "Add to Directory"
        ↓
Data inserted to member_directory
        ↓
Member visible at /member-directory
```

---

## Admin Navigation

**Sidebar has both:**
- "Members Directory" → `/admin/directory` (Edit team_members)
- "Member Signups" → `/admin/signups` (Review & add to member_directory)

---

## Public Navigation

**Header "More" menu has both:**
- "Member Directory" → `/member-directory` (member_directory table)
- "Directory" → `/directory` (team_members table)

---

## Database Tables

| Field | team_members | member_directory |
|-------|--------------|------------------|
| id | ✓ | ✓ |
| name/full_name | name | full_name |
| role/title | role | job_title |
| email | ✓ | ✓ |
| image_url | ✓ | ✓ |
| linkedin_url | ✓ | ✓ |
| bio | ✓ | ✓ |
| department | ✗ | ✓ |
| rank | ✗ | ✓ |
| phone | ✗ | ✓ |
| atomy_id | ✗ | ✓ |

---

## Important Files

1. **Migration:** `/scripts/create-member-directory-table.sql`
2. **Signup Insert:** `/app/admin/signups/signups-content.tsx` (line 35-62)
3. **Member Directory Page:** `/app/member-directory/page.tsx`
4. **Types:** `/lib/types.ts` (MemberDirectory interface)
5. **Navigation:** `/components/header.tsx` (line 79)

---

## Testing

1. Go to `/join` and fill form
2. Go to `/admin/signups`
3. Click "Add to Directory"
4. Go to `/member-directory`
5. See the member appear!
6. Search and filter work perfectly

---

## That's It!

Two completely separate systems, each with its own purpose:
- **Team Leaders** → `/directory`
- **Members** → `/member-directory`

Both fully functional and independent.
