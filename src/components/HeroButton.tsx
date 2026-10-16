import { motion, useReducedMotion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

type Variant = 'primary' | 'done' | 'quiet'

const STYLE: Record<Variant, string> = {
  primary: 'bg-accent text-ink active:scale-[0.98]',
  done: 'cursor-default bg-done text-white', // no opacity fade, so contrast stays
  quiet: 'bg-surface text-ink ring-2 ring-edge ring-inset active:scale-[0.98]',
}

// The one main button on Home. Always the same <button>, so focus stays on it when the state changes.
// "done" uses aria-disabled (not disabled) so it stays focusable and is read out.
export default function HeroButton({
  icon: Icon,
  label,
  sub,
  variant = 'primary',
  onClick,
}: {
  icon: LucideIcon
  label: string
  sub?: string
  variant?: Variant
  onClick?: () => void
}) {
  const done = variant === 'done'
  const still = useReducedMotion() // no tick pop when the OS asks for reduced motion
  return (
    <button
      type="button"
      onClick={done ? undefined : onClick}
      aria-disabled={done || undefined}
      className={`flex min-h-[120px] w-full items-center justify-center gap-4 rounded-[24px] px-6 py-4 text-left transition-transform duration-200 ${STYLE[variant]}`}
    >
      {/* Keyed by variant: the tick pops in when the button turns to done. */}
      <motion.span
        key={variant}
        className="shrink-0"
        initial={done && !still ? { scale: 0.6, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <Icon size={40} strokeWidth={2.2} aria-hidden />
      </motion.span>
      <span className="flex flex-col">
        <span className="text-hero font-bold">{label}</span>
        {sub && <span className="text-body">{sub}</span>}
      </span>
    </button>
  )
}
