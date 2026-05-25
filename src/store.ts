import { computed, reactive } from 'vue'
import type { Challenge, Outcome, TallyEvent } from './types'

// localStorage layout (see plan): an ordered ID index, plus per-challenge metadata and events keys.
// Metadata and the time series are deliberately kept in separate keys.
const INDEX_KEY = 'tally:challenges'
const metaKey = (id: string) => `tally:challenge:${id}`
const eventsKey = (id: string) => `tally:events:${id}`

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage may be full or unavailable; in-memory state keeps the session working.
  }
}

// --- Reactive state (module-scoped singleton shared by every view) ---
const challenges = reactive<Challenge[]>([])
const events = reactive<Record<string, TallyEvent[]>>({})

function hydrate(): void {
  for (const id of readJSON<string[]>(INDEX_KEY, [])) {
    const meta = readJSON<Challenge | null>(metaKey(id), null)
    if (meta === null) continue
    challenges.push({ id: meta.id, name: meta.name, archived: meta.archived ?? false })
    events[id] = readJSON<TallyEvent[]>(eventsKey(id), [])
  }
}
hydrate()

function persistIndex(): void {
  writeJSON(INDEX_KEY, challenges.map((c) => c.id))
}

function persistMeta(challenge: Challenge): void {
  writeJSON(metaKey(challenge.id), challenge)
}

function persistEvents(id: string): void {
  writeJSON(eventsKey(id), events[id] ?? [])
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

// --- Derived views ---
export const activeChallenges = computed(() => challenges.filter((c) => !c.archived))
export const archivedChallenges = computed(() => challenges.filter((c) => c.archived))

// --- Actions ---

/** Create a challenge from a name. Returns null (and writes nothing) for a blank name. */
export function addChallenge(name: string): Challenge | null {
  const trimmed = name.trim()
  if (trimmed === '') return null
  const challenge: Challenge = { id: crypto.randomUUID(), name: trimmed, archived: false }
  challenges.push(challenge)
  events[challenge.id] = []
  persistMeta(challenge)
  persistEvents(challenge.id)
  persistIndex()
  return challenge
}

/** Rename a challenge by id. Events are untouched because they're keyed by id, not name. */
export function renameChallenge(id: string, name: string): void {
  const trimmed = name.trim()
  if (trimmed === '') return
  const challenge = challenges.find((c) => c.id === id)
  if (challenge === undefined) return
  challenge.name = trimmed
  persistMeta(challenge)
}

/** Archive a challenge (it leaves the main screen but keeps all its history). One-way from the UI. */
export function archiveChallenge(id: string): void {
  const challenge = challenges.find((c) => c.id === id)
  if (challenge === undefined || challenge.archived) return
  challenge.archived = true
  persistMeta(challenge)
}

/** Append a logged interaction to a challenge's time series. */
export function logOutcome(id: string, outcome: Outcome): void {
  const list = events[id]
  if (list === undefined) return
  list.push({ t: Date.now(), outcome })
  persistEvents(id)
}

/** How many interactions were logged for this challenge on the current local day. */
export function countToday(id: string): number {
  const list = events[id]
  if (list === undefined) return 0
  const now = new Date()
  return list.filter((e) => isSameLocalDay(new Date(e.t), now)).length
}
