import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Actor, AppEvent, Behaviours, ChainResult, Contact, EventType } from '../types'
import { DAY, deriveChain } from './engine'

// Events, the SIMULATED clock and demo behaviours, saved in localStorage.
const KEY = 'care-circle-state'
export const START = 8 * 60 // Day 0 (Friday) 08:00, SIMULATED

export const DEFAULT_BEHAVIOURS: Behaviours = { neighbour: 'noReply', family: 'noReply', community: 'noReply' }
// The demo path from the README: ends Resolved by Township Support.
export const STORY_BEHAVIOURS: Behaviours = { neighbour: 'neverReports', family: 'noReply', community: 'confirmsOk' }

export type Preset = 'normal' | 'missed' | 'help' | 'sample'

interface State {
  events: AppEvent[]
  now: number
  behaviours: Behaviours
}

const fresh = (): State => ({ events: [], now: START, behaviours: { ...DEFAULT_BEHAVIOURS } })

// A few quiet days before today, so the Family week looks lived in.
function history(): AppEvent[] {
  return [
    { type: 'CHECK_IN', time: -3 * DAY + 8 * 60 + 12, actor: 'resident' },
    { type: 'CHECK_IN', time: -2 * DAY + 7 * 60 + 55, actor: 'resident' },
    { type: 'HELP_REQUESTED', time: -2 * DAY + 10 * 60, actor: 'resident', meta: { task: 'groceries' } },
    { type: 'HELP_ACCEPTED', time: -2 * DAY + 10 * 60 + 6, actor: 'neighbour', meta: { task: 'groceries' } },
    { type: 'HELP_DONE', time: -2 * DAY + 11 * 60 + 20, actor: 'neighbour', meta: { task: 'groceries' } },
    { type: 'THANKS', time: -2 * DAY + 11 * 60 + 25, actor: 'resident', meta: { task: 'groceries' } },
    { type: 'CHECK_IN', time: -1 * DAY + 8 * 60 + 3, actor: 'resident' },
  ]
}

function presetState(p: Preset, behaviours: Behaviours): State {
  switch (p) {
    case 'normal':
      return { events: history(), now: START, behaviours: { ...DEFAULT_BEHAVIOURS } }
    case 'missed':
      return { events: [], now: 9 * 60, behaviours: { ...STORY_BEHAVIOURS } }
    case 'help':
      return {
        events: [...history(), { type: 'CHECK_IN', time: 8 * 60 + 5, actor: 'resident' }],
        now: 10 * 60,
        behaviours,
      }
    case 'sample':
      return { events: history(), now: 8 * 60 + 30, behaviours }
  }
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const s = JSON.parse(raw) as State
      if (Array.isArray(s.events) && typeof s.now === 'number' && s.behaviours) return s
    }
  } catch {
    // ignore
  }
  return fresh()
}

interface Store extends State {
  chain: ChainResult
  add: (type: EventType, actor: Actor, meta?: AppEvent['meta']) => void
  advance: (minutes: number) => void
  setBehaviour: (c: Contact, b: Behaviours[Contact]) => void
  preset: (p: Preset) => void
  reset: () => void
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state])

  const add = useCallback(
    (type: EventType, actor: Actor, meta?: AppEvent['meta']) =>
      setState((s) => ({ ...s, events: [...s.events, { type, time: s.now, actor, ...(meta ? { meta } : {}) }] })),
    [],
  )
  const advance = useCallback((minutes: number) => setState((s) => ({ ...s, now: s.now + minutes })), [])
  const setBehaviour = useCallback(
    (c: Contact, b: Behaviours[Contact]) => setState((s) => ({ ...s, behaviours: { ...s.behaviours, [c]: b } })),
    [],
  )
  const preset = useCallback((p: Preset) => setState((s) => presetState(p, s.behaviours)), [])
  const reset = useCallback(() => setState(fresh()), [])

  const chain = useMemo(() => deriveChain(state.events, state.now, state.behaviours), [state])

  const value: Store = { ...state, chain, add, advance, setBehaviour, preset, reset }
  return createElement(StoreContext.Provider, { value }, children)
}

export function useStore(): Store {
  const s = useContext(StoreContext)
  if (!s) throw new Error('useStore outside StoreProvider')
  return s
}
