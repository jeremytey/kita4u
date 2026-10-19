import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Clock, Compass, MailOpen, RotateCcw, SkipForward, SlidersHorizontal, User, Users, X } from 'lucide-react'
import { useRef } from 'react'
import { resetCircle } from '../lib/circle'
import { dayOf, formatTime } from '../lib/engine'
import { useNextStep } from '../lib/demoNext'
import { useStore, type Preset } from '../lib/store'
import { useDialog } from '../lib/useDialog'
import { useT, type StrKey } from '../strings'
import type { Behaviour, Contact, Role } from '../types'
import { SimTag } from './Card'
import { Avatar, PEOPLE } from './CircleStrip'

const PRESETS: { id: Preset; key: StrKey }[] = [
  { id: 'normal', key: 'pNormal' },
  { id: 'missed', key: 'pMissed' },
  { id: 'help', key: 'pHelp' },
  { id: 'sample', key: 'pSample' },
]
// View as: who the presenter is looking through. Short names; contacts show their illustrated badge (named "Name, Role").
const ROLES: { id: Role; name: StrKey; who?: Contact }[] = [
  { id: 'resident', name: 'nameAminah' },
  { id: 'neighbour', name: 'mei', who: 'neighbour' },
  { id: 'family', name: 'daniel', who: 'family' },
  { id: 'community', name: 'townshipShort', who: 'community' },
]
const SHORT_NAME: Record<Role, StrKey> = { resident: 'nameAminah', neighbour: 'mei', family: 'daniel', community: 'townshipShort' }

const BEHAVIOURS: { id: Behaviour; key: StrKey }[] = [
  { id: 'noReply', key: 'bNoReply' },
  { id: 'cantNow', key: 'bCantNow' },
  { id: 'confirmsOk', key: 'bConfirmsOk' },
  { id: 'neverReports', key: 'bNeverReports' },
]

export function useClockLabel() {
  const t = useT()
  const { now } = useStore()
  const d = ((dayOf(now) % 7) + 7) % 7
  return `${t(`day${d}` as StrKey)} ${formatTime(now)}`
}

const chip = 'min-h-16 rounded-2xl px-3 text-body font-bold transition-colors duration-200'

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-body font-bold text-ink-soft">{title}</h3>
      {children}
    </section>
  )
}

const pill =
  'flex min-h-[56px] items-center gap-2 rounded-full border-2 border-edge bg-quiet-tint px-4 text-body font-bold whitespace-nowrap text-ink shadow-[0_4px_0_rgba(154,133,112,0.2)]'

// Presenter pills, floating bottom-right inside the phone column: Demo controls (names the role being viewed) and,
// while a case is open, Next step. If both do not fit on one row, Next sits above, right-aligned. Screens pad their bottom
// (pb-24, pb-36 with Next) so neither covers the last button. Clean mode (?clean=1) shows only a faint corner button.
export function DemoBar({ onOpen, clean, role, next, onNext }: { onOpen: () => void; clean: boolean; role: Role; next: number | null; onNext: () => void }) {
  const t = useT()
  if (clean) {
    return (
      <button
        type="button"
        onClick={onOpen}
        aria-label={t('demoPanel')}
        style={{ right: 'max(0px, calc(50vw - 215px))' }}
        className="fixed bottom-0 z-30 flex size-16 items-center justify-center text-ink opacity-15 focus-visible:opacity-100"
      >
        <SlidersHorizontal size={26} aria-hidden />
      </button>
    )
  }
  return (
    <div
      data-demo-bar
      style={{ right: 'max(14px, calc(50vw - 201px))', maxWidth: 'calc(min(100vw, 430px) - 28px)' }}
      className="fixed bottom-[14px] z-30 flex flex-wrap items-center justify-end gap-2"
    >
      {next !== null && (
        <button type="button" onClick={onNext} aria-label={t('nextStepTo', { time: formatTime(next) })} className={pill}>
          <SkipForward size={22} aria-hidden />
          {t('nextStep')}
        </button>
      )}
      <button type="button" onClick={onOpen} className={pill}>
        {/* Below 360px the icon makes room for the role name ("Demo controls · Township" would leave the column). */}
        <SlidersHorizontal size={22} aria-hidden className={role === 'resident' ? undefined : 'max-[359px]:hidden'} />
        {role === 'resident' ? t('demoControls') : t('demoView', { name: t(SHORT_NAME[role]) })}
      </button>
    </div>
  )
}

