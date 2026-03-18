"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface GuideSection {
  id: string
  title: string
  description: string
  content: string
  display_order: number
  icon?: string
}

export default function UserGuidePage() {
  const [sections, setSections] = useState<GuideSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchGuideSections()
  }, [])

  const fetchGuideSections = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data } = await supabase
        .from("user_guide_sections")
        .select("*")
        .order("display_order", { ascending: true })

      if (data) {
        setSections(data as GuideSection[])
      }
    } catch (error) {
      console.error("Error fetching guide sections:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sidebar">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading User Guide...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sidebar">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/">
              <Button variant="ghost" className="gap-2 mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">User Guide</h1>
            <p className="text-muted-foreground mt-2">
              Learn how to make the most of the Team Chetak ATOMY platform
            </p>
          </div>
        </div>

        {/* Guide Sections */}
        <div className="space-y-4">
          {sections.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No guide sections available yet. Check back soon!</p>
              </CardContent>
            </Card>
          ) : (
            sections.map((section) => (
              <Card
                key={section.id}
                className="border-border bg-card cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setExpandedId(expandedId === section.id ? null : section.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {section.icon && (
                        <div className="text-2xl mt-1">{section.icon}</div>
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg sm:text-xl">{section.title}</CardTitle>
                        <CardDescription className="mt-1">{section.description}</CardDescription>
                      </div>
                    </div>
                    <div className="text-muted-foreground">
                      {expandedId === section.id ? "−" : "+"}
                    </div>
                  </div>
                </CardHeader>

                {expandedId === section.id && (
                  <CardContent className="border-t border-border pt-4">
                    <div className="prose prose-invert max-w-none text-sm sm:text-base">
                      {section.content.split("\n").map((paragraph, index) => (
                        <p key={index} className="text-foreground mb-3 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Navigation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Join Team", href: "/join", icon: "👥" },
              { title: "Income Sources", href: "/income", icon: "💰" },
              { title: "Training Resources", href: "/training", icon: "📚" },
              { title: "Success Stories", href: "/success-stories", icon: "🏆" },
              { title: "Events Calendar", href: "/events", icon: "📅" },
              { title: "Member Directory", href: "/directory", icon: "👤" },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <Card className="border-border bg-card hover:border-primary/50 transition-colors h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{link.icon}</div>
                      <div>
                        <p className="font-semibold text-foreground">{link.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ Link */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <Link href="/faq">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              View FAQs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
