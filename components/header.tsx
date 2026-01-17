"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, UserPlus, MessageCircle, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mainNavigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Income Sources", href: "/income" },
  { name: "Leaderboard", href: "/leaderboard" },
]

const resourcesDropdown = [
  { name: "Training Resources", href: "/training" },
  { name: "Success Stories", href: "/success-stories" },
  { name: "Ranks & Levels", href: "/ranks" },
  { name: "Downloads", href: "/downloads" },
  { name: "Order Calculator", href: "/calculator" },
]

const moreDropdown = [
  { name: "Events Calendar", href: "/events" },
  { name: "Announcements", href: "/announcements" },
  { name: "Member Directory", href: "/directory" },
  { name: "Performance Dashboard", href: "/dashboard" },
  { name: "Feedback", href: "/feedback" },
  { name: "Contact", href: "/contact" },
]

const WHATSAPP_NUMBER = "916376476075"

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3">
            <Image src="/images/image.png" alt="Team Chetak" width={48} height={48} className="rounded-lg" />
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-primary">TEAM CHETAK</span>
              <p className="text-xs text-muted-foreground">NEVER GIVE UP</p>
            </div>
          </Link>
        </div>
        <div className="flex lg:hidden">
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

          {/* Resources Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-sidebar-foreground/80 hover:text-primary transition-colors">
              Resources <ChevronDown className="h-4 w-4" />
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

          {/* More Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-sidebar-foreground/80 hover:text-primary transition-colors">
              More <ChevronDown className="h-4 w-4" />
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
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-3">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
            <Button
              size="sm"
              variant="outline"
              className="gap-2 bg-green-600 border-green-600 text-white hover:bg-green-700"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </Button>
          </a>
          <Link href="/join">
            <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
              <UserPlus className="h-4 w-4" /> Join Team
            </Button>
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-sidebar px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Image src="/images/image.png" alt="Team Chetak" width={40} height={40} className="rounded-lg" />
                <span className="text-lg font-bold text-primary">TEAM CHETAK</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-border">
                <div className="space-y-2 py-6">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Main</p>
                  {mainNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "-mx-3 block rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-sidebar-accent",
                        pathname === item.href ? "text-primary" : "text-sidebar-foreground/80",
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4">
                    Resources
                  </p>
                  {resourcesDropdown.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "-mx-3 block rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-sidebar-accent",
                        pathname === item.href ? "text-primary" : "text-sidebar-foreground/80",
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4">More</p>
                  {moreDropdown.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "-mx-3 block rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-sidebar-accent",
                        pathname === item.href ? "text-primary" : "text-sidebar-foreground/80",
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6 space-y-3">
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full gap-2 bg-green-600 hover:bg-green-700">
                      <MessageCircle className="h-4 w-4" /> WhatsApp: +91 63764 76075
                    </Button>
                  </a>
                  <Link href="/join" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full gap-2 bg-primary hover:bg-primary/90 mt-2">
                      <UserPlus className="h-4 w-4" /> Join Team
                    </Button>
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent text-center"
                  >
                    Admin Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
