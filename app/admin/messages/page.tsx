"use client"

import { useState, useEffect } from "react"
import { Mail, MailOpen, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { ContactSubmission } from "@/lib/types"

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null)

  const fetchMessages = async () => {
    const supabase = getSupabaseBrowserClient()
    const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false })
    setMessages((data as ContactSubmission[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const markAsRead = async (message: ContactSubmission) => {
    if (message.is_read) return
    const supabase = getSupabaseBrowserClient()
    await supabase.from("contact_submissions").update({ is_read: true }).eq("id", message.id)
    setMessages(messages.map((m) => (m.id === message.id ? { ...m, is_read: true } : m)))
  }

  const openMessage = (message: ContactSubmission) => {
    setSelectedMessage(message)
    markAsRead(message)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const supabase = getSupabaseBrowserClient()
    await supabase.from("contact_submissions").delete().eq("id", deleteId)
    setDeleteId(null)
    if (selectedMessage?.id === deleteId) setSelectedMessage(null)
    fetchMessages()
  }

  const unreadCount = messages.filter((m) => !m.is_read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}` : "All messages read"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="h-20 animate-pulse bg-muted" />
            </Card>
          ))}
        </div>
      ) : messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card
              key={message.id}
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${!message.is_read ? "border-primary/50 bg-primary/5" : ""}`}
              onClick={() => openMessage(message)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    {message.is_read ? (
                      <MailOpen className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    ) : (
                      <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-medium ${!message.is_read ? "text-foreground" : "text-muted-foreground"}`}>
                          {message.name}
                        </h3>
                        {!message.is_read && (
                          <Badge variant="default" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{message.email}</p>
                      {message.subject && <p className="text-sm font-medium mt-1">{message.subject}</p>}
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{message.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.created_at).toLocaleDateString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteId(message.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 font-medium text-foreground">No messages yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Messages from the contact form will appear here</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message from {selectedMessage?.name}</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">From:</span>
                  <span className="font-medium">{selectedMessage.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    {selectedMessage.email} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                {selectedMessage.subject && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subject:</span>
                    <span className="font-medium">{selectedMessage.subject}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">
                    {new Date(selectedMessage.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Message:</p>
                <p className="text-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || "Your message"}`}>
                  <Button>Reply via Email</Button>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
