import { AlertTriangle, CheckCircle2, Footprints, Info, X } from 'lucide-react'
import type { ReactNode } from 'react'
import BigButton from '../components/BigButton'
import { Card, SimTag } from '../components/Card'
import { Avatar, PEOPLE } from '../components/CircleStrip'
import TopBar from '../components/TopBar'
import { CONTACTS, formatTime } from '../lib/engine'
import { useStore } from '../lib/store'
import { useT } from '../strings'
import { currentHelp } from './NeedHelp'
import NeighbourHelp from './NeighbourHelp'
import type { ChainResult, Contact } from '../types'

type Mode =
  | { kind: 'notAsked' }
  | { kind: 'asked'; at: number }
  | { kind: 'checking'; awareAt: number }
  | { kind: 'movedOn'; to?: Contact }
  | { kind: 'resolved' }
  | { kind: 'needsHelp'; reporter?: Contact }
  | { kind: 'unresolved' }

// What this contact sees, read from the chain. Read-only once the case has passed them.
export function contactMode(chain: ChainResult, who: Contact): Mode {
  const i = CONTACTS.indexOf(who)
  const step = chain.steps[i + 1]
  const reached = (s: { state: string }) => s.state !== 'waiting' && s.state !== 'notNeeded'
  const caseExists = chain.caseOpenedAt !== undefined && chain.status !== 'none' && chain.status !== 'paused'

  if (!caseExists) return { kind: 'notAsked' }
  if (chain.status === 'resolved') return reached(step) ? { kind: 'resolved' } : { kind: 'notAsked' }
  if (chain.status === 'needsHelp') {
    const reporter = chain.steps.find((s) => s.outcome === 'needsHelp')?.who as Contact | undefined
    return { kind: 'needsHelp', reporter }
  }
  if (chain.status === 'unresolved') return { kind: 'unresolved' }
  if (step.state === 'asked') return { kind: 'asked', at: step.time! }
  if (step.state === 'responded' && step.outcome === undefined) return { kind: 'checking', awareAt: step.time! }
  if (step.state === 'noReply' || step.outcome === 'noOutcome') {
    const next = chain.steps.slice(i + 2).find(reached)?.who as Contact | undefined
    return { kind: 'movedOn', to: next }
  }
  return { kind: 'notAsked' }
}

function Notice({ icon: Icon, tone, children }: { icon: typeof Info; tone: string; children: ReactNode }) {
  return (
    <Card className="flex items-start gap-4">
      <span className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${tone}`}>
        <Icon size={30} strokeWidth={2.2} aria-hidden />
      </span>
      <div className="flex flex-col gap-2 pt-1 text-body">{children}</div>
    </Card>
  )
}

export default function ContactCard({ who }: { who: Contact }) {
  const t = useT()
  const { chain, events, now, add, addAt } = useStore()
  const mode = contactMode(chain, who)
  // Mei also sees Aminah's favour request, below any welfare card.
  const hasHelp = who === 'neighbour' && currentHelp(events, now) !== undefined
  const name = t(PEOPLE[who].name)
  const call999 = <p className="font-bold text-alert">{t('call999')}</p>

  // A real tap after a simulated "I'll check" keeps that earlier reply in the log.
  const outcome = (type: 'CONTACT_OK' | 'NEEDS_HELP') => {
    if (mode.kind === 'checking') addAt('HUMAN_AWARE', who, mode.awareAt)
    add(type, who)
  }

  return (
    <>
      <TopBar
        left={
          <span className="flex items-center gap-3 text-body font-bold">
            <Avatar who={who} size={44} />
            {name}
          </span>
        }
      />
      <main className="flex flex-1 flex-col gap-6 px-4 pt-4 pb-8">
        <h1 className="text-greet font-bold">{t('contactHi', { name })}</h1>

        {mode.kind === 'notAsked' && !hasHelp && (
          <Notice icon={Info} tone="bg-quiet-tint text-quiet">
            <p>{t('notAskedYet')}</p>
          </Notice>
        )}

        {(mode.kind === 'asked' || mode.kind === 'checking') && (
          <Card className="flex flex-col gap-2 border-l-8 border-wait-dot">
            <p className="text-title font-bold">{t('pleaseCheck')}</p>
            <p className="text-body">{t('noCheckInToday')}</p>
            {mode.kind === 'asked' && (
              <p className="flex flex-wrap items-center gap-2 text-small text-ink-soft">
                {t('askedAtTime', { time: formatTime(mode.at) })} <SimTag />
              </p>
            )}
          </Card>
        )}

        {mode.kind === 'asked' && (
          <div className="flex flex-col gap-3">
            <BigButton icon={Footprints} onClick={() => add('HUMAN_AWARE', who)}>
              {t('illCheck')}
            </BigButton>
            <BigButton icon={X} variant="secondary" onClick={() => add('CANT_NOW', who)}>
              {t('cantNow')}
            </BigButton>
          </div>
        )}

        {mode.kind === 'checking' && (
          <div className="flex flex-col gap-3">
            <p className="text-body font-bold">{t('whatDidYouFind')}</p>
            <BigButton icon={CheckCircle2} onClick={() => outcome('CONTACT_OK')}>
              {t('shesOk')}
            </BigButton>
            <BigButton icon={AlertTriangle} variant="alert" onClick={() => outcome('NEEDS_HELP')}>
              {t('needsHelpBtn')}
            </BigButton>
          </div>
        )}

        {mode.kind === 'movedOn' && (
          <Notice icon={Info} tone="bg-quiet-tint text-quiet">
            <p>{mode.to ? t('movedTo', { name: t(PEOPLE[mode.to].name) }) : t('noOneConfirmed')}</p>
          </Notice>
        )}

        {mode.kind === 'resolved' && (
          <Notice icon={CheckCircle2} tone="bg-done-tint text-done">
            <p className="font-bold">{t('caseResolved')}</p>
          </Notice>
        )}

        {mode.kind === 'needsHelp' && (
          <Notice icon={AlertTriangle} tone="bg-alert-tint text-alert">
            <p>
              {mode.reporter === who
                ? t('youReportedHelp')
                : t('needsHelpInfo', { name: mode.reporter ? t(PEOPLE[mode.reporter].name) : '' })}
            </p>
            {call999}
          </Notice>
        )}

        {mode.kind === 'unresolved' && (
          <Notice icon={Info} tone="bg-alert-tint text-alert">
            <p className="font-bold">{t('noOneConfirmed')}</p>
          </Notice>
        )}
        {hasHelp && <NeighbourHelp />}
      </main>
    </>
  )
}
