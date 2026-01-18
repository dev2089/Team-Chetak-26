"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  sender_name: string
  message: string
  is_from_admin: boolean
  created_at: string
}

export function LiveChat() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [userName, setUserName] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [isStarted, setIsStarted] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const savedSession = localStorage.getItem("chat_session_id")
    const savedName = localStorage.getItem("chat_user_name")
    if (savedSession && savedName) {
      setSessionId(savedSession)
      setUserName(savedName)
      setIsStarted(true)
      loadMessages(savedSession)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (!sessionId) return

    const supabase = getSupabaseBrowserClient()
    const channel = supabase
      .channel(`chat-${sessionId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `session_id=eq.${sessionId}` },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId])

  const loadMessages = async (sid: string) => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sid)
        .order("created_at", { ascending: true })

      if (error) {
        console.log("[v0] Error loading messages:", error)
      }
      if (data) setMessages(data)
    } catch (error) {
      console.log("[v0] Error loading messages:", error)
    }
  }

  const startChat = () => {
    if (!userName.trim()) return
    const newSessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setSessionId(newSessionId)
    localStorage.setItem("chat_session_id", newSessionId)
    localStorage.setItem("chat_user_name", userName)
    setIsStarted(true)
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return
    setSending(true)

    const messageText = newMessage.trim()
    const tempId = `temp_${Date.now()}`

    // Create optimistic message to show immediately
    const optimisticMessage: Message = {
      id: tempId,
      sender_name: userName,
      message: messageText,
      is_from_admin: false,
      created_at: new Date().toISOString(),
    }

    // Add to messages immediately for instant feedback
    setMessages((prev) => [...prev, optimisticMessage])
    setNewMessage("") // Clear input immediately

    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase
        .from("chat_messages")
        .insert({
          sender_name: userName,
          message: messageText,
          is_from_admin: false,
          session_id: sessionId,
        })

      if (error) {
        console.log("[v0] Error sending message:", error)
        // Remove optimistic message on error and restore input
        setMessages((prev) => prev.filter((m) => m.id !== tempId))
        setNewMessage(messageText)
      }
      // On success, keep the optimistic message (don't need to update it)
    } catch (error) {
      console.log("[v0] Error sending message:", error)
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
      setNewMessage(messageText)
    }

    setSending(false)
  }

  if (!mounted) return null

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[9998] bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-110"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    )
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-[9998] bg-card border border-border rounded-2xl shadow-2xl transition-all overflow-hidden flex flex-col",
        isMinimized ? "w-72 h-14" : "w-80 sm:w-96 h-[500px]",
      )}
    >
      {/* Header */}
      <div className="flex-shrink-0 bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span className="font-semibold">Live Chat</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {!isStarted ? (
            <div className="flex-1 p-6 flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Welcome to Team Chetak support! Enter your name to start chatting.
              </p>
              <Input
                placeholder="Your Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && startChat()}
              />
              <Button onClick={startChat} disabled={!userName.trim()}>
                Start Chat
              </Button>
            </div>
          ) : (
            <>
              {/* Messages - scrollable */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    Send a message to start the conversation!
                  </p>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "max-w-[80%] p-3 rounded-2xl text-sm",
                      msg.is_from_admin
                        ? "bg-muted mr-auto rounded-bl-md"
                        : "bg-primary text-primary-foreground ml-auto rounded-br-md",
                    )}
                  >
                    <p className="font-medium text-xs mb-1 opacity-70">
                      {msg.is_from_admin ? "Team Chetak" : msg.sender_name}
                    </p>
                    <p>{msg.message}</p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input - fixed at bottom */}
              <div className="flex-shrink-0 p-4 border-t border-border flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  disabled={sending}
                />
                <Button size="icon" onClick={sendMessage} disabled={sending || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
