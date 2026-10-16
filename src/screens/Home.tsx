import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  BellRing,
  CalendarClock,
  CheckCircle2,
  HandHeart,
  Hourglass,
  Luggage,
  ScanSearch,
  Undo2,
  UserCheck,
  UserX,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import BigButton from '../components/BigButton'
import { ActionCard, DemoReplyTag } from '../components/Card'
import ChainBar, { StatusTag } from '../components/ChainBar'
import CircleStrip, { PEOPLE } from '../components/CircleStrip'
import TopBar from '../components/TopBar'
import { DAY, dayOf, formatTime, homeStatus } from '../lib/engine'
import { simulatedContacts, useStore } from '../lib/store'
import { useT, type StrKey } from '../strings'

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}

type Tone = 'done' | 'wait' | 'quiet' | 'alert'
const BOX: Record<Tone, { bg: string; fg: string }> = {
  done: { bg: 'bg-done-tint', fg: 'text-done' },
  wait: { bg: 'bg-wait-tint', fg: 'text-wait' },
  quiet: { bg: 'bg-quiet-tint', fg: 'text-quiet' },
  alert: { bg: 'bg-alert-tint', fg: 'text-alert' },
}

function StatusBox({ tone, icon: Icon, title, sub, children }: {
  tone: Tone
  icon: typeof BellRing
  title: ReactNode
  sub?: ReactNode
  children?: ReactNode
}) {
  return (
    <motion.section {...fade} className={`rounded-[24px] p-5 ${BOX[tone].bg}`} aria-live="polite">
      <div className="flex items-start gap-4">
        <span className={`flex size-14 shrink-0 items-center justify-center rounded-2xl bg-surface ${BOX[tone].fg}`}>
          <Icon size={30} strokeWidth={2.2} aria-hidden />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="text-title font-bold">{title}</h2>
          {sub && <div className="text-body text-ink">{sub}</div>}
        </div>
      </div>
      {children && <div className="mt-4 flex flex-col gap-3">{children}</div>}
    </motion.section>
  )
}

// Away until: next day 09:00, or the next Sunday 09:00 (Day 0 is Friday, so Sunday is day index 2).
function awayOptions(now: number) {
  const today = dayOf(now)
  const weekday = ((today % 7) + 7) % 7
  let toSunday = (2 - weekday + 7) % 7
  if (toSunday === 0) toSunday = 7
  return {
    tomorrow: (today + 1) * DAY + 9 * 60,
    sunday: toSunday === 1 ? undefined : (today + toSunday) * DAY + 9 * 60,
  }
}

