"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

const SUPER_ADMIN_EMAIL = "devanshu2089@gmail.com"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [mode, setMode] = useState<"login" | "signup">("login")

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    const normalizedEmail = email.toLowerCase().trim()

    try {
      const supabase = getSupabaseBrowserClient()

      const isSuperAdmin = normalizedEmail === SUPER_ADMIN_EMAIL.toLowerCase()

      if (!isSuperAdmin) {
        // Only check database for non-super-admin users
        const { data: adminData, error: adminError } = await supabase
          .from("admin_users")
          .select("email")
          .eq("email", normalizedEmail)
          .maybeSingle()

        if (adminError || !adminData) {
          throw new Error("You are not authorized to access the admin panel. Contact the super admin for access.")
        }
      }

      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/admin`,
          },
        })

        if (signUpError) {
          if (signUpError.message.includes("already registered")) {
            throw new Error("This email is already registered. Please login instead.")
          }
          throw signUpError
        }

        setMessage("Account created! Check your email to confirm, then login.")
        setMode("login")
        setPassword("")
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        })

        if (signInError) {
          if (signInError.message.includes("Invalid login")) {
            throw new Error(
              "Invalid email or password. If you haven't created an account yet, click 'Create Admin Account' below.",
            )
          }
          throw signInError
        }

        router.push("/admin")
        router.refresh()
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar px-4">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-3 mb-4">
            <Image src="/images/logo.png" alt="Team Chetak" width={56} height={56} className="rounded-lg" />
          </Link>
          <CardTitle className="text-primary">{mode === "login" ? "Admin Login" : "Create Admin Account"}</CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Sign in to access the Team Chetak admin dashboard"
              : "Create your admin account (must be pre-authorized)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="devanshu2089@gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "Create a password (min 6 chars)" : "Enter your password"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}
            {message && <p className="text-sm text-green-500 bg-green-500/10 p-3 rounded-lg">{message}</p>}

            <Button type="submit" className="w-full gap-2 bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                "Please wait..."
              ) : mode === "login" ? (
                <>
                  Sign In <LogIn className="h-4 w-4" />
                </>
              ) : (
                <>
                  Create Account <UserPlus className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-4">
            {mode === "login" ? (
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setMode("signup")
                  setError("")
                  setMessage("")
                }}
              >
                First time? Create Admin Account
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setMode("login")
                  setError("")
                  setMessage("")
                }}
              >
                Already have an account? Login
              </Button>
            )}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-foreground font-medium mb-2">First Time Setup:</p>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Enter your authorized email</li>
              <li>Click &quot;Create Admin Account&quot;</li>
              <li>Set your password and submit</li>
              <li>Check email for confirmation link</li>
              <li>Come back and login</li>
            </ol>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Back to website
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
