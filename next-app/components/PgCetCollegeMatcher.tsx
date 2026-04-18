"use client"

import { useState, useMemo } from "react"
import {
  PG_CET_SCORE_MAX,
  getMatchingCollegesForPgCetScore,
  getPgCetScorePercentOfMax,
  type CollegeListing,
} from "@/lib/data"
import { Button } from "@/components/ui/button"
import {
  Building2,
  MapPin,
  BedDouble,
  Home,
  Banknote,
  Sparkles,
  TrendingUp,
  School,
} from "lucide-react"

export function PgCetCollegeMatcher() {
  const [input, setInput] = useState("")
  const [submittedScore, setSubmittedScore] = useState<number | null>(null)

  const matches = useMemo(() => {
    if (submittedScore === null) return [] as CollegeListing[]
    return getMatchingCollegesForPgCetScore(submittedScore)
  }, [submittedScore])

  const percentileLabel =
    submittedScore !== null ? getPgCetScorePercentOfMax(submittedScore) : null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const raw = input.trim()
    if (raw === "") return
    const n = Number(raw)
    if (!Number.isFinite(n)) return
    const score = Math.round(n)
    if (score < 0 || score > PG_CET_SCORE_MAX) return
    setSubmittedScore(score)
  }

  function handleReset() {
    setSubmittedScore(null)
    setInput("")
  }

  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-sm md:p-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-500/15 text-rose-600">
            <School className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">College suggestions from your score</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground leading-relaxed">
              Enter your PG-CET marks (out of {PG_CET_SCORE_MAX}) to see matching colleges with fees, facilities,
              overview, and PG hostel availability.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <label htmlFor="pgcet-score" className="text-sm font-bold text-foreground">
            Your PG-CET score
          </label>
          <div className="flex items-center gap-2 rounded-2xl border bg-background px-4 py-2 focus-within:ring-2 focus-within:ring-rose-500/30">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <input
              id="pgcet-score"
              type="number"
              required
              min={0}
              max={PG_CET_SCORE_MAX}
              step={1}
              inputMode="numeric"
              placeholder={`e.g. 480 (max ${PG_CET_SCORE_MAX})`}
              className="min-w-0 flex-1 border-0 bg-transparent py-2 text-lg font-bold outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <span className="text-xs font-semibold text-muted-foreground">/ {PG_CET_SCORE_MAX}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" className="h-12 rounded-2xl px-8 font-bold">
            Submit score
          </Button>
          {submittedScore !== null && (
            <Button type="button" variant="outline" className="h-12 rounded-2xl font-bold" onClick={handleReset}>
              New score
            </Button>
          )}
        </div>
      </form>

      {submittedScore !== null && (
        <div className="mt-10 space-y-8">
          <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 px-6 py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Submitted score</p>
              <p className="text-3xl font-black text-rose-700 dark:text-rose-400">
                {submittedScore}
                <span className="text-lg font-bold text-muted-foreground"> / {PG_CET_SCORE_MAX}</span>
              </p>
            </div>
            <div className="h-10 w-px bg-border hidden sm:block" aria-hidden />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Score vs max (%)</p>
              <p className="text-2xl font-black text-primary">{percentileLabel}%</p>
            </div>
            <div className="h-10 w-px bg-border hidden sm:block" aria-hidden />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Matching colleges</p>
              <p className="text-2xl font-black text-primary">{matches.length}</p>
            </div>
          </div>

          {matches.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-muted/30 p-10 text-center">
              <p className="font-bold text-lg">No matching colleges for this score</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a higher score, or use &quot;New score&quot; to enter a different value.
              </p>
            </div>
          ) : (
            <ul className="space-y-6">
              {matches.map((college) => (
                <li key={college.id}>
                  <CollegeCard college={college} userScore={submittedScore} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}

function CollegeCard({ college, userScore }: { college: CollegeListing; userScore: number }) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border bg-background shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 border-b bg-secondary/30 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Building2 className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">{college.name}</h3>
            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              {college.location}
            </p>
            <p className="mt-2 text-xs font-semibold text-muted-foreground">
              Minimum indicative score: <span className="text-foreground">{college.minPgCetScore}</span>
              {userScore >= college.minPgCetScore && (
                <span className="ml-2 text-emerald-600 dark:text-emerald-400">· Your score qualifies for this tier</span>
              )}
            </p>
          </div>
        </div>
        <div
          className={`flex shrink-0 items-center gap-2 self-start rounded-full border px-4 py-2 text-xs font-bold ${
            college.pgHostelAvailable
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
              : "border-muted bg-muted/50 text-muted-foreground"
          }`}
        >
          {college.pgHostelAvailable ? (
            <>
              <BedDouble className="h-4 w-4" />
              PG hostel available
            </>
          ) : (
            <>
              <Home className="h-4 w-4" />
              No on-campus PG hostel
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            <Banknote className="h-4 w-4 text-rose-600" />
            Fees structure
          </h4>
          <p className="text-sm leading-relaxed text-foreground">{college.feesStructure}</p>
        </div>
        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            <Sparkles className="h-4 w-4 text-rose-600" />
            About the college
          </h4>
          <p className="text-sm leading-relaxed text-muted-foreground">{college.about}</p>
        </div>
      </div>

      <div className="border-t px-6 py-5">
        <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Facilities</h4>
        <ul className="flex flex-wrap gap-2">
          {college.facilities.map((f) => (
            <li
              key={f}
              className="rounded-full border bg-secondary/40 px-3 py-1.5 text-xs font-semibold text-secondary-foreground"
            >
              {f}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
