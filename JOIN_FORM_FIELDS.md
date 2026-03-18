# Join Form Fields Reference

## Overview
The updated Join page now includes 10 comprehensive fields to capture member information. All data is stored in the Supabase `user_signups` table.

## Form Fields

### 1. **Full Name** ⭐ Required
- **Database Column**: `full_name`
- **Type**: Text
- **Validation**: 3-50 characters
- **Purpose**: Member's complete name
- **Example**: "Devanshu Kumar"

### 2. **Job Title** (Optional)
- **Database Column**: `job_title`
- **Type**: Text
- **Validation**: No strict limit
- **Purpose**: Current or desired job title
- **Example**: "Senior Software Engineer"

### 3. **Department** (Optional)
- **Database Column**: `department`
- **Type**: Text
- **Validation**: No strict limit
- **Purpose**: Department or business unit
- **Example**: "Sales", "Marketing", "Operations"

### 4. **Rank** (Optional)
- **Database Column**: `rank`
- **Type**: Text
- **Validation**: No strict limit
- **Purpose**: ATOMY rank or position
- **Example**: "Ruby", "Gold", "Platinum"

### 5. **Email** ⭐ Required
- **Database Column**: `email`
- **Type**: Email
- **Validation**: Valid email format
- **Purpose**: Contact and account verification
- **Example**: "user@example.com"

### 6. **Phone** (Optional)
- **Database Column**: `phone`
- **Type**: Numeric (10 digits for India)
- **Validation**: Exactly 10 digits, numeric only
- **Formatting**: Automatically removes non-numeric characters
- **Purpose**: Contact and SMS notifications
- **Example**: "9876543210"

### 7. **ATOMY ID** (Optional)
- **Database Column**: `atomy_id`
- **Type**: Numeric (8 digits)
- **Validation**: Exactly 8 digits, numeric only
- **Formatting**: Automatically removes non-numeric characters
- **Purpose**: Unique ATOMY identifier
- **Example**: "12345678"
- **Help**: Link to WhatsApp if user needs to create ATOMY ID

### 8. **Image URL** (Optional)
- **Database Column**: `image_url`
- **Type**: URL
- **Validation**: Valid URL format
- **Purpose**: Profile picture or member image
- **Example**: "https://example.com/profile.jpg"

### 9. **LinkedIn URL** (Optional)
- **Database Column**: `linkedin_url`
- **Type**: URL
- **Validation**: Valid URL format
- **Purpose**: Professional profile link
- **Example**: "https://linkedin.com/in/username"

### 10. **Bio** (Optional)
- **Database Column**: `bio`
- **Type**: Long text (Textarea)
- **Validation**: Maximum 500 characters
- **Purpose**: Member introduction and background
- **Example**: "Passionate about network marketing and helping others achieve financial freedom. 5+ years of experience in sales and team building."

---

## Form Layout (Mobile-First)

### Mobile (< 640px)
- Single column layout
- Full-width inputs
- Touch-friendly sizing
- Optimal spacing for thumb interaction

### Tablet (640px - 1024px)
- Two-column grid for related fields
- Improved visual hierarchy
- Balanced spacing

### Desktop (1024px+)
- Two-column layout maintained
- Better use of space
- Full form visibility

---

## Data Processing

### On Submit:
1. **Validation** - All required fields verified
2. **Trimming** - Whitespace removed from text fields
3. **Formatting** - Phone and ATOMY ID formatted
4. **Database Insert** - Data inserted into `user_signups` table
5. **Success Screen** - User shown confirmation message

### Error Handling:
- Clear error messages displayed
- Form remains editable
- Specific validation messages for each field

### Success Flow:
- Success page displays with checkmark
- WhatsApp contact button provided
- Back to home link included
- Auto-review flag can be set by admin

---

## Database Table Structure

```sql
user_signups table:
- id (UUID, Primary Key)
- full_name (TEXT, NOT NULL)
- job_title (TEXT, nullable)
- department (TEXT, nullable)
- rank (TEXT, nullable)
- email (TEXT, NOT NULL)
- phone (TEXT, nullable)
- atomy_id (TEXT, nullable)
- image_url (TEXT, nullable)
- linkedin_url (TEXT, nullable)
- bio (TEXT, nullable)
- is_reviewed (BOOLEAN, default: false)
- created_at (TIMESTAMP, default: now())
```

---

## Admin Integration

### Adding to Member Directory
Admins can click "Add to Directory" button to:
1. Create new entry in `team_members` table
2. Auto-populate from signup data:
   - name ← full_name
   - role ← job_title (defaults to "Team Member")
   - email ← email
   - bio ← bio
   - image_url ← image_url
   - linkedin_url ← linkedin_url
3. Automatically mark signup as reviewed
4. Display success confirmation

---

## Validation Rules Summary

| Field | Required | Type | Length | Format |
|-------|----------|------|--------|--------|
| Full Name | ✅ | Text | 3-50 | Any |
| Job Title | ❌ | Text | Any | Any |
| Department | ❌ | Text | Any | Any |
| Rank | ❌ | Text | Any | Any |
| Email | ✅ | Email | Any | valid@email.com |
| Phone | ❌ | Numeric | 10 | Digits only |
| ATOMY ID | ❌ | Numeric | 8 | Digits only |
| Image URL | ❌ | URL | Any | https://... |
| LinkedIn URL | ❌ | URL | Any | https://... |
| Bio | ❌ | Text | 500 | Any |

---

## User Experience Features

### Mobile Responsiveness
- ✅ Touch-friendly inputs (min 44px height)
- ✅ Clear labels and error messages
- ✅ Responsive grid layout
- ✅ Optimized spacing

### Accessibility
- ✅ Proper form labels
- ✅ Input type attributes for mobile keyboards
- ✅ Clear error messaging
- ✅ Success feedback with visual indicators

### Performance
- ✅ Client-side validation before submission
- ✅ Optimized for mobile networks
- ✅ Minimal API calls
- ✅ Efficient database operations

---

## Testing Scenarios

### Happy Path
- Fill all optional fields
- Submit successfully
- Verify data in Supabase
- Check success message

### Minimal Path
- Fill only required fields (Name, Email)
- Submit successfully
- Verify optional fields stored as null

### Error Path
- Enter invalid phone (non-numeric)
- See error message
- Correct and resubmit
- Verify success

### Mobile Test
- Open on mobile device
- Test single-column layout
- Verify all fields accessible
- Test form submission

---

**Last Updated**: March 18, 2026
**Form Version**: 2.0 (Enhanced)
**Database Version**: Updated to include all new fields
