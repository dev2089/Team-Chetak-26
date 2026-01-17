"use client"

import { useState, useEffect } from "react"
import { ImageIcon, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { GalleryImage } from "@/lib/types"

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchImages() {
      const supabase = getSupabaseBrowserClient()
      const { data } = await supabase.from("gallery_images").select("*").eq("is_active", true).order("display_order")

      const galleryImages = (data as GalleryImage[]) || []
      setImages(galleryImages)

      const uniqueCategories = Array.from(new Set(galleryImages.map((img) => img.category).filter(Boolean))) as string[]
      setCategories(uniqueCategories)
      setLoading(false)
    }

    fetchImages()
  }, [])

  const filteredImages = activeCategory ? images.filter((img) => img.category === activeCategory) : images

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-muted/30 px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground">Gallery</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                A visual journey through our team activities and achievements.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                <Button
                  variant={activeCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(null)}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : filteredImages.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredImages.map((image) => (
                  <Card
                    key={image.id}
                    className="group relative overflow-hidden cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="aspect-square bg-muted">
                      <img
                        src={image.image_url || "/placeholder.svg"}
                        alt={image.title || "Gallery image"}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    {(image.title || image.category) && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <div>
                          {image.title && <p className="text-white font-medium">{image.title}</p>}
                          {image.category && (
                            <Badge variant="secondary" className="mt-1">
                              {image.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <ImageIcon className="mx-auto h-16 w-16 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium text-foreground">No images yet</h3>
                <p className="mt-2 text-muted-foreground">Check back soon for photos!</p>
              </div>
            )}
          </div>
        </section>

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedImage.image_url || "/placeholder.svg"}
                alt={selectedImage.title || "Gallery image"}
                className="max-w-full max-h-[80vh] object-contain"
              />
              {(selectedImage.title || selectedImage.description) && (
                <div className="mt-4 text-center text-white">
                  {selectedImage.title && <h3 className="text-lg font-medium">{selectedImage.title}</h3>}
                  {selectedImage.description && <p className="text-white/70 mt-1">{selectedImage.description}</p>}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
