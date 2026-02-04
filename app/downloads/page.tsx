import { Download, FileText, FileImage, FileVideo, File, FolderDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { DownloadableFile } from "@/lib/types"

export default async function DownloadsPage() {
  const supabase = await getSupabaseServerClient()

  const { data: files } = await supabase.from("downloadable_files").select("*").eq("is_active", true).order("category")

  const downloadableFiles = (files as DownloadableFile[]) || []

  const getIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return FileText
      case "image":
        return FileImage
      case "video":
        return FileVideo
      case "ppt":
        return File
      case "doc":
        return FileText
      default:
        return File
    }
  }

  const groupedFiles = downloadableFiles.reduce(
    (acc, file) => {
      const category = file.category || "Other"
      if (!acc[category]) acc[category] = []
      acc[category].push(file)
      return acc
    },
    {} as Record<string, DownloadableFile[]>,
  )

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-sidebar px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold text-sidebar-foreground">Download Center</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Access brochures, presentations, marketing materials, and other resources to support your ATOMY business.
            </p>
          </div>
        </section>

        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {Object.keys(groupedFiles).length > 0 ? (
              <div className="space-y-12">
                {Object.entries(groupedFiles).map(([category, categoryFiles]) => (
                  <div key={category}>
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <FolderDown className="h-6 w-6 text-primary" /> {category}
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {categoryFiles.map((file) => {
                        const Icon = getIcon(file.file_type)
                        return (
                          <Card key={file.id} className="border-border hover:border-primary/50 transition-colors">
                            <CardHeader className="pb-2">
                              <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                  <Icon className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <CardTitle className="text-base">{file.title}</CardTitle>
                                  <CardDescription className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {file.file_type.toUpperCase()}
                                    </Badge>
                                    {file.file_size && <span className="text-xs">{file.file_size}</span>}
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {file.description && (
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{file.description}</p>
                              )}
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">{file.download_count} downloads</span>
                                <a href={file.file_url} target="_blank" rel="noopener noreferrer" download>
                                  <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                                    <Download className="h-4 w-4" /> Download
                                  </Button>
                                </a>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FolderDown className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground">Coming Soon</h2>
                <p className="mt-2 text-muted-foreground">
                  Downloadable resources will be available here shortly. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