function AwaySheet({ now, onPick, onClose }: { now: number; onPick: (until: number) => void; onClose: () => void }) {
  const t = useT()
  const opts = awayOptions(now)
  const sheetRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    sheetRef.current?.querySelector('button')?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-end bg-ink/40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="away-title"
        className="w-full rounded-t-[32px] bg-bg px-4 pt-6 pb-8"
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        exit={{ y: 40 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="away-title" className="mb-5 text-title font-bold">
          {t('awaySheetTitle')}
        </h2>
        <div className="flex flex-col gap-3">
          <BigButton icon={CalendarClock} variant="secondary" onClick={() => onPick(opts.tomorrow)}>
            {t('untilTomorrow')}
          </BigButton>
          {opts.sunday !== undefined && (
            <BigButton icon={CalendarClock} variant="secondary" onClick={() => onPick(opts.sunday!)}>
              {t('untilSunday')}
            </BigButton>
          )}
          <BigButton variant="quiet" onClick={onClose}>
            {t('cancel')}
          </BigButton>
        </div>
      </motion.div>
    </motion.div>
  )
}

function greetingKey(now: number): StrKey {
  const hour = Math.floor((((now % DAY) + DAY) % DAY) / 60)
  if (hour < 12) return 'goodMorning'
  if (hour < 18) return 'goodAfternoon'
  return 'goodEvening'
}

export default function Home({ onWhatIsThis, onNeedHelp }: { onWhatIsThis: () => void; onNeedHelp: () => void }) {
  const t = useT()
  const { chain, now, add, events } = useStore()
  const status = homeStatus(chain)
  const [sheet, setSheet] = useState(false)
  const closeSheet = useCallback(() => setSheet(false), [])

  const checkIn = () => add('CHECK_IN', 'resident')
  const pickAway = (until: number) => {
    setSheet(false)
    add('AWAY', 'resident', { until })
  }

  const contactName = (who?: string) => (who && who in PEOPLE ? t(PEOPLE[who as keyof typeof PEOPLE].name) : '')
  const helpReporter = chain.steps.find((s) => s.outcome === 'needsHelp')?.who
  const awayWhen = (() => {
    if (chain.awayUntil === undefined) return ''
    if (dayOf(chain.awayUntil) === dayOf(now) + 1) return t('whenTomorrow')
    return t('whenSunday')
  })()
  const hadCase = chain.caseOpenedAt !== undefined

  const statusBlock = (() => {
    switch (status) {
      case 'checkedIn':
        return (
          <StatusBox
            key="checkedIn"
            tone="done"
            icon={CheckCircle2}
            title={t('checkedInTitle', { time: formatTime(chain.checkedInAt ?? now) })}
            sub={t('checkedInSub')}
          >
            {hadCase && (
              <div>
                <StatusTag chain={chain} />
              </div>
            )}
          </StatusBox>
        )
      case 'reminder':
        return (
          <StatusBox key="reminder" tone="wait" icon={BellRing} title={t('reminderTitle')} sub={t('reminderSub')}>
            <BigButton icon={CheckCircle2} onClick={checkIn}>
              {t('imOkay')}
            </BigButton>
            <BigButton icon={Luggage} variant="secondary" onClick={() => setSheet(true)}>
              {t('imAway')}
            </BigButton>
          </StatusBox>
        )
      case 'chainRunning':
        return (
          <StatusBox key="chain" tone="wait" icon={Hourglass} title={t('chainTitle')} sub={t('chainSub')}>
            <ChainBar chain={chain} bare />
          </StatusBox>
        )
      case 'unresolved':
        return (
          <StatusBox key="unresolved" tone="alert" icon={UserX} title={t('homeUnresolvedTitle')} sub={t('homeUnresolvedSub')}>
            <ChainBar chain={chain} bare />
          </StatusBox>
        )
      case 'needsHelp':
        return (
          <StatusBox
            key="needsHelp"
            tone="alert"
            icon={AlertTriangle}
            title={t('homeNeedsHelpTitle')}
            sub={
              <>
                <p>{t('homeNeedsHelpSub', { name: contactName(helpReporter) })}</p>
                <p className="mt-2 font-bold text-alert">{t('call999')}</p>
              </>
            }
          />
        )
      case 'away':
        return (
          <StatusBox
            key="away"
            tone="quiet"
            icon={Luggage}
            title={t('awayTitle', { when: awayWhen })}
            sub={t('awaySub')}
          >
            <BigButton icon={Undo2} variant="secondary" onClick={() => add('BACK', 'resident')}>
              {t('imBack')}
            </BigButton>
          </StatusBox>
        )
      case 'contactChecked':
        return (
          <StatusBox
            key="contact"
            tone="done"
            icon={UserCheck}
            title={t('contactCheckedTitle', {
              name: contactName(chain.resolvedBy),
              time: formatTime(chain.resolvedAt ?? now),
            })}
            sub={
              <>
                {chain.resolvedBy && chain.resolvedBy !== 'resident' && simulatedContacts(chain, events).has(chain.resolvedBy) && (
                  <p className="mb-2 flex flex-wrap items-center gap-2 text-small text-ink-soft">
                    <DemoReplyTag /> {t('demoReplyNote')}
                  </p>
                )}
                <p>{t('contactCheckedSub')}</p>
              </>
            }
          />
        )
      default:
        return null
    }
  })()

  // The reminder banner and the away card replace the I'm okay card, so it never shows twice.
  const showOkayCard = status !== 'reminder' && status !== 'away'
  const checkedIn = status === 'checkedIn'

  return (
    <>
      <TopBar left={<span className="text-body font-bold">{t(greetingKey(now))}</span>} />
      <main className="flex flex-1 flex-col gap-6 px-4 pt-4 pb-8">
        <h1 className="text-greet font-bold">{t('residentName')}</h1>

        <AnimatePresence mode="wait">{statusBlock}</AnimatePresence>

        <CircleStrip />

        <div className="flex flex-col gap-4">
          {showOkayCard && (
            <ActionCard
              icon={CheckCircle2}
              tone={checkedIn ? 'done' : 'accent'}
              title={checkedIn ? t('checkedInCard') : t('imOkay')}
              sub={checkedIn ? undefined : t('imOkaySub')}
              disabled={checkedIn}
              onClick={checkIn}
            />
          )}
          <ActionCard icon={ScanSearch} title={t('whatIsThis')} sub={t('whatIsThisSub')} onClick={onWhatIsThis} />
          <ActionCard icon={HandHeart} title={t('needHelp')} sub={t('needHelpSub')} onClick={onNeedHelp} />
        </div>

        <p className="mt-auto pt-4 text-center text-small text-ink-soft">{t('footer')}</p>
      </main>

      <AnimatePresence>{sheet && <AwaySheet now={now} onPick={pickAway} onClose={closeSheet} />}</AnimatePresence>
    </>
  )
}
