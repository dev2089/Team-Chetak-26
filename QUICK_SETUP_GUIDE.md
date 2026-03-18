# Quick Setup Guide - New Features

## 🚀 Quick Start (5 Minutes)

### Step 1: Database Setup ✅ (Already Done)
Tables have been created automatically:
- `app_updates` - For admin to manage update notifications
- `user_guide_sections` - For admin to manage user guide content

Pre-populated data: 7 default user guide sections with helpful content

### Step 2: Configure App Download Link
Edit `/components/app-download-popup.tsx` line 35:

```typescript
// Change from:
const downloadUrl = "/app-download"

// To your actual download link:
const downloadUrl = "https://your-domain.com/path-to-your-app.apk"
// or for iOS:
const downloadUrl = "https://apps.apple.com/app/your-app"
```

### Step 3: Deploy
```bash
npm run build
npm run dev  # Test locally first
# Then deploy to Vercel
```

---

## 📱 Feature Overview

### For Users
| Feature | Location | Frequency |
|---------|----------|-----------|
| Download Popup | Home page | Once per day |
| App Updates | Home page | Once per day |
| User Guide | `/user-guide` | Always available |
| Guide Banner | Home page | Always visible |

### For Admins
| Feature | Location | Access |
|---------|----------|--------|
| Signups | `/admin/signups` | See all 10 fields |
| Add to Directory | `/admin/signups` | One-click action |
| Manage Updates | `/admin/app-updates` | Create/Edit/Delete |
| Manage Guide | `/admin/user-guide` | Create/Edit/Delete |

---

## 🎯 Admin Tasks

### Creating Your First App Update
1. Go to `/admin/app-updates`
2. Click "Add Update"
3. Fill in:
   - Title: "New Feature: Member Rewards"
   - Description: "Earn points for every referral..."
   - Image URL: (optional) "https://..."
   - Active: Toggle ON
4. Click "Create Update"
5. Users see it in popup tomorrow (once per day)

### Managing User Guide
1. Go to `/admin/user-guide`
2. Edit existing sections or add new ones
3. Each section has:
   - Title (e.g., "Getting Started")
   - Description (short summary)
   - Content (full text, multiline)
   - Icon (emoji, e.g., 🚀)
   - Display Order (lower = first)
4. Users see updates immediately

### Adding Signups to Directory
1. Go to `/admin/signups`
2. Review signup details (all 10 fields visible)
3. Click "Add to Directory" button
4. User instantly appears in `/directory`
5. Status marked as reviewed

---

## 🎨 Customization

### Popup Styling
- Download popup: `/components/app-download-popup.tsx` (lines 1-80)
- Update popup: `/components/app-updates-popup.tsx` (lines 1-70)

### Colors & Theme
- Uses existing design tokens from `/app/globals.css`
- primary color for buttons
- muted-foreground for text
- card for backgrounds

### Shake Animation
Located in `/components/app-download-popup.tsx` (lines 12-24):
- Duration: 0.6s (adjust as needed)
- Intensity: -5px to 5px translation

---

## 📊 Data Flow

### Download Popup
```
User visits page
    ↓
After 2 seconds
    ↓
Check localStorage (appPopupLastShown)
    ↓
If today's date not found → Show popup with shake
    ↓
Save today's date to localStorage
    ↓
Show again tomorrow
```

### App Updates
```
Admin creates update in `/admin/app-updates`
    ↓
Marked as is_active = true
    ↓
Stored in database (app_updates table)
    ↓
User visits page tomorrow
    ↓
Component fetches active updates
    ↓
Shows as slideshow carousel
    ↓
Updates localStorage (appUpdatesLastShown)
    ↓
Shows again tomorrow
```

### User Guide
```
Admin edits sections in `/admin/user-guide`
    ↓
Stored in database (user_guide_sections table)
    ↓
User clicks banner or visits `/user-guide`
    ↓
Sections load from database
    ↓
User clicks to expand/collapse
    ↓
Content displays
```

---

## 🔧 Troubleshooting

### Popup Not Showing?
1. Check browser console for errors
2. Clear localStorage: `localStorage.clear()`
3. Wait 2-3 seconds after page load
4. Check that components are imported in `/app/layout.tsx`

