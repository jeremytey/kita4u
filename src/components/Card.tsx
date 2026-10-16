import { Bot, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useT } from '../strings'

type Tone = 'accent' | 'done' | 'wait' | 'quiet' | 'warn' | 'alert'

const TILE: Record<Tone, string> = {
  accent: 'bg-accent-tint text-ink',
  done: 'bg-done-tint text-done',
  wait: 'bg-wait-tint text-wait',
  quiet: 'bg-quiet-tint text-quiet',
  warn: 'bg-warn-tint text-warn',
  alert: 'bg-alert-tint text-alert',
}

// Dark glyph in a tinted 56px rounded square.
export function IconTile({ icon: Icon, tone = 'accent' }: { icon: LucideIcon; tone?: Tone }) {
  return (
    <span className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${TILE[tone]}`}>
      <Icon size={30} strokeWidth={2.2} aria-hidden />
    </span>
  )
}

// Plain white card. 24px radius, soft shadow.
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[24px] bg-surface p-5 shadow-card ${className}`}>{children}</div>
}

// One action per card: icon, title, one short line.
export function ActionCard({
  icon,
  title,
  sub,
  tone = 'accent',
  disabled,
  onClick,
}: {
  icon: LucideIcon
  title: string
  sub?: string
  tone?: Tone
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled || undefined}
      className={`flex min-h-24 w-full items-center gap-4 rounded-[24px] bg-surface p-5 text-left shadow-card transition-transform duration-200 ${
        disabled ? 'cursor-default' : 'active:scale-[0.98]'
      }`}
    >
      <IconTile icon={icon} tone={tone} />
      <span className="flex flex-col">
        <span className="text-title font-bold">{title}</span>
        {sub && <span className="text-body text-ink-soft">{sub}</span>}
      </span>
    </button>
  )
}

// Shown next to every simulated number or time.
export function SimTag() {
  const t = useT()
  return (
    <span className="inline-flex rounded-full bg-quiet-tint px-2.5 py-0.5 align-middle text-small font-bold tracking-wide text-quiet">
      {t('simulated')}
    </span>
  )
}

// Marks a reply that came from a demo behaviour, so no screen suggests a real person acted.
export function DemoReplyTag() {
  const t = useT()
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-quiet-tint px-2.5 py-0.5 align-middle text-small font-bold text-quiet">
      <Bot size={18} aria-hidden />
      {t('demoReply')}
    </span>
  )
}
