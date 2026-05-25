/** An interaction's outcome. `success` and `failure` are internal terms; the UI shows 😊 / 😟. */
export type Outcome = 'success' | 'failure'

/** A single logged interaction in a challenge's time series. */
export interface TallyEvent {
  /** When it was logged, as epoch milliseconds (`Date.now()`). */
  t: number
  outcome: Outcome
}

/** A challenge's metadata. Its event time series lives separately, keyed by `id`. */
export interface Challenge {
  /** Stable UUID. Names can change without affecting stored history. */
  id: string
  name: string
  /** Archived challenges stay in storage and Settings but leave the main screen. */
  archived: boolean
}
