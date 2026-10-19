import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  CalendarClock,
  Check,
  CheckCircle2,
  HeartHandshake,
  House,
  Luggage,
  MessageCircleQuestion,
  Minus,
  Plus,
  Undo2,
  UserX,
} from 'lucide-react'
import { useCallback, useRef, useState, type ReactNode } from 'react'
import BigButton from '../components/BigButton'
import { ActionCard, DemoReplyTag, Eyebrow } from '../components/Card'
import { StatusTag } from '../components/ChainBar'
import CircleRing from '../components/CircleRing'
import { PEOPLE } from '../components/CircleStrip'
import HeroButton from '../components/HeroButton'
import TopBar from '../components/TopBar'
import { DAY, dayOf, formatTime, homeStatus } from '../lib/engine'
import { awayWhen, latestContact } from '../lib/statusText'
import { simulatedContacts, useStore } from '../lib/store'
import { useDialog } from '../lib/useDialog'
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

const MAX_AWAY_DAYS = 14 // demo setting, not validated policy

const stepBtn =
  'flex size-16 items-center justify-center rounded-2xl bg-surface ring-2 ring-edge ring-inset disabled:opacity-60'

function AwaySheet({ now, onPick, onClose }: { now: number; onPick: (until: number) => void; onClose: () => void }) {
  const t = useT()
  const [days, setDays] = useState(1)
  const until = (dayOf(now) + days) * DAY + 9 * 60
  const sheetRef = useRef<HTMLDivElement>(null)
  useDialog(sheetRef, true, onClose) // focus in, Tab trapped, Escape closes, focus back to I'm away (or the hero)
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink/40"
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
        className="w-full max-w-[430px] rounded-t-[32px] bg-bg px-4 pt-6 pb-8"
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        exit={{ y: 40 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="away-title" className="mb-5 text-title font-bold">
          {t('awaySheetTitle')}
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              aria-label={t('fewerDays')}
              disabled={days <= 1}
              onClick={() => setDays((d) => Math.max(1, d - 1))}
              className={stepBtn}
            >
              <Minus size={28} aria-hidden />
            </button>
            <p aria-live="polite" className="text-greet font-bold tabular-nums">
              {t(days === 1 ? 'awayDayOne' : 'awayDays', { n: days })}
            </p>
            <button
              type="button"
              aria-label={t('moreDays')}
              disabled={days >= MAX_AWAY_DAYS}
              onClick={() => setDays((d) => Math.min(MAX_AWAY_DAYS, d + 1))}
              className={stepBtn}
            >
              <Plus size={28} aria-hidden />
            </button>
          </div>
          <p className="text-center text-body text-ink-soft">{t('awayPreview', { when: awayWhen(until, now, t) })}</p>
          <BigButton icon={CalendarClock} onClick={() => onPick(until)}>
            {t('setAway')}
          </BigButton>
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
  const awayLabel = chain.awayUntil === undefined ? '' : awayWhen(chain.awayUntil, now, t)
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
            <p className="text-title font-bold">{t('awayTitle', { when: awayLabel })}</p>
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
      <HeroButton label={t('imOkay')} onClick={() => add('CHECK_IN', 'resident')} />
    )

  // The check-in card around the hero: orange to do, green when done, white while away. The status sentence above says
  // where things stand; the card only says what the button is for.
  const done = status === 'checkedIn'
  const away = status === 'away'
  const cardStyle = done
    ? 'border-done bg-done-tint shadow-[0_10px_0_rgba(37,107,66,0.14)]'
    : away
      ? 'border-edge bg-surface'
      : 'border-accent-edge bg-accent shadow-[0_10px_0_rgba(154,74,18,0.12)]'
  const CardIcon = done ? Check : away ? Luggage : House

  return (
    <>
      <TopBar left={<span className="text-small font-bold tracking-wide text-accent-ink uppercase">{t(greetingKey(now))}</span>} />
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
          <section
            aria-labelledby={away ? undefined : 'checkin-title'}
            aria-label={away ? t('todayCheckIn') : undefined}
            className={`flex flex-col gap-6 rounded-[28px] border-2 p-6 transition-colors duration-200 ${cardStyle}`}
            style={done || away ? undefined : { backgroundImage: 'radial-gradient(circle at 100% 0, rgba(255,255,255,0.45), transparent 12rem)' }}
          >
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className={`flex size-16 shrink-0 items-center justify-center rounded-[20px] border-2 border-ink/15 bg-surface ${done ? 'text-done' : 'text-ink'}`}
              >
                <CardIcon size={40} strokeWidth={2.4} />
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <Eyebrow className="text-ink">{t(done ? 'allSet' : 'todayCheckIn')}</Eyebrow>
                {!away && (
                  <h2 id="checkin-title" className="text-greet font-bold">
                    {t(done ? 'checkedInHeading' : 'letThemKnow')}
                  </h2>
                )}
                {status === 'normal' && <p className="text-body">{t('justOneTap')}</p>}
              </div>
            </div>
            {hero}
            <div className="flex flex-col gap-3">
              <CircleRing order tone={done ? 'done' : away ? 'surface' : 'accent'} className="max-w-[240px]" />
              <p className="text-center text-small font-bold">{t('circleCaption')}</p>
            </div>
          </section>
          {status === 'reminder' && (
            <BigButton icon={Luggage} variant="secondary" onClick={() => setSheet(true)}>
              {t('imAway')}
            </BigButton>
          )}
        </div>

        <section aria-labelledby="ask-title" className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Eyebrow>{t('needSomething')}</Eyebrow>
            <h2 id="ask-title" className="text-title font-bold">
              {t('askYourCircle')}
            </h2>
          </div>
          <ActionCard icon={MessageCircleQuestion} tone="warn" title={t('explainMessage')} sub={t('makeSimple')} onClick={onWhatIsThis} />
          <ActionCard icon={HeartHandshake} tone="done" title={t('askFavour')} sub={t('askMeiSub')} onClick={onNeedHelp} />
        </section>

        <p className="mt-auto pt-4 text-center text-small text-ink-soft">{t('footer')}</p>
      </main>

      <AnimatePresence>{sheet && <AwaySheet now={now} onPick={pickAway} onClose={closeSheet} />}</AnimatePresence>
    </>
  )
}
