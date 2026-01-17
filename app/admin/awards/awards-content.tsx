"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Trophy } from "lucide-react"
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
import type { MonthlyAward } from "@/lib/types"

const awardTypes = [
  "Best Leader Of The Month",
  "Best Trainer Of The Month",
  "Best Consumer Of The Month",
  "Best Distributor Of The Month",
  "Best Leader Of The Year",
]

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export function AwardsContent() {
  const [awards, setAwards] = useState<MonthlyAward[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAward, setEditingAward] = useState<MonthlyAward | null>(null)

  const currentDate = new Date()
  const [formData, setFormData] = useState({
    award_type: "",
    member_name: "",
    member_atomy_id: "",
    achievement: "",
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    is_active: true,
  })

  const supabase = getSupabaseBrowserClient()

  const fetchAwards = async () => {
    const { data } = await supabase
      .from("monthly_awards")
      .select("*")
      .order("year", { ascending: false })
      .order("month", { ascending: false })
    setAwards((data as MonthlyAward[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchAwards()
  }, [])

  const openDialog = (award?: MonthlyAward) => {
    if (award) {
      setEditingAward(award)
      setFormData({
        award_type: award.award_type,
        member_name: award.member_name,
        member_atomy_id: award.member_atomy_id || "",
        achievement: award.achievement || "",
        month: award.month,
        year: award.year,
        is_active: award.is_active,
      })
    } else {
      setEditingAward(null)
      setFormData({
        award_type: "",
        member_name: "",
        member_atomy_id: "",
        achievement: "",
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        is_active: true,
      })
    }
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (editingAward) {
      await supabase.from("monthly_awards").update(formData).eq("id", editingAward.id)
    } else {
      await supabase.from("monthly_awards").insert(formData)
    }
    setDialogOpen(false)
    fetchAwards()
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this award?")) {
      await supabase.from("monthly_awards").delete().eq("id", id)
      fetchAwards()
    }
  }

  // Group awards by month/year
  const grouped = awards.reduce(
    (acc, award) => {
      const key = `${award.year}-${award.month}`
      if (!acc[key]) acc[key] = []
      acc[key].push(award)
      return acc
    },
    {} as Record<string, MonthlyAward[]>,
  )

  if (loading) return <div className="p-8 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Monthly Awards</h1>
          <p className="text-muted-foreground">Recognize top performers in Team Chetak</p>
        </div>
        <Button onClick={() => openDialog()} className="gap-2">
          <Plus className="h-4 w-4" /> Add Award
        </Button>
      </div>

      {Object.keys(grouped).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(grouped).map(([key, monthAwards]) => {
            const [year, month] = key.split("-").map(Number)
            return (
              <div key={key}>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  {months[month - 1]} {year}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {monthAwards.map((award) => (
                    <Card key={award.id} className={`border-border ${!award.is_active && "opacity-50"}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Trophy className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <Badge className="mb-1 text-xs">{award.award_type}</Badge>
                              <p className="font-medium text-foreground">{award.member_name}</p>
                              {award.member_atomy_id && (
                                <p className="text-xs text-muted-foreground">ID: {award.member_atomy_id}</p>
                              )}
                              {award.achievement && (
                                <p className="text-sm text-muted-foreground mt-1">{award.achievement}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openDialog(award)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(award.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <Trophy className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground">No Awards Yet</h3>
          <p className="text-muted-foreground mt-2">Add monthly awards to recognize top performers</p>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>{editingAward ? "Edit Award" : "Add Award"}</DialogTitle>
            <DialogDescription>Recognize a team member for their achievements</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Award Type</Label>
              <Select
                value={formData.award_type}
                onValueChange={(value) => setFormData({ ...formData, award_type: value })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select award type" />
                </SelectTrigger>
                <SelectContent>
                  {awardTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Month</Label>
                <Select
                  value={formData.month.toString()}
                  onValueChange={(value) => setFormData({ ...formData, month: Number.parseInt(value) })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, idx) => (
                      <SelectItem key={month} value={(idx + 1).toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number.parseInt(e.target.value) })}
                  className="bg-background"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Member Name</Label>
              <Input
                value={formData.member_name}
                onChange={(e) => setFormData({ ...formData, member_name: e.target.value })}
                placeholder="Full name"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>ATOMY ID (Optional)</Label>
              <Input
                value={formData.member_atomy_id}
                onChange={(e) => setFormData({ ...formData, member_atomy_id: e.target.value })}
                placeholder="Member's ATOMY ID"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>Achievement (Optional)</Label>
              <Textarea
                value={formData.achievement}
                onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
                placeholder="Brief description of their achievement"
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
