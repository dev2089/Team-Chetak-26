import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { MonthlyAward } from "@/lib/types"
import { Trophy, Medal, Star, Crown, Users, Award, Calendar } from "lucide-react"

export const metadata = {
  title: "Leaderboard & Recognition | Team Chetak ATOMY",
  description: "Celebrating our top performers - monthly and yearly awards for Team Chetak members",
}

export default async function LeaderboardPage() {
  const supabase = await getSupabaseServerClient()

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const { data } = await supabase
    .from("monthly_awards")
    .select("*")
    .eq("is_active", true)
    .order("year", { ascending: false })
    .order("month", { ascending: false })

  const awards = (data as MonthlyAward[]) || []

  // Group by month/year
  const grouped = awards.reduce(
    (acc, award) => {
      const key = `${award.year}-${award.month}`
      if (!acc[key]) acc[key] = []
      acc[key].push(award)
      return acc
    },
    {} as Record<string, MonthlyAward[]>,
  )

  const getAwardIcon = (type: string) => {
    const lower = type.toLowerCase()
    if (lower.includes("leader") && lower.includes("year")) return Crown
    if (lower.includes("leader")) return Trophy
    if (lower.includes("trainer")) return Users
    if (lower.includes("consumer")) return Star
    if (lower.includes("distributor")) return Medal
    return Award
  }

  const getAwardColor = (type: string) => {
    const lower = type.toLowerCase()
    if (lower.includes("leader") && lower.includes("year"))
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
    if (lower.includes("leader")) return "bg-primary/10 text-primary border-primary/30"
    if (lower.includes("trainer")) return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
    if (lower.includes("consumer")) return "bg-pink-500/10 text-pink-500 border-pink-500/30"
    if (lower.includes("distributor")) return "bg-orange-500/10 text-orange-500 border-orange-500/30"
    return "bg-muted text-muted-foreground"
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const awardTypes = [
    "Best Leader Of The Month",
    "Best Trainer Of The Month",
    "Best Consumer Of The Month",
    "Best Distributor Of The Month",
    "Best Leader Of The Year",
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-sidebar px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
              <Trophy className="h-3 w-3 mr-1" /> Recognition
            </Badge>
            <h1 className="text-4xl font-bold text-sidebar-foreground sm:text-5xl">Leaderboard & Awards</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Celebrating excellence in Team Chetak ATOMY - our top performers who inspire us all
            </p>
          </div>
        </section>

        {/* Award Categories */}
        <section className="px-6 py-12 lg:px-8 bg-muted/30">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {awardTypes.map((type) => {
                const Icon = getAwardIcon(type)
                return (
                  <Card key={type} className={`border ${getAwardColor(type)} text-center`}>
                    <CardContent className="pt-6">
                      <Icon className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">{type}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Awards by Month */}
        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {Object.keys(grouped).length > 0 ? (
              <div className="space-y-12">
                {Object.entries(grouped).map(([key, monthAwards]) => {
                  const [year, month] = key.split("-").map(Number)
                  const isCurrentMonth = month === currentMonth && year === currentYear
                  return (
                    <div key={key}>
                      <div className="flex items-center gap-3 mb-6">
                        <Calendar className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold text-foreground">
                          {monthNames[month - 1]} {year}
                        </h2>
                        {isCurrentMonth && <Badge className="bg-primary/10 text-primary">Current Month</Badge>}
                      </div>
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {monthAwards.map((award) => {
                          const Icon = getAwardIcon(award.award_type)
                          return (
                            <Card key={award.id} className="border-border overflow-hidden">
                              <div className={`h-2 ${getAwardColor(award.award_type)}`}></div>
                              <CardHeader className="text-center">
                                <div className={`mx-auto p-3 rounded-full w-fit ${getAwardColor(award.award_type)}`}>
                                  <Icon className="h-8 w-8" />
                                </div>
                                <CardTitle className="text-lg">{award.member_name}</CardTitle>
                                <CardDescription>{award.award_type}</CardDescription>
                              </CardHeader>
                              {(award.member_atomy_id || award.achievement) && (
                                <CardContent className="text-center">
                                  {award.member_atomy_id && (
                                    <p className="text-xs text-muted-foreground">ID: {award.member_atomy_id}</p>
                                  )}
                                  {award.achievement && (
                                    <p className="text-sm text-muted-foreground mt-1">{award.achievement}</p>
                                  )}
                                </CardContent>
                              )}
                            </Card>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <Trophy className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground">No Awards Yet</h3>
                <p className="text-muted-foreground mt-2">Monthly awards will be announced here. Check back soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* Motivation */}
        <section className="bg-sidebar px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-sidebar-foreground">Want to be on the Leaderboard?</h2>
            <p className="mt-4 text-muted-foreground">
              Work hard, stay consistent, and you could be our next Best Leader, Trainer, Consumer, or Distributor of
              the Month!
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/join"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Join Team Chetak
              </a>
              <a
                href="/income"
                className="inline-flex items-center gap-2 rounded-lg border border-sidebar-border px-6 py-3 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              >
                View Income Sources
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
