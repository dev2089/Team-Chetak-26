import { Quote, Calendar, TrendingUp, Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { SuccessStory } from "@/lib/types"
import { SuccessStoriesClient } from "./client"

export default async function SuccessStoriesPage() {
  const supabase = await getSupabaseServerClient()

  const { data: stories } = await supabase
    .from("success_stories")
    .select("*")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })

  const successStories = (stories as SuccessStory[]) || []

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-sidebar px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold text-sidebar-foreground">Success Stories</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Real stories from real members who transformed their lives with Team Chetak and ATOMY. Get inspired by
              their journeys to financial freedom.
            </p>
          </div>
        </section>

        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {successStories.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2">
                {successStories.map((story) => (
                  <Card key={story.id} className={`border-border ${story.is_featured ? "ring-2 ring-primary" : ""}`}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        {story.member_image_url ? (
                          <img
                            src={story.member_image_url || "/placeholder.svg"}
                            alt={story.member_name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary">{story.member_name.charAt(0)}</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{story.member_name}</CardTitle>
                            {story.is_featured && <Badge className="bg-primary">Featured</Badge>}
                          </div>
                          {story.current_rank && (
                            <CardDescription className="flex items-center gap-1">
                              <Award className="h-3 w-3" /> {story.current_rank}
                            </CardDescription>
                          )}
                          {story.member_atomy_id && (
                            <span className="text-xs text-muted-foreground">ID: {story.member_atomy_id}</span>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-semibold text-foreground mb-2">{story.story_title}</h3>
                      <div className="flex items-start gap-2 mb-4">
                        <Quote className="h-5 w-5 text-primary shrink-0 mt-1" />
                        <p className="text-sm text-muted-foreground italic">{story.story_content}</p>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        {story.previous_occupation && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <span className="font-medium">Previously:</span> {story.previous_occupation}
                          </div>
                        )}
                        {story.monthly_income && (
                          <div className="flex items-center gap-1 text-green-500">
                            <TrendingUp className="h-4 w-4" />
                            <span className="font-medium">{story.monthly_income}/month</span>
                          </div>
                        )}
                        {story.join_date && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Joined{" "}
                            {new Date(story.join_date).toLocaleDateString("en-IN", { year: "numeric", month: "short" })}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Quote className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground">Coming Soon</h2>
                <p className="mt-2 text-muted-foreground">
                  Inspiring success stories from our members will be shared here soon.
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
