import { Award, Users, TrendingUp, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { RankLevel } from "@/lib/types"

export default async function RanksPage() {
  const supabase = await getSupabaseServerClient()

  const { data: ranks } = await supabase.from("rank_levels").select("*").eq("is_active", true).order("rank_order")

  const rankLevels = (ranks as RankLevel[]) || []

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-sidebar px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold text-sidebar-foreground">ATOMY Rank System</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Understand the ATOMY ranking system and what it takes to reach each level. Progress through the ranks and
              unlock greater rewards.
            </p>
          </div>
        </section>

        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-5xl">
            {rankLevels.length > 0 ? (
              <div className="space-y-6">
                {rankLevels.map((rank, index) => (
                  <Card
                    key={rank.id}
                    className="border-border overflow-hidden"
                    style={{ borderLeftColor: rank.color || "#0ea5e9", borderLeftWidth: "4px" }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: rank.color || "#0ea5e9" }}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <CardTitle className="text-xl" style={{ color: rank.color || "#0ea5e9" }}>
                              {rank.rank_name}
                            </CardTitle>
                            <CardDescription>Level {rank.rank_order}</CardDescription>
                          </div>
                        </div>
                        <Award className="h-8 w-8" style={{ color: rank.color || "#0ea5e9" }} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-3 mb-4">
                        {rank.min_pv !== null && (
                          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">Minimum PV</p>
                              <p className="font-semibold">{rank.min_pv?.toLocaleString()}</p>
                            </div>
                          </div>
                        )}
                        {rank.min_team_members !== null && (
                          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                            <Users className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">Team Members</p>
                              <p className="font-semibold">{rank.min_team_members?.toLocaleString()}+</p>
                            </div>
                          </div>
                        )}
                      </div>
                      {rank.benefits && (
                        <div>
                          <p className="text-sm font-medium text-foreground mb-2">Benefits:</p>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            <p className="text-sm text-muted-foreground">{rank.benefits}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground">Rank Information Coming Soon</h2>
                <p className="mt-2 text-muted-foreground">
                  Detailed information about ATOMY ranks will be available here shortly.
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
