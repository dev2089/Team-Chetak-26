"use client"

import { useState, useEffect } from "react"
import { Shield, UserPlus, Trash2, Calendar, Crown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { AdminUser } from "@/lib/types"

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [newAdminEmail, setNewAdminEmail] = useState("")
  const [isAddingAdmin, setIsAddingAdmin] = useState(false)
  const [error, setError] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchAdmins = async () => {
    const supabase = getSupabaseBrowserClient()

    // Check if current user is super admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data: currentAdmin } = await supabase
        .from("admin_users")
        .select("is_super_admin")
        .eq("email", user.email)
        .single()
      setIsSuperAdmin(currentAdmin?.is_super_admin || false)
    }

    const { data } = await supabase.from("admin_users").select("*").order("created_at", { ascending: true })
    setAdmins((data as AdminUser[]) || [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const addAdmin = async () => {
    if (!newAdminEmail.trim()) return
    setError("")
    setIsAddingAdmin(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Get current admin's ID
      const { data: currentAdmin } = await supabase.from("admin_users").select("id").eq("email", user?.email).single()

      const { error: insertError } = await supabase.from("admin_users").insert({
        email: newAdminEmail.trim().toLowerCase(),
        is_super_admin: false,
        invited_by: currentAdmin?.id,
      })

      if (insertError) throw insertError

      setNewAdminEmail("")
      setDialogOpen(false)
      fetchAdmins()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to add admin")
      } else {
        setError("Failed to add admin")
      }
    } finally {
      setIsAddingAdmin(false)
    }
  }

  const removeAdmin = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to remove ${email} as an admin?`)) return
    const supabase = getSupabaseBrowserClient()
    await supabase.from("admin_users").delete().eq("id", id)
    fetchAdmins()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading admins...</div>
      </div>
    )
  }

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="border-border max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">Access Denied</h2>
            <p className="mt-2 text-muted-foreground">Only super admins can manage admin users.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Users</h1>
          <p className="text-muted-foreground mt-1">Manage who can access the admin dashboard</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <UserPlus className="h-4 w-4" /> Invite Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New Admin</DialogTitle>
              <DialogDescription>
                Enter the email address of the person you want to invite as an admin. They will need to sign up with
                this exact email to gain access.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button onClick={addAdmin} disabled={isAddingAdmin} className="w-full bg-primary hover:bg-primary/90">
                {isAddingAdmin ? "Adding..." : "Add Admin"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {admins.map((admin) => (
          <Card key={admin.id} className="border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${admin.is_super_admin ? "bg-primary/20" : "bg-muted"}`}
                  >
                    {admin.is_super_admin ? (
                      <Crown className="h-6 w-6 text-primary" />
                    ) : (
                      <Shield className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{admin.email}</span>
                      {admin.is_super_admin && (
                        <Badge variant="default" className="bg-primary">
                          Super Admin
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      Added {new Date(admin.created_at).toLocaleDateString("en-IN")}
                    </div>
                  </div>
                </div>
                {!admin.is_super_admin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAdmin(admin.id, admin.email)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border bg-muted/30">
        <CardContent className="pt-6">
          <h3 className="font-medium text-foreground mb-2">How Admin Access Works</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Only users added here can access the admin dashboard</li>
            <li>• Invited users must sign up in Supabase with the exact email address</li>
            <li>• Super Admin (you) can add or remove other admins</li>
            <li>• Regular admins can manage all content but cannot manage admin users</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
