"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Calendar, Users, Trash2, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { WorkshopSession, AttendanceRecord } from "@/lib/types"
import { format } from "date-fns"

export function AttendanceAdminContent() {
  const [sessions, setSessions] = useState<WorkshopSession[]>([])
  const [selectedSession, setSelectedSession] = useState<WorkshopSession | null>(null)
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    session_date: "",
    start_time: "",
    end_time: "",
    location: "",
    host_name: "",
    max_attendees: "",
  })

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    const supabase = getSupabaseBrowserClient()
    const { data } = await supabase.from("workshop_sessions").select("*").order("session_date", { ascending: false })

    if (data) setSessions(data)
    setLoading(false)
  }

  const loadAttendance = async (sessionId: string) => {
    const supabase = getSupabaseBrowserClient()
    const { data } = await supabase
      .from("attendance_records")
      .select("*")
      .eq("session_id", sessionId)
      .order("check_in_time", { ascending: true })

    if (data) setAttendance(data)
  }

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = getSupabaseBrowserClient()

    await supabase.from("workshop_sessions").insert({
      title: formData.title,
      description: formData.description || null,
      session_date: formData.session_date,
      start_time: formData.start_time || null,
      end_time: formData.end_time || null,
      location: formData.location || null,
      host_name: formData.host_name || null,
      max_attendees: formData.max_attendees ? Number.parseInt(formData.max_attendees) : null,
    })

    setShowAddDialog(false)
    setFormData({
      title: "",
      description: "",
      session_date: "",
      start_time: "",
      end_time: "",
      location: "",
      host_name: "",
      max_attendees: "",
    })
    loadSessions()
  }

  const handleDeleteSession = async (id: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return
    const supabase = getSupabaseBrowserClient()
    await supabase.from("workshop_sessions").delete().eq("id", id)
    loadSessions()
  }

  const viewAttendance = (session: WorkshopSession) => {
    setSelectedSession(session)
    loadAttendance(session.id)
    setShowAttendanceDialog(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workshop Sessions & Attendance</h1>
          <p className="text-muted-foreground">Manage workshop sessions and view attendance records</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Session
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Workshop Session</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSession} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Session Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="session_date">Date *</Label>
                  <Input
                    id="session_date"
                    type="date"
                    value={formData.session_date}
                    onChange={(e) => setFormData({ ...formData, session_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host_name">Host Name</Label>
                  <Input
                    id="host_name"
                    value={formData.host_name}
                    onChange={(e) => setFormData({ ...formData, host_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_attendees">Max Attendees</Label>
                  <Input
                    id="max_attendees"
                    type="number"
                    value={formData.max_attendees}
                    onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Create Session
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Sessions Yet</h3>
              <p className="text-muted-foreground mb-4">Create your first workshop session</p>
              <Button onClick={() => setShowAddDialog(true)}>Add Session</Button>
            </CardContent>
          </Card>
        ) : (
          sessions.map((session) => (
            <Card key={session.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{session.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(session.session_date), "PPP")}
                      {session.location && ` • ${session.location}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => viewAttendance(session)}>
                      <Eye className="h-4 w-4 mr-1" /> View Attendance
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDeleteSession(session.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      {/* Attendance Dialog */}
      <Dialog open={showAttendanceDialog} onOpenChange={setShowAttendanceDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              Attendance - {selectedSession?.title}
              <span className="text-sm font-normal text-muted-foreground ml-2">({attendance.length} attendees)</span>
            </DialogTitle>
          </DialogHeader>
          {attendance.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No attendance records yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>ATOMY ID</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Check-in Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.member_name}</TableCell>
                    <TableCell>{record.atomy_id || "-"}</TableCell>
                    <TableCell>{record.member_phone || "-"}</TableCell>
                    <TableCell>{format(new Date(record.check_in_time), "PPp")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
