"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Calendar,
  Newspaper,
  Star,
  ImageIcon,
  HelpCircle,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  UserPlus,
  Shield,
  IndianRupee,
  Trophy,
  MessageSquare,
  BookOpen,
  Award,
  Megaphone,
  Download,
  ClipboardCheck,
  Bell,
  MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Member Signups", href: "/admin/signups", icon: UserPlus },
  { name: "Feedback", href: "/admin/feedback", icon: MessageSquare },
  { name: "Push Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Live Chat", href: "/admin/chat", icon: MessageCircle },
  { name: "Attendance", href: "/admin/attendance", icon: ClipboardCheck },
  { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { name: "Income Sources", href: "/admin/income", icon: IndianRupee },
  { name: "Monthly Awards", href: "/admin/awards", icon: Trophy },
  { name: "Training Resources", href: "/admin/training", icon: BookOpen },
  { name: "Success Stories", href: "/admin/stories", icon: Star },
  { name: "Rank Levels", href: "/admin/ranks", icon: Award },
  { name: "Downloads", href: "/admin/downloads", icon: Download },
  { name: "Team Members", href: "/admin/team", icon: Users },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "News", href: "/admin/news", icon: Newspaper },
  { name: "Testimonials", href: "/admin/testimonials", icon: Star },
  { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { name: "FAQ", href: "/admin/faq", icon: HelpCircle },
  { name: "Messages", href: "/admin/messages", icon: Mail },
  { name: "Admin Users", href: "/admin/users", icon: Shield },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

const SUPER_ADMIN_EMAIL = "devanshu2089@gmail.com"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  useEffect(() => {
    const checkSuperAdmin = async () => {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        if (user.email === SUPER_ADMIN_EMAIL) {
          setIsSuperAdmin(true)
        } else {
          const { data } = await supabase.from("admin_users").select("is_super_admin").eq("email", user.email).single()
          setIsSuperAdmin(data?.is_super_admin || false)
        }
      }
    }
    checkSuperAdmin()
  }, [])

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const filteredNavigation = navigation.filter((item) => {
    if (item.href === "/admin/users" && !isSuperAdmin) return false
    return true
  })

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src="/images/image.png" alt="Team Chetak" width={40} height={40} className="rounded-lg" />
          <div>
            <span className="text-lg font-bold text-primary">Team Chetak</span>
            <p className="text-xs text-sidebar-foreground/60">Admin Dashboard</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-transparent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Home className="h-4 w-4" /> View Website
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-sidebar border-b border-sidebar-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/images/image.png" alt="Team Chetak" width={32} height={32} className="rounded-lg" />
          <span className="font-bold text-primary">Admin</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
            <NavContent />
          </aside>
        </>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex-col">
        <NavContent />
      </aside>
    </>
  )
}
