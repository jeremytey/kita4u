import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CalendarClock, CheckCircle2, HandHeart, Luggage, ScanSearch, Undo2, UserX } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import BigButton from '../components/BigButton'
import { DemoReplyTag } from '../components/Card'
import { StatusTag } from '../components/ChainBar'
import CircleStrip, { PEOPLE } from '../components/CircleStrip'
import HeroButton from '../components/HeroButton'
import TopBar from '../components/TopBar'
import { DAY, dayOf, formatTime, homeStatus } from '../lib/engine'
import { latestContact } from '../lib/statusText'
import { simulatedContacts, useStore } from '../lib/store'
import { useT, type StrKey } from '../strings'

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}

// Red box: only for Needs help and Unresolved.
function AlertBox({ icon: Icon, title, children }: { icon: typeof UserX; title: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-4 rounded-[24px] bg-alert-tint p-5">
      <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-surface text-alert">
        <Icon size={30} strokeWidth={2.2} aria-hidden />
      </span>
      <div className="flex flex-col gap-1">
        <h2 className="text-title font-bold">{title}</h2>
        <div className="text-body text-ink">{children}</div>
      </div>
    </div>
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
  const checkedInTime = formatTime(chain.checkedInAt ?? now)

  // One sentence (or a red box) that says where things stand. Screens only read the chain.
  const statusBlock = (() => {
    switch (status) {
      case 'normal':
        return <p className="text-title font-bold">{t('statusDue')}</p>
      case 'checkedIn':
        return (
          <div className="flex flex-col items-start gap-2">
            <p className="text-title font-bold">
              {t('statusAllSet')}
              <span className="sr-only"> {t('heroCheckedIn', { time: checkedInTime })}</span>
            </p>
            {hadCase && <StatusTag chain={chain} />}
          </div>
        )
      case 'reminder':
        return <p className="text-title font-bold">{t('reminderTitle')}</p>
      case 'chainRunning': {
        const latest = latestContact(chain)
        if (!latest) return <p className="text-title font-bold">{t('chainTitle')}</p>
        const name = contactName(latest.who)
        return <p className="text-title font-bold">{t(latest.kind === 'asked' ? 'statusAsked' : 'statusChecking', { name })}</p>
      }
      case 'contactChecked':
        return (
          <div className="flex flex-col gap-2">
            <p className="text-title font-bold">
              {t('contactCheckedTitle', { name: contactName(chain.resolvedBy), time: formatTime(chain.resolvedAt ?? now) })}
            </p>
            <p className="text-body">{t('contactCheckedSub')}</p>
            {chain.resolvedBy && chain.resolvedBy !== 'resident' && simulatedContacts(chain, events).has(chain.resolvedBy) && (
              <p className="flex flex-wrap items-center gap-2 text-small text-ink-soft">
                <DemoReplyTag /> {t('demoReplyNote')}
              </p>
            )}
          </div>
        )
      case 'needsHelp':
        return (
          <AlertBox icon={AlertTriangle} title={t('homeNeedsHelpTitle')}>
            <p>{t('homeNeedsHelpSub', { name: contactName(helpReporter) })}</p>
            <p className="mt-2 font-bold text-alert">{t('call999')}</p>
          </AlertBox>
        )
      case 'unresolved':
        return (
          <AlertBox icon={UserX} title={t('homeUnresolvedTitle')}>
            <p>{t('homeUnresolvedSub')}</p>
          </AlertBox>
        )
      case 'away':
        return (
          <div className="flex flex-col gap-1">
            <p className="text-title font-bold">{t('awayTitle', { when: awayWhen })}</p>
            <p className="text-body">{t('awaySub')}</p>
          </div>
        )
    }
  })()

  // Hero: I'm okay is always available (so a check-in can close any open case), except once checked in or while away.
  const hero =
    status === 'checkedIn' ? (
      <HeroButton variant="done" icon={CheckCircle2} label={t('heroCheckedIn', { time: checkedInTime })} />
    ) : status === 'away' ? (
      <HeroButton variant="quiet" icon={Undo2} label={t('imBack')} onClick={() => add('BACK', 'resident')} />
    ) : (
      <HeroButton
        icon={CheckCircle2}
        label={t('imOkay')}
        sub={status === 'normal' ? t('imOkaySub') : undefined}
        onClick={() => add('CHECK_IN', 'resident')}
      />
    )

  return (
    <>
      <TopBar left={<span className="text-body font-bold">{t(greetingKey(now))}</span>} />
      <main className="flex flex-1 flex-col gap-6 px-4 pt-4 pb-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-greet font-bold">{t('residentName')}</h1>
          <div aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={status} {...fade}>
                {statusBlock}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {hero}
          {status === 'reminder' && (
            <BigButton icon={Luggage} variant="secondary" onClick={() => setSheet(true)}>
              {t('imAway')}
            </BigButton>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <BigButton icon={ScanSearch} variant="secondary" onClick={onWhatIsThis}>
            {t('whatIsThis')}
          </BigButton>
          <BigButton icon={HandHeart} variant="secondary" onClick={onNeedHelp}>
            {t('needHelp')}
          </BigButton>
        </div>

        <CircleStrip />

        <p className="mt-auto pt-4 text-center text-small text-ink-soft">{t('footer')}</p>
      </main>

      <AnimatePresence>{sheet && <AwaySheet now={now} onPick={pickAway} onClose={closeSheet} />}</AnimatePresence>
    </>
  )
}
