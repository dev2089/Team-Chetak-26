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
  const [jobTitle, setJobTitle] = useState("")
  const [department, setDepartment] = useState("")
  const [rank, setRank] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [atomyId, setAtomyId] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [bio, setBio] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (fullName.trim().length < 3 || fullName.length > 50) {
      setError("Full name must be between 3 and 50 characters")
      return
    }

    if (!email.trim()) {
      setError("Email is required")
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
        full_name: fullName.trim(),
        job_title: jobTitle.trim() || null,
        department: department.trim() || null,
        rank: rank.trim() || null,
        email: email.trim(),
        phone: phone || null,
        atomy_id: atomyId || null,
        image_url: imageUrl.trim() || null,
        linkedin_url: linkedinUrl.trim() || null,
        bio: bio.trim() || null,
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
      <div className="flex min-h-screen items-center justify-center bg-sidebar px-4 py-8 sm:py-12">
        <Card className="w-full max-w-md border-border bg-card">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">Welcome to Team Chetak!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
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
    <div className="flex min-h-screen items-center justify-center bg-sidebar px-4 py-8 sm:py-12">
      <Card className="w-full max-w-2xl border-border bg-card">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-3 mb-4">
            <Image src="/images/image.png" alt="Team Chetak" width={56} height={56} className="rounded-lg" />
          </Link>
          <CardTitle className="text-lg sm:text-xl md:text-2xl text-primary">Join Team Chetak ATOMY</CardTitle>
          <CardDescription className="text-sm sm:text-base">Complete your profile to join our winning team</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                minLength={3}
                maxLength={50}
                className="text-base"
              />
            </div>

            {/* Two Column Layout for Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="text-sm">Job Title</Label>
                <Input
                  id="jobTitle"
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Your job title"
                  className="text-base"
                />
              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm">Department</Label>
                <Input
                  id="department"
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Your department"
                  className="text-base"
                />
              </div>
            </div>

            {/* Rank */}
            <div className="space-y-2">
              <Label htmlFor="rank" className="text-sm">Rank</Label>
              <Input
                id="rank"
                type="text"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="Your rank in ATOMY"
                className="text-base"
              />
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10 digit number"
                  maxLength={10}
                  className="text-base"
                />
              </div>
            </div>

            {/* ATOMY ID */}
            <div className="space-y-2">
              <Label htmlFor="atomyId" className="text-sm">ATOMY ID</Label>
              <Input
                id="atomyId"
                type="text"
                value={atomyId}
                onChange={(e) => setAtomyId(e.target.value.replace(/\D/g, "").slice(0, 8))}
                placeholder="8 digit ATOMY ID"
                maxLength={8}
                className="text-base"
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

            {/* Image URL and LinkedIn URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-sm">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedinUrl" className="text-sm">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="text-base"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm">Bio</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself (max 500 characters)"
                maxLength={500}
                className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base min-h-24"
              />
            </div>

            {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}

            <Button type="submit" className="w-full gap-2 bg-primary hover:bg-primary/90 text-base" disabled={isLoading}>
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
