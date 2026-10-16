import { motion } from 'framer-motion'
import { AlertTriangle, Building2, Check, House, Minus, User, Users, type LucideIcon } from 'lucide-react'
import { formatTime } from '../lib/engine'
import { useT, type StrKey } from '../strings'
import type { CaseStatus, ChainResult, ChainStep } from '../types'
import { SimTag } from './Card'
import { PEOPLE } from './CircleStrip'

const ICON: Record<ChainStep['who'], LucideIcon> = { you: User, neighbour: House, family: Users, community: Building2 }

type Dot = 'waiting' | 'asked' | 'noReply' | 'responded' | 'notNeeded' | 'alert'

function dotFor(step: ChainStep): Dot {
  if (step.outcome === 'needsHelp') return 'alert'
  return step.state
}

function StepDot({ dot }: { dot: Dot }) {
  const base = 'relative z-10 flex size-10 items-center justify-center rounded-full'
  switch (dot) {
    case 'waiting':
      return <span className={`${base} border-[3px] border-line bg-surface`} />
    case 'notNeeded':
      return <span className={`${base} border-[3px] border-dashed border-line bg-bg`} />
    case 'asked':
      return (
        <span className={`${base} bg-wait-tint`}>
          <span className="size-5 rounded-full bg-wait-dot" />
        </span>
      )
    case 'noReply':
      return (
        <span className={`${base} bg-quiet-tint text-quiet`}>
          <Minus size={24} strokeWidth={3} aria-hidden />
        </span>
      )
    case 'responded':
      return (
        <span className={`${base} bg-done-dot text-white`}>
          <Check size={24} strokeWidth={3} aria-hidden />
        </span>
      )
    case 'alert':
      return (
        <span className={`${base} bg-alert text-white`}>
          <AlertTriangle size={22} strokeWidth={2.6} aria-hidden />
        </span>
      )
  }
}

// The lines under a step's name: state word plus time, never colour alone.
function useStepLines(step: ChainStep, chain: ChainResult) {
  const t = useT()
  const at = (m?: number) => (m === undefined ? '' : formatTime(m))
  const name = step.who === 'you' ? t('stepAminah') : t(PEOPLE[step.who].name)
  const lines: { text: string; tone: string }[] = []

  if (step.who === 'you') {
    if (chain.status === 'paused') lines.push({ text: t('stPaused'), tone: 'text-quiet' })
    else if (step.outcome === 'checkedIn') lines.push({ text: t('stCheckedIn', { time: at(step.time) }), tone: 'text-done' })
    else if (step.outcome === 'missed') {
      lines.push({ text: t('stMissed', { time: at(step.time) }), tone: 'text-quiet' })
      if (chain.reminderAt !== undefined) lines.push({ text: t('stReminder', { time: at(chain.reminderAt) }), tone: 'text-quiet' })
    } else lines.push({ text: t('stWaiting'), tone: 'text-quiet' })
    return lines
  }

  switch (step.state) {
    case 'waiting':
      lines.push({ text: t('stWaiting'), tone: 'text-quiet' })
      break
    case 'notNeeded':
      lines.push({ text: t('stNotNeeded'), tone: 'text-quiet' })
      break
    case 'asked':
      lines.push({ text: t('stAsked', { time: at(step.time) }), tone: 'text-wait' })
      break
    case 'noReply':
      lines.push({ text: t('stAsked', { time: at(step.time) }), tone: 'text-ink-soft' })
      lines.push({
        text: t(step.outcome === 'cantNow' ? 'stCantNow' : 'stNoReply', { time: at(step.outcomeTime) }),
        tone: 'text-quiet',
      })
      break
    case 'responded':
      lines.push({ text: t('stChecking', { name, time: at(step.time) }), tone: 'text-done' })
      if (step.outcome === 'ok') lines.push({ text: t('stOk', { time: at(step.outcomeTime) }), tone: 'text-done' })
      if (step.outcome === 'noOutcome') lines.push({ text: t('stNoOutcome', { time: at(step.outcomeTime) }), tone: 'text-quiet' })
      if (step.outcome === 'needsHelp') lines.push({ text: t('stNeedsHelp', { time: at(step.outcomeTime) }), tone: 'text-alert' })
      break
  }
  return lines
}

