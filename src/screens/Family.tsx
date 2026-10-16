import { AlertTriangle, CalendarDays, ShieldCheck } from 'lucide-react'
import ChainBar from '../components/ChainBar'
import { SimTag } from '../components/Card'
import CircleStrip, { PEOPLE } from '../components/CircleStrip'
import { DAY, dayOf, formatTime } from '../lib/engine'
import { SAMPLES } from '../lib/samples'
import { useStore } from '../lib/store'
import { useT, type StrKey } from '../strings'
import type { AppEvent, ChainResult, Contact } from '../types'
import { ContactTopBar, WelfareSection } from './ContactCard'
import { TASKS, type Task } from './NeedHelp'

type T = ReturnType<typeof useT>
type Tone = 'ink' | 'done' | 'alert' | 'quiet'
interface Line {
  time: number
  text: string
  tone: Tone
  rank: number // same minute: higher rank is newer
}

// Same-minute order, oldest to newest: deadline lines, replies that pass the case on, alerts, then everything else.
const RANK: Partial<Record<AppEvent['type'], number>> = { CANT_NOW: 1, NEEDS_HELP: 1, ALERTED: 2 }

const MAX_LINES = 8
const isContact = (a: string): a is Contact => a in PEOPLE

// Plain sentences from the real event log, the engine's derived events and the chain. Nothing in the future.
export function buildTimeline(events: AppEvent[], chain: ChainResult, now: number, t: T): Line[] {
  const lines: Line[] = []
  let rank = 0
  const push = (time: number, text: string, tone: Tone = 'ink') => {
    if (time <= now) lines.push({ time, text, tone, rank })
  }
  const name = (c: string) => (isContact(c) ? t(PEOPLE[c].name) : '')
  const task = (e: AppEvent) => TASKS[(e.meta?.task as Task) ?? 'groceries']

  // Steps the engine worked out from the clock (rank 0).
  if (chain.caseOpenedAt !== undefined) {
    push(chain.caseOpenedAt, t('tlMissed'), 'quiet')
    if (chain.reminderAt !== undefined) push(chain.reminderAt, t('tlReminder'))
    for (const s of chain.steps) {
      if (s.who === 'you' || s.outcomeTime === undefined) continue
      if (s.outcome === 'noReply') push(s.outcomeTime, t('tlNoReply', { name: name(s.who) }), 'quiet')
      if (s.outcome === 'noOutcome') push(s.outcomeTime, t('tlNoOutcome', { name: name(s.who) }), 'quiet')
    }
    if (chain.status === 'unresolved') {
      const last = Math.max(...chain.steps.map((s) => s.outcomeTime ?? 0))
      push(last, t('tlUnresolved'), 'alert')
    }
  }

  for (const e of [...events, ...chain.derived]) {
    rank = RANK[e.type] ?? 3
    switch (e.type) {
      case 'CHECK_IN':
        push(e.time, t('tlCheckIn'), 'done')
        break
      case 'AWAY': {
        const until = Number(e.meta?.until ?? 0)
        const when = dayOf(until) === dayOf(e.time) + 1 ? t('whenTomorrow') : t('whenSunday')
        push(e.time, t('tlAway', { when }), 'quiet')
        break
      }
      case 'BACK':
        push(e.time, t('tlBack'))
        break
      case 'MESSAGE_CHECKED':
        push(e.time, t('tlMessageChecked'))
        break
      case 'ASKED_CIRCLE': {
        const sample = SAMPLES.find((s) => s.id === e.meta?.sample)
        push(e.time, t(sample?.suspicious ? 'tlSentSuspicious' : 'tlSentNormal'))
        break
      }
      case 'HELP_REQUESTED':
        push(e.time, t('tlHelpRequested', { task: t(task(e).phrase) }))
        break
      case 'HELP_ACCEPTED':
        push(e.time, t('tlHelpAccepted', { task: t(task(e).phrase) }))
        break
      case 'HELP_DECLINED':
        push(e.time, t('tlHelpDeclined', { task: t(task(e).phrase) }), 'quiet')
        break
      case 'HELP_DONE':
        push(e.time, t('tlHelpDone', { task: t(task(e).title) }), 'done')
        break
      case 'THANKS':
        push(e.time, t('tlThanks'))
        break
      case 'ALERTED':
        push(e.time, t('tlAlerted', { name: name(String(e.meta?.contact)) }))
        break
      case 'CANT_NOW':
        push(e.time, t('tlCantNow', { name: name(e.actor) }), 'quiet')
        break
      case 'HUMAN_AWARE':
        push(e.time, t('tlChecking', { name: name(e.actor) }), 'done')
        break
      case 'CONTACT_OK':
        push(e.time, t('tlOk', { name: name(e.actor) }), 'done')
        break
      case 'NEEDS_HELP':
        push(e.time, t('tlNeedsHelp', { name: name(e.actor) }), 'alert')
        break
    }
  }

  // Newest first. Same minute: the one logged later goes first.
  return lines
    .map((l, i) => ({ l, i }))
    .sort((a, b) => b.l.time - a.l.time || b.l.rank - a.l.rank || b.i - a.i)
    .map(({ l }) => l)
    .slice(0, MAX_LINES)
}

