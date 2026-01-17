"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Download, FileText, FileImage, File } from "lucide-react"
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
import type { DownloadableFile } from "@/lib/types"

const fileTypes = [
  { value: "pdf", label: "PDF" },
  { value: "ppt", label: "PowerPoint" },
  { value: "doc", label: "Document" },
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
  { value: "other", label: "Other" },
]

export default function DownloadsContent() {
  const [files, setFiles] = useState<DownloadableFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFile, setEditingFile] = useState<DownloadableFile | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file_url: "",
    file_type: "pdf",
    file_size: "",
    category: "",
    is_active: true,
  })

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    const supabase = getSupabaseBrowserClient()
    const { data } = await supabase.from("downloadable_files").select("*").order("category")
    setFiles((data as DownloadableFile[]) || [])
    setIsLoading(false)
  }

  const handleSubmit = async () => {
    const supabase = getSupabaseBrowserClient()

    if (editingFile) {
      await supabase.from("downloadable_files").update(formData).eq("id", editingFile.id)
    } else {
      await supabase.from("downloadable_files").insert([formData])
    }

    setIsDialogOpen(false)
    resetForm()
    fetchFiles()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return
    const supabase = getSupabaseBrowserClient()
    await supabase.from("downloadable_files").delete().eq("id", id)
    fetchFiles()
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      file_url: "",
      file_type: "pdf",
      file_size: "",
      category: "",
      is_active: true,
    })
    setEditingFile(null)
  }

  const openEditDialog = (file: DownloadableFile) => {
    setEditingFile(file)
    setFormData({
      title: file.title,
      description: file.description || "",
      file_url: file.file_url,
      file_type: file.file_type,
      file_size: file.file_size || "",
      category: file.category || "",
      is_active: file.is_active,
    })
    setIsDialogOpen(true)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "pdf":
      case "doc":
        return FileText
      case "image":
        return FileImage
      default:
        return File
    }
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
          <h1 className="text-3xl font-bold text-foreground">Download Center</h1>
          <p className="text-muted-foreground">Manage downloadable files and resources</p>
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
              <Plus className="h-4 w-4" /> Add File
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingFile ? "Edit File" : "Add Downloadable File"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="File title"
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
              <div className="space-y-2">
                <Label>File URL *</Label>
                <Input
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>File Type *</Label>
                  <Select
                    value={formData.file_type}
                    onValueChange={(value) => setFormData({ ...formData, file_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fileTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>File Size</Label>
                  <Input
                    value={formData.file_size}
                    onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                    placeholder="e.g., 2.5 MB"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Brochures, Presentations"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Active</Label>
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
                  {editingFile ? "Update" : "Add File"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {files.length === 0 ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Download className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">No Files</h3>
            <p className="text-muted-foreground">Add downloadable resources for your team.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => {
            const Icon = getIcon(file.file_type)
            return (
              <Card key={file.id} className={`border-border ${!file.is_active ? "opacity-50" : ""}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{file.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Badge variant="outline">{file.file_type.toUpperCase()}</Badge>
                        {file.file_size && <span>{file.file_size}</span>}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {file.description && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{file.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mb-3">{file.download_count} downloads</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(file)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive bg-transparent"
                      onClick={() => handleDelete(file.id)}
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
