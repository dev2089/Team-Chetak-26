"use client"

import { useLanguage } from "@/lib/language-context"
import { Calendar, MapPin, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Event } from "@/lib/types"

interface EventsPageClientProps {
  upcoming: Event[]
  past: Event[]
}

export function EventsPageClient({ upcoming, past }: EventsPageClientProps) {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-muted/30 px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground">{t("events") || "Events"}</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("events_desc") || "Stay connected with our team through meetings, workshops, and activities."}
              </p>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-bold text-foreground mb-8">{t("upcoming_events") || "Upcoming Events"}</h2>
            {upcoming.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{t("upcoming") || "Upcoming"}</Badge>
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
                <h3 className="mt-4 text-lg font-medium text-foreground">{t("no_upcoming_events") || "No upcoming events"}</h3>
                <p className="mt-2 text-muted-foreground">{t("check_back_soon") || "Check back soon for new events!"}</p>
              </div>
            )}
          </div>
        </section>

        {/* Past Events */}
        {past.length > 0 && (
          <section className="bg-muted/30 px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-2xl font-bold text-foreground mb-8">{t("past_events") || "Past Events"}</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {past.map((event) => (
                  <Card key={event.id} className="opacity-75">
                    <CardHeader>
                      <Badge variant="secondary">{t("past") || "Past"}</Badge>
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
