"use client"

import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { BarChart3, Briefcase, BookOpen, Users, Plus, Settings, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const mockJobs = [
  { id: 1, title: "Frontend Developer", company: "Tech Corp", location: "Bangalore", salary: "8-12 LPA" },
  { id: 2, title: "Backend Developer", company: "StartUp Inc", location: "Mumbai", salary: "10-15 LPA" },
  { id: 3, title: "Full Stack Developer", company: "WebFlow", location: "Delhi", salary: "12-18 LPA" },
]

const mockApplications = [
  { id: 1, jobId: 1, candidateName: "John Doe", status: "Pending", appliedAt: "2024-01-15" },
  { id: 2, jobId: 1, candidateName: "Jane Smith", status: "Pending", appliedAt: "2024-01-14" },
  { id: 3, jobId: 2, candidateName: "Bob Johnson", status: "Pending", appliedAt: "2024-01-16" },
]

export default function AdminDashboard() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null)

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
                  onClick={() => setSelectedJob(job.id)}
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
      </main>
    </div>
  )
}
                           <div className="border-t bg-secondary/20 p-6 space-y-3">
                             {jobApps.map((app) => (
                               <div key={app.id} className="bg-card rounded-xl p-4 flex items-center justify-between border">
                                 <div className="flex-1">
                                   <p className="font-semibold text-sm">{app.applicantName}</p>
                                   <p className="text-xs text-muted-foreground">{app.applicantEmail}</p>
                                   <p className="text-xs text-muted-foreground mt-1">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                                 </div>
                                 <div className="flex items-center gap-2">
                                   <select
                                     value={app.status}
                                     onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                                     disabled={updatingId === app.id}
                                     className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${STATUS_COLORS[app.status]} cursor-pointer disabled:opacity-50`}
                                   >
                                     {STATUS_OPTIONS.map((status) => (
                                       <option key={status} value={status}>{status}</option>
                                     ))}
                                   </select>
                                   {updatingId === app.id && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                                 </div>
                               </div>
                             ))}
                           </div>
                         )}

                         {isExpanded && jobApps.length === 0 && (
                           <div className="border-t bg-secondary/20 p-6 text-center text-muted-foreground text-sm">
                             No applications for this job yet
                           </div>
                         )}
                       </div>
                     )
                   })}
                </div>
              )}
           </div>

           {/* Platform Health */}
           <div className="space-y-6">
              <h2 className="text-2xl font-black">Platform Health</h2>

              <div className="rounded-[2.5rem] border bg-primary p-8 text-primary-foreground shadow-xl shadow-primary/20">
                 <h3 className="font-bold text-lg">System Status</h3>
                 <p className="text-sm text-primary-foreground/80 mt-2">All systems are operational. Database is responsive and emails are configured.</p>
                 <Button className="w-full mt-6 bg-white text-primary hover:bg-white/90 rounded-2xl font-bold gap-2">
                    View Logs <ArrowUpRight className="h-4 w-4" />
                 </Button>
              </div>

              <div className="rounded-[2.5rem] border bg-card p-6 space-y-3">
                 <h3 className="font-bold">Status Breakdown</h3>
                 {STATUS_OPTIONS.map((status) => {
                   const count = applications.filter(a => a.status === status).length
                   return (
                     <div key={status} className="flex items-center justify-between text-sm">
                       <span className={`px-3 py-1 rounded-lg border ${STATUS_COLORS[status as keyof typeof STATUS_COLORS]}`}>
                         {status}
                       </span>
                       <span className="font-bold">{count}</span>
                     </div>
                   )
                 })}
              </div>
           </div>
        </div>
      </main>
    </div>
  )
}
