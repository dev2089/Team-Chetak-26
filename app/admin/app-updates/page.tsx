"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface AppUpdate {
  id: string
  title: string
  description: string
  image_url?: string
  is_active: boolean
  created_at: string
}

export default function AppUpdatesAdmin() {
  const [updates, setUpdates] = useState<AppUpdate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    is_active: true,
  })

  useEffect(() => {
    fetchUpdates()
  }, [])

  const fetchUpdates = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data } = await supabase
        .from("app_updates")
        .select("*")
        .order("created_at", { ascending: false })

      if (data) {
        setUpdates(data as AppUpdate[])
      }
    } catch (error) {
      console.error("Error fetching updates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const supabase = getSupabaseBrowserClient()

      if (editingId) {
        const { error } = await supabase
          .from("app_updates")
          .update(formData)
          .eq("id", editingId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from("app_updates")
          .insert([formData])

        if (error) throw error
      }

      fetchUpdates()
      setIsOpen(false)
      setEditingId(null)
      setFormData({ title: "", description: "", image_url: "", is_active: true })
    } catch (error) {
      console.error("Error saving update:", error)
      alert("Failed to save update")
    }
  }

  const handleEdit = (update: AppUpdate) => {
    setEditingId(update.id)
    setFormData({
      title: update.title,
      description: update.description,
      image_url: update.image_url || "",
      is_active: update.is_active,
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this update?")) return

    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase
        .from("app_updates")
        .delete()
        .eq("id", id)

      if (error) throw error
      fetchUpdates()
    } catch (error) {
      console.error("Error deleting update:", error)
      alert("Failed to delete update")
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase
        .from("app_updates")
        .update({ is_active: !currentStatus })
        .eq("id", id)

      if (error) throw error
      fetchUpdates()
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">App Updates</h1>
          <p className="text-muted-foreground mt-1">Manage app update notifications shown to users</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null)
            setFormData({ title: "", description: "", image_url: "", is_active: true })
            setIsOpen(true)
          }}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Add Update
        </Button>
      </div>

      {/* Form */}
      {isOpen && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Update" : "Create New Update"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., New Feature Released"
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the update details"
                className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base min-h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL (Optional)</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.png"
                type="url"
                className="text-base"
              />
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="Update preview"
                  className="w-full h-32 object-cover rounded-lg mt-2"
                />
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 cursor-pointer"
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Active (Show to users)
              </Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {editingId ? "Update" : "Create"} Update
              </Button>
              <Button
                onClick={() => {
                  setIsOpen(false)
                  setEditingId(null)
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Updates List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card className="border-border">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Loading updates...</p>
            </CardContent>
          </Card>
        ) : updates.length === 0 ? (
          <Card className="border-border">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No updates yet. Create one to get started!</p>
            </CardContent>
          </Card>
        ) : (
          updates.map((update) => (
            <Card key={update.id} className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">{update.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        update.is_active
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}>
                        {update.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{update.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(update.created_at).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => handleToggleActive(update.id, update.is_active)}
                      variant="outline"
                      size="sm"
                      className="gap-1"
                    >
                      {update.is_active ? (
                        <>
                          <Eye className="w-4 h-4" />
                          Hide
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Show
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleEdit(update)}
                      variant="outline"
                      size="sm"
                      className="gap-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(update.id)}
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
