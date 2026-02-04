import { Play, FileText, LinkIcon, BookOpen, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { TrainingResource } from "@/lib/types"
import { TrainingPageClient } from "./client"

export default async function TrainingPage() {
  const supabase = await getSupabaseServerClient()

  const { data: resources } = await supabase
    .from("training_resources")
    .select("*")
    .eq("is_active", true)
    .order("display_order")

  const trainingResources = (resources as TrainingResource[]) || []

  const featured = trainingResources.filter((r) => r.is_featured)
  const videos = trainingResources.filter((r) => r.resource_type === "video")
  const pdfs = trainingResources.filter((r) => r.resource_type === "pdf")
  const articles = trainingResources.filter((r) => r.resource_type === "article")
  const links = trainingResources.filter((r) => r.resource_type === "link")

  const getIcon = (type: string) => {
    switch (type) {
      case "video":
        return Play
      case "pdf":
        return FileText
      case "article":
        return BookOpen
      case "link":
        return LinkIcon
      default:
        return BookOpen
    }
  }

  const ResourceCard = ({ resource }: { resource: TrainingResource }) => {
    const Icon = getIcon(resource.resource_type)
    return (
      <Card className="border-border hover:border-primary/50 transition-colors">
        {resource.thumbnail_url && (
          <div className="aspect-video bg-muted overflow-hidden">
            <img
              src={resource.thumbnail_url || "/placeholder.svg"}
              alt={resource.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <Badge variant="outline" className="text-xs">
                {resource.resource_type.toUpperCase()}
              </Badge>
            </div>
            {resource.is_featured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
          </div>
          <CardTitle className="text-base mt-2">{resource.title}</CardTitle>
          {resource.category && <CardDescription>{resource.category}</CardDescription>}
        </CardHeader>
        <CardContent>
          {resource.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{resource.description}</p>
          )}
          <div className="flex items-center justify-between">
            {resource.duration && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> {resource.duration}
              </span>
            )}
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                {resource.resource_type === "video" ? "Watch" : resource.resource_type === "pdf" ? "Download" : "Open"}
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-sidebar px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold text-sidebar-foreground">Training Resources</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Access our comprehensive library of training materials including videos, PDFs, articles, and external
              resources to accelerate your ATOMY journey.
            </p>
          </div>
        </section>

        {featured.length > 0 && (
          <section className="px-6 py-12 lg:px-8 bg-muted/30">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500" /> Featured Resources
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          </section>
        )}

        {videos.length > 0 && (
          <section className="px-6 py-12 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Play className="h-6 w-6 text-primary" /> Video Library
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {videos.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          </section>
        )}

        {pdfs.length > 0 && (
          <section className="px-6 py-12 lg:px-8 bg-muted/30">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" /> PDF Documents
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pdfs.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          </section>
        )}

        {articles.length > 0 && (
          <section className="px-6 py-12 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" /> Articles
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          </section>
        )}

        {links.length > 0 && (
          <section className="px-6 py-12 lg:px-8 bg-muted/30">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <LinkIcon className="h-6 w-6 text-primary" /> Useful Links
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {links.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          </section>
        )}

        {trainingResources.length === 0 && (
          <section className="px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground">Coming Soon</h2>
              <p className="mt-2 text-muted-foreground">
                Our training resources library is being prepared. Check back soon for videos, PDFs, and learning
                materials.
              </p>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
