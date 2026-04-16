"use client"

import { useParams } from "next/navigation"
import { JOBS } from "@/lib/data"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Mail, 
  ChevronLeft, 
  CheckCircle2, 
  Globe,
  Building2
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function JobDetails() {
  const { id } = useParams()
  const job = JOBS.find(j => j.id === id)
  const [isApplying, setIsApplying] = useState(false)
  const [trackId, setTrackId] = useState<string | null>(null)

  if (!job) return <div>Job not found</div>

  const handleApply = () => {
    setIsApplying(true)
    // Simulate application process
    setTimeout(() => {
      setTrackId(`OPT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`)
      setIsApplying(false)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to listings
        </Link>

        {trackId ? (
          <div className="mx-auto max-w-2xl rounded-3xl border-2 border-emerald-500/20 bg-emerald-500/5 p-8 text-center animate-in zoom-in duration-300">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-bold">Application Submitted!</h2>
            <p className="mt-4 text-muted-foreground">
              Your application for <span className="font-bold text-foreground">{job.title}</span> at <span className="font-bold text-foreground">{job.company}</span> has been received.
            </p>
            <div className="mt-8 rounded-2xl bg-card border p-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Your Unique Tracking ID</p>
              <p className="mt-2 text-4xl font-mono font-black text-primary">{trackId}</p>
              <p className="mt-4 text-sm text-muted-foreground">Keep this ID to monitor your application progress in your dashboard.</p>
            </div>
            <div className="mt-8 flex gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="rounded-xl px-8">Go to Dashboard</Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="rounded-xl px-8">Browse More Jobs</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div className="flex flex-col gap-6 md:flex-row md:items-center justify-between rounded-3xl border bg-card p-8">
                <div className="flex items-center gap-6">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-3xl font-bold italic shadow-xl shadow-primary/20">
                    {job.company[0]}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
                    <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">{job.company}</span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{job.department}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="rounded-2xl h-14 px-10 text-lg font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                  onClick={handleApply}
                  disabled={isApplying}
                >
                  {isApplying ? "Processing..." : "Apply Now"}
                </Button>
              </div>

              {/* Description */}
              <div className="rounded-3xl border bg-card p-8">
                <h2 className="text-xl font-bold mb-4">Job Description</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-lg">
                  {job.description}
                </p>

                <h2 className="text-xl font-bold mt-10 mb-6">Requirements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {job.requirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-2xl bg-secondary/50 p-4 border border-border/50">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="font-medium">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div className="rounded-3xl border bg-card p-8">
                <h2 className="text-xl font-bold mb-6">Steps to Apply</h2>
                <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-primary/10">
                  {job.applySteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-4 relative">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-bold z-10">
                        {i + 1}
                      </div>
                      <div className="pt-1">
                        <p className="font-bold text-lg">{step}</p>
                        <p className="text-sm text-muted-foreground mt-1 text-balance">Follow this instruction carefully to ensure your application is processed successfully.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="space-y-6">
              <div className="rounded-3xl border bg-card p-6 divide-y divide-border/50">
                <div className="pb-4">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Quick Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-sm font-bold">{job.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Job Type & Shift</p>
                        <p className="text-sm font-bold">{job.type} • {job.shift}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="py-4">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Application Window</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Opening Date</p>
                        <p className="text-sm font-bold">{new Date(job.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Closing Date</p>
                        <p className="text-sm font-bold">{new Date(job.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Contact & Support</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">HR Contacts</p>
                        <p className="text-sm font-bold truncate">{job.hrEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Official Link</p>
                        <a href={job.officialUrl} target="_blank" className="text-sm font-bold text-primary hover:underline">Apply Externally</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-primary p-6 text-primary-foreground">
                <h3 className="font-bold">Avoid Frauds</h3>
                <p className="mt-2 text-xs text-primary-foreground/70 leading-relaxed">
                  Always verify the recruiter through OpportuNet verified badges. 
                  Never pay for job applications.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
