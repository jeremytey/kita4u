import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type Tone = 'accent' | 'done' | 'wait' | 'quiet' | 'warn' | 'alert'

export const TILE: Record<Tone, string> = {
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
  onClick,
}: {
  icon: LucideIcon
  title: string
  sub?: string
  tone?: Tone
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-24 w-full items-center gap-4 rounded-[24px] bg-surface p-5 text-left shadow-card transition-transform duration-200 active:scale-[0.98]"
    >
      <IconTile icon={icon} tone={tone} />
      <span className="flex flex-col">
        <span className="text-title font-bold">{title}</span>
        {sub && <span className="text-body text-ink-soft">{sub}</span>}
      </span>
    </button>
  )
}
