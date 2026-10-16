import { HeartHandshake, Info, ShieldAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card, SimTag } from '../components/Card'
import { StatusTag, StepDot, dotFor } from '../components/ChainBar'
import { PEOPLE } from '../components/CircleStrip'
import { formatTime } from '../lib/engine'
import { useStore } from '../lib/store'
import { useT, type StrKey } from '../strings'
import type { ChainStep } from '../types'
import { ContactTopBar, WelfareSection } from './ContactCard'
import { currentHelp, TASKS } from './NeedHelp'

function CaseCard({ icon: Icon, title, children }: { icon: typeof Info; title: string; children: ReactNode }) {
  const t = useT()
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-accent-tint">
          <Icon size={30} strokeWidth={2.2} aria-hidden />
        </span>
        <div>
          <h2 className="text-title font-bold">{title}</h2>
          <p className="text-body text-ink-soft">
            {t('residentName')}, {t('unit')}
          </p>
        </div>
      </div>
      {children}
    </Card>
  )
}

function Row({ dot, label, state }: { dot: ReactNode; label: string; state: string }) {
  return (
    <li className="flex items-center gap-3">
      {dot}
      <span className="flex flex-col">
        <span className="text-body font-bold">{label}</span>
        <span className="text-small font-bold text-ink-soft">{state}</span>
      </span>
    </li>
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
        <h1 className="text-greet font-bold">{t('communityTitle')}</h1>

        <WelfareSection who="community" />

        {welfare && (
          <CaseCard icon={ShieldAlert} title={t('caseWelfare')}>
            <div className="flex flex-wrap items-center gap-2">
              <StatusTag chain={chain} />
              <SimTag />
            </div>
            <ol className="flex flex-col gap-3">
              {chain.reminderAt !== undefined && chain.reminderAt <= now && (
                <Row
                  dot={<StepDot dot="responded" />}
                  label={t('stepReminder')}
                  state={formatTime(chain.reminderAt)}
                />
              )}
              {chain.steps.slice(1).map((s) => (
                <Row
                  key={s.who}
                  dot={<StepDot dot={dotFor(s)} />}
                  label={`${t(PEOPLE[s.who as keyof typeof PEOPLE].name)}`}
                  state={stepWord(s, t)}
                />
              ))}
            </ol>
            {firstAware !== undefined && (
              <p className="flex flex-wrap items-center gap-2 text-body font-bold text-done">
                {t('humanAware', { time: formatTime(firstAware) })} <SimTag />
              </p>
            )}
          </CaseCard>
        )}

        {help && (
          <CaseCard icon={HeartHandshake} title={t('caseHelp')}>
            <p className="text-body font-bold">{t(TASKS[help.task].title as StrKey)}</p>
            <p className="flex flex-wrap items-center gap-2 text-body text-ink-soft">
              {helpState} <SimTag />
            </p>
          </CaseCard>
        )}

        {!welfare && !help && (
          <p className="flex items-center gap-3 rounded-[24px] bg-quiet-tint p-5 text-body">
            <Info size={26} className="shrink-0 text-quiet" aria-hidden />
            {t('noCases')}
          </p>
        )}

        <p className="text-small text-ink-soft">{t('stagedNote')}</p>
      </main>
    </>
  )
}
