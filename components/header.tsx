"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Menu,
  X,
  UserPlus,
  MessageCircle,
  ChevronDown,
  Home,
  Info,
  IndianRupee,
  Trophy,
  BookOpen,
  Star,
  Award,
  Download,
  Calculator,
  Calendar,
  Megaphone,
  Users,
  BarChart3,
  MessageSquare,
  Phone,
  HelpCircle,
  ImageIcon,
  Newspaper,
  ClipboardCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { NotificationBell } from "@/components/notification-bell"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { useLanguage } from "@/lib/language-context"

const WHATSAPP_NUMBER = "916376476075"

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useLanguage()

  const mainNavigation = [
    { name: t("home"), href: "/", icon: Home },
    { name: t("about"), href: "/about", icon: Info },
    { name: t("income_sources"), href: "/income", icon: IndianRupee },
    { name: t("leaderboard"), href: "/leaderboard", icon: Trophy },
  ]

  const resourcesDropdown = [
    { name: t("training"), href: "/training", icon: BookOpen },
    { name: t("success_stories"), href: "/success-stories", icon: Star },
    { name: t("ranks"), href: "/ranks", icon: Award },
    { name: t("downloads"), href: "/downloads", icon: Download },
    { name: t("calculator"), href: "/calculator", icon: Calculator },
  ]

  const moreDropdown = [
    { name: t("events"), href: "/events", icon: Calendar },
    { name: t("announcements"), href: "/announcements", icon: Megaphone },
    { name: t("attendance"), href: "/attendance", icon: ClipboardCheck },
    { name: t("directory"), href: "/directory", icon: Users },
    { name: t("dashboard"), href: "/dashboard", icon: BarChart3 },
    { name: t("feedback"), href: "/feedback", icon: MessageSquare },
    { name: t("contact"), href: "/contact", icon: Phone },
    { name: t("faq"), href: "/faq", icon: HelpCircle },
    { name: t("gallery"), href: "/gallery", icon: ImageIcon },
    { name: t("news"), href: "/news", icon: Newspaper },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3">
            <Image src="/images/image.png" alt="Team Chetak" width={48} height={48} className="rounded-lg" />
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-primary">{t("team_chetak")}</span>
              <p className="text-xs text-muted-foreground">{t("never_give_up")}</p>
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-2">
          <NotificationBell />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-4 lg:items-center">
          {mainNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-sidebar-foreground/80",
              )}
            >
              {item.name}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-sidebar-foreground/80 hover:text-primary transition-colors">
              {t("resources")} <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-sidebar border-border">
              {resourcesDropdown.map((item) => (
                <DropdownMenuItem key={item.name} asChild>
                  <Link href={item.href} className="cursor-pointer">
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-sidebar-foreground/80 hover:text-primary transition-colors">
              {t("more")} <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-sidebar border-border">
              {moreDropdown.map((item) => (
                <DropdownMenuItem key={item.name} asChild>
                  <Link href={item.href} className="cursor-pointer">
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop right side */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-2">
          <LanguageSwitcher />
          <NotificationBell />
          <ThemeToggle />
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
            <Button
              size="sm"
              variant="outline"
              className="gap-2 bg-green-600 border-green-600 text-white hover:bg-green-700"
            >
              <MessageCircle className="h-4 w-4" /> {t("whatsapp")}
            </Button>
          </a>
          <Link href="/join">
            <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
              <UserPlus className="h-4 w-4" /> {t("join_team")}
            </Button>
          </Link>
        </div>
      </nav>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <aside className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden">
            <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                <Image src="/images/image.png" alt="Team Chetak" width={40} height={40} className="rounded-lg" />
                <div>
                  <span className="text-lg font-bold text-primary">{t("team_chetak")}</span>
                  <p className="text-xs text-muted-foreground">{t("never_give_up")}</p>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Language switcher in mobile */}
            <div className="p-4 border-b border-sidebar-border">
              <LanguageSwitcher />
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">Main</p>
              {mainNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}

              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2 mt-6">
                {t("resources")}
              </p>
              {resourcesDropdown.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}

              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2 mt-6">
                {t("more")}
              </p>
              {moreDropdown.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-sidebar-border space-y-3">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white">
                  <MessageCircle className="h-4 w-4" /> {t("whatsapp")}: +91 63764 76075
                </Button>
              </a>
              <Link href="/join" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                  <UserPlus className="h-4 w-4" /> {t("join_team")}
                </Button>
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-sm font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
              >
                {t("admin_login")}
              </Link>
            </div>
          </aside>
        </>
      )}
    </header>
  )
}
