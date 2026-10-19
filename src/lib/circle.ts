import { useSyncExternalStore } from 'react'

// The resident's Circle setup, Mei's invitation and a few demo choices. Saved apart from the event log
// (own localStorage key) and never read by the engine: nothing here changes the chain.
const KEY = 'care-circle-circle'

export type Invite = 'none' | 'pending' | 'accepted' | 'declined'

export interface CircleState {
  setupDone: boolean
  prefs: { groceries: boolean; phone: boolean; clinic: boolean }
  meiInvite: Invite
  introInterested: boolean
  parcel: 'open' | 'helping' | 'cantNow'
}

const DEFAULT: CircleState = {
  setupDone: false,
  prefs: { groceries: true, phone: true, clinic: false },
  meiInvite: 'none',
  introInterested: false,
  parcel: 'open',
}

function load(): CircleState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT
    const s = JSON.parse(raw) as Partial<CircleState>
    if (!s || typeof s !== 'object') return DEFAULT
    return { ...DEFAULT, ...s, prefs: { ...DEFAULT.prefs, ...s.prefs } }
  } catch {
    return DEFAULT
  }
}

// One cached object: getSnapshot returns the same reference until something changes.
let state = load()
const listeners = new Set<() => void>()

function commit(next: CircleState) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // ignore (private mode, storage full)
  }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

const getSnapshot = () => state

export function useCircle(): CircleState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export function setCircle(partial: Partial<CircleState>) {
  commit({ ...state, ...partial })
}

export function resetCircle() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
  state = DEFAULT
  listeners.forEach((l) => l())
}
