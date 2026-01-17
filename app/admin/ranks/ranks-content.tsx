"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { RankLevel } from "@/lib/types"

export default function RanksContent() {
  const [ranks, setRanks] = useState<RankLevel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRank, setEditingRank] = useState<RankLevel | null>(null)
  const [formData, setFormData] = useState({
    rank_name: "",
    rank_order: 1,
    min_pv: 0,
    min_team_members: 0,
    benefits: "",
    color: "#0ea5e9",
    is_active: true,
  })

  useEffect(() => {
    fetchRanks()
  }, [])

  const fetchRanks = async () => {
    const supabase = getSupabaseBrowserClient()
    const { data } = await supabase.from("rank_levels").select("*").order("rank_order")
    setRanks((data as RankLevel[]) || [])
    setIsLoading(false)
  }

  const handleSubmit = async () => {
    const supabase = getSupabaseBrowserClient()

    if (editingRank) {
      await supabase.from("rank_levels").update(formData).eq("id", editingRank.id)
    } else {
      await supabase.from("rank_levels").insert([formData])
    }

    setIsDialogOpen(false)
    resetForm()
    fetchRanks()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this rank?")) return
    const supabase = getSupabaseBrowserClient()
    await supabase.from("rank_levels").delete().eq("id", id)
    fetchRanks()
  }

  const resetForm = () => {
    setFormData({
      rank_name: "",
      rank_order: ranks.length + 1,
      min_pv: 0,
      min_team_members: 0,
      benefits: "",
      color: "#0ea5e9",
      is_active: true,
    })
    setEditingRank(null)
  }

  const openEditDialog = (rank: RankLevel) => {
    setEditingRank(rank)
    setFormData({
      rank_name: rank.rank_name,
      rank_order: rank.rank_order,
      min_pv: rank.min_pv || 0,
      min_team_members: rank.min_team_members || 0,
      benefits: rank.benefits || "",
      color: rank.color || "#0ea5e9",
      is_active: rank.is_active,
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
          <h1 className="text-3xl font-bold text-foreground">Rank Levels</h1>
          <p className="text-muted-foreground">Manage ATOMY rank progression system</p>
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
              <Plus className="h-4 w-4" /> Add Rank
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingRank ? "Edit Rank" : "Add Rank Level"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Rank Name *</Label>
                  <Input
                    value={formData.rank_name}
                    onChange={(e) => setFormData({ ...formData, rank_name: e.target.value })}
                    placeholder="e.g., Diamond Master"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Order *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.rank_order}
                    onChange={(e) => setFormData({ ...formData, rank_order: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Minimum PV</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.min_pv}
                    onChange={(e) => setFormData({ ...formData, min_pv: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Min Team Members</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.min_team_members}
                    onChange={(e) => setFormData({ ...formData, min_team_members: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Benefits</Label>
                <Textarea
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  placeholder="List the benefits of this rank..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#0ea5e9"
                  />
                </div>
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
                  {editingRank ? "Update" : "Add Rank"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {ranks.length === 0 ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">No Ranks</h3>
            <p className="text-muted-foreground">Add rank levels to show the progression system.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {ranks.map((rank) => (
            <Card
              key={rank.id}
              className={`border-border ${!rank.is_active ? "opacity-50" : ""}`}
              style={{ borderLeftColor: rank.color || "#0ea5e9", borderLeftWidth: "4px" }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: rank.color || "#0ea5e9" }}
                    >
                      {rank.rank_order}
                    </div>
                    <div>
                      <CardTitle className="text-lg" style={{ color: rank.color || "#0ea5e9" }}>
                        {rank.rank_name}
                      </CardTitle>
                      <CardDescription>
                        PV: {rank.min_pv?.toLocaleString() || 0} | Team: {rank.min_team_members?.toLocaleString() || 0}+
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(rank)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive bg-transparent"
                      onClick={() => handleDelete(rank.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {rank.benefits && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{rank.benefits}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
