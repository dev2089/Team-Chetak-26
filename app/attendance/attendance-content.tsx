"use client"

import { useLanguage } from "@/lib/language-context"
import type React from "react"

import { useState, useEffect } from "react"
import { ClipboardCheck, Calendar, MapPin, Clock, User, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { WorkshopSession } from "@/lib/types"
import { format } from "date-fns"

export function AttendanceContent() {
  const [sessions, setSessions] = useState<WorkshopSession[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState<WorkshopSession | null>(null)
  const [formData, setFormData] = useState({
    member_name: "",
    member_email: "",
    member_phone: "",
    atomy_id: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    const supabase = getSupabaseBrowserClient()
    const today = new Date().toISOString().split("T")[0]
    const { data } = await supabase
      .from("workshop_sessions")
      .select("*")
      .gte("session_date", today)
      .eq("is_active", true)
      .order("session_date", { ascending: true })

    if (data) setSessions(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSession || !formData.member_name) return

    setSubmitting(true)
    const supabase = getSupabaseBrowserClient()

    const { error } = await supabase.from("attendance_records").insert({
      session_id: selectedSession.id,
      member_name: formData.member_name,
      member_email: formData.member_email || null,
      member_phone: formData.member_phone || null,
      atomy_id: formData.atomy_id || null,
      status: "present",
    })

    if (!error) {
      setSuccess(true)
      setFormData({ member_name: "", member_email: "", member_phone: "", atomy_id: "" })
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <ClipboardCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Mark Attendance</h1>
          <p className="text-lg text-muted-foreground">Select a workshop/session and mark your attendance</p>
        </div>

        {success && (
          <Card className="mb-8 border-green-500 bg-green-500/10">
            <CardContent className="flex items-center gap-4 py-6">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-semibold text-green-500">Attendance Marked Successfully!</h3>
                <p className="text-sm text-muted-foreground">
                  Thank you for attending. Your attendance has been recorded.
                </p>
              </div>
              <Button
                variant="outline"
                className="ml-auto bg-transparent"
                onClick={() => {
                  setSuccess(false)
                  setSelectedSession(null)
                }}
              >
                Mark Another
              </Button>
            </CardContent>
          </Card>
        )}

        {!success && (
          <>
            {sessions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Upcoming Sessions</h3>
                  <p className="text-muted-foreground">
                    There are no workshops or training sessions scheduled at the moment.
                  </p>
                </CardContent>
              </Card>
            ) : !selectedSession ? (
              <div className="grid gap-4">
                <h2 className="text-xl font-semibold">Select a Session</h2>
                {sessions.map((session) => (
                  <Card
                    key={session.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setSelectedSession(session)}
                  >
                    <CardContent className="py-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{session.title}</h3>
                          {session.description && (
                            <p className="text-sm text-muted-foreground mb-3">{session.description}</p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(session.session_date), "PPP")}
                            </span>
                            {session.start_time && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {session.start_time}
                                {session.end_time && ` - ${session.end_time}`}
                              </span>
                            )}
                            {session.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {session.location}
                              </span>
                            )}
                            {session.host_name && (
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {session.host_name}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button>Select</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedSession.title}</CardTitle>
                  <CardDescription>
                    {format(new Date(selectedSession.session_date), "PPP")}
                    {selectedSession.location && ` • ${selectedSession.location}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="member_name">Full Name *</Label>
                        <Input
                          id="member_name"
                          value={formData.member_name}
                          onChange={(e) => setFormData({ ...formData, member_name: e.target.value })}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="atomy_id">ATOMY ID</Label>
                        <Input
                          id="atomy_id"
                          value={formData.atomy_id}
                          onChange={(e) => setFormData({ ...formData, atomy_id: e.target.value })}
                          placeholder="Enter your ATOMY ID"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="member_email">Email</Label>
                        <Input
                          id="member_email"
                          type="email"
                          value={formData.member_email}
                          onChange={(e) => setFormData({ ...formData, member_email: e.target.value })}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="member_phone">Phone Number</Label>
                        <Input
                          id="member_phone"
                          value={formData.member_phone}
                          onChange={(e) => setFormData({ ...formData, member_phone: e.target.value })}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => setSelectedSession(null)}>
                        Back
                      </Button>
                      <Button type="submit" disabled={submitting || !formData.member_name}>
                        {submitting ? "Marking..." : "Mark Attendance"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
