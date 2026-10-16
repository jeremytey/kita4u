import type { ChainResult, Contact } from '../types'

// Read-only: which contact the case is with right now, for the one-sentence status on Home and Family.
export function latestContact(chain: ChainResult): { who: Contact; kind: 'asked' | 'checking' } | undefined {
  const active = chain.steps.slice(1).filter((s) => s.state !== 'waiting' && s.state !== 'notNeeded')
  const last = active.at(-1)
  if (!last) return undefined
  if (last.state === 'responded' && last.outcome === undefined) return { who: last.who as Contact, kind: 'checking' }
  if (last.state === 'asked') return { who: last.who as Contact, kind: 'asked' }
  const fallback = [...active].reverse().find((s) => s.state === 'asked' || s.state === 'responded')
  if (!fallback) return undefined
  return { who: fallback.who as Contact, kind: fallback.state === 'asked' ? 'asked' : 'checking' }
}
