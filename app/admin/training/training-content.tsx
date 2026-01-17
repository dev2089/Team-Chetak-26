"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, BookOpen, Play, FileText, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { TrainingResource } from "@/lib/types"

const resourceTypes = [
  { value: "video", label: "Video", icon: Play },
  { value: "pdf", label: "PDF", icon: FileText },
  { value: "article", label: "Article", icon: BookOpen },
  { value: "link", label: "External Link", icon: LinkIcon },
]

export default function TrainingContent() {
  const [resources, setResources] = useState<TrainingResource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<TrainingResource | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    resource_type: "video",
    url: "",
    thumbnail_url: "",
    category: "",
    duration: "",
    is_featured: false,
    is_active: true,
    display_order: 0,
  })

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    const supabase = getSupabaseBrowserClient()
    const { data } = await supabase.from("training_resources").select("*").order("display_order")
    setResources((data as TrainingResource[]) || [])
    setIsLoading(false)
  }

  const handleSubmit = async () => {
    const supabase = getSupabaseBrowserClient()

    if (editingResource) {
      await supabase.from("training_resources").update(formData).eq("id", editingResource.id)
    } else {
      await supabase.from("training_resources").insert([formData])
    }

    setIsDialogOpen(false)
    resetForm()
    fetchResources()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return
    const supabase = getSupabaseBrowserClient()
    await supabase.from("training_resources").delete().eq("id", id)
    fetchResources()
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      resource_type: "video",
      url: "",
      thumbnail_url: "",
      category: "",
      duration: "",
      is_featured: false,
      is_active: true,
      display_order: 0,
    })
    setEditingResource(null)
  }

  const openEditDialog = (resource: TrainingResource) => {
    setEditingResource(resource)
    setFormData({
      title: resource.title,
      description: resource.description || "",
      resource_type: resource.resource_type,
      url: resource.url,
      thumbnail_url: resource.thumbnail_url || "",
      category: resource.category || "",
      duration: resource.duration || "",
      is_featured: resource.is_featured,
      is_active: resource.is_active,
      display_order: resource.display_order,
    })
    setIsDialogOpen(true)
  }

  const getIcon = (type: string) => {
    const found = resourceTypes.find((t) => t.value === type)
    return found ? found.icon : BookOpen
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Training Resources</h1>
          <p className="text-muted-foreground">Manage videos, PDFs, and learning materials</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" /> Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingResource ? "Edit Resource" : "Add Training Resource"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Resource title"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description..."
                  rows={3}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select
                    value={formData.resource_type}
                    onValueChange={(value) => setFormData({ ...formData, resource_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Beginner, Advanced"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Resource URL *</Label>
                <Input
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Thumbnail URL</Label>
                <Input
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 15 mins"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label>Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label>Active</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                  {editingResource ? "Update" : "Add Resource"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {resources.length === 0 ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">No Training Resources</h3>
            <p className="text-muted-foreground">Add videos, PDFs, and other learning materials.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => {
            const Icon = getIcon(resource.resource_type)
            return (
              <Card key={resource.id} className={`border-border ${!resource.is_active ? "opacity-50" : ""}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <Badge variant="outline">{resource.resource_type.toUpperCase()}</Badge>
                      {resource.is_featured && <Badge className="bg-yellow-500">Featured</Badge>}
                    </div>
                  </div>
                  <CardTitle className="text-base mt-2">{resource.title}</CardTitle>
                  {resource.category && <CardDescription>{resource.category}</CardDescription>}
                </CardHeader>
                <CardContent>
                  {resource.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{resource.description}</p>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(resource)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive bg-transparent"
                      onClick={() => handleDelete(resource.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
