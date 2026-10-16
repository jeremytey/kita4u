import type {
  AppEvent,
  Behaviour,
  Behaviours,
  CaseStatus,
  ChainResult,
  ChainStep,
  Contact,
  HomeStatus,
} from '../types'

// All times are SIMULATED minutes. These are demo settings, not validated policy.
export const DAY = 1440
export const WINDOW_END = 9 * 60 // check-in window ends 09:00
export const REMINDER_AFTER = 15 // 09:15 reminder
export const FIRST_ALERT_AFTER_REMINDER = 120 // first contact at 11:15
export const REPLY_TIMEOUT = 120 // no reply within 2h -> next contact
export const OUTCOME_TIMEOUT = 60 // "I'll check" with no outcome in 1h -> next contact
export const BEHAVIOUR_REPLY = 15 // simulated reply 15 min after alert
export const BEHAVIOUR_OUTCOME = 15 // simulated outcome 15 min after reply

export const CONTACTS: Contact[] = ['neighbour', 'family', 'community']
const CONTACT_TYPES = ['CANT_NOW', 'HUMAN_AWARE', 'CONTACT_OK', 'NEEDS_HELP']

export const dayOf = (t: number) => Math.floor(t / DAY)

export function formatTime(t: number): string {
  const m = ((t % DAY) + DAY) % DAY
  const hh = String(Math.floor(m / 60)).padStart(2, '0')
  const mm = String(m % 60).padStart(2, '0')
  return `${hh}:${mm}`
}

// Replies a contact gives in this case: real taps win, otherwise the demo behaviour.
function repliesFor(
  contact: Contact,
  alertAt: number,
  events: AppEvent[],
  behaviour: Behaviour,
): AppEvent[] {
  const real = events.filter(
    (e) => e.actor === contact && CONTACT_TYPES.includes(e.type) && e.time >= alertAt,
  )
  if (real.length > 0) return real
  const t1 = alertAt + BEHAVIOUR_REPLY
  const t2 = t1 + BEHAVIOUR_OUTCOME
  const sim = { simulated: true }
  switch (behaviour) {
    case 'cantNow':
      return [{ type: 'CANT_NOW', time: t1, actor: contact, meta: sim }]
    case 'confirmsOk':
      return [
        { type: 'HUMAN_AWARE', time: t1, actor: contact, meta: sim },
        { type: 'CONTACT_OK', time: t2, actor: contact, meta: sim },
      ]
    case 'neverReports':
      return [{ type: 'HUMAN_AWARE', time: t1, actor: contact, meta: sim }]
    default:
      return []
  }
}

