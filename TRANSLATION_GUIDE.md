# Translation Implementation Guide

## Overview
This guide explains how to translate all 55+ pages in your Team Chetak app. Two pages (About & Contact) have already been fully translated as templates.

## Key Principles
1. Import `useLanguage` from `@/lib/language-context` in client components
2. Use `const { t } = useLanguage()` to access translation function
3. Provide fallback English text: `t("key") || "Default English Text"`
4. Update `/lib/translations.ts` with new translation keys

## Step-by-Step Translation Process

### Step 1: Add Translation Keys to /lib/translations.ts
For each page, add translation keys:

```typescript
// Example pattern
export const translations = {
  // ... existing translations ...
  
  // Page-specific keys
  page_title: {
    en: "Page Title",
    hi: "पृष्ठ शीर्षक",
    te: "పేజీ శీర్ష‍్రము",
    ta: "பக்க தலைப்பு",
    pa: "ਪੰਨਾ ਸਿਰਲੇਖ",
  },
  page_description: {
    en: "Description",
    hi: "विवरण",
    te: "వివరణ",
    ta: "விளக்கம்",
    pa: "ਵਰਣਨ",
  },
}
```

### Step 2: Convert Page to Client Component
If page uses server-side data fetching, split into:
- `page.tsx` - Server component (handles metadata, fetches data)
- `client.tsx` - Client component (uses useLanguage for translations)

Example structure:
```typescript
// page.tsx
import { ClientComponent } from "./client"

export const metadata = { ... }
export default function Page() {
  return <ClientComponent />
}

// client.tsx
"use client"
import { useLanguage } from "@/lib/language-context"
export function ClientComponent() {
  const { t } = useLanguage()
  return <div>{t("key") || "Fallback"}</div>
}
```

### Step 3: Update Content Strings
Replace all hardcoded strings with `t()` calls:

```typescript
// Before
<h1>Welcome to Team Chetak</h1>
<p>Join our community today</p>

// After
<h1>{t("welcome_team_chetak") || "Welcome to Team Chetak"}</h1>
<p>{t("join_today") || "Join our community today"}</p>
```

### Step 4: Test Language Switching
Use the language selector in the header to test all 5 languages:
- English (en)
- Hindi (hi)
- Telugu (te)
- Tamil (ta)
- Punjabi (pa)

## Pages to Translate (55+)

### Public Pages (Priority 1)
✅ /about - DONE
✅ /contact - DONE
- / (home)
- /join
- /income
- /leaderboard
- /training
- /success-stories
- /ranks
- /downloads
- /calculator
- /events
- /announcements
- /attendance
- /directory
- /dashboard
- /feedback
- /gallery
- /news
- /login
- /faq

### Resource Pages (Priority 2)
- /training/[id]
- /success-stories/[id]
- /events/[id]
- /news/[id]
- /downloads/[category]

### Admin Pages (Priority 3)
- /admin
- /admin/members
- /admin/members/[id]
- /admin/income
- /admin/events
- /admin/announcements
- /admin/settings
- /admin/analytics
- /admin/content
- /admin/contact-messages

### Error Pages
- /404
- /500
- /unauthorized

## Translation Keys Checklist

Common keys to translate on every page:
```typescript
// Navigation
home, about, contact, join_team, admin_login

// Common buttons
submit, cancel, save, delete, edit, view_more, read_more, back, next

// Common labels
name, email, phone, message, subject, description, date, status

// Common alerts
success_message, error_message, loading, confirmation_needed

// Common CTAs
join_today, learn_more, view_details, get_started, sign_up
```

## Nested Translation Example

For forms with multiple fields:
```typescript
// Add to translations.ts
form_fields: {
  en: "Form Fields",
  hi: "फॉर्म फील्ड",
  // ...
},

// In component
<input placeholder={t("form_fields.name") || "Name"} />
```

## Dynamic Content

For dynamic content, translate labels separately from data:
```typescript
// Translate: "Members", "Income", "Status"
// Don't translate: actual member names, amounts, current status values

<Card>
  <Label>{t("member_name") || "Member Name"}</Label>
  <Value>{memberData.name}</Value> {/* Keep actual data as-is */}
</Card>
```

## Performance Tips
1. Use `const { t } = useLanguage()` once per component
2. Don't call hooks inside loops
3. Memoize components that render translation-dependent content if frequently re-rendered
4. Language context updates trigger re-renders only for components using `useLanguage()`

## Add Missing Translations

If you see `[v0] Missing translation: page_key_name` in logs, add to translations.ts:
```typescript
page_key_name: {
  en: "English text",
  hi: "हिंदी पाठ",
  te: "తెలుగు పాఠం",
  ta: "தமிழ் உரை",
  pa: "ਪੰਜਾਬੀ ਪਾਠ",
},
```

## Quick Start Template

For any new page translation:
```typescript
"use client"

import { useLanguage } from "@/lib/language-context"

export function PageComponent() {
  const { t } = useLanguage()
  
  return (
    <div>
      <h1>{t("page_title") || "Page Title"}</h1>
      <p>{t("page_description") || "Description"}</p>
      <button>{t("button_text") || "Button"}</button>
    </div>
  )
}
```

## Testing Checklist
- [ ] All text switches to selected language
- [ ] Fallback text shows in English
- [ ] No console errors
- [ ] Layout doesn't break with longer translations (German/Spanish)
- [ ] Special characters display correctly (Hindi: ु, ा, ी)
- [ ] Mobile view wrapping works with all languages
- [ ] Header language selector works on every page
