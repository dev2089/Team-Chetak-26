import { NextResponse } from 'next/server';

/**
 * GET /api/app-download
 * Redirects to the app download URL configured in environment variables
 * 
 * Environment variables needed:
 * - NEXT_PUBLIC_APP_DOWNLOAD_URL: The URL to your APK/IPA file or app store link
 * 
 * Examples:
 * - https://example.com/downloads/team-chetak-app.apk
 * - https://play.google.com/store/apps/details?id=com.teamchetak.app
 * - https://apps.apple.com/app/team-chetak/id123456
 */

export async function GET() {
  try {
    const downloadUrl = process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL;

    if (!downloadUrl) {
      return NextResponse.json(
        { 
          error: 'App download URL not configured',
          message: 'Please set NEXT_PUBLIC_APP_DOWNLOAD_URL in your environment variables'
        },
        { status: 500 }
      );
    }

    // Redirect to the download URL
    return NextResponse.redirect(downloadUrl, { status: 302 });
  } catch (error) {
    console.error('[v0] App download error:', error);
    return NextResponse.json(
      { error: 'Failed to process download request' },
      { status: 500 }
    );
  }
}
