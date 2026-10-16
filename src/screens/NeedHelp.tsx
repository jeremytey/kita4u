import { AnimatePresence, motion } from 'framer-motion'
import { Car, Check, CheckCircle2, Heart, Info, Minus, RotateCcw, ShoppingBasket, Smartphone, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import BigButton from '../components/BigButton'
import { ActionCard, SimTag } from '../components/Card'
import CircleStrip from '../components/CircleStrip'
import TopBar from '../components/TopBar'
import { DAY, dayOf, formatTime } from '../lib/engine'
import { useStore } from '../lib/store'
import { useT, type StrKey } from '../strings'
import type { AppEvent } from '../types'

export type Task = 'groceries' | 'phone' | 'clinic'

export const TASKS: Record<Task, { icon: LucideIcon; title: StrKey; phrase: StrKey }> = {
  groceries: { icon: ShoppingBasket, title: 'taskGroceriesTitle', phrase: 'taskGroceries' },
  phone: { icon: Smartphone, title: 'taskPhoneTitle', phrase: 'taskPhone' },
  clinic: { icon: Car, title: 'taskClinicTitle', phrase: 'taskClinic' },
}

export interface HelpState {
  task: Task
  requestedAt: number
  acceptedAt?: number
  declinedAt?: number
  doneAt?: number
  thanksAt?: number
}

// Today's latest favour request, read from the event log. Help events never touch the welfare chain.
export function currentHelp(events: AppEvent[], now: number): HelpState | undefined {
  const dayStart = dayOf(now) * DAY
  const today = events.filter((e) => e.time >= dayStart && e.time <= now)
  // Events are appended in order, so "after" means later in the log (taps can share a SIMULATED minute).
  const idx = today.map((e) => e.type).lastIndexOf('HELP_REQUESTED')
  if (idx < 0) return undefined
  const req = today[idx]
  const after = today.slice(idx + 1)
  const first = (type: AppEvent['type']) => after.find((e) => e.type === type)?.time
  return {
    task: (req.meta?.task as Task) ?? 'groceries',
    requestedAt: req.time,
    acceptedAt: first('HELP_ACCEPTED'),
    declinedAt: first('HELP_DECLINED'),
    doneAt: first('HELP_DONE'),
    thanksAt: first('THANKS'),
  }
}

type Step = 'pick' | 'confirm' | 'status'

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}

function TrackLine({ state, text, time }: { state: 'done' | 'wait' | 'todo' | 'no'; text: string; time?: number }) {
  const dot =
    state === 'done' ? (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-done-dot text-white">
        <Check size={24} strokeWidth={3} aria-hidden />
      </span>
    ) : state === 'wait' ? (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-wait-tint">
        <span className="size-5 rounded-full bg-wait-dot" />
      </span>
    ) : state === 'no' ? (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-quiet-tint text-quiet">
        <Minus size={24} strokeWidth={3} aria-hidden />
      </span>
    ) : (
      <span className="size-10 shrink-0 rounded-full border-[3px] border-line bg-surface" />
    )
  return (
    <li className="flex items-center gap-4">
      {dot}
      <span className="flex flex-wrap items-center gap-2 text-body font-bold">
        {text}
        {time !== undefined && <SimTag />}
      </span>
    </li>
  )
}

