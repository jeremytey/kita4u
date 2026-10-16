import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'quiet' | 'alert'

const STYLE: Record<Variant, string> = {
  primary: 'bg-accent text-ink',
  secondary: 'bg-surface text-ink ring-2 ring-line ring-inset',
  quiet: 'bg-quiet-tint text-ink',
  alert: 'bg-alert text-white',
}

// Full width, at least 64px tall.
export default function BigButton({
  children,
  icon: Icon,
  variant = 'primary',
  onClick,
  disabled,
}: {
  children: ReactNode
  icon?: LucideIcon
  variant?: Variant
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl px-5 text-body font-bold transition-[transform,opacity] duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${STYLE[variant]}`}
    >
      {Icon && <Icon size={26} strokeWidth={2.2} aria-hidden />}
      <span>{children}</span>
    </button>
  )
}
