import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { MonthlyAward } from "@/lib/types"
import { LeaderboardClient } from "./client"

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

  return <LeaderboardClient awards={awards} currentMonth={currentMonth} currentYear={currentYear} />
}
