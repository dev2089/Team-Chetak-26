"use client"

import { useState, useEffect } from "react"
import { X, Download, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AppDownloadPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    // Check if user has already seen the popup today
    const lastShownDate = localStorage.getItem("appPopupLastShown")
    const today = new Date().toDateString()

    if (lastShownDate !== today && !hasShown) {
      // Show popup after 2 seconds of page load
      const timer = setTimeout(() => {
        setIsOpen(true)
        setHasShown(true)
        localStorage.setItem("appPopupLastShown", today)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [hasShown])

  const handleDownload = () => {
    // Trigger download - you can replace this URL with your actual app download link
    const downloadUrl = "/app-download" // This should link to your actual APK or IPA
    window.location.href = downloadUrl
    setIsOpen(false)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          10%, 20% { transform: translateX(-5px) rotate(-0.5deg); }
          30%, 50%, 70%, 90% { transform: translateX(5px) rotate(0.5deg); }
          40%, 60%, 80% { transform: translateX(-5px) rotate(-0.5deg); }
        }
        .shake-animation {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>

      <div className="shake-animation bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-4 rounded-full">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Download Our App</h2>
          <p className="text-white/90 text-sm">Get exclusive features and stay connected</p>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-foreground text-center text-sm">
            Download the Team Chetak ATOMY app for a better experience with exclusive features, push notifications, and offline access.
          </p>

          <div className="grid grid-cols-2 gap-3 my-6">
            <div className="bg-sidebar p-3 rounded-lg text-center">
              <p className="text-2xl mb-1">⚡</p>
              <p className="text-xs font-semibold text-foreground">Fast & Smooth</p>
            </div>
            <div className="bg-sidebar p-3 rounded-lg text-center">
              <p className="text-2xl mb-1">🔔</p>
              <p className="text-xs font-semibold text-foreground">Notifications</p>
            </div>
            <div className="bg-sidebar p-3 rounded-lg text-center">
              <p className="text-2xl mb-1">📱</p>
              <p className="text-xs font-semibold text-foreground">Mobile First</p>
            </div>
            <div className="bg-sidebar p-3 rounded-lg text-center">
              <p className="text-2xl mb-1">🔒</p>
              <p className="text-xs font-semibold text-foreground">Secure</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleDownload}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6 gap-2 text-base"
            >
              <Download className="w-5 h-5" />
              Download Now
            </Button>

            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full border-border text-foreground"
            >
              Maybe Later
            </Button>
          </div>

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-sidebar px-6 py-3 text-center">
          <p className="text-xs text-muted-foreground">
            Only 5.2 MB • Works on Android 6.0+
          </p>
        </div>
      </div>
    </div>
  )
}
