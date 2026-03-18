"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { TeamMember } from "@/lib/types"

export default function AdminMemberDirectoryPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    image_url: "",
    bio: "",
    linkedin_url: "",
    is_active: true,
  })
  const [submitting, setSubmitting] = useState(false)

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true })

      if (error) throw error
      setMembers(data || [])
    } catch (error) {
      console.error("Error fetching members:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      email: "",
      image_url: "",
      bio: "",
      linkedin_url: "",
      is_active: true,
    })
    setEditingMember(null)
  }

  const handleOpenDialog = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member)
      setFormData({
        name: member.name,
        role: member.role || "",
        email: member.email || "",
        image_url: member.image_url || "",
        bio: member.bio || "",
        linkedin_url: member.linkedin_url || "",
        is_active: member.is_active,
      })
    } else {
      resetForm()
    }
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingMember) {
        const { error } = await supabase
          .from("team_members")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingMember.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from("team_members")
          .insert([
            {
              ...formData,
              display_order: members.length + 1,
            },
          ])

        if (error) throw error
      }

      await fetchMembers()
      setDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving member:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", deleteId)

      if (error) throw error
      await fetchMembers()
      setDeleteId(null)
    } catch (error) {
      console.error("Error deleting member:", error)
    }
  }

  const handleToggleActive = async (member: DirectoryMember) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .update({ is_active: !member.is_active })
        .eq("id", member.id)

      if (error) throw error
      await fetchMembers()
    } catch (error) {
      console.error("Error updating member:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Members Directory</h1>
          <p className="text-muted-foreground">Manage all organization members</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" /> Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingMember ? "Edit Member" : "Add New Member"}</DialogTitle>
              <DialogDescription>
                {editingMember
                  ? "Update the member's information"
                  : "Add a new member to the directory"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role / Position</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Area Manager"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  <Input
                    id="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Member bio or description"
                  rows={4}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Saving..." : "Save Member"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading members...</p>
          </CardContent>
        </Card>
      ) : members.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No members yet. Add one to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {members.map((member) => (
            <Card key={member.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    {member.image_url && (
                      <img
                        src={member.image_url || "/placeholder.svg"}
                        alt={member.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{member.name}</h3>
                      {member.role && <p className="text-sm text-muted-foreground">{member.role}</p>}
                      {member.email && <p className="text-xs text-muted-foreground">{member.email}</p>}
                      {member.bio && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{member.bio}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={member.is_active}
                      onCheckedChange={() => handleToggleActive(member)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(member)}
                      className="gap-1"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(member.id)}
                        className="gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Member</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {member.name}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
