# Environment Variables Setup

## Required Variables

### NEXT_PUBLIC_APP_DOWNLOAD_URL
**Purpose:** URL where users can download the app

**How to set:**

#### Option 1: Local Development (.env.local)
```bash
# Create file: .env.local
NEXT_PUBLIC_APP_DOWNLOAD_URL=https://example.com/downloads/app.apk
```

#### Option 2: Vercel Production
1. Go to your project at https://vercel.com/dashboard
2. Select your project: **Team-Chetak-26**
3. Click **Settings** (top navigation)
4. Go to **Environment Variables** (left sidebar)
5. Click **Add New Environment Variable**
6. Fill in:
   - **Name:** `NEXT_PUBLIC_APP_DOWNLOAD_URL`
   - **Value:** Your download URL (see options below)
   - **Environments:** Check all three (Production, Preview, Development)
7. Click **Save**
8. Redeploy your project

---

## Download URL Options

### Best Options (Choose One):

#### 1. Google Play Store (Recommended for Android)
```
https://play.google.com/store/apps/details?id=com.teamchetak.app
```
- Replace `com.teamchetak.app` with your actual app package name
- User will open Play Store

#### 2. Apple App Store (Recommended for iOS)
```
https://apps.apple.com/app/team-chetak/id1234567890
```
- Get your App ID from App Store Connect
- User will open App Store

#### 3. Direct APK Download (Android)
Get a direct APK link:
- **Google Drive:** Upload APK → Share → Get link → Replace `/open?id=` with `/uc?id=` and add `&export=download`
- **GitHub Releases:** Upload to releases, get raw download link
- **Firebase Hosting:** Upload APK file, get download URL

Example:
```
https://drive.google.com/uc?id=YOUR_FILE_ID&export=download
```

#### 4. GitHub Releases (Recommended)
1. Upload APK/IPA to GitHub repository Releases
2. Get the direct link:
```
https://github.com/yourrepo/releases/download/v1.0/app.apk
```

#### 5. Firebase App Distribution (Enterprise)
```
https://appdistribution.firebase.dev/...
```

#### 6. Your Own Server
```
https://your-domain.com/downloads/app.apk
```

---

## How It Works

When user clicks "Download Now" button in popup:

1. **Android (Google Play):** Opens Play Store app or website
2. **Android (Direct APK):** Downloads APK file to device
3. **iOS (App Store):** Opens App Store
4. **Web (Fallback):** Opens your provided URL

---

## Testing

### Test Locally
1. Add to `.env.local`:
   ```
   NEXT_PUBLIC_APP_DOWNLOAD_URL=https://drive.google.com/uc?id=YOUR_ID&export=download
   ```
2. Restart dev server: `npm run dev`
3. Open http://localhost:3000
4. Wait for popup → Click Download
5. Should redirect to your URL

### Test on Vercel
1. After setting environment variable
2. Wait for automatic redeploy (or manually redeploy)
3. Visit your live domain
4. Popup should appear and download should work

---

## Verification

After setting the variable:

1. **Check in Vercel:**
   - Settings → Environment Variables
   - Should see `NEXT_PUBLIC_APP_DOWNLOAD_URL` listed

2. **Check in Browser:**
   - Open DevTools (F12)
   - Go to Console tab
   - Type: `console.log(process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL)`
   - Should show your URL

3. **Test Download:**
   - Visit website
   - Wait for popup
   - Click "Download Now"
   - Should redirect to your download link

---

## Common Issues

### "Download button does nothing"
- Check if environment variable is set in Vercel
- Verify URL is correct and accessible
- Clear browser cache and try again

### "Shows old URL"
- Environment variables changed? Redeploy the project
- Go to Vercel → Projects → Redeploy

### "Variable not appearing in code"
- Must start with `NEXT_PUBLIC_` to be accessible in browser
- Restart dev server after adding `.env.local`

---

## After You Deploy

### For Android Users:
- Can download APK directly or get it from Play Store
- Popup triggers automatically once per day

### For iOS Users:
- Can get app from App Store via link
- Same once-per-day popup

### For Web Users:
- Still can access full site
- Can optionally download app for native experience

---

## Next Steps

1. ✅ Decide which download method to use
2. ✅ Get your download URL
3. ✅ Add `NEXT_PUBLIC_APP_DOWNLOAD_URL` variable in Vercel
4. ✅ Redeploy
5. ✅ Test the download popup
6. ✅ Done!

The app download functionality will now work for all your users! 🚀
