"use client"

import { Navbar } from "@/components/Navbar"
import { MOCK_APPLICATIONS, JOBS, getHrEmail, type JobListing } from "@/lib/data"
import { 
  Users, 
  Search, 
  Filter, 
  MessageCircle, 
  CheckCircle, 
  XCircle,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

async function copyHrAddress(job: JobListing | undefined) {
  const email = (job?.hrEmail && job.hrEmail.trim()) || getHrEmail(job ?? {})
  try {
    await navigator.clipboard.writeText(email)
    return { ok: true as const, email }
  } catch {
    return { ok: false as const, email }
  }
}

export default function HRDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [mailAction, setMailAction] = useState<{ appId: string; message: string } | null>(null)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-4">
               <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
               HR Recruiting Mode
            </div>
            <h1 className="text-4xl font-black tracking-tight">Applicant Manager</h1>
            <p className="text-muted-foreground mt-2">View and manage applications for your active listings.</p>
          </div>
          
          <div className="flex bg-card border rounded-2xl p-2 gap-2 shadow-sm">
             <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                   type="text"
                   placeholder="Search by candidate name or ID..."
                   className="w-full bg-transparent pl-10 pr-4 py-2 border-none focus:outline-none"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <Button variant="secondary" className="rounded-xl gap-2 font-bold px-4">
                <Filter className="h-4 w-4" /> Filter
             </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6">
           {/* Applicant Table/List */}
           <div className="rounded-[2rem] border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-secondary/50 border-b">
                          <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Candidate & Application</th>
                          <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Job Role</th>
                          <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                          <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Date Applied</th>
                          <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y">
                       {MOCK_APPLICATIONS.map((app) => {
                          const job = JOBS.find(j => j.id === app.jobId)
                          return (
                             <tr key={app.id} className="hover:bg-secondary/20 transition-colors">
                                <td className="px-8 py-6">
                                   <div className="flex items-center gap-4">
                                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                         {app.userId.substring(0, 2).toUpperCase()}
                                      </div>
                                      <div>
                                         <p className="font-bold text-lg">Candidate #{app.userId.split('-')[1]}</p>
                                         <p className="text-xs font-mono text-muted-foreground">{app.trackingId}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-8 py-6">
                                   <p className="font-bold">{job?.title}</p>
                                   <p className="text-sm text-muted-foreground">{job?.company}</p>
                                </td>
                                <td className="px-8 py-6">
                                   <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                                      app.status === 'Under Review' ? 'bg-orange-500/10 text-orange-600' : 
                                      app.status === 'Offered' ? 'bg-emerald-500/10 text-emerald-600' :
                                      'bg-primary/10 text-primary'
                                   }`}>
                                      <Clock className="h-3 w-3" />
                                      {app.status}
                                   </span>
                                </td>
                                <td className="px-8 py-6 text-sm font-medium text-muted-foreground">
                                   {new Date(app.appliedDate).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-6">
                                   <div className="flex flex-col items-end gap-1">
                                   <div className="flex items-center justify-end gap-2">
                                      <Button
                                         type="button"
                                         variant="ghost"
                                         size="sm"
                                         className="rounded-xl h-10 px-4 font-bold text-primary hover:bg-primary/10 gap-2"
                                         onClick={() => {
                                            void (async () => {
                                              const result = await copyHrAddress(job)
                                              if (result.ok) {
                                                setMailAction({
                                                  appId: app.id,
                                                  message: "HR email copied — paste it into your mail app to send.",
                                                })
                                              } else {
                                                setMailAction({
                                                  appId: app.id,
                                                  message: `HR email: ${result.email}`,
                                                })
                                              }
                                              window.setTimeout(() => {
                                                setMailAction((cur) => (cur?.appId === app.id ? null : cur))
                                              }, 4000)
                                            })()
                                         }}
                                      >
                                         <MessageCircle className="h-4 w-4" /> Reply
                                      </Button>
                                      <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-emerald-600 hover:bg-emerald-50 content-center">
                                         <CheckCircle className="h-5 w-5" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-rose-600 hover:bg-rose-50">
                                         <XCircle className="h-5 w-5" />
                                      </Button>
                                   </div>
                                   {mailAction?.appId === app.id && (
                                      <p className="max-w-[220px] text-right text-xs text-muted-foreground">
                                         {mailAction.message}
                                      </p>
                                   )}
                                   </div>
                                </td>
                             </tr>
                          )
                       })}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Empty State */}
           {MOCK_APPLICATIONS.length === 0 && (
              <div className="text-center py-20 bg-card border rounded-[2rem]">
                 <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                 <h3 className="text-xl font-bold">No applications yet</h3>
                 <p className="text-muted-foreground mt-2">Active listings will appear here once candidates start applying.</p>
              </div>
           )}
        </div>
      </main>
    </div>
  )
}