export default function DemoPanel({
  open,
  role,
  onClose,
  onRole,
  onPreset,
  onSetup,
  onPreview,
  onReset,
}: {
  open: boolean
  role: Role
  onClose: () => void
  onRole: (r: Role) => void
  onPreset: (p: Preset) => void
  onSetup: () => void
  onPreview: () => void
  onReset: () => void
}) {
  const t = useT()
  const store = useStore()
  const clock = useClockLabel()
  const next = useNextStep()
  const dialogRef = useRef<HTMLDivElement>(null)
  useDialog(dialogRef, open, onClose) // focus in (on Close), Tab trapped, Escape closes, focus back to the opener

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-end justify-center bg-ink/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-title"
            className="flex max-h-[92dvh] w-full max-w-[430px] flex-col gap-6 overflow-y-auto rounded-t-[32px] bg-bg px-4 pt-5 pb-8"
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            exit={{ y: 40 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 id="demo-title" className="text-title font-bold">
                {t('demoPanel')}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('close')}
                className="flex size-16 items-center justify-center rounded-full bg-surface shadow-card"
              >
                <X size={28} aria-hidden />
              </button>
            </div>

            <Group title={t('clock')}>
              <div className="flex flex-wrap items-center gap-3 rounded-[24px] bg-surface p-4 shadow-card">
                <Clock size={28} aria-hidden />
                <span className="text-greet font-bold tabular-nums">{clock}</span>
                <SimTag />
              </div>
              <button
                type="button"
                disabled={next === null}
                aria-label={next === null ? undefined : t('nextStepTo', { time: formatTime(next) })}
                className={`${chip} flex items-center justify-center gap-2 bg-accent text-ink disabled:opacity-60`}
                onClick={() => next !== null && store.advance(next - store.now)}
              >
                <SkipForward size={22} aria-hidden />
                {next === null ? t('nextStepNone') : t('nextStepTo', { time: formatTime(next) })}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className={`${chip} bg-accent text-ink`} onClick={() => store.advance(60)}>
                  +1h
                </button>
                <button type="button" className={`${chip} bg-accent text-ink`} onClick={() => store.advance(120)}>
                  +2h
                </button>
              </div>
            </Group>

            <Group title={t('presets')}>
              <div className="grid grid-cols-2 gap-3">
                {PRESETS.map((p) => (
                  <button key={p.id} type="button" className={`${chip} bg-surface text-ink shadow-card`} onClick={() => onPreset(p.id)}>
                    {t(p.key)}
                  </button>
                ))}
              </div>
            </Group>

            <Group title={t('viewAs')}>
              <div className="grid grid-cols-2 gap-3" role="group" aria-label={t('viewAs')}>
                {ROLES.map((r) => {
                  const on = role === r.id
                  return (
                    <button
                      key={r.id}
                      type="button"
                      aria-pressed={on}
                      className={`relative flex min-h-[64px] w-full flex-col items-center justify-center gap-1 rounded-[20px] px-2 py-2 text-center ring-inset transition-colors duration-200 ${
                        on ? 'bg-accent-tint ring-[3px] ring-ink' : 'bg-surface ring-2 ring-edge'
                      }`}
                      onClick={() => onRole(r.id)}
                    >
                      {on && <CheckCircle2 size={24} strokeWidth={2.6} className="absolute top-1.5 right-1.5 text-ink" aria-hidden />}
                      {r.who ? (
                        <Avatar who={r.who} size={44} />
                      ) : (
                        <span aria-hidden className="flex size-11 items-center justify-center rounded-full bg-accent text-ink">
                          <User size={24} strokeWidth={2.4} />
                        </span>
                      )}
                      <span className="text-body leading-tight font-bold">{t(r.name)}</span>
                    </button>
                  )
                })}
              </div>
              <p className="text-center text-small text-ink-soft">{t('demoViewsNote')}</p>
              <button type="button" className={`${chip} flex items-center justify-center gap-2 bg-surface text-ink shadow-card`} onClick={() => onRole('neighbour')}>
                <MailOpen size={22} aria-hidden />
                {t('viewInvite')}
              </button>
            </Group>

            <Group title={t('behaviours')}>
              {(Object.keys(PEOPLE) as Contact[]).map((c) => (
                <label key={c} className="flex flex-col gap-1">
                  <span className="text-small font-bold">
                    {t(PEOPLE[c].name)} ({t(PEOPLE[c].role)})
                  </span>
                  <select
                    value={store.behaviours[c]}
                    onChange={(e) => store.setBehaviour(c, e.target.value as Behaviour)}
                    className="min-h-16 rounded-2xl bg-surface px-4 text-body shadow-card"
                  >
                    {BEHAVIOURS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {t(b.key)}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
              <p className="text-small text-ink-soft">{t('behaviourNote')}</p>
            </Group>

            <Group title={t('advanced')}>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className={`${chip} bg-surface text-ink shadow-card`} onClick={() => store.advance(24 * 60)}>
                  +24h
                </button>
                {/* Reset clears the event log (store) and the Circle setup state (own key). The language stays. */}
                <button
                  type="button"
                  className={`${chip} flex items-center justify-center gap-2 bg-quiet-tint text-ink`}
                  onClick={() => {
                    store.reset()
                    resetCircle()
                    onReset()
                  }}
                >
                  <RotateCcw size={22} aria-hidden />
                  {t('reset')}
                </button>
                <button type="button" className={`${chip} col-span-2 flex items-center justify-center gap-2 bg-surface text-ink shadow-card`} onClick={onSetup}>
                  <Users size={22} aria-hidden />
                  {t('showSetup')}
                </button>
                <button type="button" className={`${chip} col-span-2 flex items-center justify-center gap-2 bg-surface text-ink shadow-card`} onClick={onPreview}>
                  <Compass size={22} aria-hidden />
                  {t('proposedPreview')}
                </button>
              </div>
            </Group>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
