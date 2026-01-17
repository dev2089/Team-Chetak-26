import { Users, Mail, Linkedin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { TeamMember } from "@/lib/types"

export const metadata = {
  title: "Our Team | Team Chetak",
  description: "Meet the talented professionals behind Team Chetak",
}

export default async function TeamPage() {
  const supabase = await getSupabaseServerClient()

  const { data } = await supabase.from("team_members").select("*").eq("is_active", true).order("display_order")

  const team = (data as TeamMember[]) || []

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-muted/30 px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground">Our Team</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Meet the talented individuals who make Team Chetak exceptional. Each member brings unique skills and
                expertise to our collective success.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {team.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {team.map((member) => (
                  <Card key={member.id} className="overflow-hidden">
                    <div className="aspect-square bg-muted">
                      {member.image_url ? (
                        <img
                          src={member.image_url || "/placeholder.svg"}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Users className="h-24 w-24 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle>{member.name}</CardTitle>
                      <CardDescription className="text-primary font-medium">{member.role}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {member.bio && <p className="text-sm text-muted-foreground">{member.bio}</p>}
                      <div className="flex gap-2">
                        {member.email && (
                          <a href={`mailto:${member.email}`}>
                            <Button variant="outline" size="icon" aria-label={`Email ${member.name}`}>
                              <Mail className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                        {member.linkedin_url && (
                          <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="icon" aria-label={`${member.name}'s LinkedIn`}>
                              <Linkedin className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Users className="mx-auto h-16 w-16 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium text-foreground">No team members yet</h3>
                <p className="mt-2 text-muted-foreground">Check back soon to meet our team!</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
