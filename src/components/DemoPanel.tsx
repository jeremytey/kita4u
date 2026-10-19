import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, ChevronRight, Clock, Compass, RotateCcw, SlidersHorizontal, User, Users, X } from 'lucide-react'
import { useRef } from 'react'
import { resetCircle } from '../lib/circle'
import { dayOf, formatTime } from '../lib/engine'
import { useStore, type Preset } from '../lib/store'
import { useDialog } from '../lib/useDialog'
import { useT, type StrKey } from '../strings'
import type { Behaviour, Contact, Role } from '../types'
import { IconTile, SimTag } from './Card'
import { Avatar, PEOPLE } from './CircleStrip'

const PRESETS: { id: Preset; key: StrKey }[] = [
  { id: 'normal', key: 'pNormal' },
  { id: 'missed', key: 'pMissed' },
  { id: 'help', key: 'pHelp' },
  { id: 'sample', key: 'pSample' },
]
// View as: who the presenter is looking through. Contacts show their illustrated badge.
const ROLES: { id: Role; name: StrKey; role: StrKey; who?: Contact }[] = [
  { id: 'resident', name: 'residentName', role: 'roleResident' },
  { id: 'neighbour', name: 'mei', role: 'roleNeighbour', who: 'neighbour' },
  { id: 'family', name: 'daniel', role: 'roleSon', who: 'family' },
  { id: 'community', name: 'township', role: 'roleCommunity', who: 'community' },
]
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

// Presenter pill, floating bottom-right inside the phone column. The clock lives in the Ribbon.
// Screens pad their bottom (pb-24) so it never covers the last button. Clean mode (?clean=1) shows only a faint corner button.
export function DemoBar({ onOpen, clean }: { onOpen: () => void; clean: boolean }) {
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
    <button
      type="button"
      onClick={onOpen}
      style={{ right: 'max(14px, calc(50vw - 201px))' }}
      className="fixed bottom-[14px] z-30 flex min-h-[56px] items-center gap-2 rounded-full border-2 border-edge bg-quiet-tint px-4 text-body font-bold text-ink shadow-[0_4px_0_rgba(154,133,112,0.2)]"
    >
      <SlidersHorizontal size={22} aria-hidden />
      {t('demoControls')}
    </button>
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
}: {
  open: boolean
  role: Role
  onClose: () => void
  onRole: (r: Role) => void
  onPreset: (p: Preset) => void
  onSetup: () => void
  onPreview: () => void
}) {
  const t = useT()
  const store = useStore()
  const clock = useClockLabel()
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
              <div className="flex flex-col gap-3" role="group">
                {ROLES.map((r) => {
                  const on = role === r.id
                  return (
                    <button
                      key={r.id}
                      type="button"
                      aria-pressed={on}
                      className={`grid min-h-[76px] w-full grid-cols-[56px_1fr_auto] items-center gap-3 rounded-[20px] border-2 px-3 py-2 text-left transition-colors duration-200 ${
                        on ? 'border-done bg-done-tint' : 'border-line bg-surface'
                      }`}
                      onClick={() => onRole(r.id)}
                    >
                      <span className="flex justify-center">
                        {r.who ? <Avatar who={r.who} size={52} /> : <IconTile icon={User} tone="accent" />}
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="text-body leading-tight font-bold">{t(r.name)}</span>
                        <span className="text-small leading-tight text-ink-soft">{t(r.role)}</span>
                      </span>
                      {on ? (
                        <CheckCircle2 size={28} className="text-done" aria-hidden />
                      ) : (
                        <ChevronRight size={28} className="text-ink-soft" aria-hidden />
                      )}
                    </button>
                  )
                })}
              </div>
              <p className="text-center text-small text-ink-soft">{t('demoViewsNote')}</p>
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
