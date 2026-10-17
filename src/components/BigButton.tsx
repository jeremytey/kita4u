import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'quiet' | 'alert' | 'dark'

const STYLE: Record<Variant, string> = {
  primary: 'bg-accent text-ink',
  secondary: 'bg-surface text-ink ring-2 ring-edge ring-inset',
  quiet: 'bg-quiet-tint text-ink ring-2 ring-edge ring-inset',
  alert: 'bg-alert text-white',
  dark: 'bg-ink text-white', // demo End call. Not red: red is reserved.
}

// Full width, at least 64px tall.
export default function BigButton({
  children,
  icon: Icon,
  variant = 'primary',
  onClick,
  disabled,
  expanded,
}: {
  children: ReactNode
  icon?: LucideIcon
  variant?: Variant
  onClick?: () => void
  disabled?: boolean
  expanded?: boolean // set for show/hide toggles (aria-expanded)
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-expanded={expanded}
      className={`flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl px-5 text-body font-bold transition-[transform,opacity] duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${STYLE[variant]}`}
    >
      {Icon && <Icon size={26} strokeWidth={2.2} aria-hidden />}
      <span>{children}</span>
    </button>
  )
}
