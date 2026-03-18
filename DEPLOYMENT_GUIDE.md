# Deployment & Testing Guide

## Pre-Deployment Checklist

### 1. Configuration Updates

#### Update Domain References
Find and replace all instances of demo domain with your production domain:

**File: `/app/sitemap.ts`**
```typescript
const baseUrl = 'https://your-production-domain.com'
```

**File: `/app/layout.tsx`**
```typescript
metadataBase: new URL("https://your-production-domain.com"),
```

Also update in OpenGraph section:
```typescript
url: "https://your-production-domain.com",
```

### 2. Environment Variables
Ensure all required environment variables are set in `.env.local`:

```
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://your-production-domain.com/admin

# Database (if using Postgres directly)
POSTGRES_URL=your_postgres_url
```

### 3. Build Verification
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Check for any build errors
```

### 4. Local Testing
```bash
# Run development server
npm run dev

# Test URL: http://localhost:3000
```

---

## Testing Checklist

### A. Live Chat Button Removal ✅
- [ ] Navigate to homepage `/`
- [ ] Look at bottom-left corner - should be NO chat button
- [ ] Check mobile view - no chat button visible
- [ ] Test on all pages - no chat button anywhere
- [ ] Open dev tools, search for "LiveChat" - should find no component

### B. Join Form Testing ✅

#### Desktop Testing:
1. Navigate to `/join`
2. Verify all 10 fields are visible:
   - [ ] Full Name (required)
   - [ ] Job Title
   - [ ] Department
   - [ ] Rank
   - [ ] Email (required)
   - [ ] Phone
   - [ ] ATOMY ID
   - [ ] Image URL
   - [ ] LinkedIn URL
   - [ ] Bio (textarea)

#### Data Validation:
- [ ] Submit without Full Name - should show error
- [ ] Submit without Email - should show error
- [ ] Enter non-numeric characters in Phone - should auto-filter
- [ ] Enter more than 8 digits in ATOMY ID - should truncate
- [ ] Enter bio > 500 chars - should show warning

#### Successful Submission:
- [ ] Fill all required fields
- [ ] Submit form
- [ ] Should see success page with checkmark
- [ ] Check Supabase - verify all data in `user_signups` table
- [ ] Check optional fields are stored (or null if empty)

#### Mobile Testing:
- [ ] Open `/join` on mobile (< 640px)
- [ ] Verify single-column layout
- [ ] All inputs should be full-width
- [ ] Typography should be readable
- [ ] Touch targets >= 44px
- [ ] Submit on mobile

### C. Admin Signups Enhancement ✅

#### Admin Access:
1. Login at `/login` with admin credentials
2. Navigate to Admin > Signups

#### Verify New Button:
- [ ] "Add to Directory" button visible on each signup card
- [ ] Button is blue with white text
- [ ] Button has UserCheck icon
- [ ] Mobile: buttons stack vertically

#### Add to Directory Functionality:
1. Click "Add to Directory" on a signup
2. Should show "Adding..." state
3. Should complete and show success alert
4. [ ] Check `team_members` table in Supabase
5. [ ] Verify new entry created with signup data
6. [ ] Verify signup marked as reviewed

#### Data Mapping Verification:
- [ ] full_name → team_members.name
- [ ] job_title → team_members.role
- [ ] email → team_members.email
- [ ] bio → team_members.bio
- [ ] image_url → team_members.image_url
- [ ] linkedin_url → team_members.linkedin_url

### D. Admin Login Redirect ✅

#### Test Login Flow:
1. Navigate to `/login`
2. Enter valid admin email and password
3. Click "Sign In"
4. Should redirect to `/admin` (not stay on login page)
5. Admin dashboard should load properly

#### Verify Session:
- [ ] Check browser cookies for Supabase session
- [ ] Refresh page - should stay logged in
- [ ] Admin functionality should work

#### Error Handling:
- [ ] Enter wrong password - should show error
- [ ] Enter unauthorized email - should show error
- [ ] Error message should be clear

### E. SEO Optimization ✅

#### Sitemap Testing:
1. Navigate to `https://your-domain.com/sitemap.xml`
2. Should return XML (not 404)
3. [ ] Should contain 15+ URLs
4. [ ] Each URL has lastModified, changeFrequency, priority
5. [ ] XML is valid (no errors in browser)

