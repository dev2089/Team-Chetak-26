import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { IncomeSource } from "@/lib/types"
import { IncomePageClient } from "./client"

export const metadata = {
  title: "14 Income Sources | Team Chetak ATOMY",
  description: "Discover 14 ways to earn with Team Chetak ATOMY - from bonuses to yearly trips",
}

export default async function IncomePage() {
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase.from("income_sources").select("*").eq("is_active", true).order("display_order")

  const incomeSources = (data as IncomeSource[]) || []

  return <IncomePageClient incomeSources={incomeSources} />
}
