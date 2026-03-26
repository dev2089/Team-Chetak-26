'use client'

import { useEffect, useState } from 'react'

export function PWAProvider() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.log('[v0] Service worker registration failed:', error)
      })
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowInstallPrompt(false)
      }
      setDeferredPrompt(null)
    }
  }

  if (!showInstallPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground rounded-lg shadow-lg p-4 max-w-sm z-50">
      <p className="text-sm font-medium mb-3">Install Team Chetak App</p>
      <p className="text-xs text-primary-foreground/80 mb-4">
        Get quick access to join form, directory, and more!
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleInstall}
          className="flex-1 bg-white text-primary px-3 py-2 rounded font-semibold text-sm hover:bg-gray-100 transition"
        >
          Install
        </button>
        <button
          onClick={() => setShowInstallPrompt(false)}
          className="px-3 py-2 rounded font-semibold text-sm hover:bg-primary/80 transition"
        >
          Later
        </button>
      </div>
    </div>
  )
}
