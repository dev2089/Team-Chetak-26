import { Users, Calendar, Newspaper, Mail, Star, ImageIcon, UserPlus, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function AdminDashboardPage() {
  const supabase = await getSupabaseServerClient()

  const [
    teamResult,
    eventsResult,
    newsResult,
    messagesResult,
    testimonialsResult,
    galleryResult,
    faqResult,
    signupsResult,
    newSignupsResult,
  ] = await Promise.all([
    supabase.from("team_members").select("id", { count: "exact" }),
    supabase.from("events").select("id", { count: "exact" }),
    supabase.from("news_posts").select("id", { count: "exact" }),
    supabase.from("contact_submissions").select("id", { count: "exact" }).eq("is_read", false),
    supabase.from("testimonials").select("id", { count: "exact" }),
    supabase.from("gallery_images").select("id", { count: "exact" }),
    supabase.from("faq_items").select("id", { count: "exact" }),
    supabase.from("user_signups").select("id", { count: "exact" }),
    supabase.from("user_signups").select("id", { count: "exact" }).eq("is_reviewed", false),
  ])

  const stats = [
    {
      name: "New Signups",
      value: newSignupsResult.count || 0,
      icon: UserPlus,
      href: "/admin/signups",
      highlight: true,
    },
    { name: "Total Signups", value: signupsResult.count || 0, icon: TrendingUp, href: "/admin/signups" },
    { name: "Team Members", value: teamResult.count || 0, icon: Users, href: "/admin/team" },
    { name: "Events", value: eventsResult.count || 0, icon: Calendar, href: "/admin/events" },
    { name: "News Posts", value: newsResult.count || 0, icon: Newspaper, href: "/admin/news" },
    { name: "Unread Messages", value: messagesResult.count || 0, icon: Mail, href: "/admin/messages" },
    { name: "Testimonials", value: testimonialsResult.count || 0, icon: Star, href: "/admin/testimonials" },
    { name: "Gallery Images", value: galleryResult.count || 0, icon: ImageIcon, href: "/admin/gallery" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to Team Chetak ATOMY Admin Dashboard</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <a key={stat.name} href={stat.href}>
            <Card
              className={cn(
                "hover:shadow-md transition-shadow border-border",
                stat.highlight && stat.value > 0 && "border-primary bg-primary/5",
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
                <stat.icon
                  className={cn("h-5 w-5", stat.highlight && stat.value > 0 ? "text-primary" : "text-muted-foreground")}
                />
              </CardHeader>
              <CardContent>
                <div className={cn("text-3xl font-bold", stat.highlight && stat.value > 0 && "text-primary")}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/admin/signups"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <UserPlus className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium">View Signups</p>
              <p className="text-sm text-muted-foreground">Review new member registrations</p>
            </div>
          </a>
          <a
            href="/admin/team"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium">Manage Team</p>
              <p className="text-sm text-muted-foreground">Add or edit team members</p>
            </div>
          </a>
          <a
            href="/admin/events"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium">Manage Events</p>
              <p className="text-sm text-muted-foreground">Create workshops and meetings</p>
            </div>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
