"use client"

import { useLanguage } from "@/lib/language-context"
import { Play, FileText, LinkIcon, BookOpen, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { TrainingResource } from "@/lib/types"

interface TrainingPageClientProps {
  resources: TrainingResource[]
}

export function TrainingPageClient({ resources }: TrainingPageClientProps) {
  const { t } = useLanguage()

  const getIcon = (type: string) => {
    const lower = type.toLowerCase()
    if (lower.includes("video")) return Play
    if (lower.includes("pdf")) return FileText
    if (lower.includes("link")) return LinkIcon
    if (lower.includes("book")) return BookOpen
    if (lower.includes("course")) return Star
    return Clock
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-sidebar px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">{t("learning") || "Learning"}</Badge>
            <h1 className="text-4xl font-bold text-sidebar-foreground">{t("training_resources") || "Training Resources"}</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("training_desc") || "Access comprehensive training materials to build your ATOMY business successfully"}
            </p>
          </div>
        </section>

        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {resources.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource) => {
                  const Icon = getIcon(resource.type)
                  return (
                    <Card key={resource.id} className="border-border bg-card hover:border-primary/50 transition-colors group">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                          <Badge variant="outline" className="text-xs capitalize">{resource.type}</Badge>
                        </div>
                        <CardTitle className="mt-4">{resource.title}</CardTitle>
                        <CardDescription>{resource.category}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                        {resource.url && (
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                              <Play className="h-4 w-4" /> {t("access_now") || "Access Now"}
                            </Button>
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                {t("no_training_available") || "No training resources available yet"}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
