import { useId, type ReactNode } from 'react'

// Three flat-vector badges drawn to one spec so they match: 64x64 viewBox, a circle badge with a 2.5 ink outline,
// flat fills only (no gradients, filters or shadows), everything clipped to the circle. Minimal detail so they read at 44px.
const INK = '#2a211b'
const SKIN = '#e0a577'
const HAIR = '#3a2a25'
const CORAL = '#e8735a'
const SHIRT = 'M8 64 C8 50 18 45 32 45 C46 45 56 50 56 64 Z'
const SMILE = 'M28 36 Q32 39.5 36 36'
const line = { stroke: INK, strokeWidth: 2.5, strokeLinejoin: 'round', strokeLinecap: 'round' } as const

function Badge({ size, label, bg, children }: { size: number; label: string; bg: string; children: ReactNode }) {
  const clip = useId()
  return (
    <svg role="img" aria-label={label} width={size} height={size} viewBox="0 0 64 64" className="block">
      <defs>
        <clipPath id={clip}>
          <circle cx="32" cy="32" r="30" />
        </clipPath>
      </defs>
      <circle cx="32" cy="32" r="30" style={{ fill: bg }} />
      <g clipPath={`url(#${clip})`}>{children}</g>
      <circle cx="32" cy="32" r="30" fill="none" {...line} />
    </svg>
  )
}

export function MeiAvatar({ size, label }: { size: number; label: string }) {
  return (
    <Badge size={size} label={label} bg="var(--color-avatar-peach)">
      <path d={SHIRT} fill={CORAL} {...line} />
      <rect x="28" y="38" width="8" height="9" fill={SKIN} {...line} />
      <path d="M17 30 C17 16 24 11 32 11 C40 11 47 16 47 30 L47 42 C47 44 45 45 43 45 L21 45 C19 45 17 44 17 42 Z" fill={HAIR} {...line} />
      <ellipse cx="32" cy="30" rx="11" ry="12" fill={SKIN} {...line} />
      <path d="M21 28 C22 19 28 17 32 17 C38 17 42 20 43 28 C38 24 30 23 21 28 Z" fill={HAIR} {...line} />
      <circle cx="27.5" cy="31" r="1.6" fill={INK} />
      <circle cx="36.5" cy="31" r="1.6" fill={INK} />
      <path d={SMILE} fill="none" {...line} />
    </Badge>
  )
}

export function DanielAvatar({ size, label }: { size: number; label: string }) {
  return (
    <Badge size={size} label={label} bg="var(--color-avatar-sage)">
      <path d={SHIRT} fill="#5b8fb9" {...line} />
      <rect x="28" y="38" width="8" height="9" fill={SKIN} {...line} />
      <ellipse cx="32" cy="30" rx="11" ry="12" fill={SKIN} {...line} />
      <path d="M20 27 C20 16 26 12 32 12 C38 12 44 16 44 27 C40 22 24 22 20 27 Z" fill={HAIR} {...line} />
      <circle cx="27" cy="31" r="4.5" fill="none" {...line} />
      <circle cx="37" cy="31" r="4.5" fill="none" {...line} />
      <path d="M31.5 31 L32.5 31" fill="none" {...line} />
      <circle cx="27" cy="31" r="1.6" fill={INK} />
      <circle cx="37" cy="31" r="1.6" fill={INK} />
      <path d={SMILE} fill="none" {...line} />
    </Badge>
  )
}

// Not a person: a small home with a heart. No cross, siren, badge or shield.
export function TownshipAvatar({ size, label }: { size: number; label: string }) {
  return (
    <Badge size={size} label={label} bg="var(--color-avatar-blue)">
      <rect x="19" y="28" width="26" height="20" fill="#ffffff" {...line} />
      <path d="M14 29 L32 15 L50 29 Z" fill="#245f75" {...line} />
      <path
        d="M32 44 C26 40 25 36 28 34.5 C30 33.7 31.5 34.8 32 36 C32.5 34.8 34 33.7 36 34.5 C39 36 38 40 32 44 Z"
        fill={CORAL}
        {...line}
      />
    </Badge>
  )
}
