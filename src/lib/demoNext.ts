import {
  BEHAVIOUR_OUTCOME,
  BEHAVIOUR_REPLY,
  DAY,
  dayOf,
  FIRST_ALERT_AFTER_REMINDER,
  OUTCOME_TIMEOUT,
  REPLY_TIMEOUT,
  WINDOW_END,
} from './engine'
import { useStore } from './store'
import type { Behaviours, ChainResult, Contact } from '../types'

// Presenter helper, read-only: the next SIMULATED time (> now) at which deriveChain's result can change, or null when
// the story is finished. It only reads the chain and the engine's exported delays; it never decides anything itself.
export function nextMilestone(chain: ChainResult, now: number, behaviours: Behaviours): number | null {
  const { status } = chain
  if (status === 'resolved' || status === 'unresolved' || status === 'paused' || status === 'needsHelp') return null

  const candidates: number[] = []
  if (status === 'none') {
    // Before 09:00 with no check-in the case can still open. After the window (checked in, or away at 09:00): nothing.
    const windowEnd = dayOf(now) * DAY + WINDOW_END
    if (chain.checkedInAt !== undefined || now >= windowEnd) return null
    candidates.push(windowEnd)
  } else if (chain.reminderAt !== undefined) {
    candidates.push(chain.reminderAt, chain.reminderAt + FIRST_ALERT_AFTER_REMINDER)
  }

  for (const step of chain.steps) {
    if (step.who === 'you' || step.time === undefined) continue
    const who: Contact = step.who
    const b = behaviours[who]
    if (step.state === 'asked') {
      if (b !== 'noReply') candidates.push(step.time + BEHAVIOUR_REPLY) // the demo reply arrives
      candidates.push(step.time + REPLY_TIMEOUT) // or the 2h reply window ends
    }
    if (step.state === 'responded' && step.outcome === undefined) {
      // The demo confirmation only follows a demo "I'll check" (a real tap overrides the behaviour).
      const simulated = chain.derived.some((e) => e.type === 'HUMAN_AWARE' && e.actor === who && e.meta?.simulated)
      if (b === 'confirmsOk' && simulated) candidates.push(step.time + BEHAVIOUR_OUTCOME)
      candidates.push(step.time + OUTCOME_TIMEOUT) // or the 1h outcome window ends
    }
  }

  const later = candidates.filter((t) => t > now)
  return later.length ? Math.min(...later) : null
}

// The next simulated moment for the current store, or null.
export function useNextStep(): number | null {
  const { chain, now, behaviours } = useStore()
  return nextMilestone(chain, now, behaviours)
}
