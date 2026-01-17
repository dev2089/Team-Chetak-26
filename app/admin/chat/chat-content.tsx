"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, Send, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { ChatMessage } from "@/lib/types"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface ChatSession {
  session_id: string
  sender_name: string
  last_message: string
  last_time: string
  unread_count: number
}

export function ChatAdminContent() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadSessions()

    const supabase = getSupabaseBrowserClient()
    const channel = supabase
      .channel("admin-chat")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, () => {
        loadSessions()
        if (selectedSession) loadMessages(selectedSession)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedSession])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadSessions = async () => {
    const supabase = getSupabaseBrowserClient()
    const { data } = await supabase.from("chat_messages").select("*").order("created_at", { ascending: false })

    if (data) {
      const sessionMap = new Map<string, ChatSession>()
      data.forEach((msg) => {
        if (msg.session_id && !sessionMap.has(msg.session_id)) {
          sessionMap.set(msg.session_id, {
            session_id: msg.session_id,
            sender_name: msg.sender_name,
            last_message: msg.message,
            last_time: msg.created_at,
            unread_count: data.filter((m) => m.session_id === msg.session_id && !m.is_read && !m.is_from_admin).length,
          })
        }
      })
      setSessions(Array.from(sessionMap.values()))
    }
    setLoading(false)
  }

  const loadMessages = async (sessionId: string) => {
    const supabase = getSupabaseBrowserClient()
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })

    if (data) {
      setMessages(data)
      // Mark as read
      await supabase
        .from("chat_messages")
        .update({ is_read: true })
        .eq("session_id", sessionId)
        .eq("is_from_admin", false)
    }
  }

  const selectSession = (sessionId: string) => {
    setSelectedSession(sessionId)
    loadMessages(sessionId)
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedSession || sending) return

    setSending(true)
    const supabase = getSupabaseBrowserClient()

    await supabase.from("chat_messages").insert({
      sender_name: "Team Chetak Admin",
      message: newMessage,
      is_from_admin: true,
      session_id: selectedSession,
    })

    setNewMessage("")
    setSending(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Live Chat</h1>
        <p className="text-muted-foreground">Respond to member messages</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 h-[600px]">
        {/* Sessions List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[520px]">
              {sessions.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No conversations yet</p>
                </div>
              ) : (
                sessions.map((session) => (
                  <button
                    key={session.session_id}
                    onClick={() => selectSession(session.session_id)}
                    className={cn(
                      "w-full p-4 text-left border-b border-border hover:bg-muted/50 transition-colors",
                      selectedSession === session.session_id && "bg-muted",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{session.sender_name}</p>
                          {session.unread_count > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                              {session.unread_count}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{session.last_message}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {!selectedSession ? (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to start chatting</p>
              </div>
            </CardContent>
          ) : (
            <>
              <CardHeader className="pb-2 border-b border-border">
                <CardTitle className="text-lg">
                  {sessions.find((s) => s.session_id === selectedSession)?.sender_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "max-w-[80%] p-3 rounded-2xl text-sm",
                        msg.is_from_admin
                          ? "bg-primary text-primary-foreground ml-auto rounded-br-md"
                          : "bg-muted mr-auto rounded-bl-md",
                      )}
                    >
                      <p>{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">{format(new Date(msg.created_at), "p")}</p>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <div className="p-4 border-t border-border flex gap-2">
                <Input
                  placeholder="Type your reply..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  disabled={sending}
                />
                <Button onClick={sendMessage} disabled={sending || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
