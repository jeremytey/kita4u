import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CalendarDays, Check, Clock, ListOrdered, ShieldCheck, Users } from 'lucide-react'
import { useState } from 'react'
import BigButton from '../components/BigButton'
import { Eyebrow, IconTile } from '../components/Card'
import { Avatar, PEOPLE } from '../components/CircleStrip'
import TopBar from '../components/TopBar'
import { setCircle, useCircle, type CircleState } from '../lib/circle'
import { useT, type StrKey } from '../strings'
import type { Contact } from '../types'
import { TASKS, type Task } from './NeedHelp'

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}

// Read-only: the order and the people are fixed in this prototype. Nothing here changes the chain.
const PEOPLE_ROWS: { who: Contact; note: StrKey }[] = [
  { who: 'neighbour', note: 'willBeInvited' },
  { who: 'family', note: 'familyDemo' },
  { who: 'community', note: 'townshipProposed' },
]

function Heading({ n, title }: { n: number; title: string }) {
  const t = useT()
  return (
    <div className="flex flex-col gap-1">
      <Eyebrow>{t('setupStep', { n })}</Eyebrow>
      <h1 className="text-greet font-bold">{title}</h1>
    </div>
  )
}

// A plain line with an icon. Not a button.
function Line({ icon: Icon, children }: { icon: typeof Clock; children: string }) {
  return (
    <p className="flex items-start gap-3 text-body text-ink-soft">
      <Icon size={26} strokeWidth={2.4} className="mt-0.5 shrink-0" aria-hidden />
      {children}
    </p>
  )
}

// Switch row: role="switch" with the word On or Off, never colour alone.
function SwitchRow({ task, on, onToggle }: { task: Task; on: boolean; onToggle: () => void }) {
  const t = useT()
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className="grid min-h-[76px] w-full grid-cols-[56px_1fr_auto] items-center gap-3 rounded-[22px] border-2 border-edge bg-surface p-3 text-left"
    >
      <IconTile icon={TASKS[task].icon} tone={on ? 'done' : 'quiet'} />
      <span className="flex min-w-0 flex-col">
        <span className="text-title leading-tight font-bold">{t(TASKS[task].title)}</span>
        <span className="text-body font-bold text-ink-soft">{t(on ? 'switchOn' : 'switchOff')}</span>
      </span>
      <span aria-hidden className={`flex h-9 w-16 items-center rounded-full p-1 transition-colors duration-200 ${on ? 'justify-end bg-ink' : 'justify-start bg-quiet-tint ring-2 ring-edge ring-inset'}`}>
        <span className="flex size-7 items-center justify-center rounded-full bg-surface text-ink shadow">{on && <Check size={18} strokeWidth={3} />}</span>
      </span>
    </button>
  )
}

export default function CircleSetup({ onExit, onDone }: { onExit: () => void; onDone: () => void }) {
  const t = useT()
  const circle = useCircle()
  const [step, setStep] = useState(1)

  const back = () => (step === 1 ? onExit() : setStep(step - 1))
  const togglePref = (k: Task) => setCircle({ prefs: { ...circle.prefs, [k]: !circle.prefs[k] } })
  const finish = () => {
    const patch: Partial<CircleState> = { setupDone: true }
    if (circle.meiInvite === 'none') patch.meiInvite = 'pending'
    setCircle(patch)
    onDone()
  }

  return (
    <>
      <TopBar onBack={back} />
      <main className="flex flex-1 flex-col px-4 pt-6 pb-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="1" {...fade} className="flex flex-col gap-6">
              <Heading n={1} title={t('setupPeopleTitle')} />
              <ol className="flex flex-col gap-3">
                {PEOPLE_ROWS.map(({ who, note }, i) => (
                  <li
                    key={who}
                    className={`flex items-start gap-4 rounded-[22px] border-2 bg-surface p-4 ${who === 'community' ? 'border-dashed border-edge' : 'border-edge'}`}
                  >
                    <Avatar who={who} size={60} order={i + 1} />
                    <div className="flex min-w-0 flex-col">
                      <span className="text-title leading-tight font-bold">{t(PEOPLE[who].name)}</span>
                      <span className="text-body text-ink-soft">{t(PEOPLE[who].role)}</span>
                      <span className="mt-1 text-body font-bold">{t(note)}</span>
                    </div>
                  </li>
                ))}
              </ol>
              <Line icon={ListOrdered}>{t('orderFixed')}</Line>
              <BigButton icon={ArrowRight} onClick={() => setStep(2)}>
                {t('next')}
              </BigButton>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="2" {...fade} className="flex flex-col gap-6">
              <Heading n={2} title={t('setupHelpTitle')} />
              <Line icon={Clock}>{t('checkInBy')}</Line>
              <div className="flex flex-col gap-3">
                {(Object.keys(TASKS) as Task[]).map((k) => (
                  <SwitchRow key={k} task={k} on={circle.prefs[k]} onToggle={() => togglePref(k)} />
                ))}
              </div>
              <Line icon={ShieldCheck}>{t('doorstepOnly')}</Line>
              <BigButton icon={ArrowRight} onClick={() => setStep(3)}>
                {t('next')}
              </BigButton>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="3" {...fade} className="flex flex-col gap-6">
              <Heading n={3} title={t('setupMeetTitle')} />
              {/* Mock only: grey and dashed, so it reads as a proposal, not a booked event. */}
              <section aria-labelledby="intro-title" className="flex flex-col gap-4 rounded-[24px] border-2 border-dashed border-edge bg-quiet-tint p-5">
                <span className="self-start rounded-xl bg-surface px-3 py-1 text-small font-bold tracking-wide text-quiet">{t('introTag')}</span>
                <div className="flex items-center gap-4">
                  <IconTile icon={Users} tone="quiet" />
                  <h2 id="intro-title" className="text-title font-bold">
                    {t('introTitle')}
                  </h2>
                </div>
                <p className="flex items-start gap-3 text-body">
                  <CalendarDays size={26} strokeWidth={2.4} className="mt-0.5 shrink-0 text-quiet" aria-hidden />
                  {t('introText')}
                </p>
                <button
                  type="button"
                  aria-pressed={circle.introInterested}
                  onClick={() => setCircle({ introInterested: !circle.introInterested })}
                  className="flex min-h-16 w-full flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-2xl bg-surface px-5 py-2 text-left ring-2 ring-edge ring-inset"
                >
                  <span className="text-body font-bold">{t('imInterested')}</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-small font-bold ${circle.introInterested ? 'bg-ink text-white' : 'bg-quiet-tint text-quiet'}`}>
                    {circle.introInterested && <Check size={20} strokeWidth={3} aria-hidden />}
                    {t(circle.introInterested ? 'interested' : 'notYet')}
                  </span>
                </button>
              </section>
              <BigButton icon={Check} onClick={finish}>
                {t('finish')}
              </BigButton>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  )
}
