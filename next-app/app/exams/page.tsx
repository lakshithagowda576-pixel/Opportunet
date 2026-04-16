"use client"

import { Navbar } from "@/components/Navbar"
import { EXAMS } from "@/lib/data"
import { GraduationCap, Calendar, Download, ChevronRight, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ExamsPortal() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-rose-500/5 border-b py-20">
           <div className="container mx-auto px-4 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500 text-white mb-6 shadow-xl shadow-rose-500/20">
                 <GraduationCap className="h-8 w-8" />
              </div>
              <h1 className="text-5xl font-black tracking-tight mb-4">Exam Hub</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                 Your one-stop destination for PG-CET, UPSC, SSC and other competitive examination resources.
              </p>
           </div>
        </section>

        <section className="container mx-auto px-4 py-16">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {EXAMS.map((exam) => (
                 <div key={exam.id} className="group relative rounded-[2.5rem] border bg-card p-8 transition-all hover:shadow-2xl hover:shadow-rose-500/5 hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-6">
                       <span className="rounded-full bg-rose-500/10 px-4 py-1.5 text-xs font-bold text-rose-600 uppercase tracking-widest">
                          {exam.category}
                       </span>
                       <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                          <Download className="h-5 w-5" />
                       </div>
                    </div>
                    
                    <h3 className="text-2xl font-black mb-4">{exam.title}</h3>
                    <p className="text-muted-foreground line-clamp-2 mb-8">{exam.description}</p>
                    
                    <div className="space-y-4 mb-8">
                       <div className="flex items-center gap-3 text-sm font-bold">
                          <Calendar className="h-5 w-5 text-rose-500" />
                          Exam Date: {new Date(exam.examDate).toLocaleDateString()}
                       </div>
                    </div>
                    
                    <Link href={`/exams/${exam.id === 'pgcet-1' ? 'pg-cet' : exam.id}`}>
                       <Button className="w-full rounded-2xl h-14 font-bold text-lg group-hover:bg-rose-600 transition-colors">
                          View Details <ChevronRight className="ml-2 h-5 w-5" />
                       </Button>
                    </Link>
                 </div>
              ))}
              
              {/* Featured Card for other exams */}
              <div className="rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center p-8 text-center bg-secondary/10">
                 <div className="h-16 w-16 flex items-center justify-center rounded-full bg-secondary text-muted-foreground mb-4">
                    <Search className="h-8 w-8" />
                 </div>
                 <h3 className="text-xl font-bold">More Exams Coming Soon</h3>
                 <p className="text-sm text-muted-foreground mt-2">We are adding UPSC, SSC CGL and KPSC specific portals shortly.</p>
                 <Button variant="outline" className="mt-6 rounded-xl font-bold">Get Notified</Button>
              </div>
           </div>
        </section>
      </main>
    </div>
  )
}
