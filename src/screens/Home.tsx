import { AnimatePresence, motion } from 'framer-motion'
import {
  BellRing,
  CalendarClock,
  CheckCircle2,
  HandHeart,
  Hourglass,
  Luggage,
  ScanSearch,
  Sun,
  Undo2,
  UserCheck,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import BigButton from '../components/BigButton'
import { ActionCard, SimTag } from '../components/Card'
import CircleStrip from '../components/CircleStrip'
import TopBar from '../components/TopBar'
import { useT } from '../strings'
import type { HomeStatus } from '../types'

export type AwayChoice = 'tomorrow' | 'sunday'

interface Props {
  status: HomeStatus
  checkedInTime?: string
  awayUntil?: AwayChoice
  checkerName?: string
  checkerTime?: string
  chain?: ReactNode // ChainBar, from phase 4
  onCheckIn: () => void
  onAway: (until: AwayChoice) => void
  onBack: () => void
  onWhatIsThis: () => void
  onNeedHelp: () => void
}

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}

function StatusBox({ tone, icon: Icon, title, sub, children }: {
  tone: 'done' | 'wait' | 'quiet'
  icon: typeof Sun
  title: ReactNode
  sub?: string
  children?: ReactNode
}) {
  const bg = { done: 'bg-done-tint', wait: 'bg-wait-tint', quiet: 'bg-quiet-tint' }[tone]
  const fg = { done: 'text-done', wait: 'text-wait', quiet: 'text-quiet' }[tone]
  return (
    <motion.section {...fade} className={`rounded-[24px] p-5 ${bg}`} aria-live="polite">
      <div className="flex items-start gap-4">
        <span className={`flex size-14 shrink-0 items-center justify-center rounded-2xl bg-surface ${fg}`}>
          <Icon size={30} strokeWidth={2.2} aria-hidden />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="text-title font-bold">{title}</h2>
          {sub && <p className="text-body text-ink">{sub}</p>}
        </div>
      </div>
      {children && <div className="mt-4 flex flex-col gap-3">{children}</div>}
    </motion.section>
  )
}

function AwaySheet({ onPick, onClose }: { onPick: (u: AwayChoice) => void; onClose: () => void }) {
  const t = useT()
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
          <BigButton icon={CalendarClock} variant="secondary" onClick={() => onPick('tomorrow')}>
            {t('untilTomorrow')}
          </BigButton>
          <BigButton icon={CalendarClock} variant="secondary" onClick={() => onPick('sunday')}>
            {t('untilSunday')}
          </BigButton>
          <BigButton variant="quiet" onClick={onClose}>
            {t('cancel')}
          </BigButton>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Home(p: Props) {
  const t = useT()
  const [sheet, setSheet] = useState(false)
  const pickAway = (u: AwayChoice) => {
    setSheet(false)
    p.onAway(u)
  }

  const statusBlock = (() => {
    switch (p.status) {
      case 'checkedIn':
        return (
          <StatusBox
            key="checkedIn"
            tone="done"
            icon={CheckCircle2}
            title={
              <>
                {t('checkedInTitle', { time: p.checkedInTime ?? '' })} <SimTag />
              </>
            }
            sub={t('checkedInSub')}
          />
        )
      case 'reminder':
        return (
          <StatusBox key="reminder" tone="wait" icon={BellRing} title={t('reminderTitle')} sub={t('reminderSub')}>
            <BigButton icon={CheckCircle2} onClick={p.onCheckIn}>
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
            {p.chain}
          </StatusBox>
        )
      case 'away':
        return (
          <StatusBox
            key="away"
            tone="quiet"
            icon={Luggage}
            title={t('awayTitle', { when: t(p.awayUntil === 'sunday' ? 'whenSunday' : 'whenTomorrow') })}
            sub={t('awaySub')}
          >
            <BigButton icon={Undo2} variant="secondary" onClick={p.onBack}>
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
            title={
              <>
                {t('contactCheckedTitle', { name: p.checkerName ?? '', time: p.checkerTime ?? '' })} <SimTag />
              </>
            }
            sub={t('contactCheckedSub')}
          />
        )
      default:
        return null
    }
  })()

  // The banner (reminder) or away card replaces the I'm okay card, so there are never more than a few actions.
  const showOkayCard = p.status !== 'reminder' && p.status !== 'away'

  return (
    <>
      <TopBar
        left={
          <span className="flex items-center gap-2 text-body font-bold">
            <Sun size={26} strokeWidth={2.2} className="text-accent-ink" aria-hidden />
            {t('goodMorning')}
          </span>
        }
      />
      <main className="flex flex-1 flex-col gap-6 px-4 pt-4 pb-8">
        <h1 className="text-greet font-bold">{t('residentName')}</h1>

        <AnimatePresence mode="wait">{statusBlock}</AnimatePresence>

        <CircleStrip />

        <div className="flex flex-col gap-4">
          {showOkayCard && (
            <ActionCard
              icon={CheckCircle2}
              tone="done"
              title={p.status === 'checkedIn' ? t('checkedInCard') : t('imOkay')}
              sub={p.status === 'checkedIn' ? undefined : t('imOkaySub')}
              onClick={p.onCheckIn}
            />
          )}
          <ActionCard icon={ScanSearch} title={t('whatIsThis')} sub={t('whatIsThisSub')} onClick={p.onWhatIsThis} />
          <ActionCard icon={HandHeart} title={t('needHelp')} sub={t('needHelpSub')} onClick={p.onNeedHelp} />
        </div>

        <p className="mt-auto pt-4 text-center text-small text-ink-soft">{t('footer')}</p>
      </main>

      <AnimatePresence>{sheet && <AwaySheet onPick={pickAway} onClose={() => setSheet(false)} />}</AnimatePresence>
    </>
  )
}
