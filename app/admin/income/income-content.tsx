"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { IncomeSource } from "@/lib/types"

const categories = ["Bonus", "Incentive", "Sales", "Commission", "Referral", "Training", "Program", "Award", "Trip"]

export function IncomeContent() {
  const [sources, setSources] = useState<IncomeSource[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSource, setEditingSource] = useState<IncomeSource | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    is_active: true,
  })

  const supabase = getSupabaseBrowserClient()

  const fetchSources = async () => {
    const { data } = await supabase.from("income_sources").select("*").order("display_order")
    setSources((data as IncomeSource[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchSources()
  }, [])

  const openDialog = (source?: IncomeSource) => {
    if (source) {
      setEditingSource(source)
      setFormData({
        name: source.name,
        description: source.description || "",
        category: source.category || "",
        is_active: source.is_active,
      })
    } else {
      setEditingSource(null)
      setFormData({ name: "", description: "", category: "", is_active: true })
    }
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (editingSource) {
      await supabase
        .from("income_sources")
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq("id", editingSource.id)
    } else {
      const maxOrder = Math.max(...sources.map((s) => s.display_order), 0)
      await supabase.from("income_sources").insert({ ...formData, display_order: maxOrder + 1 })
    }
    setDialogOpen(false)
    fetchSources()
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this income source?")) {
      await supabase.from("income_sources").delete().eq("id", id)
      fetchSources()
    }
  }

  const toggleActive = async (id: string, is_active: boolean) => {
    await supabase.from("income_sources").update({ is_active: !is_active }).eq("id", id)
    fetchSources()
  }

  if (loading) return <div className="p-8 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Income Sources</h1>
          <p className="text-muted-foreground">Manage the 14 income streams for Team Chetak</p>
        </div>
        <Button onClick={() => openDialog()} className="gap-2">
          <Plus className="h-4 w-4" /> Add Income Source
        </Button>
      </div>

      <div className="grid gap-4">
        {sources.map((source) => (
          <Card key={source.id} className={`border-border ${!source.is_active && "opacity-50"}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{source.name}</span>
                      {source.category && (
                        <Badge variant="outline" className="text-xs">
                          {source.category}
                        </Badge>
                      )}
                      {!source.is_active && (
                        <Badge variant="secondary" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{source.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={source.is_active}
                    onCheckedChange={() => toggleActive(source.id, source.is_active)}
                  />
                  <Button variant="ghost" size="icon" onClick={() => openDialog(source)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(source.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>{editingSource ? "Edit Income Source" : "Add Income Source"}</DialogTitle>
            <DialogDescription>
              {editingSource ? "Update the income source details" : "Add a new income source for Team Chetak"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Education Bonus"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this income source..."
                className="bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
