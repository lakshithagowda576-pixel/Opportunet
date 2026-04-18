import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-2xl font-black tracking-tight">Sign-in could not be completed</h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          The OAuth callback did not return a valid session. Check that the redirect URL is added in your
          Supabase project (Authentication → URL configuration) and that the Google provider is enabled with
          valid client credentials.
        </p>
        <Button asChild className="mt-8 rounded-xl font-bold">
          <Link href="/auth/login">Try again</Link>
        </Button>
        <Button asChild variant="ghost" className="mt-2 rounded-xl font-bold">
          <Link href="/">Back home</Link>
        </Button>
      </main>
    </div>
  )
}
