"use client"

import { useLanguage } from "@/lib/language-context"
import type React from "react"
import { useState } from "react"
import { Send, Star, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

const categories = [
  { value: "general", label: "General Feedback" },
  { value: "suggestion", label: "Suggestion" },
  { value: "complaint", label: "Complaint" },
  { value: "appreciation", label: "Appreciation" },
  { value: "training", label: "Training Related" },
  { value: "product", label: "Product Related" },
]

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    atomy_id: "",
    category: "general",
    subject: "",
    message: "",
    rating: 5,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const supabase = getSupabaseBrowserClient()
      const { error: submitError } = await supabase.from("feedback").insert([formData])

      if (submitError) throw submitError

      setSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        atomy_id: "",
        category: "general",
        subject: "",
        message: "",
        rating: 5,
      })
    } catch {
      setError("Failed to submit feedback. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-6 py-16">
          <Card className="max-w-md text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Thank You!</h2>
              <p className="text-muted-foreground mb-6">
                Your feedback has been submitted successfully. We appreciate your input and will review it shortly.
              </p>
              <Button onClick={() => setSubmitted(false)} className="bg-primary hover:bg-primary/90">
                Submit Another Feedback
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-sidebar px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-sidebar-foreground">Share Your Feedback</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Your feedback helps us improve. Share your thoughts, suggestions, or concerns with us.
            </p>
          </div>
        </section>

        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Feedback Form</CardTitle>
                <CardDescription>All fields marked with * are required</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="atomy_id">ATOMY ID</Label>
                      <Input
                        id="atomy_id"
                        value={formData.atomy_id}
                        onChange={(e) => setFormData({ ...formData, atomy_id: e.target.value })}
                        placeholder="Your ATOMY member ID"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Rating</Label>
                      <div className="flex gap-1 pt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData({ ...formData, rating: star })}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= formData.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Brief subject of your feedback"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message *</Label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share your detailed feedback, suggestions, or concerns..."
                    />
                  </div>

                  {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}

                  <Button type="submit" className="w-full gap-2 bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
