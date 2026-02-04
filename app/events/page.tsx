import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { Event } from "@/lib/types"
import { EventsPageClient } from "./client"

export const metadata = {
  title: "Events | Team Chetak",
  description: "Upcoming events and activities from Team Chetak",
}

export default async function EventsPage() {
  const supabase = await getSupabaseServerClient()
  const now = new Date().toISOString()

  const [upcomingResult, pastResult] = await Promise.all([
    supabase.from("events").select("*").eq("is_published", true).gte("start_date", now).order("start_date"),
    supabase
      .from("events")
      .select("*")
      .eq("is_published", true)
      .lt("start_date", now)
      .order("start_date", { ascending: false })
      .limit(6),
  ])

  const upcoming = (upcomingResult.data as Event[]) || []
  const past = (pastResult.data as Event[]) || []

  return <EventsPageClient upcoming={upcoming} past={past} />
}
