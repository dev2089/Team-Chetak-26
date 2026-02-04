"use client"

import { useLanguage } from "@/lib/language-context"
import Image from "next/image"
import Link from "next/link"
import { Target, Eye, Heart, Zap, Users, TrendingUp, Award, UserPlus, IndianRupee, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export function AboutClient() {
  const { t } = useLanguage()

  const values = [
    { icon: Target, title: t("excellence") || "Excellence", desc: t("excellence_desc") || "Striving for the highest standards" },
    { icon: Heart, title: t("support") || "Support", desc: t("support_desc") || "Helping every member succeed" },
    { icon: Zap, title: t("action") || "Action", desc: t("action_desc") || "Taking consistent action" },
    { icon: Eye, title: t("integrity") || "Integrity", desc: t("integrity_desc") || "Building trust" },
  ]

  const stats = [
    { value: "5,000+", label: t("team_members") || "Team Members", icon: Users },
    { value: "₹1 Cr", label: t("monthly_target") || "Monthly Target", icon: Target },
    { value: "14", label: t("income_streams") || "Income Streams", icon: IndianRupee },
    { value: "3", label: t("yearly_trips") || "Yearly Trips", icon: Plane },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-sidebar px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h1 className="text-4xl font-bold text-sidebar-foreground">{t("about_team_chetak") || "About Team Chetak"}</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  {t("about_intro") || "India's premier ATOMY network marketing team, dedicated to creating financial freedom"}
                </p>
                <div className="mt-8 flex gap-4">
                  <Link href="/join">
                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                      <UserPlus className="h-4 w-4" /> {t("join_team") || "Join Team"}
                    </Button>
                  </Link>
                  <Link href="/income">
                    <Button variant="outline" className="gap-2 bg-transparent border-sidebar-border text-sidebar-foreground">
                      <TrendingUp className="h-4 w-4" /> {t("view_income") || "View Income"}
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
                    <CardTitle className="text-2xl">{t("mission") || "Our Mission"}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-primary-foreground/90">
                    {t("mission_desc") || "Empower team members to achieve financial freedom through ATOMY"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Eye className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl">{t("vision") || "Our Vision"}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {t("vision_desc") || "Be the leading ATOMY team in India"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">{t("core_values") || "Our Core Values"}</h2>
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
            <h2 className="text-3xl font-bold text-sidebar-foreground">{t("ready_start") || "Ready to Start?"}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("join_cta") || "Join our community today"}
            </p>
            <div className="mt-8">
              <Link href="/join">
                <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                  <UserPlus className="h-5 w-5" /> {t("join_today") || "Join Today"}
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
