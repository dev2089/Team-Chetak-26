import Image from "next/image"
import Link from "next/link"
import { Target, Eye, Heart, Zap, Users, TrendingUp, Award, UserPlus, IndianRupee, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { SiteSetting } from "@/lib/types"

export const metadata = {
  title: "About Us | Team Chetak ATOMY",
  description: "Learn about Team Chetak's mission to create financial freedom through ATOMY network marketing",
}

export default async function AboutPage() {
  const supabase = await getSupabaseServerClient()

  const { data } = await supabase.from("site_settings").select("*")

  const settings = (data as SiteSetting[]) || []
  const getSetting = (key: string) => settings.find((s) => s.key === key)?.value || ""

  const values = [
    { icon: Target, title: "Excellence", desc: "Striving for the highest standards in ATOMY business building" },
    { icon: Heart, title: "Support", desc: "Helping every team member succeed through mentorship and guidance" },
    { icon: Zap, title: "Action", desc: "Taking consistent action towards our goals every single day" },
    { icon: Eye, title: "Integrity", desc: "Building trust through honest and transparent business practices" },
  ]

  const stats = [
    { value: "5,000+", label: "Team Members", icon: Users },
    { value: "₹1 Cr", label: "Monthly Target", icon: Target },
    { value: "14", label: "Income Streams", icon: IndianRupee },
    { value: "3", label: "Yearly Trips", icon: Plane },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-sidebar px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h1 className="text-4xl font-bold text-sidebar-foreground">About Team Chetak</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  India&apos;s premier ATOMY network marketing team, dedicated to creating financial freedom and
                  reducing unemployment through quality products and a supportive community.
                </p>
                <div className="mt-8 flex gap-4">
                  <Link href="/join">
                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                      <UserPlus className="h-4 w-4" /> Join Our Team
                    </Button>
                  </Link>
                  <Link href="/income">
                    <Button
                      variant="outline"
                      className="gap-2 bg-transparent border-sidebar-border text-sidebar-foreground"
                    >
                      <TrendingUp className="h-4 w-4" /> View Income Sources
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <Image
                  src="/images/image.png"
                  alt="Team Chetak - Maharana Pratap"
                  width={300}
                  height={300}
                  className="rounded-2xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="px-6 py-12 lg:px-8 bg-background">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
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

        {/* Mission & Vision */}
        <section className="px-6 py-16 lg:px-8 bg-muted/30">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="bg-primary text-primary-foreground border-0">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8" />
                    <CardTitle className="text-2xl">Our Mission</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-primary-foreground/90">
                    {getSetting("about_mission") ||
                      "Our mission is to empower 5,000+ team members to achieve financial freedom through ATOMY network marketing, with a monthly team target of ₹1 Crore. We are committed to reducing unemployment in India by creating sustainable income opportunities."}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Eye className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl">Our Vision</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {getSetting("about_vision") ||
                      "To be the leading ATOMY team in India, recognized for excellence, integrity, and transforming lives through quality products and a supportive community that empowers every member to succeed."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground text-center mb-8">Our Story</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none text-center">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Team Chetak is named after the legendary horse of Maharana Pratap, symbolizing unwavering loyalty,
                courage, and the spirit of never giving up. Just as Chetak carried his master through the most
                challenging battles, our team carries forward the mission of transforming lives through ATOMY.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                Founded with a vision to create financial freedom for thousands of Indians, we have grown into a
                powerful network of 5,000+ dedicated members across India. Our team provides comprehensive training,
                mentorship, and support systems to help every member build a successful ATOMY business.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                We believe that with the right guidance, quality products, and a supportive community, anyone can
                achieve their dreams of financial independence. Join us in our mission to reduce unemployment and create
                prosperity across India.
              </p>
            </div>
          </div>
        </section>

        {/* Why ATOMY */}
        <section className="bg-muted/30 px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-foreground text-center mb-4">Why ATOMY?</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              ATOMY is a global direct sales company offering premium quality products at affordable prices with a
              transparent and fair compensation plan.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Absolute Quality", desc: "Premium products that deliver real results" },
                { title: "Absolute Price", desc: "Fair pricing that makes quality accessible to everyone" },
                { title: "Global Presence", desc: "Operating in 20+ countries with consistent growth" },
                { title: "No Rank Maintenance", desc: "Once you achieve a rank, you keep it forever" },
                { title: "Consumer-Centric", desc: "Focus on genuine product value, not just sales" },
                { title: "Proven System", desc: "A tried and tested business model that works" },
              ].map((item) => (
                <Card key={item.title} className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Core Values</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <Card key={value.title} className="text-center border-border">
                  <CardHeader>
                    <value.icon className="mx-auto h-12 w-12 text-primary" />
                    <CardTitle>{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{value.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-sidebar px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-sidebar-foreground">Ready to Start Your Journey?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join 5,000+ members who are building their dreams with Team Chetak. Get access to training, mentorship,
              and a supportive community.
            </p>
            <div className="mt-8">
              <Link href="/join">
                <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                  <UserPlus className="h-5 w-5" /> Join Team Chetak Today
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
