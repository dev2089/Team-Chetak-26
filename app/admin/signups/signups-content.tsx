"use client"

import { useState, useEffect } from "react"
import { UserPlus, CheckCircle, Trash2, Mail, Phone, Calendar, Hash, Search, UserCheck } from "lucide-react"
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
  const [addingToDirectory, setAddingToDirectory] = useState<string | null>(null)

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

  const addToDirectory = async (signup: UserSignup) => {
    setAddingToDirectory(signup.id)
    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.from("member_directory").insert({
        full_name: signup.full_name,
        job_title: signup.job_title || null,
        department: signup.department || null,
        rank: signup.rank || null,
        email: signup.email,
        phone: signup.phone || null,
        atomy_id: signup.atomy_id || null,
        image_url: signup.image_url || null,
        linkedin_url: signup.linkedin_url || null,
        bio: signup.bio || null,
        is_active: true,
        display_order: 0,
      })

      if (error) throw error

      // Mark as reviewed after adding to directory
      await supabase.from("user_signups").update({ is_reviewed: true }).eq("id", signup.id)
      fetchSignups()
      alert("Successfully added to member directory!")
    } catch (err) {
      console.error("Error adding to directory:", err)
      alert("Failed to add to directory. Please try again.")
    } finally {
      setAddingToDirectory(null)
    }
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
                  <div className="space-y-3 flex-1">
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

                    {/* Expanded Profile Information */}
                    {(signup.job_title || signup.department || signup.rank || signup.bio || signup.image_url || signup.linkedin_url) && (
                      <div className="border-t border-border pt-4 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {signup.job_title && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase">Job Title</p>
                            <p className="text-foreground">{signup.job_title}</p>
                          </div>
                        )}
                        {signup.department && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase">Department</p>
                            <p className="text-foreground">{signup.department}</p>
                          </div>
                        )}
                        {signup.rank && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase">Rank</p>
                            <p className="text-foreground">{signup.rank}</p>
                          </div>
                        )}
                        {signup.bio && (
                          <div className="sm:col-span-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase">Bio</p>
                            <p className="text-foreground line-clamp-2">{signup.bio}</p>
                          </div>
                        )}
                        {signup.image_url && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase">Image URL</p>
                            <a href={signup.image_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all text-xs">
                              View Image
                            </a>
                          </div>
                        )}
                        {signup.linkedin_url && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase">LinkedIn</p>
                            <a href={signup.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all text-xs">
                              LinkedIn Profile
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      size="sm"
                      onClick={() => addToDirectory(signup)}
                      disabled={addingToDirectory === signup.id}
                      className="gap-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <UserCheck className="h-4 w-4" />
                      {addingToDirectory === signup.id ? "Adding..." : "Add to Directory"}
                    </Button>
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
