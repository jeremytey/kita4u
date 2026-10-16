import { Check } from 'lucide-react'
import { useT, type StrKey } from '../strings'
import type { Contact } from '../types'

export const PEOPLE: Record<Contact, { name: StrKey; role: StrKey; initial: string; colour: string }> = {
  neighbour: { name: 'mei', role: 'roleNeighbour', initial: 'M', colour: 'bg-quiet-tint text-ink' },
  family: { name: 'daniel', role: 'roleSon', initial: 'D', colour: 'bg-quiet-tint text-ink' },
  community: { name: 'township', role: 'roleCommunity', initial: 'T', colour: 'bg-quiet-tint text-ink' },
}

export function Avatar({ who, size = 56 }: { who: Contact; size?: number }) {
  const p = PEOPLE[who]
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      className={`flex shrink-0 items-center justify-center rounded-full font-bold ${p.colour}`}
    >
      {p.initial}
    </span>
  )
}

// The resident's Circle: three initial circles with role labels. Home only, no card.
export default function CircleStrip() {
  const t = useT()
  return (
    <section aria-labelledby="circle-title" className="flex flex-col gap-3">
      <h2 id="circle-title" className="text-body font-bold">
        {t('yourCircle')}
      </h2>
      <ul className="grid grid-cols-3 gap-2">
        {(Object.keys(PEOPLE) as Contact[]).map((c) => (
          <li key={c} className="flex flex-col items-center gap-1 text-center">
            <Avatar who={c} />
            <span className="text-small leading-tight font-bold">{t(PEOPLE[c].name)}</span>
            <span className="text-small leading-tight text-ink-soft">{t(PEOPLE[c].role)}</span>
          </li>
        ))}
      </ul>
      <p className="flex items-center justify-center gap-2 text-small font-bold text-done">
        <Check size={20} strokeWidth={3} aria-hidden />
        {t('allAgreed')}
      </p>
    </section>
  )
}