export function deriveChain(events: AppEvent[], now: number, behaviours: Behaviours): ChainResult {
  const sorted = [...events].filter((e) => e.time <= now).sort((a, b) => a.time - b.time)
  const dayStart = dayOf(now) * DAY
  const windowEnd = dayStart + WINDOW_END
  const derived: AppEvent[] = []

  const you: ChainStep = { who: 'you', state: 'waiting' }
  const contactSteps: ChainStep[] = CONTACTS.map((c) => ({ who: c, state: 'waiting' }))
  const result = (status: CaseStatus, extra: Partial<ChainResult> = {}): ChainResult => ({
    steps: [you, ...contactSteps],
    status,
    derived,
    ...extra,
  })

  // Away: the latest AWAY/BACK decides. Away pauses everything.
  const awayEvents = sorted.filter((e) => e.type === 'AWAY' || e.type === 'BACK')
  const lastAway = awayEvents[awayEvents.length - 1]
  const awayUntil = lastAway?.type === 'AWAY' ? Number(lastAway.meta?.until ?? 0) : undefined
  if (lastAway && awayUntil !== undefined && now < awayUntil) {
    contactSteps.forEach((s) => (s.state = 'notNeeded'))
    you.state = 'notNeeded'
    return result('paused', { awayUntil })
  }

  // Was the resident away when the window closed today?
  const awayAtWindow = (() => {
    const before = awayEvents.filter((e) => e.time <= windowEnd)
    const last = before[before.length - 1]
    return last?.type === 'AWAY' && Number(last.meta?.until ?? 0) > windowEnd
  })()

  const todayCheckIns = sorted.filter((e) => e.type === 'CHECK_IN' && e.time >= dayStart)
  const checkIn = todayCheckIns[0]

  if (checkIn && checkIn.time <= windowEnd) {
    you.state = 'responded'
    you.time = checkIn.time
    you.outcome = 'checkedIn'
    contactSteps.forEach((s) => (s.state = 'notNeeded'))
    return result('none', { checkedInAt: checkIn.time })
  }
  if (now < windowEnd || awayAtWindow) {
    if (awayAtWindow) contactSteps.forEach((s) => (s.state = 'notNeeded'))
    return result('none')
  }

  // A case opens at 09:00. A later check-in or going away closes it.
  const caseOpenedAt = windowEnd
  const reminderAt = windowEnd + REMINDER_AFTER
  const closer = sorted.find(
    (e) => (e.type === 'CHECK_IN' || e.type === 'AWAY') && e.time > windowEnd,
  )
  const limit = closer ? closer.time : now

  you.state = 'noReply'
  you.time = windowEnd
  you.outcome = 'missed'

  let status: CaseStatus = 'open'
  let resolvedBy: Contact | undefined
  let resolvedAt: number | undefined
  let anyAware = false
  let cursor = reminderAt + FIRST_ALERT_AFTER_REMINDER
  let i = 0

  for (; i < CONTACTS.length; i++) {
    const contact = CONTACTS[i]
    const step = contactSteps[i]
    const alertAt = cursor
    if (alertAt > limit) break

    step.state = 'asked'
    step.time = alertAt
    derived.push({ type: 'ALERTED', time: alertAt, actor: 'system', meta: { contact } })

    const replies = repliesFor(contact, alertAt, sorted, behaviours[contact]).filter(
      (e) => e.time <= limit,
    )
    replies.filter((e) => e.meta?.simulated).forEach((e) => derived.push(e))

    const replyDeadline = alertAt + REPLY_TIMEOUT
    const first = replies.find((e) => e.time <= replyDeadline)

    if (!first) {
      if (limit >= replyDeadline) {
        step.state = 'noReply'
        step.outcome = 'noReply'
        step.outcomeTime = replyDeadline
        cursor = replyDeadline
        continue
      }
      break // still waiting for this contact
    }

    if (first.type === 'CANT_NOW') {
      step.state = 'noReply'
      step.outcome = 'cantNow'
      step.outcomeTime = first.time
      cursor = first.time
      continue
    }

    // HUMAN_AWARE (or an outcome tapped straight away)
    step.state = 'responded'
    step.humanAware = true
    step.time = first.time
    anyAware = true
    const outcomeDeadline = first.time + OUTCOME_TIMEOUT
    const outcome = replies.find(
      (e) => (e.type === 'CONTACT_OK' || e.type === 'NEEDS_HELP') && e.time <= outcomeDeadline,
    )

    if (outcome?.type === 'CONTACT_OK') {
      step.outcome = 'ok'
      step.outcomeTime = outcome.time
      status = 'resolved'
      resolvedBy = contact
      resolvedAt = outcome.time
      i++
      break
    }
    if (outcome?.type === 'NEEDS_HELP') {
      step.outcome = 'needsHelp'
      step.outcomeTime = outcome.time
      status = 'needsHelp'
      // Alert all remaining contacts at once.
      for (let j = i + 1; j < CONTACTS.length; j++) {
        contactSteps[j].state = 'asked'
        contactSteps[j].time = outcome.time
        derived.push({ type: 'ALERTED', time: outcome.time, actor: 'system', meta: { contact: CONTACTS[j] } })
      }
      i = CONTACTS.length + 1
      break
    }
    if (limit >= outcomeDeadline) {
      step.outcome = 'noOutcome'
      step.outcomeTime = outcomeDeadline
      cursor = outcomeDeadline
      continue
    }
    break // contact is checking, within the hour
  }

  if (status === 'open') {
    if (i >= CONTACTS.length) status = 'unresolved'
    else if (anyAware) status = 'beingChecked'
  }

  // Contacts the chain never reached are not needed once the case ends.
  const ended = status === 'resolved' || closer !== undefined
  if (ended) contactSteps.forEach((s) => s.state === 'waiting' && (s.state = 'notNeeded'))

  // The resident's own check-in closes any case still open.
  if (closer?.type === 'CHECK_IN' && status !== 'resolved') {
    you.state = 'responded'
    you.time = closer.time
    you.outcome = 'checkedIn'
    return result('resolved', {
      caseOpenedAt,
      reminderAt,
      resolvedBy: 'resident',
      resolvedAt: closer.time,
      checkedInAt: closer.time,
    })
  }
  if (closer?.type === 'AWAY') return result('none', { caseOpenedAt, reminderAt })

  return result(status, {
    caseOpenedAt,
    reminderAt,
    resolvedBy,
    resolvedAt,
    checkedInAt: checkIn?.time,
  })
}

export function homeStatus(chain: ChainResult): HomeStatus {
  if (chain.status === 'paused') return 'away'
  if (chain.checkedInAt !== undefined) return 'checkedIn'
  if (chain.status === 'resolved' && chain.resolvedBy !== 'resident') return 'contactChecked'
  if (chain.status === 'needsHelp') return 'needsHelp'
  if (chain.status === 'unresolved') return 'unresolved'
  if (chain.caseOpenedAt !== undefined && chain.status !== 'none') {
    const firstAlert = chain.steps[1].state !== 'waiting'
    return firstAlert ? 'chainRunning' : 'reminder'
  }
  return 'normal'
}
