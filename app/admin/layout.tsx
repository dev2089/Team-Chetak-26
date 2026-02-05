import type React from "react"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { getSupabaseServerClient } from "@/lib/supabase/server"

const SUPER_ADMIN_EMAIL = "devanshu2089@gmail.com"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const isSuperAdmin = user.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()

  if (!isSuperAdmin) {
    // Check if user is in admin_users table
    const { data: adminData } = await supabase.from("admin_users").select("email").eq("email", user.email).maybeSingle()

    if (!adminData) {
      // Sign out and redirect
      await supabase.auth.signOut()
      redirect("/login?error=unauthorized")
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="lg:pl-64 pt-14 lg:pt-0">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
