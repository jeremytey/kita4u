import type { CSSProperties } from 'react'
import { Avatar, PEOPLE } from './CircleStrip'
import { useT } from '../strings'
import type { Contact } from '../types'

type Tone = 'page' | 'accent' | 'done' | 'surface'

// Halo around each avatar, the name label and the dashed ring match the surface behind, so the names cut the ring cleanly.
const TONE: Record<Tone, { halo: string; label: string; ring: string; centre: string }> = {
  page: { halo: 'ring-bg', label: 'bg-bg', ring: 'border-line', centre: 'bg-accent' },
  accent: { halo: 'ring-accent', label: 'bg-accent', ring: 'border-accent-edge', centre: 'bg-surface border-2 border-accent-edge' },
  done: { halo: 'ring-done-tint', label: 'bg-done-tint', ring: 'border-done/40', centre: 'bg-surface border-2 border-done/40' },
  surface: { halo: 'ring-surface', label: 'bg-surface', ring: 'border-line', centre: 'bg-accent' },
}

// Avatar centres in % of the square box (a 300px design). Township hangs from the bottom so its label never overflows.
const SIDES: { who: Contact; x: string }[] = [
  { who: 'neighbour', x: '19.67%' },
  { who: 'family', x: '80.33%' },
]

const AVATAR = 60
// The centre circle is 29.33% of the box, but shrinks on narrow boxes so it always clears Daniel's 20px label
// (75px wide, centred at 80.33%) by 6px: diameter <= 2 * (80.33% - 50% - 37.65px - 6px).
const CENTRE = 'min(29.33cqw, calc(60.66cqw - 87.3px))'

export default function CircleRing({
  order = false,
  tone = 'page',
  className = 'max-w-[300px]',
}: {
  order?: boolean
  tone?: Tone
  className?: string
}) {
  const t = useT()
  const c = TONE[tone]
  const label = `${order ? 'mt-2' : 'mt-1'} rounded-full px-2 text-small font-bold whitespace-nowrap ${c.label}`
  const stack = (who: Contact, i: number) => (
    <>
      <span className={`rounded-full ring-[6px] ${c.halo}`}>
        <Avatar who={who} size={AVATAR} order={order ? i + 1 : undefined} />
      </span>
      {/* The avatar carries "Name, Role" for screen readers, so the visible name is hidden from them. */}
      <span aria-hidden className={label}>
        {t(PEOPLE[who].name)}
      </span>
    </>
  )
  return (
    <div role="group" aria-label={t('yourCircle')} className={`@container relative mx-auto aspect-square w-full ${className}`}>
      <span aria-hidden className={`absolute top-[8.33%] left-[15%] size-[70%] rounded-full border-[3px] border-dashed ${c.ring}`} />
      <span
        aria-hidden
        className={`absolute flex items-center justify-center rounded-full font-bold text-ink ${c.centre}`}
        style={
          {
            width: CENTRE,
            height: CENTRE,
            left: `calc(50% - ${CENTRE} / 2)`,
            top: `calc(43.33% - ${CENTRE} / 2)`,
            fontSize: `calc(${CENTRE} * 0.43)`,
          } as CSSProperties
        }
      >
        A
      </span>
      {SIDES.map(({ who, x }, i) => (
        <span
          key={who}
          className="absolute flex -translate-x-1/2 flex-col items-center"
          style={{ left: x, top: `calc(28% - ${AVATAR / 2}px)` }}
        >
          {stack(who, i)}
        </span>
      ))}
      <span className="absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center">{stack('community', 2)}</span>
    </div>
  )
}
