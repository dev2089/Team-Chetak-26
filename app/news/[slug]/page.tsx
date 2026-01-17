import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { NewsPost } from "@/lib/types"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase
    .from("news_posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (!data) return { title: "Post Not Found" }

  return {
    title: `${data.title} | Team Chetak`,
    description: data.excerpt,
  }
}

export default async function NewsPostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await getSupabaseServerClient()

  const { data } = await supabase.from("news_posts").select("*").eq("slug", slug).eq("is_published", true).single()

  if (!data) notFound()

  const post = data as NewsPost

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <article className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <Link href="/news">
              <Button variant="ghost" className="mb-8 gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to News
              </Button>
            </Link>

            {post.image_url && (
              <div className="aspect-video overflow-hidden rounded-lg bg-muted mb-8">
                <img
                  src={post.image_url || "/placeholder.svg"}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              {post.published_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.published_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
              {post.author_name && (
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.author_name}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-foreground mb-6">{post.title}</h1>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {post.content.split("\n").map((paragraph, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
