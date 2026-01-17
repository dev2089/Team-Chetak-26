"use client"

import { useState, useEffect } from "react"
import { UserPlus, CheckCircle, Trash2, Mail, Phone, Calendar, Hash, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { UserSignup } from "@/lib/types"

export function SignupsContent() {
  const [signups, setSignups] = useState<UserSignup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchSignups = async () => {
    const supabase = getSupabaseBrowserClient()
    const { data } = await supabase.from("user_signups").select("*").order("created_at", { ascending: false })
    setSignups((data as UserSignup[]) || [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchSignups()
  }, [])

  const markAsReviewed = async (id: string) => {
    const supabase = getSupabaseBrowserClient()
    await supabase.from("user_signups").update({ is_reviewed: true }).eq("id", id)
    fetchSignups()
  }

  const deleteSignup = async (id: string) => {
    if (!confirm("Are you sure you want to delete this signup?")) return
    const supabase = getSupabaseBrowserClient()
    await supabase.from("user_signups").delete().eq("id", id)
    fetchSignups()
  }

  const filteredSignups = signups.filter(
    (signup) =>
      signup.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      signup.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (signup.atomy_id && signup.atomy_id.includes(searchTerm)),
  )

  const newSignupsCount = signups.filter((s) => !s.is_reviewed).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading signups...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Member Signups</h1>
          <p className="text-muted-foreground mt-1">
            {newSignupsCount > 0 ? (
              <span className="text-primary">
                {newSignupsCount} new signup{newSignupsCount > 1 ? "s" : ""} to review
              </span>
            ) : (
              "All signups have been reviewed"
            )}
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredSignups.length === 0 ? (
        <Card className="border-border">
          <CardContent className="pt-6 text-center">
            <UserPlus className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No signups found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredSignups.map((signup) => (
            <Card
              key={signup.id}
              className={`border-border ${!signup.is_reviewed ? "border-l-4 border-l-primary" : ""}`}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-foreground">{signup.full_name}</h3>
                      {!signup.is_reviewed && (
                        <Badge variant="default" className="bg-primary">
                          New
                        </Badge>
                      )}
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${signup.email}`} className="hover:text-primary">
                          {signup.email}
                        </a>
                      </div>
                      {signup.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <a href={`tel:+91${signup.phone}`} className="hover:text-primary">
                            +91 {signup.phone}
                          </a>
                        </div>
                      )}
                      {signup.atomy_id && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Hash className="h-4 w-4" />
                          ATOMY ID: {signup.atomy_id}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(signup.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!signup.is_reviewed && (
                      <Button variant="outline" size="sm" onClick={() => markAsReviewed(signup.id)} className="gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Mark Reviewed
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSignup(signup.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
