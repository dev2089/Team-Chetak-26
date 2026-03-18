"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface AppUpdate {
  id: string
  title: string
  description: string
  image_url?: string
  is_active: boolean
  created_at: string
}

export function AppUpdatesPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [updates, setUpdates] = useState<AppUpdate[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasShown, setHasShown] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUpdates()
  }, [])

  const fetchUpdates = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data } = await supabase
        .from("app_updates")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (data && data.length > 0) {
        setUpdates(data as AppUpdate[])
        
        // Check if user has seen updates today
        const lastShownDate = localStorage.getItem("appUpdatesLastShown")
        const today = new Date().toDateString()

        if (lastShownDate !== today && !hasShown) {
          const timer = setTimeout(() => {
            setIsOpen(true)
            setHasShown(true)
            localStorage.setItem("appUpdatesLastShown", today)
          }, 3500) // Show after download popup

          return () => clearTimeout(timer)
        }
      }
    } catch (error) {
      console.error("Error fetching updates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % updates.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + updates.length) % updates.length)
  }

  if (!isOpen || updates.length === 0 || isLoading) return null

  const currentUpdate = updates[currentIndex]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden">
          {currentUpdate.image_url ? (
            <img
              src={currentUpdate.image_url}
              alt={currentUpdate.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <p className="text-4xl">📢</p>
              <p className="text-sm text-muted-foreground mt-2">Update Available</p>
            </div>
          )}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-foreground">{currentUpdate.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(currentUpdate.created_at).toLocaleDateString("en-IN")}
            </p>
          </div>

          <p className="text-foreground text-sm leading-relaxed">{currentUpdate.description}</p>

          <div className="flex items-center justify-center gap-2 mt-6">
            {updates.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 pt-4">
            <Button
              onClick={handlePrev}
              variant="outline"
              size="sm"
              className="flex-1 gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              onClick={handleClose}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Got It
            </Button>
            <Button
              onClick={handleNext}
              variant="outline"
              size="sm"
              className="flex-1 gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
