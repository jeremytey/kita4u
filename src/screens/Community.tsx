import { Bell, BellRing, Building2, Clock3, HeartHandshake, Info, PackageCheck, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { DemoReplyTag, Eyebrow, IconTile, SimTag } from '../components/Card'
import { StatusTag, StepDot, dotFor } from '../components/ChainBar'
import { Avatar, PEOPLE } from '../components/CircleStrip'
import { formatTime } from '../lib/engine'
import { simulatedContacts, useStore } from '../lib/store'
import { useT, type StrKey } from '../strings'
import type { CaseStatus, ChainStep, Contact } from '../types'
import { ContactTopBar, WelfareSection } from './ContactCard'
import { currentHelp, TASKS } from './NeedHelp'

// Left edge colour follows the case: amber while open, red for Unresolved and Needs help, green when resolved, grey when paused.
const EDGE: Record<CaseStatus, string> = {
  none: 'border-l-quiet',
  open: 'border-l-wait-dot',
  beingChecked: 'border-l-wait-dot',
  resolved: 'border-l-done-dot',
  unresolved: 'border-l-alert',
  needsHelp: 'border-l-alert',
  paused: 'border-l-quiet',
}

// One row per contact, read from the chain: picture, name and role, what happened, and the same dot as the chain bar.
function Row({ lead, name, role, state, dot, simulated }: { lead: ReactNode; name: string; role?: string; state: string; dot: ReactNode; simulated?: boolean }) {
  return (
    <li className="grid grid-cols-[48px_1fr_auto] items-center gap-3 border-t-2 border-line pt-3">
      <span className="flex justify-center">{lead}</span>
      <span className="flex min-w-0 flex-col">
        <span className="flex flex-wrap items-center gap-x-2 text-body leading-tight font-bold">
          {name}
          {role && <span className="text-small font-normal text-ink-soft">{role}</span>}
        </span>
        <span className="text-small font-bold text-ink-soft">{state}</span>
        {simulated && (
          <span className="mt-1">
            <DemoReplyTag />
          </span>
        )}
      </span>
      {dot}
    </li>
  )
}

function CaseHeader({ icon, tone, title, children }: { icon: LucideIcon; tone: 'wait' | 'done' | 'accent'; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <IconTile icon={icon} tone={tone} />
      <div className="flex min-w-0 flex-col items-start gap-2">
        {children}
        <h2 className="text-title font-bold">{title}</h2>
      </div>
    </div>
  )
}

function stepWord(step: ChainStep, t: ReturnType<typeof useT>): string {
  const at = (m?: number) => (m === undefined ? '' : formatTime(m))
  if (step.outcome === 'ok') return t('stOk', { time: at(step.outcomeTime) })
  if (step.outcome === 'needsHelp') return t('stNeedsHelp', { time: at(step.outcomeTime) })
  if (step.outcome === 'noOutcome') return t('stNoOutcome', { time: at(step.outcomeTime) })
  if (step.outcome === 'cantNow') return t('stCantNow', { time: at(step.outcomeTime) })
  if (step.outcome === 'noReply') return t('stNoReply', { time: at(step.outcomeTime) })
  if (step.state === 'responded') return t('stChecking', { name: step.who === 'you' ? '' : t(PEOPLE[step.who].name), time: at(step.time) })
  if (step.state === 'asked') return t('stAsked', { time: at(step.time) })
  if (step.state === 'notNeeded') return t('stNotNeeded')
  return t('stWaiting')
}

// Thin case list for Township Support: one card per case, no charts, no counts.
export default function Community() {
  const t = useT()
  const { chain, events, now } = useStore()
  const help = currentHelp(events, now)
  const sim = simulatedContacts(chain, events)
  const welfare = chain.caseOpenedAt !== undefined && chain.status !== 'none' && chain.status !== 'paused'
  const aware = chain.steps.filter((s) => s.humanAware && s.time !== undefined).map((s) => s.time!)
  const firstAware = aware.length ? Math.min(...aware) : undefined

  const helpState = (() => {
    if (!help) return ''
    const at = (m: number) => formatTime(m)
    if (help.doneAt !== undefined) return t('helpStDone', { time: at(help.doneAt) })
    if (help.acceptedAt !== undefined) return t('helpStAccepted', { time: at(help.acceptedAt) })
    if (help.declinedAt !== undefined) return t('helpStDeclined', { time: at(help.declinedAt) })
    return t('helpStRequested', { time: at(help.requestedAt) })
  })()

  return (
    <>
      <ContactTopBar who="community" />
      <main className="flex flex-1 flex-col gap-6 px-4 pt-4 pb-8">
        <div className="flex items-center gap-4">
          <IconTile icon={Building2} tone="blue" size="lg" />
          <div className="flex min-w-0 flex-col gap-1">
            <Eyebrow>{t('communityView')}</Eyebrow>
            <h1 className="text-greet font-bold">{t('communityTitle')}</h1>
          </div>
        </div>

        <WelfareSection who="community" />

        {welfare && (
          <section className={`flex flex-col gap-4 rounded-[24px] border-2 border-l-8 border-edge bg-surface p-4.5 ${EDGE[chain.status]}`}>
            <CaseHeader
              icon={BellRing}
              tone="wait"
              title={
                <>
                  {t('stepAminah')} · <span className="whitespace-nowrap">{t('unit')}</span>
                </>
              }
            >
              <div className="flex flex-wrap items-center gap-2">
                <StatusTag chain={chain} />
                <SimTag />
              </div>
            </CaseHeader>
            <p className="text-body font-bold text-ink-soft">{t('caseWelfare')}</p>
            <ol className="flex flex-col gap-3">
              {chain.reminderAt !== undefined && chain.reminderAt <= now && (
                <Row
                  lead={
                    <span className="flex size-[46px] items-center justify-center rounded-full bg-quiet-tint text-quiet">
                      <Bell size={24} strokeWidth={2.4} aria-hidden />
                    </span>
                  }
                  name={t('stepReminder')}
                  state={formatTime(chain.reminderAt)}
                  dot={<StepDot dot="responded" />}
                />
              )}
              {chain.steps.slice(1).map((s) => {
                const c = s.who as Contact
                return (
                  <Row
                    key={c}
                    lead={<Avatar who={c} size={46} />}
                    name={t(PEOPLE[c].name)}
                    role={t(PEOPLE[c].role)}
                    state={stepWord(s, t)}
                    dot={<StepDot dot={dotFor(s)} />}
                    simulated={sim.has(c)}
                  />
                )
              })}
            </ol>
            {firstAware !== undefined && (
              <p className="text-body font-bold text-done">{t('humanAware', { time: formatTime(firstAware) })}</p>
            )}
          </section>
        )}

        {help && (
          <section className="flex flex-col gap-3 rounded-[24px] border-2 border-line bg-surface p-4.5">
            <CaseHeader
              icon={help.doneAt !== undefined ? PackageCheck : HeartHandshake}
              tone={help.doneAt !== undefined ? 'done' : 'accent'}
              title={t('caseHelp')}
            />
            <p className="text-body font-bold">{t(TASKS[help.task].title as StrKey)}</p>
            <p className="text-body text-ink-soft">{helpState}</p>
          </section>
        )}

        {!welfare && !help && (
          <p className="flex items-center gap-3 rounded-[24px] bg-quiet-tint p-5 text-body">
            <Info size={26} className="shrink-0 text-quiet" aria-hidden />
            {t('noCases')}
          </p>
        )}

        <p className="flex items-start gap-3 text-small text-ink-soft">
          <Clock3 size={24} strokeWidth={2.4} className="mt-0.5 shrink-0" aria-hidden />
          {t('stagedNote')}
        </p>
      </main>
    </>
  )
}
