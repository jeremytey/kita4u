import { BellRing, CheckCircle2, Clock3, Footprints, Info, TriangleAlert, X, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import BigButton from '../components/BigButton'
import { DemoReplyTag, Eyebrow, IconTile } from '../components/Card'
import { Avatar, PEOPLE } from '../components/CircleStrip'
import TopBar from '../components/TopBar'
import { CONTACTS, formatTime } from '../lib/engine'
import { simulatedContacts, useStore } from '../lib/store'
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
function contactMode(chain: ChainResult, who: Contact): Mode {
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

type NoticeTone = 'quiet' | 'done' | 'alert'
const NOTICE: Record<NoticeTone, string> = {
  quiet: 'border-2 border-edge bg-surface',
  done: 'border-2 border-done bg-done-tint',
  alert: 'bg-alert-tint', // Needs help and Unresolved only
}

function Notice({ icon, tone, title, children }: { icon: LucideIcon; tone: NoticeTone; title?: string; children?: ReactNode }) {
  return (
    <section className={`flex items-start gap-4 rounded-[24px] p-5 ${NOTICE[tone]}`}>
      <IconTile icon={icon} tone={tone} />
      <div className="flex min-w-0 flex-col gap-2 pt-1 text-body">
        {title && <h2 className={`text-title font-bold ${tone === 'alert' ? 'text-alert' : tone === 'done' ? 'text-done' : ''}`}>{title}</h2>}
        {children}
      </div>
    </section>
  )
}

// The contact's own picture and name in the top bar. Empty on Mei's screen, where her header already shows both.
export function ContactTopBar({ who }: { who?: Contact }) {
  const t = useT()
  if (!who) return <TopBar left={null} />
  return (
    <TopBar
      left={
        <span className="flex items-center gap-3 text-body leading-tight font-bold">
          <Avatar who={who} size={44} />
          {/* Long names (Township Support) wrap to two lines instead of running under the toggle. */}
          <span className="min-w-0">{t(PEOPLE[who].name)}</span>
        </span>
      }
    />
  )
}

// The welfare part of a contact's screen. Nothing when this contact has not been asked.
export function WelfareSection({ who }: { who: Contact }) {
  const t = useT()
  const { chain, events, add, addAt } = useStore()
  const mode = contactMode(chain, who)
  const simulated = simulatedContacts(chain, events).has(who)
  const call999 = <p className="font-bold text-alert">{t('call999')}</p>

  // A real tap after a simulated "I'll check" keeps that earlier reply in the log. A real "I'll check" is already logged.
  const outcome = (type: 'CONTACT_OK' | 'NEEDS_HELP') => {
    if (mode.kind === 'checking' && simulated) addAt('HUMAN_AWARE', who, mode.awareAt)
    add(type, who)
  }

  if (mode.kind === 'notAsked') return null
  const name = t(PEOPLE[who].name)
  return (
    <>
      {(mode.kind === 'asked' || mode.kind === 'checking') && (
        <section
          aria-labelledby="welfare-title"
          className="flex flex-col gap-5 rounded-[28px] border-2 border-edge bg-surface p-5 shadow-[0_4px_0_rgba(154,133,112,0.14)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <IconTile icon={BellRing} tone="warn" />
            <span className="inline-flex items-center gap-2 rounded-full bg-wait-tint px-3 py-2 text-small font-bold text-wait">
              <Clock3 size={22} strokeWidth={2.4} aria-hidden />
              {t('pillPleaseCheck')}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Eyebrow>{t('caseWelfare')}</Eyebrow>
            <h2 id="welfare-title" className="text-hero font-bold">
              {t('canYouCheck')}
            </h2>
            <p className="text-[21px] text-ink-soft">{t('unit')}</p>
            <p className="text-body">{t('noCheckInToday')}</p>
            {mode.kind === 'asked' && <p className="text-small text-ink-soft">{t('askedAtTime', { time: formatTime(mode.at) })}</p>}
          </div>

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
            <div className="flex flex-col gap-3 border-t-2 border-line pt-5">
              {simulated && (
                <p className="flex flex-wrap items-center gap-2 text-small text-ink-soft">
                  <DemoReplyTag /> {t('demoReplyNote')}
                </p>
              )}
              <h3 className="text-title font-bold">{t('whatDidYouFind')}</h3>
              <BigButton icon={CheckCircle2} variant="success" onClick={() => outcome('CONTACT_OK')}>
                {t('shesOk')}
              </BigButton>
              <BigButton icon={TriangleAlert} variant="alert" onClick={() => outcome('NEEDS_HELP')}>
                {t('needsHelpBtn')}
              </BigButton>
            </div>
          )}
        </section>
      )}

      {mode.kind === 'movedOn' && (
        <Notice icon={Info} tone="quiet">
          <p>{mode.to ? t('movedTo', { name: t(PEOPLE[mode.to].name) }) : t('noOneConfirmed')}</p>
        </Notice>
      )}

      {/* Only the person who closed the case gets the thank-you. Everyone else sees the plain resolved line. */}
      {mode.kind === 'resolved' &&
        (chain.resolvedBy === who ? (
          <Notice icon={CheckCircle2} tone="done" title={t('circleUpdated')}>
            <p className="font-bold">{t('thankYouName', { name })}</p>
          </Notice>
        ) : (
          <Notice icon={CheckCircle2} tone="done">
            <p className="font-bold">{t('caseResolved')}</p>
          </Notice>
        ))}

      {mode.kind === 'needsHelp' && (
        <Notice icon={TriangleAlert} tone="alert" title={t('everyoneAlerted')}>
          <p>
            {mode.reporter === who
              ? t('youReportedHelp')
              : t('needsHelpInfo', { name: mode.reporter ? t(PEOPLE[mode.reporter].name) : '' })}
          </p>
          {call999}
        </Notice>
      )}

      {mode.kind === 'unresolved' && (
        <Notice icon={Info} tone="alert">
          <p className="font-bold">{t('noOneConfirmed')}</p>
        </Notice>
      )}
    </>
  )
}

export default function ContactCard({ who }: { who: Contact }) {
  const t = useT()
  const { chain, events, now } = useStore()
  const asked = contactMode(chain, who).kind !== 'notAsked'
  // Mei also sees Aminah's favour request, below any welfare card.
  const hasHelp = who === 'neighbour' && currentHelp(events, now) !== undefined
  const name = t(PEOPLE[who].name)

  return (
    <>
      <ContactTopBar />
      <main className="flex flex-1 flex-col gap-6 px-4 pt-4 pb-8">
        <div className="flex items-center gap-4">
          <Avatar who={who} size={72} />
          <div className="flex min-w-0 flex-col gap-1">
            <Eyebrow>{t('neighbourView')}</Eyebrow>
            <h1 className="text-greet font-bold">{t('contactHi', { name })}</h1>
          </div>
        </div>
        {!asked && !hasHelp && (
          <Notice icon={Info} tone="quiet">
            <p>{t('notAskedYet')}</p>
          </Notice>
        )}
        <WelfareSection who={who} />
        {hasHelp && <NeighbourHelp />}
      </main>
    </>
  )
}
