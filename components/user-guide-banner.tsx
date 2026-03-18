"use client"

import Link from "next/link"
import { BookOpen, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UserGuideBanner() {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4 sm:p-6 my-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">New to the Platform?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Check out our comprehensive user guide to learn how to make the most of all features
            </p>
          </div>
        </div>
        <Link href="/user-guide">
          <Button className="gap-2 bg-primary hover:bg-primary/90 whitespace-nowrap">
            View Guide
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
