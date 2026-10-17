import type { StrKey, useT } from '../strings'
import type { ChainResult, Contact } from '../types'
import { dayOf } from './engine'

type Tr = ReturnType<typeof useT>

// Away until: "tomorrow 09:00" for the next day, otherwise the weekday ("Sun 09:00").
export function awayWhen(until: number, now: number, t: Tr): string {
  if (dayOf(until) === dayOf(now) + 1) return t('whenTomorrow')
  const wd = ((dayOf(until) % 7) + 7) % 7
  return t('whenOnDay', { day: t(`day${wd}` as StrKey) })
}

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