#### Robots.txt Testing:
1. Navigate to `https://your-domain.com/robots.txt`
2. Should display plain text (not 404)
3. [ ] Contains User-agent rules
4. [ ] Contains Disallow rules
5. [ ] Contains Sitemap reference

#### Metadata Testing:
1. Open any page
2. Open dev tools > Elements/Inspector
3. Look in `<head>`:
   - [ ] Title tag present and descriptive
   - [ ] Meta description present (155-160 chars)
   - [ ] Viewport meta tag present
   - [ ] OpenGraph tags present (og:title, og:description, og:image)
   - [ ] Twitter card tags present
   - [ ] Canonical URL present
   - [ ] Theme color meta tag present

#### Mobile-Friendly Test:
1. Go to https://search.google.com/test/mobile-friendly
2. Enter your domain
3. Should pass "Mobile-friendly"
4. Check for issues

#### PageSpeed Insights:
1. Go to https://pagespeed.web.dev/
2. Enter your domain
3. Check:
   - [ ] Performance > 70
   - [ ] Core Web Vitals in "Good" range
   - [ ] Mobile performance acceptable

### F. Footer Attribution ✅

#### Visual Verification:
1. Scroll to footer on any page
2. Should see "Made with ❤ by DEVRAYOG AI"
3. [ ] Heart emoji renders correctly
4. [ ] Text styled properly
5. [ ] Text is readable

#### Link Verification:
1. Hover over "DEVRAYOG AI" text
2. Should show link to https://v0-devrayog.vercel.app
3. Click link - should open in new tab
4. [ ] Link is correct
5. [ ] opens in new window

### G. Responsive Design Testing ✅

#### Mobile (< 640px):
- [ ] Navigate pages with < 640px width
- [ ] No horizontal scroll
- [ ] Text readable without zoom
- [ ] Buttons/inputs touch-friendly
- [ ] Images responsive
- [ ] Forms functional

#### Tablet (640px - 1024px):
- [ ] Layout optimized for tablet
- [ ] Two-column layouts appear correctly
- [ ] All content accessible
- [ ] Performance good

#### Desktop (> 1024px):
- [ ] Full layout visible
- [ ] Proper spacing
- [ ] Professional appearance
- [ ] All features functional

#### Device Testing:
- [ ] iPhone (iOS)
- [ ] Android phone
- [ ] iPad/tablet
- [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)

---

## Deployment Steps

### Option 1: Vercel Deployment

#### Setup:
1. Push code to GitHub
2. Go to https://vercel.com
3. Create new project from repository
4. Select the repository
5. Configure environment variables
6. Deploy

#### Post-Deployment:
```bash
# Vercel automatically builds and deploys
# Your site will be available at:
# https://your-project.vercel.app
# or https://your-custom-domain.com
```

### Option 2: Manual Deployment

1. Build locally:
```bash
npm run build
```

2. Deploy to hosting provider:
```bash
# Copy .next folder and public folder to server
# Set environment variables on server
# Start Next.js production server
npm start
```

---

## Search Engine Submission

### Google Search Console:
1. Go to https://search.google.com/search-console
2. Add property (your domain)
3. Verify ownership:
   - DNS TXT record, OR
   - HTML file upload, OR
   - Meta tag, OR
   - Google Analytics
4. Wait for verification (can take 24-48 hours)
5. Submit sitemap:
   - Go to Sitemaps
   - Click "Add/test sitemap"
   - Enter: `/sitemap.xml`
   - Click Submit
6. Monitor:
   - Coverage (indexed pages)
   - Performance (impressions, clicks, CTR)
   - Mobile usability
   - Core Web Vitals

### Bing Webmaster Tools:
1. Go to https://www.bing.com/webmasters
2. Add site
3. Verify ownership
4. Submit sitemap:
   - Go to Sitemaps
   - Click "Add sitemap"
   - Enter `/sitemap.xml`
5. Monitor metrics

### Other Search Engines:
- Yandex: https://webmaster.yandex.com/
- DuckDuckGo: https://duckduckgo.com/
- Baidu (for China): https://zhanzhang.baidu.com/

---

## Monitoring & Maintenance

