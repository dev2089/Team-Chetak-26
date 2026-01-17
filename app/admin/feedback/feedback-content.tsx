"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Star, Eye, Trash2, Reply } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Feedback } from "@/lib/types"

export default function FeedbackContent() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [response, setResponse] = useState("")

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    const supabase = getSupabaseBrowserClient()
    const { data } = await supabase.from("feedback").select("*").order("created_at", { ascending: false })
    setFeedback((data as Feedback[]) || [])
    setIsLoading(false)
  }

  const markAsRead = async (id: string) => {
    const supabase = getSupabaseBrowserClient()
    await supabase.from("feedback").update({ is_read: true }).eq("id", id)
    fetchFeedback()
  }

  const deleteFeedback = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return
    const supabase = getSupabaseBrowserClient()
    await supabase.from("feedback").delete().eq("id", id)
    fetchFeedback()
  }

  const submitResponse = async () => {
    if (!selectedFeedback || !response.trim()) return
    const supabase = getSupabaseBrowserClient()
    await supabase.from("feedback").update({ admin_response: response, is_read: true }).eq("id", selectedFeedback.id)
    setSelectedFeedback(null)
    setResponse("")
    fetchFeedback()
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "complaint":
        return "bg-red-500/20 text-red-500"
      case "suggestion":
        return "bg-blue-500/20 text-blue-500"
      case "appreciation":
        return "bg-green-500/20 text-green-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const unreadCount = feedback.filter((f) => !f.is_read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Feedback</h1>
          <p className="text-muted-foreground">
            {unreadCount} unread feedback{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {feedback.length === 0 ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">No Feedback Yet</h3>
            <p className="text-muted-foreground text-center">Feedback from members will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {feedback.map((item) => (
            <Card key={item.id} className={`border-border ${!item.is_read ? "border-l-4 border-l-primary" : ""}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {item.name}
                      {!item.is_read && <Badge className="bg-primary text-xs">New</Badge>}
                    </CardTitle>
                    <CardDescription className="flex flex-wrap gap-2 mt-1">
                      <span>{item.email}</span>
                      {item.phone && <span>• {item.phone}</span>}
                      {item.atomy_id && <span>• ID: {item.atomy_id}</span>}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(item.category)}>{item.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-foreground mb-1">{item.subject}</p>
                <p className="text-sm text-muted-foreground mb-3">{item.message}</p>
                {item.rating && (
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < item.rating! ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                )}
                {item.admin_response && (
                  <div className="p-3 rounded-lg bg-muted/50 mt-2">
                    <p className="text-xs text-muted-foreground mb-1">Admin Response:</p>
                    <p className="text-sm">{item.admin_response}</p>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  {!item.is_read && (
                    <Button size="sm" variant="outline" onClick={() => markAsRead(item.id)}>
                      <Eye className="h-4 w-4 mr-1" /> Mark Read
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedFeedback(item)
                      setResponse(item.admin_response || "")
                    }}
                  >
                    <Reply className="h-4 w-4 mr-1" /> Respond
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive bg-transparent"
                    onClick={() => deleteFeedback(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Feedback</DialogTitle>
            <DialogDescription>From: {selectedFeedback?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm font-medium">{selectedFeedback?.subject}</p>
              <p className="text-sm text-muted-foreground mt-1">{selectedFeedback?.message}</p>
            </div>
            <Textarea
              placeholder="Type your response..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedFeedback(null)}>
                Cancel
              </Button>
              <Button onClick={submitResponse} className="bg-primary hover:bg-primary/90">
                Send Response
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
