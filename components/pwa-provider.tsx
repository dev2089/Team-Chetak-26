'use client'

import { useEffect, useState } from 'react'
import { X, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PWAProvider() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration failed - continue anyway
      })
    }

    // Check if user has already dismissed today
    const lastDismissed = localStorage.getItem('pwaPromptDismissed')
    const today = new Date().toDateString()

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Only show if not dismissed today
      if (lastDismissed !== today && !hasShown) {
        setShowInstallPrompt(true)
        setHasShown(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [hasShown])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowInstallPrompt(false)
        localStorage.setItem('pwaPromptDismissed', new Date().toDateString())
      }
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    localStorage.setItem('pwaPromptDismissed', new Date().toDateString())
  }

  if (!showInstallPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .pwa-prompt {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>

      <div className="pwa-prompt bg-card border border-border rounded-2xl shadow-2xl max-w-sm w-80 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-center relative">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Download className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Install App</h3>
          <p className="text-white/90 text-sm">Get Team Chetak on your home screen</p>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-foreground text-sm leading-relaxed">
            Install as an app for quick access, offline support, and a native feel.
          </p>

          <div className="flex gap-3">
            <Button
              onClick={handleInstall}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-5 gap-2"
            >
              <Download className="w-4 h-4" />
              Install
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-sidebar"
            >
              Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
