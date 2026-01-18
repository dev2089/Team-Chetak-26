"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import {
  ArrowRight,
  Users,
  Calendar,
  Star,
  Target,
  TrendingUp,
  Award,
  UserPlus,
  IndianRupee,
  Trophy,
  Plane,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/language-context"
import type { TeamMember, Event, NewsPost, Testimonial, IncomeSource } from "@/lib/types"

export default function HomePage() {
  const { t } = useLanguage()
  const [team, setTeam] = useState<TeamMember[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [news, setNews] = useState<NewsPost[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([])

  useEffect(() => {
    const loadData = async () => {
      const supabase = getSupabaseBrowserClient()

      const [teamResult, eventsResult, newsResult, testimonialsResult, incomeResult] = await Promise.all([
        supabase.from("team_members").select("*").eq("is_active", true).order("display_order").limit(4),
        supabase
          .from("events")
          .select("*")
          .eq("is_published", true)
          .gte("start_date", new Date().toISOString())
          .order("start_date")
          .limit(3),
        supabase
          .from("news_posts")
          .select("*")
          .eq("is_published", true)
          .order("published_at", { ascending: false })
          .limit(3),
        supabase
          .from("testimonials")
          .select("*")
          .eq("is_active", true)
          .eq("is_featured", true)
          .order("display_order")
          .limit(3),
        supabase.from("income_sources").select("*").eq("is_active", true).order("display_order").limit(6),
      ])

      if (teamResult.data) setTeam(teamResult.data)
      if (eventsResult.data) setEvents(eventsResult.data)
      if (newsResult.data) setNews(newsResult.data)
      if (testimonialsResult.data) setTestimonials(testimonialsResult.data)
      if (incomeResult.data) setIncomeSources(incomeResult.data)
    }

    loadData()
  }, [])

  const getCategoryIcon = (category: string | null) => {
    switch (category) {
      case "Bonus":
        return IndianRupee
      case "Incentive":
        return TrendingUp
      case "Sales":
        return Target
      case "Commission":
        return IndianRupee
      case "Referral":
        return UserPlus
      case "Training":
        return Users
      case "Program":
        return Calendar
      case "Award":
        return Trophy
      case "Trip":
        return Plane
      default:
        return Award
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-sidebar px-6 py-20 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                  <Target className="h-4 w-4" />
                  {t("monthly_target")}
                </div>
                <h1 className="text-balance text-4xl font-bold tracking-tight text-sidebar-foreground sm:text-5xl lg:text-6xl">
                  <span className="text-primary">{t("team_chetak")}</span>
                  <br />
                  <span className="text-sidebar-foreground/90">{t("never_give_up")}</span>
                </h1>
                <p className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl">{t("hero_description")}</p>
                <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <Link href="/join">
                    <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                      <UserPlus className="h-5 w-5" /> {t("join_our_team")}
                    </Button>
                  </Link>
                  <Link href="/income">
                    <Button
                      variant="outline"
                      size="lg"
                      className="gap-2 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent bg-transparent"
                    >
                      {t("income_streams_14")} <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl"></div>
                  <Image
                    src="/images/image.png"
                    alt="Team Chetak - Maharana Pratap"
                    width={400}
                    height={400}
                    className="relative rounded-3xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6 py-12 lg:px-8 bg-background">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: "5,000+", label: t("team_members"), icon: Users },
                { value: "₹1 Cr", label: t("monthly_target_short"), icon: Target },
                { value: "14", label: t("income_streams"), icon: IndianRupee },
                { value: "3", label: t("yearly_trips"), icon: Plane },
              ].map((stat) => (
                <Card key={stat.label} className="border-border bg-card text-center">
                  <CardContent className="pt-6">
                    <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Income Sources */}
        {incomeSources.length > 0 && (
          <section className="px-6 py-16 lg:px-8 bg-muted/30">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">{t("ways_to_earn_14")}</h2>
                  <p className="mt-2 text-muted-foreground">{t("multiple_income_streams")}</p>
                </div>
                <Link href="/income">
                  <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80">
                    {t("view_all")} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {incomeSources.map((source) => {
                  const Icon = getCategoryIcon(source.category)
                  return (
                    <Card key={source.id} className="border-border bg-card hover:border-primary/50 transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{source.name}</CardTitle>
                            <span className="text-xs text-muted-foreground">{source.category}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{source.description}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Features */}
        <section className="px-6 py-16 lg:px-8 bg-background">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">{t("why_join_team_chetak")}</h2>
              <p className="mt-2 text-muted-foreground">{t("build_atomy_business")}</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Users,
                  title: t("reduce_unemployment"),
                  desc: t("reduce_unemployment_desc"),
                },
                {
                  icon: Calendar,
                  title: t("daily_training"),
                  desc: t("daily_training_desc"),
                },
                {
                  icon: IndianRupee,
                  title: t("income_streams_14_title"),
                  desc: t("income_streams_desc"),
                },
                {
                  icon: Trophy,
                  title: t("recognition_system"),
                  desc: t("recognition_system_desc"),
                },
              ].map((feature) => (
                <Card key={feature.title} className="border-border bg-card">
                  <CardHeader>
                    <feature.icon className="h-10 w-10 text-primary" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Preview */}
        {team.length > 0 && (
          <section className="bg-muted/30 px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">{t("meet_our_leaders")}</h2>
                  <p className="mt-2 text-muted-foreground">{t("talented_people")}</p>
                </div>
                <Link href="/team">
                  <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80">
                    {t("view_all")} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {team.map((member) => (
                  <Card key={member.id} className="overflow-hidden border-border">
                    <div className="aspect-square bg-muted">
                      {member.image_url ? (
                        <img
                          src={member.image_url || "/placeholder.svg"}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-sidebar">
                          <Users className="h-16 w-16 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <CardDescription>{member.role}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Upcoming Events */}
        {events.length > 0 && (
          <section className="px-6 py-16 lg:px-8 bg-background">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">{t("upcoming_workshops")}</h2>
                  <p className="mt-2 text-muted-foreground">{t("dont_miss_training")}</p>
                </div>
                <Link href="/events">
                  <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80">
                    {t("view_all")} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {events.map((event) => (
                  <Card key={event.id} className="border-border">
                    <CardHeader>
                      <div className="text-sm font-medium text-primary">
                        {new Date(event.start_date).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      {event.location && <CardDescription>{event.location}</CardDescription>}
                    </CardHeader>
                    {event.description && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Latest News */}
        {news.length > 0 && (
          <section className="bg-muted/30 px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">{t("latest_updates")}</h2>
                  <p className="mt-2 text-muted-foreground">{t("news_announcements")}</p>
                </div>
                <Link href="/news">
                  <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80">
                    {t("view_all")} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {news.map((post) => (
                  <Card key={post.id} className="overflow-hidden border-border">
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
                      <div className="text-xs text-muted-foreground">
                        {post.published_at &&
                          new Date(post.published_at).toLocaleDateString("en-IN", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                      </div>
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                    </CardHeader>
                    {post.excerpt && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="px-6 py-16 lg:px-8 bg-background">
            <div className="mx-auto max-w-7xl">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground">{t("success_stories_title")}</h2>
                <p className="mt-2 text-muted-foreground">{t("hear_from_members")}</p>
              </div>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="bg-card border-border">
                    <CardContent className="pt-6">
                      <div className="flex gap-1 text-primary">
                        {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <p className="mt-4 text-sm text-muted-foreground italic">{`"${testimonial.content}"`}</p>
                      <div className="mt-4 flex items-center gap-3">
                        {testimonial.author_image_url ? (
                          <img
                            src={testimonial.author_image_url || "/placeholder.svg"}
                            alt={testimonial.author_name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar">
                            <Users className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-foreground">{testimonial.author_name}</div>
                          {(testimonial.author_role || testimonial.author_company) && (
                            <div className="text-xs text-muted-foreground">
                              {testimonial.author_role}
                              {testimonial.author_role && testimonial.author_company && ", "}
                              {testimonial.author_company}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-sidebar px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-sidebar-foreground">{t("ready_transform_life")}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t("cta_description")}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/join">
                <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <UserPlus className="h-5 w-5" /> {t("join_now")}
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent bg-transparent"
                >
                  <Trophy className="h-5 w-5" /> {t("view_leaderboard")}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
