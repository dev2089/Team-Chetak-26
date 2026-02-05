import { Calendar, MapPin, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { Event } from "@/lib/types"

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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-muted/30 px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground">Events</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Stay connected with our team through meetings, workshops, and activities.
              </p>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-bold text-foreground mb-8">Upcoming Events</h2>
            {upcoming.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Upcoming</Badge>
                      </div>
                      <CardTitle className="mt-2">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.start_date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {new Date(event.start_date).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                        {event.end_date && (
                          <>
                            {" - "}
                            {new Date(event.end_date).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </>
                        )}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      )}
                      {event.description && <p className="text-sm text-muted-foreground pt-2">{event.description}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium text-foreground">No upcoming events</h3>
                <p className="mt-2 text-muted-foreground">Check back soon for new events!</p>
              </div>
            )}
          </div>
        </section>

        {/* Past Events */}
        {past.length > 0 && (
          <section className="bg-muted/30 px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-2xl font-bold text-foreground mb-8">Past Events</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {past.map((event) => (
                  <Card key={event.id} className="opacity-75">
                    <CardHeader>
                      <Badge variant="secondary">Past</Badge>
                      <CardTitle className="mt-2">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.start_date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
