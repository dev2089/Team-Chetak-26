import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { LanguageProvider } from "@/lib/language-context"
import { AppUpdatesPopup } from "@/components/app-updates-popup"
import { PWAProvider } from "@/components/pwa-provider"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#1a1a1a",
  icons: {
    icon: "/favicon.ico",
    apple: "/images/logo.png",
  },
}

export const metadata: Metadata = {
  title: "Team Chetak ATOMY | Never Give Up - Financial Freedom Through Network Marketing",
  description:
    "Join 5,000+ team members achieving financial freedom through ATOMY network marketing. Monthly team target: ₹1 Crore. Access training, income sources, and success stories.",
  keywords: [
    "ATOMY",
    "Team Chetak",
    "Network Marketing",
    "Financial Freedom",
    "MLM",
    "Income",
    "Business Opportunity",
    "Team Building",
  ],
  authors: [{ name: "Team Chetak ATOMY" }],
  creator: "Team Chetak",
  publisher: "Team Chetak ATOMY",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  metadataBase: new URL("https://teamchetak.vercel.app"),
  alternates: {
    canonical: "https://teamchetak.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://teamchetak.vercel.app",
    siteName: "Team Chetak ATOMY",
    title: "Team Chetak ATOMY | Never Give Up",
    description:
      "Join 5,000+ team members achieving financial freedom through ATOMY network marketing. Monthly team target: ₹1 Crore.",
    images: [
      {
        url: "/images/image.png",
        width: 1200,
        height: 630,
        alt: "Team Chetak ATOMY",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Team Chetak ATOMY | Never Give Up",
    description:
      "Join 5,000+ team members achieving financial freedom through ATOMY network marketing.",
    images: ["/images/image.png"],
  },
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="NqDtQZA4mgeNnfo0-b7BCsn8-O25HQ1aaMr2z7KtTDY" />
        <meta name="google-adsense-account" content="ca-pub-2026937791260614"/>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Team Chetak" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className={`font-sans antialiased`}>
        <LanguageProvider>
          {children}
          <AppUpdatesPopup />
          <PWAProvider />
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
