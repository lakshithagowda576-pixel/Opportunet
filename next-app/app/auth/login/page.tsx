"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/client"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [message, setMessage] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function signInWithGoogle() {
    setMessage(null)
    setPending(true)
    try {
      const supabase = createClient()
      const origin = window.location.origin
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      })
      if (error) {
        setMessage(error.message)
        setPending(false)
        return
      }
      if (data.url) {
        window.location.assign(data.url)
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Sign-in failed")
      setPending(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-lg">
          <h1 className="text-center text-2xl font-black tracking-tight">Sign in</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Use Google via Supabase Auth. Enable the Google provider and redirect URLs in your Supabase
            dashboard.
          </p>
          <Button
            type="button"
            className="mt-8 h-12 w-full rounded-2xl text-base font-bold"
            disabled={pending}
            onClick={() => void signInWithGoogle()}
          >
            {pending ? "Redirecting…" : "Continue with Google"}
          </Button>
          {message && <p className="mt-4 text-center text-sm text-destructive">{message}</p>}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link href="/" className="font-semibold text-primary hover:underline">
              Return home
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
