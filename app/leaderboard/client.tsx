"use client"

import { useLanguage } from "@/lib/language-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MonthlyAward } from "@/lib/types"
import { Trophy, Medal, Star, Crown, Users, Award, Calendar } from "lucide-react"

interface LeaderboardClientProps {
  awards: MonthlyAward[]
  currentMonth: number
  currentYear: number
}

export function LeaderboardClient({ awards, currentMonth, currentYear }: LeaderboardClientProps) {
  const { t } = useLanguage()
  const monthlyAwards = awards.filter(award => award.month === currentMonth && award.year === currentYear);
  const yearlyAwards = awards.filter(award => award.year === currentYear);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-orange-600" />
      default:
        return <Star className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-sidebar px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">{t("recognition") || "Recognition"}</Badge>
            <h1 className="text-4xl font-bold text-sidebar-foreground">{t("leaderboard") || "Leaderboard"}</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("leaderboard_desc") || "Celebrating our top performers and achievers. See who's leading this month and this year!"}
            </p>
          </div>
        </section>

        {/* Monthly Leaderboard */}
        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              {t("this_month") || "This Month"} - {monthlyAwards[0]?.name || `${currentMonth}/${currentYear}`}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {monthlyAwards.map((award, idx) => (
                <Card key={award.id} className="border-border bg-card hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getRankBadge(idx + 1)}
                        <span className="text-2xl font-bold text-foreground">{idx + 1}</span>
                      </div>
                    </div>
                    <CardTitle className="mt-4">{award.member_name}</CardTitle>
                    <CardDescription>{award.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground"><strong>{t("achievement") || "Achievement"}:</strong> {award.achievement}</p>
                      <p className="text-sm font-semibold text-primary">{award.reward}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {monthlyAwards.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                {t("no_data_yet") || "No data yet for this month"}
              </div>
            )}
          </div>
        </section>

        {/* Yearly Leaderboard */}
        <section className="px-6 py-16 lg:px-8 bg-muted/30">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              {t("this_year") || "This Year"} - {currentYear}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {yearlyAwards.map((award, idx) => (
                <Card key={award.id} className="border-border bg-card hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getRankBadge(idx + 1)}
                        <span className="text-2xl font-bold text-foreground">{idx + 1}</span>
                      </div>
                    </div>
                    <CardTitle className="mt-4">{award.member_name}</CardTitle>
                    <CardDescription>{award.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground"><strong>{t("achievement") || "Achievement"}:</strong> {award.achievement}</p>
                      <p className="text-sm font-semibold text-primary">{award.reward}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {yearlyAwards.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                {t("no_data_yet") || "No yearly data yet"}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
