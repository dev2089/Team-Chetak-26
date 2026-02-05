"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Send, CheckCircle, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

const PHONE_NUMBER = "+91 63764 76075"
const WHATSAPP_NUMBER = "916376476075"
const EMAIL = "devanshu2089@gmail.com"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const supabase = getSupabaseBrowserClient()
      const { error: submitError } = await supabase.from("contact_submissions").insert([formData])

      if (submitError) throw submitError

      setIsSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch {
      setError("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-sidebar px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-sidebar-foreground">Contact Us</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Have questions about ATOMY or want to join Team Chetak? We would be delighted to assist you on your
                journey to financial freedom.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
                <p className="text-muted-foreground mb-8">
                  Connect with us through any of the following channels. Our team is available to answer your questions
                  about ATOMY products, business opportunities, and how to get started.
                </p>

                <div className="space-y-6">
                  <Card className="border-border">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <a href={`mailto:${EMAIL}`} className="font-medium text-foreground hover:text-primary">
                          {EMAIL}
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <a href={`tel:${PHONE_NUMBER}`} className="font-medium text-foreground hover:text-primary">
                          {PHONE_NUMBER}
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-green-500/10 border-green-500/30">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                        <MessageCircle className="h-6 w-6 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">WhatsApp (Preferred)</p>
                        <p className="font-medium text-foreground">{PHONE_NUMBER}</p>
                      </div>
                      <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-green-600 hover:bg-green-700">Chat Now</Button>
                      </a>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium text-foreground">India (Pan India Network)</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Response Time:</strong> We typically respond within 24 hours.
                    For urgent inquiries, please contact us via WhatsApp for faster assistance.
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>Fill out the form below and our team will get back to you promptly.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                      <h3 className="mt-4 text-lg font-medium text-foreground">Message Sent Successfully!</h3>
                      <p className="mt-2 text-muted-foreground">
                        Thank you for reaching out. Our team will review your message and respond within 24 hours.
                      </p>
                      <Button variant="outline" className="mt-6 bg-transparent" onClick={() => setIsSubmitted(false)}>
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="e.g., Inquiry about joining Team Chetak"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Please share your questions or how we can assist you..."
                        />
                      </div>

                      {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}

                      <Button
                        type="submit"
                        className="w-full gap-2 bg-primary hover:bg-primary/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <>
                            Send Message <Send className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