### Update Popups Show Old Data?
1. Wait 1 hour and refresh
2. Or manually clear: `localStorage.removeItem('appUpdatesLastShown')`
3. Check that updates have `is_active = true` in admin panel

### Guide Content Not Updating?
1. Click refresh in browser
2. Check that you're saving properly in admin panel
3. Verify `display_order` value is correct

### Mobile Issues?
1. Ensure viewport meta tag is set (it is)
2. Test on actual device (not just browser emulation)
3. Check that buttons are at least 44px tall

---

## 📈 Analytics Considerations

### Track These Events
In future, add analytics for:
- Download popup shows/clicks
- App update popup shows/navigation
- User guide page visits/section opens
- Admin panel actions

### Monitor These Metrics
- Popup dismiss rate
- Update engagement
- Guide section popularity

---

## 🔐 Security & RLS

### Authentication
All admin features require admin authentication via Row Level Security

### Public Access
- Users can view app updates (active ones)
- Users can view user guide sections
- Users cannot modify content

### Admin-Only
- Create/Edit/Delete updates
- Create/Edit/Delete guide sections
- View all signups with sensitive data

---

## 📝 Database Queries

### Check App Updates
```sql
SELECT * FROM app_updates ORDER BY created_at DESC;
```

### Check Guide Sections
```sql
SELECT * FROM user_guide_sections ORDER BY display_order;
```

### See Signup Data (Enhanced)
```sql
SELECT id, full_name, job_title, department, rank, email, phone, atomy_id, image_url, linkedin_url, bio, created_at 
FROM user_signups 
ORDER BY created_at DESC;
```

---

## 🚢 Deployment Checklist

Before deploying to production:

- [ ] Configure app download URL
- [ ] Test popups locally
- [ ] Create sample app update in admin
- [ ] Create sample guide section
- [ ] Test on mobile device
- [ ] Clear localStorage and test frequency
- [ ] Check that admin endpoints are secure
- [ ] Verify all 10 signup fields display
- [ ] Test "Add to Directory" button
- [ ] Deploy and verify live

---

## 📞 Support

### Common Issues Resolution

**Q: Popup appears too often?**
A: Check localStorage - it should track daily. See line 35 in `app-download-popup.tsx`

**Q: Can't see admin panel?**
A: Must be logged in as admin. Visit `/login` first

**Q: Guide sections missing?**
A: Default sections auto-created. Check database if empty

**Q: Download button doesn't work?**
A: Update the downloadUrl in `app-download-popup.tsx` with your actual link

---

## 📚 File Reference

| File | Purpose | Lines |
|------|---------|-------|
| `app-download-popup.tsx` | Download popup component | 125 |
| `app-updates-popup.tsx` | Updates slideshow popup | 154 |
| `user-guide-banner.tsx` | Banner on home page | 32 |
| `/user-guide/page.tsx` | Public guide page | 165 |
| `/admin/app-updates/page.tsx` | Admin update manager | 317 |
| `/admin/user-guide/page.tsx` | Admin guide manager | 308 |
| `footer.tsx` | Footer with year 2026 | Updated |

---

## 🎓 Learning Resources

### For Developers
- React hooks: useState, useEffect
- Supabase client library
- Tailwind CSS styling
- localStorage API

### For Content Managers
- How to write effective guide sections
- Best practices for app updates
- Mobile-optimized image sizes

---

## ✨ Feature Highlights

✅ **One-Click Directory Addition** - Admins can add signups with single button  
✅ **Shaky Popups** - Phone shake animation on download popup  
✅ **Smart Frequency** - Shows once per day automatically  
✅ **Slideshow Updates** - Multiple updates navigate like carousel  
✅ **Editable Guides** - Admins can manage all user guide content  
✅ **Mobile-First** - Fully responsive on all devices  
✅ **Professional UI** - Beautiful gradients and animations  
✅ **Server-Optimized** - Uses SSR where appropriate  

---

## 🎉 You're All Set!

Your new features are ready to use. Start by:

1. Creating your first app update
2. Customizing guide sections
3. Testing popups locally
4. Deploying to production

Happy building! 🚀

