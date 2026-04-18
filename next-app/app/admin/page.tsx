"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import {
  BarChart3,
  Briefcase,
  BookOpen,
  Users,
  Plus,
  Settings,
  ArrowUpRight,
  ShieldCheck,
  Mail,
  KeyRound,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { IntegrationHealth } from "@/lib/integration-status"

const mockJobs = [
  { id: 1, title: "Frontend Developer", company: "Tech Corp", location: "Bangalore", salary: "8-12 LPA" },
  { id: 2, title: "Backend Developer", company: "StartUp Inc", location: "Mumbai", salary: "10-15 LPA" },
  { id: 3, title: "Full Stack Developer", company: "WebFlow", location: "Delhi", salary: "12-18 LPA" },
]

const mockApplications = [
  { id: 1, jobId: 1, candidateName: "John Doe", status: "Pending", appliedAt: "2024-01-15" },
  { id: 2, jobId: 1, candidateName: "Jane Smith", status: "Pending", appliedAt: "2024-01-14" },
  { id: 3, jobId: 2, candidateName: "Bob Johnson", status: "Reviwed", appliedAt: "2024-01-16" },
]

export default function AdminDashboard() {
  const [integrations, setIntegrations] = useState<IntegrationHealth | null>(null)
  const [integrationsLoading, setIntegrationsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch("/api/health/integrations", { cache: "no-store" })
        const data = (await res.json()) as IntegrationHealth
        if (!cancelled) setIntegrations(data)
      } catch {
        if (!cancelled) setIntegrations(null)
      } finally {
        if (!cancelled) setIntegrationsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const stats = [
    { label: "Total Applications", count: 42, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-500/10" },
    { label: "Pending", count: 28, icon: Users, color: "text-amber-600", bg: "bg-amber-500/10" },
    { label: "In Review", count: 10, icon: BookOpen, color: "text-purple-600", bg: "bg-purple-500/10" },
    { label: "Interview Round", count: 4, icon: ArrowUpRight, color: "text-green-600", bg: "bg-green-500/10" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
              Admin Control Center
              <Settings className="h-6 w-6 text-muted-foreground" />
            </h1>
            <p className="text-muted-foreground mt-2">Manage job postings and track applications</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl font-bold h-12 px-6">Export Data</Button>
            <Button className="rounded-xl font-bold h-12 px-6 gap-2">
              <Plus className="h-5 w-5" /> New Job
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((s, i) => (
            <div
              key={i}
              className="rounded-3xl border bg-card p-8 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`h-14 w-14 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center`}>
                <s.icon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
                <p className="text-3xl font-black mt-1">{s.count}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-primary" />
              Job Listings
            </h2>
            <div className="space-y-4">
              {mockJobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-3xl border bg-card p-6 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{job.salary}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Applications Sidebar */}
          <div className="bg-card rounded-3xl border p-6">
            <h2 className="text-xl font-black mb-4">Applications</h2>
            <div className="space-y-3">
              {mockApplications.map((app) => (
                <div key={app.id} className="p-3 bg-secondary/30 rounded-xl">
                  <p className="font-bold text-sm">{app.candidateName}</p>
                  <p className="text-xs text-muted-foreground mt-1">{app.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-12 rounded-3xl border bg-card p-8">
          <h2 className="text-xl font-black tracking-tight">Integrations</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Status is derived from environment variables loaded for this app (including parent{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">.env</code> in development).
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-4 rounded-2xl border bg-background p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <KeyRound className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold">OAuth (Supabase)</p>
                {integrationsLoading ? (
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Checking…
                  </p>
                ) : integrations?.oauth ? (
                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-emerald-600">
                    <ShieldCheck className="h-4 w-4 shrink-0" /> Configured
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                    Set <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                    <code className="text-xs">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>, then enable Google
                    under Supabase → Authentication → Providers. Add redirect{" "}
                    <code className="break-all text-xs">…/auth/callback</code>.
                  </p>
                )}
                <Button asChild variant="outline" size="sm" className="mt-3 rounded-lg font-bold">
                  <Link href="/auth/login">Open sign-in</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl border bg-background p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold">Email notifications</p>
                {integrationsLoading ? (
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Checking…
                  </p>
                ) : integrations?.email ? (
                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-emerald-600">
                    <ShieldCheck className="h-4 w-4 shrink-0" /> Configured ({integrations.emailProvider})
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                    Set <code className="text-xs">SMTP_HOST</code>, <code className="text-xs">SMTP_USER</code>,{" "}
                    <code className="text-xs">SMTP_PASS</code> (and optional <code className="text-xs">SMTP_FROM</code>
                    ), or set <code className="text-xs">RESEND_API_KEY</code> for Resend.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
