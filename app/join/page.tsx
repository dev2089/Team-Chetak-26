"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { UserPlus, CheckCircle, MessageCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function JoinPage() {
  const [fullName, setFullName] = useState("")
  const [atomyId, setAtomyId] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (fullName.length < 3 || fullName.length > 50) {
      setError("Full name must be between 3 and 50 characters")
      return
    }

    if (atomyId && !/^\d{8}$/.test(atomyId)) {
      setError("ATOMY ID must be exactly 8 digits")
      return
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      setError("Phone number must be exactly 10 digits")
      return
    }

    setIsLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const { error: insertError } = await supabase.from("user_signups").insert({
        full_name: fullName,
        atomy_id: atomyId || null,
        email,
        phone: phone || null,
      })

      if (insertError) throw insertError

      setIsSuccess(true)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to submit. Please try again.")
      } else {
        setError("Failed to submit. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sidebar px-4">
        <Card className="w-full max-w-md border-border bg-card">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">Welcome to Team Chetak!</h2>
            <p className="mt-2 text-muted-foreground">
              Your registration has been submitted successfully. Our team admin will contact you soon.
            </p>
            <div className="mt-6 space-y-3">
              <a
                href="https://wa.me/916376476075?text=Hi!%20I%20just%20registered%20for%20Team%20Chetak%20ATOMY."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full gap-2 bg-green-600 hover:bg-green-700">
                  <MessageCircle className="h-4 w-4" />
                  Connect on WhatsApp
                </Button>
              </a>
              <Link href="/">
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar px-4 py-12">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-3 mb-4">
            <Image src="/images/image.png" alt="Team Chetak" width={56} height={56} className="rounded-lg" />
          </Link>
          <CardTitle className="text-primary">Join Team Chetak ATOMY</CardTitle>
          <CardDescription>Register to become a part of our winning team</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                minLength={3}
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="atomyId">ATOMY ID (Optional)</Label>
              <Input
                id="atomyId"
                type="text"
                value={atomyId}
                onChange={(e) => setAtomyId(e.target.value.replace(/\D/g, "").slice(0, 8))}
                placeholder="8 digit ATOMY ID"
                maxLength={8}
              />
              <p className="text-xs text-muted-foreground">
                Don't have an ATOMY ID?{" "}
                <a
                  href="https://wa.me/916376476075?text=Hi!%20I%20need%20help%20creating%20an%20ATOMY%20ID."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Contact us on WhatsApp
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10 digit phone number"
                maxLength={10}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full gap-2 bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                "Submitting..."
              ) : (
                <>
                  <UserPlus className="h-4 w-4" /> Join Team Chetak
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to website
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
