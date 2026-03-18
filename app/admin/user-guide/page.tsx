"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface GuideSection {
  id: string
  title: string
  description: string
  content: string
  display_order: number
  icon?: string
}

export default function UserGuideAdmin() {
  const [sections, setSections] = useState<GuideSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    icon: "",
    display_order: 0,
  })

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data } = await supabase
        .from("user_guide_sections")
        .select("*")
        .order("display_order", { ascending: true })

      if (data) {
        setSections(data as GuideSection[])
      }
    } catch (error) {
      console.error("Error fetching sections:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.content.trim()) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const supabase = getSupabaseBrowserClient()

      const dataToSave = {
        ...formData,
        display_order: parseInt(formData.display_order.toString()) || 0,
      }

      if (editingId) {
        const { error } = await supabase
          .from("user_guide_sections")
          .update(dataToSave)
          .eq("id", editingId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from("user_guide_sections")
          .insert([dataToSave])

        if (error) throw error
      }

      fetchSections()
      setIsOpen(false)
      setEditingId(null)
      setFormData({ title: "", description: "", content: "", icon: "", display_order: 0 })
    } catch (error) {
      console.error("Error saving section:", error)
      alert("Failed to save section")
    }
  }

  const handleEdit = (section: GuideSection) => {
    setEditingId(section.id)
    setFormData({
      title: section.title,
      description: section.description,
      content: section.content,
      icon: section.icon || "",
      display_order: section.display_order,
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this guide section?")) return

    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase
        .from("user_guide_sections")
        .delete()
        .eq("id", id)

      if (error) throw error
      fetchSections()
    } catch (error) {
      console.error("Error deleting section:", error)
      alert("Failed to delete section")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Guide Sections</h1>
          <p className="text-muted-foreground mt-1">Manage user guide content displayed on the platform</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null)
            setFormData({ title: "", description: "", content: "", icon: "", display_order: sections.length })
            setIsOpen(true)
          }}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </Button>
      </div>

      {/* Form */}
      {isOpen && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Section" : "Create New Section"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Section Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Getting Started"
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon Emoji</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g., 🚀"
                  maxLength={2}
                  className="text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this section"
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Full Content *</Label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write the full guide content. Separate paragraphs with empty lines."
                className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base min-h-40"
              />
              <p className="text-xs text-muted-foreground">
                Tip: Use empty lines to separate paragraphs
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="text-base"
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {editingId ? "Update" : "Create"} Section
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

      {/* Sections List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card className="border-border">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Loading sections...</p>
            </CardContent>
          </Card>
        ) : sections.length === 0 ? (
          <Card className="border-border">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No guide sections yet. Create one to get started!</p>
            </CardContent>
          </Card>
        ) : (
          sections.map((section, index) => (
            <Card key={section.id} className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-2xl mt-1">{section.icon || "📄"}</div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <span className="text-xs bg-muted px-2 py-1 rounded">#{index + 1}</span>
                        {section.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {section.content.length} characters • Order: {section.display_order}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => handleEdit(section)}
                      variant="outline"
                      size="sm"
                      className="gap-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(section.id)}
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

      {/* Info */}
      <Card className="border-border/50 bg-primary/5">
        <CardContent className="pt-6">
          <p className="text-sm text-foreground">
            <strong>💡 Tip:</strong> These sections will be displayed on the User Guide page that new users can access to learn about the platform.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
