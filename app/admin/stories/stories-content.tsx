"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { SuccessStory } from "@/lib/types"

export default function StoriesContent() {
  const [stories, setStories] = useState<SuccessStory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null)
  const [formData, setFormData] = useState({
    member_name: "",
    member_image_url: "",
    member_atomy_id: "",
    previous_occupation: "",
    current_rank: "",
    story_title: "",
    story_content: "",
    monthly_income: "",
    join_date: "",
    is_featured: false,
    is_active: true,
  })

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    const supabase = getSupabaseBrowserClient()
    const { data } = await supabase.from("success_stories").select("*").order("is_featured", { ascending: false })
    setStories((data as SuccessStory[]) || [])
    setIsLoading(false)
  }

  const handleSubmit = async () => {
    const supabase = getSupabaseBrowserClient()
    const dataToSave = {
      ...formData,
      join_date: formData.join_date || null,
    }

    if (editingStory) {
      await supabase.from("success_stories").update(dataToSave).eq("id", editingStory.id)
    } else {
      await supabase.from("success_stories").insert([dataToSave])
    }

    setIsDialogOpen(false)
    resetForm()
    fetchStories()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this success story?")) return
    const supabase = getSupabaseBrowserClient()
    await supabase.from("success_stories").delete().eq("id", id)
    fetchStories()
  }

  const resetForm = () => {
    setFormData({
      member_name: "",
      member_image_url: "",
      member_atomy_id: "",
      previous_occupation: "",
      current_rank: "",
      story_title: "",
      story_content: "",
      monthly_income: "",
      join_date: "",
      is_featured: false,
      is_active: true,
    })
    setEditingStory(null)
  }

  const openEditDialog = (story: SuccessStory) => {
    setEditingStory(story)
    setFormData({
      member_name: story.member_name,
      member_image_url: story.member_image_url || "",
      member_atomy_id: story.member_atomy_id || "",
      previous_occupation: story.previous_occupation || "",
      current_rank: story.current_rank || "",
      story_title: story.story_title,
      story_content: story.story_content,
      monthly_income: story.monthly_income || "",
      join_date: story.join_date || "",
      is_featured: story.is_featured,
      is_active: story.is_active,
    })
    setIsDialogOpen(true)
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
          <h1 className="text-3xl font-bold text-foreground">Success Stories</h1>
          <p className="text-muted-foreground">Manage member success stories and testimonials</p>
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
              <Plus className="h-4 w-4" /> Add Story
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStory ? "Edit Success Story" : "Add Success Story"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Member Name *</Label>
                  <Input
                    value={formData.member_name}
                    onChange={(e) => setFormData({ ...formData, member_name: e.target.value })}
                    placeholder="Full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>ATOMY ID</Label>
                  <Input
                    value={formData.member_atomy_id}
                    onChange={(e) => setFormData({ ...formData, member_atomy_id: e.target.value })}
                    placeholder="Member ID"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Member Photo URL</Label>
                <Input
                  value={formData.member_image_url}
                  onChange={(e) => setFormData({ ...formData, member_image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Previous Occupation</Label>
                  <Input
                    value={formData.previous_occupation}
                    onChange={(e) => setFormData({ ...formData, previous_occupation: e.target.value })}
                    placeholder="e.g., Teacher, Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Current Rank</Label>
                  <Input
                    value={formData.current_rank}
                    onChange={(e) => setFormData({ ...formData, current_rank: e.target.value })}
                    placeholder="e.g., Diamond Master"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Monthly Income</Label>
                  <Input
                    value={formData.monthly_income}
                    onChange={(e) => setFormData({ ...formData, monthly_income: e.target.value })}
                    placeholder="e.g., ₹50,000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Join Date</Label>
                  <Input
                    type="date"
                    value={formData.join_date}
                    onChange={(e) => setFormData({ ...formData, join_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Story Title *</Label>
                <Input
                  value={formData.story_title}
                  onChange={(e) => setFormData({ ...formData, story_title: e.target.value })}
                  placeholder="e.g., From Housewife to Diamond Master"
                />
              </div>
              <div className="space-y-2">
                <Label>Story Content *</Label>
                <Textarea
                  value={formData.story_content}
                  onChange={(e) => setFormData({ ...formData, story_content: e.target.value })}
                  placeholder="Share their inspiring journey..."
                  rows={5}
                />
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
              <div className="flex justify-end gap-2">
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
                  {editingStory ? "Update" : "Add Story"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {stories.length === 0 ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Quote className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">No Success Stories</h3>
            <p className="text-muted-foreground">Share inspiring stories from your team members.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {stories.map((story) => (
            <Card key={story.id} className={`border-border ${!story.is_active ? "opacity-50" : ""}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                  {story.member_image_url ? (
                    <img
                      src={story.member_image_url || "/placeholder.svg"}
                      alt={story.member_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{story.member_name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {story.member_name}
                      {story.is_featured && <Badge className="bg-yellow-500">Featured</Badge>}
                    </CardTitle>
                    <CardDescription>
                      {story.current_rank && <span>{story.current_rank}</span>}
                      {story.monthly_income && <span> • {story.monthly_income}/month</span>}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-foreground text-sm mb-1">{story.story_title}</p>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{story.story_content}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(story)}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive bg-transparent"
                    onClick={() => handleDelete(story.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
