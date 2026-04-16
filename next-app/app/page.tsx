import { Navbar } from "@/components/Navbar"
import { CategoryGrid } from "@/components/CategoryGrid"
import { JobCard } from "@/components/JobCard"
import { JOBS } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Search, ChevronRight, Briefcase } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary px-4 py-20 text-primary-foreground">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />
          <div className="container mx-auto relative z-10 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
              Career opportunities <span className="text-blue-200">await.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
              One portal for all your career needs. From top-tier IT companies to 
              Government exams, OpportuNet connects you with your future.
            </p>
            
            <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white/10 p-2 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                  <input 
                    type="text" 
                    placeholder="Search by role, company or exam..."
                    className="w-full h-12 bg-white/10 rounded-xl pl-10 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  />
                </div>
                <Button size="lg" className="h-12 px-8 rounded-xl bg-white text-primary hover:bg-white/90 font-bold transition-all">
                  Search Careers
                </Button>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/60">
              <span>Popular: IBM • RRB • KPSC • SSC CGL • PG-CET</span>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Explore Categories</h2>
              <p className="text-muted-foreground mt-2">Find opportunities across five specialized modules</p>
            </div>
          </div>
          <CategoryGrid />
        </section>

        {/* Featured Jobs Section */}
        <section className="bg-secondary/30 px-4 py-16">
          <div className="container mx-auto">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Featured Opportunities</h2>
                <p className="text-muted-foreground mt-2">Handpicked listings for your career growth</p>
              </div>
              <Button variant="ghost" className="hidden sm:flex items-center gap-2">
                View all jobs <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {JOBS.slice(0, 4).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </section>

        {/* PG-CET Teaser */}
        <section className="container mx-auto px-4 py-16">
          <div className="rounded-3xl bg-gradient-to-br from-rose-500 to-orange-500 p-8 text-white sm:p-12">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold sm:text-4xl text-white">Preparing for PG-CET?</h2>
                <p className="mt-4 text-rose-50 text-lg">
                  Access comprehensive study materials, exam dates, and a step-by-step
                  application guide for the Post Graduate Common Entrance Test.
                </p>
                <div className="mt-8 flex gap-4">
                  <Button size="lg" className="rounded-xl bg-white text-rose-600 hover:bg-rose-50 font-bold">
                    View Exam Details
                  </Button>
                  <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 rounded-xl border border-white/20">
                    Download Resources
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-video rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                      <div className="h-8 w-8 rounded-full bg-white/20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Briefcase className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-primary">OpportuNet</span>
              </div>
              <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                The most reliable portal for job seekers and exam candidates in India. 
                Bridging the gap between talent and opportunity.
              </p>
            </div>
            <div>
              <h4 className="font-bold">Modules</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><Link href="/jobs?dept=IT" className="hover:text-primary">IT Department</Link></li>
                <li><Link href="/jobs?dept=Non-IT" className="hover:text-primary">Non-IT Department</Link></li>
                <li><Link href="/jobs?dept=Government" className="hover:text-primary">Government Jobs</Link></li>
                <li><Link href="/exams/pg-cet" className="hover:text-primary">PG-CET Portal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold">Contact</h4>
              <p className="mt-4 text-sm text-muted-foreground">
                Email: hello@opportunet.com<br />
                Phone: +91 800 123 4567<br />
                Address: Tech Park, Bangalore
              </p>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            © 2024 OpportuNet. Built with Next.js & TypeScript.
          </div>
        </div>
      </footer>
    </div>
  )
}

