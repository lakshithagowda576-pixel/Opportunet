"use client"

import { Navbar } from "@/components/Navbar"
import { JobCard } from "@/components/JobCard"
import { JOBS } from "@/lib/data"
import { 
  Search, 
  Cpu, 
  Briefcase, 
  Landmark, 
  Building2 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useMemo, Suspense } from "react"

type DeptTab = "All" | "IT" | "Non-IT" | "Government" | "Central Government"

const DEPT_PARAM_MAP: Record<string, DeptTab> = {
  IT: "IT",
  "Non-IT": "Non-IT",
  Government: "Government",
  "Central-Government": "Central Government",
}

function deptTabFromParam(raw: string | null): DeptTab {
  if (!raw) return "All"
  return DEPT_PARAM_MAP[raw] ?? "All"
}

function deptQueryValue(tab: DeptTab): string | null {
  if (tab === "All") return null
  if (tab === "Central Government") return "Central-Government"
  return tab
}

export default function JobsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <Suspense fallback={<div className="container mx-auto p-20 text-center font-bold">Loading portal...</div>}>
        <JobsContent />
      </Suspense>
    </div>
  )
}

function JobsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const deptKey = searchParams.get("dept")
  const activeTab = useMemo(() => deptTabFromParam(deptKey), [deptKey])

  const [search, setSearch] = useState("")

  function setActiveTab(tab: DeptTab) {
    const next = new URLSearchParams(searchParams.toString())
    const q = deptQueryValue(tab)
    if (q) next.set("dept", q)
    else next.delete("dept")
    const qs = next.toString()
    router.push(qs ? `/jobs?${qs}` : "/jobs")
  }

  const filteredJobs = useMemo(() => {
    return JOBS.filter(job => {
      const matchesTab = activeTab === 'All' || job.department === activeTab
      const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                            job.company.toLowerCase().includes(search.toLowerCase())
      return matchesTab && matchesSearch
    })
  }, [activeTab, search])

  const tabs: { id: DeptTab; label: string; icon: typeof Briefcase }[] = [
    { id: "All", label: "All Careers", icon: Briefcase },
    { id: "IT", label: "IT Dept", icon: Cpu },
    { id: "Non-IT", label: "Non-IT", icon: Building2 },
    { id: "Government", label: "State Govt", icon: Landmark },
    { id: "Central Government", label: "Central Govt", icon: Building2 },
  ]

  return (
    <main className="flex-1">
      {/* Header Search */}
      <section className="bg-primary/5 border-b py-12 px-4">
         <div className="container mx-auto">
            <div className="max-w-3xl mx-auto space-y-8 text-center">
               <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Explore Opportunities</h1>
               <p className="text-lg text-muted-foreground">Find your next career move across our five specialized departments.</p>
               
               <div className="flex flex-col sm:flex-row gap-3 bg-card border p-2 rounded-2xl shadow-xl">
                  <div className="flex-1 relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                     <input 
                        type="text"
                        placeholder="Search by job title, company name..."
                        className="w-full bg-transparent pl-10 pr-4 py-3 border-none focus:outline-none font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                     />
                  </div>
                  <Button size="lg" className="rounded-xl px-10 font-bold h-12">Search</Button>
               </div>
            </div>
         </div>
      </section>

      {/* Filter Tabs */}
      <section className="container mx-auto px-4 py-12">
         <div className="flex flex-wrap justify-center gap-3 mb-12">
            {tabs.map((tab) => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all border ${
                     activeTab === tab.id 
                     ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105' 
                     : 'bg-card hover:bg-secondary border-border text-muted-foreground'
                  }`}
               >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
               </button>
            ))}
         </div>

         {/* Results Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredJobs.map((job) => (
               <JobCard key={job.id} job={job} />
            ))}
         </div>

         {filteredJobs.length === 0 && (
            <div className="text-center py-20">
               <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-muted-foreground mb-6">
                  <Search className="h-10 w-10" />
               </div>
               <h2 className="text-2xl font-bold">No results found</h2>
               <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms.</p>
               <Button 
                  variant="link" 
                  className="mt-4 text-primary font-bold"
                  onClick={() => {
                    setSearch("")
                    setActiveTab("All")
                  }}
               >
                  Clear all filters
               </Button>
            </div>
         )}
      </section>
    </main>
  )
}
