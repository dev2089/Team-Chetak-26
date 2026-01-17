"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Star } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Testimonial } from "@/lib/types"

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState({
    author_name: "",
    author_role: "",
    author_company: "",
    author_image_url: "",
    content: "",
    rating: "5",
    is_featured: false,
    is_active: true,
  })

  const fetchTestimonials = async () => {
    const supabase = getSupabaseBrowserClient()
    const { data } = await supabase.from("testimonials").select("*").order("display_order")
    setTestimonials((data as Testimonial[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const resetForm = () => {
    setFormData({
      author_name: "",
      author_role: "",
      author_company: "",
      author_image_url: "",
      content: "",
      rating: "5",
      is_featured: false,
      is_active: true,
    })
    setEditingItem(null)
  }

  const openEditDialog = (item: Testimonial) => {
    setEditingItem(item)
    setFormData({
      author_name: item.author_name,
      author_role: item.author_role || "",
      author_company: item.author_company || "",
      author_image_url: item.author_image_url || "",
      content: item.content,
      rating: String(item.rating || 5),
      is_featured: item.is_featured,
      is_active: item.is_active,
    })
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = getSupabaseBrowserClient()
    const payload = { ...formData, rating: Number.parseInt(formData.rating) }

    if (editingItem) {
      await supabase
        .from("testimonials")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", editingItem.id)
    } else {
      const maxOrder = testimonials.length > 0 ? Math.max(...testimonials.map((t) => t.display_order)) : 0
      await supabase.from("testimonials").insert([{ ...payload, display_order: maxOrder + 1 }])
    }

    setDialogOpen(false)
    resetForm()
    fetchTestimonials()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const supabase = getSupabaseBrowserClient()
    await supabase.from("testimonials").delete().eq("id", deleteId)
    setDeleteId(null)
    fetchTestimonials()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Testimonials</h1>
          <p className="text-muted-foreground mt-1">Manage client testimonials</p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
              <DialogDescription>Enter testimonial details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="author_name">Name *</Label>
                <Input
                  id="author_name"
                  required
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="author_role">Role/Title</Label>
                  <Input
                    id="author_role"
                    value={formData.author_role}
                    onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author_company">Company</Label>
                  <Input
                    id="author_company"
                    value={formData.author_company}
                    onChange={(e) => setFormData({ ...formData, author_company: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="author_image_url">Photo URL</Label>
                <Input
                  id="author_image_url"
                  type="url"
                  value={formData.author_image_url}
                  onChange={(e) => setFormData({ ...formData, author_image_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Testimonial *</Label>
                <Textarea
                  id="content"
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Select value={formData.rating} onValueChange={(value) => setFormData({ ...formData, rating: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} Star{n !== 1 && "s"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingItem ? "Update" : "Add"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardContent className="h-32 animate-pulse bg-muted" />
            </Card>
          ))}
        </div>
      ) : testimonials.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {testimonials.map((item) => (
            <Card key={item.id} className={!item.is_active ? "opacity-60" : ""}>
              <CardContent className="p-4">
                <div className="flex justify-between gap-2 mb-3">
                  <div className="flex gap-1 text-yellow-500">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditDialog(item)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic line-clamp-3">"{item.content}"</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="font-medium text-sm">{item.author_name}</div>
                  {(item.author_role || item.author_company) && (
                    <span className="text-xs text-muted-foreground">
                      {item.author_role}
                      {item.author_role && item.author_company && ", "}
                      {item.author_company}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  {item.is_featured && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Featured</span>
                  )}
                  {!item.is_active && <span className="text-xs bg-muted px-2 py-0.5 rounded">Inactive</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <Star className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 font-medium text-foreground">No testimonials yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Add your first testimonial</p>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
