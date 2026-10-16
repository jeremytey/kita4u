import { AnimatePresence, motion } from 'framer-motion'
import { Clock, RotateCcw, SlidersHorizontal, X } from 'lucide-react'
import { useRef } from 'react'
import { dayOf, formatTime } from '../lib/engine'
import { useStore, type Preset } from '../lib/store'
import { useDialog } from '../lib/useDialog'
import { useT, type StrKey } from '../strings'
import type { Behaviour, Contact, Role } from '../types'
import { SimTag } from './Card'
import { PEOPLE } from './CircleStrip'

const PRESETS: { id: Preset; key: StrKey }[] = [
  { id: 'normal', key: 'pNormal' },
  { id: 'missed', key: 'pMissed' },
  { id: 'help', key: 'pHelp' },
  { id: 'sample', key: 'pSample' },
]
const ROLES: { id: Role; key: StrKey }[] = [
  { id: 'resident', key: 'roleResident' },
  { id: 'neighbour', key: 'roleNeighbour' },
  { id: 'family', key: 'roleFamily' },
  { id: 'community', key: 'roleCommunity' },
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

// Presenter handle along the bottom of the phone column. The clock lives in the Ribbon.
// Content scrolls above it, so it never covers a button. Clean mode (?clean=1) shows only a faint corner button.
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
      className="fixed inset-x-0 bottom-0 z-30 mx-auto flex h-16 w-full max-w-[430px] items-center justify-center gap-3 border-t-2 border-edge bg-surface text-body font-bold text-ink focus-visible:outline-offset-[-6px]"
    >
      <SlidersHorizontal size={26} aria-hidden />
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
}: {
  open: boolean
  role: Role
  onClose: () => void
  onRole: (r: Role) => void
  onPreset: (p: Preset) => void
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
              <div className="grid grid-cols-2 gap-3" role="group">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    aria-pressed={role === r.id}
                    className={`${chip} ${role === r.id ? 'bg-ink text-white' : 'bg-surface text-ink shadow-card'}`}
                    onClick={() => onRole(r.id)}
                  >
                    {t(r.key)}
                  </button>
                ))}
              </div>
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
                <button type="button" className={`${chip} flex items-center justify-center gap-2 bg-quiet-tint text-ink`} onClick={store.reset}>
                  <RotateCcw size={22} aria-hidden />
                  {t('reset')}
                </button>
              </div>
            </Group>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
