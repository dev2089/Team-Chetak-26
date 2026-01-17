import Link from "next/link"
import { Newspaper, User, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { NewsPost } from "@/lib/types"

export const metadata = {
  title: "News | Team Chetak",
  description: "Latest news and updates from Team Chetak",
}

export default async function NewsPage() {
  const supabase = await getSupabaseServerClient()

  const { data } = await supabase
    .from("news_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })

  const posts = (data as NewsPost[]) || []

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-muted/30 px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground">News & Updates</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Stay informed about our latest activities, achievements, and announcements.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {posts.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <Link key={post.id} href={`/news/${post.slug}`}>
                    <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                      {post.image_url && (
                        <div className="aspect-video bg-muted">
                          <img
                            src={post.image_url || "/placeholder.svg"}
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {post.published_at && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(post.published_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          )}
                          {post.author_name && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {post.author_name}
                            </span>
                          )}
                        </div>
                        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                      </CardHeader>
                      {post.excerpt && (
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                        </CardContent>
                      )}
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Newspaper className="mx-auto h-16 w-16 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium text-foreground">No news posts yet</h3>
                <p className="mt-2 text-muted-foreground">Check back soon for updates!</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