### Daily:
- [ ] Check application logs
- [ ] Monitor error tracking (Sentry if configured)
- [ ] Quick manual testing of critical paths

### Weekly:
- [ ] Check Google Search Console
- [ ] Monitor performance metrics
- [ ] Review server logs
- [ ] Check email notifications

### Monthly:
- [ ] Full functionality testing
- [ ] SEO metrics review
- [ ] Performance analysis
- [ ] User feedback review
- [ ] Database backup verification

### Quarterly:
- [ ] Full audit
- [ ] Content freshness check
- [ ] Update outdated information
- [ ] Competitor analysis
- [ ] Plan improvements

---

## Troubleshooting

### Issue: Chat button still visible
**Solution**: 
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Clear browser cache
- [ ] Check layout.tsx - verify LiveChat import removed
- [ ] Redeploy

### Issue: Join form not submitting
**Solution**:
- [ ] Check Supabase connection
- [ ] Verify table exists: `user_signups`
- [ ] Check RLS policies allow INSERT
- [ ] Check browser console for errors
- [ ] Test with sample data

### Issue: "Add to Directory" button not working
**Solution**:
- [ ] Verify `team_members` table exists
- [ ] Check RLS policies for INSERT access
- [ ] Check browser console for errors
- [ ] Verify admin session is valid
- [ ] Test with sample signup

### Issue: Admin not redirecting after login
**Solution**:
- [ ] Check email is in admin_users table
- [ ] Verify password is correct
- [ ] Check browser console for auth errors
- [ ] Clear browser cookies and login again
- [ ] Check that session is being created

### Issue: Sitemap not accessible
**Solution**:
- [ ] Verify file at `/app/sitemap.ts` exists
- [ ] Check domain is correct in file
- [ ] Build and redeploy
- [ ] Check `/sitemap.xml` returns valid XML
- [ ] Verify build completed successfully

### Issue: Mobile layout broken
**Solution**:
- [ ] Check viewport meta tag present
- [ ] Verify Tailwind responsive classes applied
- [ ] Test on actual mobile device
- [ ] Check for CSS conflicts
- [ ] Inspect element in dev tools

---

## Performance Optimization Tips

### Image Optimization:
```bash
# Use Next.js Image component
# Automatic optimization, lazy loading, responsive

# Or use external optimization tools:
# - TinyPNG (https://tinypng.com)
# - ImageOptim (for Mac)
# - Squoosh (https://squoosh.app)
```

### Code Optimization:
```bash
# Monitor bundle size
npm run analyze

# Enable React Compiler (Next.js 16)
# In next.config.js:
const nextConfig = {
  reactCompiler: true,
}
```

### Database Optimization:
- Index frequently queried columns
- Archive old data
- Optimize query performance
- Monitor slow queries

### CDN Configuration:
- Enable Vercel Edge Network
- Configure cache headers
- Enable compression
- Enable HTTP/2

---

## Success Indicators

After deployment, you should see:

✅ **SEO Metrics:**
- Pages indexed in Google within 1 week
- Search impressions increasing
- CTR improving as rankings increase
- Organic traffic growing month-over-month

✅ **Performance:**
- Core Web Vitals all "Good"
- PageSpeed Insights > 85
- Mobile-friendly designation
- Fast page loads

✅ **Functionality:**
- All forms working correctly
- Admin panel functional
- No console errors
- All links working

✅ **User Experience:**
- Mobile layout responsive
- Forms easy to use
- Navigation clear
- Content easily findable

---

## Rollback Procedure

If deployment causes issues:

1. **Immediate**: Revert to previous version in Vercel
   - Go to Vercel dashboard
   - Click "Deployments"
   - Click three dots on previous deployment
   - Click "Promote to Production"

2. **Investigation**: Check deployment logs
   - Look for build errors
   - Check environment variables
   - Verify database connection

3. **Fix**: Address issues and redeploy

---

## Support Resources

### Documentation:
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Vercel: https://vercel.com/docs

### Contact Support:
- Supabase Support: https://supabase.com/support
- Vercel Support: https://vercel.com/support
- Email: devanshu2089@gmail.com
- WhatsApp: +91 63764 76075

---

**Deployment Status**: Ready for production
**Last Updated**: March 18, 2026
**Version**: 1.0
