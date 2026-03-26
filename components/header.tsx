"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
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
  Sun,
  Moon,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/language-context"
import { languages } from "@/lib/translations"
import { NotificationBell } from "@/components/notification-bell"

const WHATSAPP_NUMBER = "916376476075"

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<"dark" | "light">("dark")

  const { language, setLanguage, t } = useLanguage()

  const [, forceUpdate] = useState({})

  useEffect(() => {
    forceUpdate({})
  }, [language])

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
    { name: "User Guide", href: "/user-guide", icon: BookOpen },
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

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as "dark" | "light"
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    }
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const currentLang = languages.find((l) => l.code === language)

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as any)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm shadow-sm">
      <nav className="mx-auto flex max-w-full items-center justify-between px-4 py-3 lg:px-8 lg:py-4 gap-8">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/images/logo.png" alt="Team Chetak" width={40} height={40} className="rounded-lg w-10 h-10 flex-shrink-0" />
            <div className="hidden sm:flex flex-col min-w-0">
              <span className="text-sm sm:text-base font-bold text-foreground leading-none whitespace-nowrap">{t("team_chetak")}</span>
              <p className="text-xs text-muted-foreground leading-none">{t("never_give_up")}</p>
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-2 ml-auto">
          {mounted && (
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Desktop navigation - centered */}
        <div className="hidden lg:flex items-center gap-8 flex-1 justify-start">
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
                pathname === item.href ? "text-primary" : "text-foreground/80",
              )}
            >
              {item.name}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors whitespace-nowrap">
              {t("resources")} <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {resourcesDropdown.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} className="cursor-pointer">
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors whitespace-nowrap">
              {t("more")} <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {moreDropdown.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} className="cursor-pointer">
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop right side */}
        <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
          <NotificationBell />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-sm">
                <Globe className="h-4 w-4" />
                <span suppressHydrationWarning className="hidden xl:inline text-xs">{currentLang?.nativeName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={language === lang.code ? "bg-primary/10" : ""}
                >
                  {lang.nativeName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {mounted && (
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
            <Button
              size="sm"
              className="gap-2 bg-green-600 hover:bg-green-700 text-white font-medium text-xs"
            >
              <MessageCircle className="h-4 w-4" /> {t("whatsapp")}
            </Button>
          </a>
          <Link href="/join">
            <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-white font-medium text-xs">
              <UserPlus className="h-4 w-4" /> {t("join_team")}
            </Button>
          </Link>
          <Link href="/login">
            <Button size="sm" variant="outline" className="gap-2 border-border hover:bg-sidebar font-medium text-xs">
              <Users className="h-4 w-4" /> {t("admin_login")}
            </Button>
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[9999]">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />

          {/* Sidebar */}
          <div className="absolute top-0 left-0 bottom-0 w-80 bg-background border-r border-border flex flex-col shadow-2xl">
            {/* Sidebar Header with Logo */}
            <div className="flex-shrink-0 p-4 border-b border-border flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Image src="/images/logo.png" alt="Team Chetak" width={40} height={40} className="rounded-lg w-10 h-10" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground">{t("team_chetak")}</span>
                  <p className="text-xs text-muted-foreground">{t("never_give_up")}</p>
                </div>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Language Selector */}
            <div className="flex-shrink-0 p-4 border-b border-border space-y-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-3 tracking-wide">Language / भाषा</p>
                <div className="grid grid-cols-3 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        handleLanguageChange(lang.code)
                      }}
                      className={cn(
                        "px-2 py-2 rounded-lg text-xs font-medium transition-colors",
                        language === lang.code
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80 text-foreground",
                      )}
                    >
                      {lang.nativeName}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Current: {language}</p>
            </div>

            {/* Navigation Links - scrollable */}
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                {t("home")}
              </p>
              {mainNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1",
                    pathname === item.href ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-muted",
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
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1",
                    pathname === item.href ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-muted",
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
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1",
                    pathname === item.href ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-muted",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Footer Buttons */}
            <div className="flex-shrink-0 p-4 border-t border-border space-y-3">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white">
                  <MessageCircle className="h-4 w-4" /> {t("whatsapp")}
                </Button>
              </a>
              <Link href="/join" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                  <UserPlus className="h-4 w-4" /> {t("join_team")}
                </Button>
              </Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <Users className="h-4 w-4" /> {t("admin_login")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
