import { Bell, Calendar, AlertTriangle, Trophy, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { Announcement } from "@/lib/types"
import { AnnouncementsClient } from "./client"

export const metadata = {
  title: "Announcements | Team Chetak ATOMY",
  description: "Latest announcements and updates from Team Chetak ATOMY",
}

export default async function AnnouncementsPage() {
  const supabase = await getSupabaseServerClient()

  const { data } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_active", true)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })

  const announcements = (data as Announcement[]) || []

  const getTypeIcon = (type: string | null) => {
    switch (type) {
      case "urgent":
        return AlertTriangle
      case "event":
        return Calendar
      case "achievement":
        return Trophy
      default:
        return Info
    }
  }

  const getTypeColor = (type: string | null) => {
    switch (type) {
      case "urgent":
        return "bg-red-500/10 text-red-500 border-red-500/30"
      case "event":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30"
      case "achievement":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
      default:
        return "bg-primary/10 text-primary border-primary/30"
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-sidebar px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <Bell className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-sidebar-foreground">Announcements</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Stay updated with the latest news, events, and important updates from Team Chetak ATOMY.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {announcements.length === 0 ? (
              <Card className="border-border text-center py-12">
                <CardContent>
                  <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground">No Announcements Yet</h3>
                  <p className="text-muted-foreground mt-2">
                    Check back later for important updates and news from Team Chetak.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {announcements.map((announcement) => {
                  const Icon = getTypeIcon(announcement.announcement_type)
                  return (
                    <Card
                      key={announcement.id}
                      className={`border-border ${announcement.is_pinned ? "ring-2 ring-primary" : ""}`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${getTypeColor(announcement.announcement_type)}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="text-lg flex items-center gap-2">
                                {announcement.title}
                                {announcement.is_pinned && (
                                  <Badge variant="secondary" className="text-xs">
                                    Pinned
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription>
                                {new Date(announcement.created_at).toLocaleDateString("en-IN", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                                {announcement.expires_at && (
                                  <span className="ml-2 text-yellow-500">
                                    (Expires: {new Date(announcement.expires_at).toLocaleDateString("en-IN")})
                                  </span>
                                )}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={getTypeColor(announcement.announcement_type)}>
                            {announcement.announcement_type || "General"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">{announcement.content}</p>
                        {announcement.image_url && (
                          <img
                            src={announcement.image_url || "/placeholder.svg"}
                            alt={announcement.title}
                            className="mt-4 rounded-lg max-h-64 object-cover"
                          />
                        )}
                        {announcement.link_url && (
                          <a
                            href={announcement.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-4 text-primary hover:underline"
                          >
                            Learn More →
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
