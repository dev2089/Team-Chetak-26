import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { LiveChat } from "@/components/live-chat"
import { LanguageProvider } from "@/lib/language-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Team Chetak ATOMY | Never Give Up",
  description:
    "Join 5,000+ team members achieving financial freedom through ATOMY network marketing. Monthly team target: ₹1 Crore.",
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
      </head>
      <body className={`font-sans antialiased`}>
        <LanguageProvider>
          {children}
          <LiveChat />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
