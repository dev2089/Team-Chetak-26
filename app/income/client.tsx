"use client"

import { useLanguage } from "@/lib/language-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { IncomeSource } from "@/lib/types"
import {
  IndianRupee,
  TrendingUp,
  Target,
  UserPlus,
  Users,
  Calendar,
  Trophy,
  Plane,
  Award,
  GraduationCap,
  Crown,
  Gift,
  ShoppingCart,
  Percent,
  Briefcase,
  Heart,
  Medal,
  Sparkles,
} from "lucide-react"

interface IncomePageClientProps {
  incomeSources: IncomeSource[]
}

export function IncomePageClient({ incomeSources }: IncomePageClientProps) {
  const { t } = useLanguage()

  const getIcon = (name: string, category: string | null) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes("education")) return GraduationCap
    if (lowerName.includes("mastership bonus")) return Crown
    if (lowerName.includes("mastership incentive")) return Gift
    if (lowerName.includes("retail")) return ShoppingCart
    if (lowerName.includes("commission")) return Percent
    if (lowerName.includes("joining")) return UserPlus
    if (lowerName.includes("workshop")) return Briefcase
    if (lowerName.includes("weight")) return Heart
    if (lowerName.includes("leader") && lowerName.includes("month")) return Medal
    if (lowerName.includes("trainer")) return Users
    if (lowerName.includes("consumer")) return Sparkles
    if (lowerName.includes("distributor")) return Trophy
    if (lowerName.includes("year")) return Award
    if (lowerName.includes("trip")) return Plane

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

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case "Bonus":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "Incentive":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "Sales":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "Commission":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "Referral":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "Training":
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
      case "Program":
        return "bg-pink-500/10 text-pink-500 border-pink-500/20"
      case "Award":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "Trip":
        return "bg-primary/10 text-primary border-primary/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  // Group income sources by category
  const grouped = incomeSources.reduce(
    (acc, source) => {
      const cat = source.category || "Other"
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(source)
      return acc
    },
    {} as Record<string, IncomeSource[]>,
  )

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-sidebar px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">{t("financial_freedom") || "Financial Freedom"}</Badge>
            <h1 className="text-4xl font-bold text-sidebar-foreground sm:text-5xl">{t("income_sources_title") || "14 Income Sources"}</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("income_sources_desc") || "Team Chetak ATOMY provides multiple ways to earn and build your financial future. From daily sales to yearly international trips!"}
            </p>
          </div>
        </section>

        {/* Income Grid */}
        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {incomeSources.map((source, index) => {
                const Icon = getIcon(source.name, source.category)
                return (
                  <Card
                    key={source.id}
                    className="border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 group"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div
                          className={`p-3 rounded-xl ${getCategoryColor(source.category)} group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mt-4">{source.name}</CardTitle>
                      <CardDescription>{source.category}</CardDescription>
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

        {/* Categories Summary */}
        <section className="px-6 py-16 lg:px-8 bg-muted/30">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-bold text-foreground text-center mb-10">{t("income_categories") || "Income Categories"}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(grouped).map(([category, sources]) => (
                <Card key={category} className="border-border">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{category}</CardTitle>
                      <Badge className={getCategoryColor(category)}>{sources.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {sources.map((s) => (
                        <li key={s.id} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                          {s.name}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-sidebar px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-bold text-sidebar-foreground">{t("start_earning_today") || "Start Earning Today"}</h2>
            <p className="mt-4 text-muted-foreground">
              {t("join_team_chetak") || "Join Team Chetak and unlock all 14 income sources with ATOMY network marketing"}
            </p>
            <a
              href="/join"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <UserPlus className="h-4 w-4" /> {t("join_now") || "Join Now"}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