export default function NeedHelp({ initialTask, onExit }: { initialTask?: Task; onExit: () => void }) {
  const t = useT()
  const { events, now, add } = useStore()
  const help = currentHelp(events, now)
  const [step, setStep] = useState<Step>(() => {
    if (initialTask) return 'confirm'
    return help && help.thanksAt === undefined ? 'status' : 'pick'
  })
  const [task, setTask] = useState<Task>(initialTask ?? help?.task ?? 'groceries')

  const ask = (k: Task) => {
    add('HELP_REQUESTED', 'resident', { task: k })
    setStep('status')
  }
  const back = () => (step === 'confirm' ? setStep('pick') : onExit())
  const phrase = t(TASKS[task].phrase)

  return (
    <>
      <TopBar onBack={back} />
      <main className="flex flex-1 flex-col px-4 pt-6 pb-8">
        <AnimatePresence mode="wait">
          {step === 'pick' && (
            <motion.div key="pick" {...fade} className="flex flex-col gap-4">
              <h1 className="text-greet font-bold">{t('helpPickTitle')}</h1>
              {(Object.keys(TASKS) as Task[]).map((k) => (
                <ActionCard
                  key={k}
                  icon={TASKS[k].icon}
                  title={t(TASKS[k].title)}
                  onClick={() => {
                    setTask(k)
                    setStep('confirm')
                  }}
                />
              ))}
            </motion.div>
          )}

          {step === 'confirm' && (
            <motion.div key="confirm" {...fade} className="flex flex-col gap-6">
              <h1 className="text-greet font-bold">{t('helpConfirmQ', { task: phrase })}</h1>
              <CircleStrip />
              <p className="flex items-start gap-3 rounded-[24px] bg-accent-tint p-4 text-body font-bold">
                <Info size={26} className="mt-0.5 shrink-0 text-accent-ink" aria-hidden />
                {t('doorstepOnly')}
              </p>
              <div className="flex flex-col gap-3">
                <BigButton icon={TASKS[task].icon} onClick={() => ask(task)}>
                  {t('yesAskMei')}
                </BigButton>
                <BigButton variant="secondary" onClick={() => setStep('pick')}>
                  {t('back')}
                </BigButton>
              </div>
            </motion.div>
          )}

          {step === 'status' && help && (
            <motion.div key="status" {...fade} className="flex flex-col gap-6">
              <h1 className="text-title font-bold">{t('helpStatusTitle', { task: t(TASKS[help.task].title) })}</h1>

              <ol className="flex flex-col gap-4 rounded-[24px] bg-surface p-5 shadow-card" aria-live="polite">
                <TrackLine state="done" text={t('trackRequested', { time: formatTime(help.requestedAt) })} time={help.requestedAt} />
                {help.acceptedAt !== undefined ? (
                  <TrackLine state="done" text={t('trackAccepted', { time: formatTime(help.acceptedAt) })} time={help.acceptedAt} />
                ) : (
                  <TrackLine
                    state={help.declinedAt !== undefined ? 'no' : 'wait'}
                    text={help.declinedAt !== undefined ? t('meiCantNow') : t('trackWaitingMei')}
                  />
                )}
                {help.doneAt !== undefined ? (
                  <TrackLine state="done" text={t('trackDone', { time: formatTime(help.doneAt) })} time={help.doneAt} />
                ) : (
                  <TrackLine state="todo" text={t('trackNotYet')} />
                )}
              </ol>

              {help.declinedAt !== undefined && help.acceptedAt === undefined && (
                <BigButton icon={RotateCcw} onClick={() => ask(help.task)}>
                  {t('askAgain')}
                </BigButton>
              )}

              {help.doneAt !== undefined && (
                <div className="flex flex-col items-center gap-4 rounded-[24px] bg-done-tint p-5 text-center">
                  <motion.span
                    className="flex size-24 items-center justify-center rounded-full bg-surface text-done"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    <CheckCircle2 size={56} strokeWidth={2.2} aria-hidden />
                  </motion.span>
                  <p className="text-title font-bold">{t('helpDoneTitle', { task: t(TASKS[help.task].phrase) })}</p>
                  {help.thanksAt === undefined ? (
                    <BigButton icon={Heart} onClick={() => add('THANKS', 'resident', { task: help.task })}>
                      {t('sayThanks')}
                    </BigButton>
                  ) : (
                    <p className="flex items-center gap-2 text-body font-bold text-done">
                      <Heart size={24} aria-hidden /> {t('thanksSent')}
                    </p>
                  )}
                </div>
              )}

              <BigButton variant="quiet" onClick={onExit}>
                {t('backHome')}
              </BigButton>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  )
}
