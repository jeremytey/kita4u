import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'quiet' | 'alert' | 'dark' | 'success'

const STYLE: Record<Variant, string> = {
  primary: 'bg-accent text-ink',
  secondary: 'bg-surface text-ink ring-2 ring-edge ring-inset',
  quiet: 'bg-quiet-tint text-ink ring-2 ring-edge ring-inset',
  alert: 'bg-alert text-white', // Needs help only. Red is reserved.
  dark: 'bg-ink text-white', // demo End call. Not red: red is reserved.
  success: 'bg-done text-white', // She's OK
}

// The two outcome buttons a contact taps are a little larger.
const SHAPE: Record<Variant, string> = {
  primary: 'min-h-16 rounded-2xl',
  secondary: 'min-h-16 rounded-2xl',
  quiet: 'min-h-16 rounded-2xl',
  dark: 'min-h-16 rounded-2xl',
  alert: 'min-h-[68px] rounded-[19px]',
  success: 'min-h-[68px] rounded-[19px]',
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
      className={`flex w-full items-center justify-center gap-3 px-5 ${SHAPE[variant]} text-body font-bold transition-[transform,opacity] duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${STYLE[variant]}`}
    >
      {Icon && <Icon size={variant === 'alert' || variant === 'success' ? 28 : 26} strokeWidth={2.2} aria-hidden />}
      <span>{children}</span>
    </button>
  )
}