function Step({ step, chain, index, last }: { step: ChainStep; chain: ChainResult; index: number; last: boolean }) {
  const t = useT()
  const lines = useStepLines(step, chain)
  const Icon = ICON[step.who]
  const reached = (s: ChainStep) => s.state !== 'waiting' && s.state !== 'notNeeded'
  const next = chain.steps[index + 1]
  const solid = next && reached(next)
  const faded = step.state === 'notNeeded'
  const title = step.who === 'you' ? t('stepYou') : t(PEOPLE[step.who].name)
  const role = step.who === 'you' ? t('residentName') : t(step.who === 'neighbour' ? 'roleNeighbour' : step.who === 'family' ? 'roleFamily' : 'roleCommunity')

  return (
    <motion.li
      className="relative grid grid-cols-[40px_1fr] gap-x-4 pb-6 last:pb-0"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.12 }}
    >
      {!last && (
        <span
          aria-hidden
          className={`absolute top-10 bottom-0 left-[18px] w-1 rounded-full ${solid ? 'bg-ink-soft/40' : 'border-l-4 border-dotted border-line'}`}
        />
      )}
      <StepDot dot={dotFor(step)} />
      <div className="flex flex-col pt-1">
        <p className={`flex flex-wrap items-center gap-x-2 text-body font-bold ${faded ? 'text-quiet' : 'text-ink'}`}>
          <Icon size={22} strokeWidth={2.2} aria-hidden className="shrink-0" />
          <span className="whitespace-nowrap">{title}</span>
          <span className="text-small font-normal text-ink-soft">{role}</span>
        </p>
        {lines.map((l, i) => (
          <p key={i} className={`text-small font-bold ${l.tone}`}>
            {l.text}
          </p>
        ))}
        {/* After escalation, the earlier contact stays marked Human aware. */}
        {step.humanAware && step.outcome === 'noOutcome' && step.time !== undefined && (
          <p className="mt-1 self-start rounded-full bg-done-tint px-3 py-0.5 text-small font-bold text-done">
            {t('humanAware', { time: formatTime(step.time) })}
          </p>
        )}
      </div>
    </motion.li>
  )
}

const STATUS: Record<CaseStatus, { key: StrKey; style: string }> = {
  none: { key: 'csNone', style: 'bg-quiet-tint text-quiet' },
  open: { key: 'csOpen', style: 'bg-wait-tint text-wait' },
  beingChecked: { key: 'csBeingChecked', style: 'bg-wait-tint text-wait' },
  resolved: { key: 'csResolved', style: 'bg-done-tint text-done' },
  unresolved: { key: 'csUnresolved', style: 'bg-alert text-white' },
  needsHelp: { key: 'csNeedsHelp', style: 'bg-alert text-white' },
  paused: { key: 'csPaused', style: 'bg-quiet-tint text-quiet' },
}

export function StatusTag({ chain }: { chain: ChainResult }) {
  const t = useT()
  const s = STATUS[chain.status]
  const key: StrKey = chain.status === 'resolved' && chain.resolvedBy === 'resident' ? 'csResolvedByCheckIn' : s.key
  return <span className={`inline-flex rounded-full px-3 py-1 text-small font-bold ${s.style}`}>{t(key)}</span>
}

// Signature visual: You, Neighbour, Family, Community on one vertical line.
export default function ChainBar({ chain, showStatus = true }: { chain: ChainResult; showStatus?: boolean }) {
  return (
    <div className="rounded-[24px] bg-surface p-5 shadow-card">
      {showStatus && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <StatusTag chain={chain} />
          <SimTag />
        </div>
      )}
      <ol>
        {chain.steps.map((s, i) => (
          <Step key={s.who} step={s} chain={chain} index={i} last={i === chain.steps.length - 1} />
        ))}
      </ol>
    </div>
  )
}
