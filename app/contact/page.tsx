"use client"

import { useLanguage } from "@/lib/language-context"
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
  const { t } = useLanguage()
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
      setError(t("message_error") || "Failed to send message. Please try again.")
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
              <h1 className="text-4xl font-bold text-sidebar-foreground">{t("contact_us") || "Contact Us"}</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("contact_desc") || "Have questions about ATOMY or want to join Team Chetak?"}
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">{t("get_in_touch") || "Get in Touch"}</h2>
                <p className="text-muted-foreground mb-8">
                  {t("contact_info_desc") || "Connect with us through any channel. Our team is available to help."}
                </p>

                <div className="space-y-6">
                  <Card className="border-border">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("email") || "Email"}</p>
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
                        <p className="text-sm text-muted-foreground">{t("phone") || "Phone"}</p>
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
                        <p className="text-sm text-muted-foreground">{t("whatsapp_preferred") || "WhatsApp"}</p>
                        <p className="font-medium text-foreground">{PHONE_NUMBER}</p>
                      </div>
                      <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-green-600 hover:bg-green-700">{t("chat_now") || "Chat Now"}</Button>
                      </a>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("location") || "Location"}</p>
                        <p className="font-medium text-foreground">{t("pan_india") || "India (Pan India)"}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Contact Form */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>{t("send_message") || "Send Message"}</CardTitle>
                  <CardDescription>{t("contact_form_desc") || "Fill out the form and we'll respond within 24 hours"}</CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                      <h3 className="mt-4 text-lg font-medium text-foreground">{t("message_sent") || "Message Sent!"}</h3>
                      <p className="mt-2 text-muted-foreground">
                        {t("message_sent_desc") || "Thank you for reaching out. We'll respond within 24 hours."}
                      </p>
                      <Button variant="outline" className="mt-6 bg-transparent" onClick={() => setIsSubmitted(false)}>
                        {t("send_another") || "Send Another"}
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t("full_name") || "Full Name"} *</Label>
                          <Input
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={t("enter_name") || "Your name"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{t("email") || "Email"} *</Label>
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
                        <Label htmlFor="subject">{t("subject") || "Subject"}</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder={t("subject_placeholder") || "e.g., Inquiry about ATOMY"}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">{t("message") || "Message"} *</Label>
                        <Textarea
                          id="message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder={t("message_placeholder") || "Your message..."}
                        />
                      </div>

                      {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}

                      <Button
                        type="submit"
                        className="w-full gap-2 bg-primary hover:bg-primary/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          t("sending") || "Sending..."
                        ) : (
                          <>
                            {t("send_message") || "Send"} <Send className="h-4 w-4" />
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