const TONE: Record<Tone, string> = { ink: 'text-ink', done: 'text-done', alert: 'text-alert', quiet: 'text-ink-soft' }

export default function Family() {
  const t = useT()
  const { events, chain, now } = useStore()
  const lines = buildTimeline(events, chain, now, t)

  const stamp = (time: number) => {
    const d = dayOf(time)
    if (d === dayOf(now)) return formatTime(time)
    const wd = ((d % 7) + 7) % 7
    return `${t(`day${wd}` as StrKey)} ${formatTime(time)}`
  }

  const week = events.filter((e) => e.time > now - 7 * DAY && e.time <= now)
  const checkIns = week.filter((e) => e.type === 'CHECK_IN').length
  const helps = week.filter((e) => e.type === 'HELP_REQUESTED').length
  const sampleHistory = week.some((e) => e.meta?.seed)

  return (
    <>
      <ContactTopBar who="family" />
      <main className="flex flex-1 flex-col gap-6 px-4 pt-4 pb-8">
        <h1 className="text-greet font-bold">{t('familyTitle')}</h1>

        <WelfareSection who="family" />

        <div className="flex flex-col gap-3">
          <ChainBar chain={chain} />
          {chain.status === 'needsHelp' && (
            <p className="flex items-center gap-3 rounded-[24px] bg-alert-tint p-4 text-body font-bold text-alert">
              <AlertTriangle size={26} className="shrink-0" aria-hidden />
              {t('call999')}
            </p>
          )}
        </div>

        <section className="rounded-[24px] bg-surface p-5 shadow-card" aria-labelledby="tl-title">
          <h2 id="tl-title" className="mb-4 text-title font-bold">
            {t('timelineTitle')}
          </h2>
          {lines.length === 0 ? (
            <p className="text-body text-ink-soft">{t('timelineEmpty')}</p>
          ) : (
            <ol className="flex flex-col gap-3">
              {lines.map((l, i) => (
                <li key={i} className="flex flex-col border-l-4 border-line pl-3">
                  <span className="flex flex-wrap items-center gap-2 text-small text-ink-soft">
                    {stamp(l.time)} <SimTag />
                  </span>
                  <span className={`text-body font-bold ${TONE[l.tone]}`}>{l.text}</span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="flex flex-col gap-2 rounded-[24px] bg-surface p-5 shadow-card">
          <p className="flex items-start gap-3 text-body font-bold">
            <CalendarDays size={26} className="mt-0.5 shrink-0 text-accent-ink" aria-hidden />
            {t('thisWeek', {
              c: t(checkIns === 1 ? 'wkCheckIn' : 'wkCheckIns', { n: checkIns }),
              h: t(helps === 1 ? 'wkHelp' : 'wkHelps', { n: helps }),
            })}
          </p>
          {sampleHistory && (
            <p className="self-start rounded-full bg-quiet-tint px-3 py-1 text-small font-bold text-quiet">
              {t('sampleHistory')}
            </p>
          )}
        </section>

        <CircleStrip />

        <p className="flex items-start gap-3 text-body text-ink-soft">
          <ShieldCheck size={26} className="mt-0.5 shrink-0 text-done" aria-hidden />
          {t('privacy')}
        </p>
      </main>
    </>
  )
}
