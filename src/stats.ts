// Pure, dependency-free statistics over a challenge's event series.
// Imports only the TallyEvent type — no Vue, no localStorage — so it stays unit-testable.
// All date math is local-time and DST-safe: day/week starts are built from local Y/M/D
// components rather than millisecond arithmetic.
import type { TallyEvent } from './types'

/** One time bucket (a day or a week) with its success/failure tallies. */
export interface Bucket {
  /** Start-of-bucket instant: local midnight (daily) or local Monday midnight (weekly). */
  start: Date
  /** Short display label, e.g. "5/24" (day) or "May 24" (week start). */
  label: string
  success: number
  failure: number
}

export type Granularity = 'daily' | 'weekly'

const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

// --- local-time date helpers ---

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/** Component-based so it stays correct across DST transitions (not d + n*86400000). */
function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
}

/** Week starts on Monday. (Swap to `dow` if a Sunday-start week is ever preferred.) */
function startOfLocalWeek(d: Date): Date {
  const day = startOfLocalDay(d)
  const dow = day.getDay() // 0=Sun..6=Sat
  return addDays(day, -((dow + 6) % 7))
}

/** Whole-day difference between two local-midnight dates. */
function dayDiff(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / 86_400_000)
}

// --- core stats ---

/** Number of distinct local calendar days that have at least one event. */
export function distinctActiveDays(events: TallyEvent[]): number {
  const days = new Set<number>()
  for (const e of events) days.add(startOfLocalDay(new Date(e.t)).getTime())
  return days.size
}

/** All-time successes and total events. UI renders `${success}/${total}`. */
export function allTimeTotals(events: TallyEvent[]): { success: number; total: number } {
  let success = 0
  for (const e of events) if (e.outcome === 'success') success++
  return { success, total: events.length }
}

/**
 * Success rate over the past `days` local calendar days (today plus the previous `days - 1`).
 * `rate` is null when no events fell in the window.
 */
export function successRateWindow(
  events: TallyEvent[],
  days: number,
  now: Date = new Date(),
): { success: number; total: number; rate: number | null } {
  const cutoff = addDays(startOfLocalDay(now), -(days - 1)).getTime()
  let success = 0
  let total = 0
  for (const e of events) {
    if (e.t < cutoff) continue
    total++
    if (e.outcome === 'success') success++
  }
  return { success, total, rate: total === 0 ? null : success / total }
}

/**
 * Bucket events into a fixed-length series ending at the present:
 * - daily: 30 buckets, one per local day, last is today.
 * - weekly: 52 buckets, one per Monday-week, last is the current (partial) week.
 * Empty buckets stay zero so charts render gaps; out-of-range events are ignored.
 */
export function buildBuckets(
  events: TallyEvent[],
  granularity: Granularity,
  now: Date = new Date(),
): Bucket[] {
  const count = granularity === 'daily' ? 30 : 52
  const first =
    granularity === 'daily'
      ? addDays(startOfLocalDay(now), -(count - 1))
      : addDays(startOfLocalWeek(now), -(count - 1) * 7)

  const buckets: Bucket[] = []
  for (let i = 0; i < count; i++) {
    const start = granularity === 'daily' ? addDays(first, i) : addDays(first, i * 7)
    const label =
      granularity === 'daily'
        ? `${start.getMonth() + 1}/${start.getDate()}`
        : `${SHORT_MONTHS[start.getMonth()]} ${start.getDate()}`
    buckets.push({ start, label, success: 0, failure: 0 })
  }

  for (const e of events) {
    const eventStart =
      granularity === 'daily'
        ? startOfLocalDay(new Date(e.t))
        : startOfLocalWeek(new Date(e.t))
    const offset =
      granularity === 'daily'
        ? dayDiff(first, eventStart)
        : Math.floor(dayDiff(first, eventStart) / 7)
    const bucket = buckets[offset]
    if (bucket === undefined) continue
    bucket[e.outcome]++
  }

  return buckets
}

/**
 * Per-bucket trailing moving average of the success rate over `window` buckets.
 * Each value is the windowed aggregate success / total, or null when that window had no events.
 */
export function movingAverage(buckets: Bucket[], window: number): (number | null)[] {
  return buckets.map((_, i) => {
    let success = 0
    let total = 0
    for (let j = Math.max(0, i - window + 1); j <= i; j++) {
      const b = buckets[j]
      if (b === undefined) continue
      success += b.success
      total += b.success + b.failure
    }
    return total === 0 ? null : success / total
  })
}
