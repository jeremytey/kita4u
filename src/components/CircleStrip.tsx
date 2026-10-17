import { CheckCircle2, Users } from 'lucide-react'
import { Eyebrow } from './Card'
import { useT, type StrKey } from '../strings'
import type { Contact } from '../types'
import { DanielAvatar, MeiAvatar, TownshipAvatar } from './avatars'

export const PEOPLE: Record<Contact, { name: StrKey; role: StrKey }> = {
  neighbour: { name: 'mei', role: 'roleNeighbour' },
  family: { name: 'daniel', role: 'roleSon' },
  community: { name: 'township', role: 'roleCommunity' },
}

const ART = { neighbour: MeiAvatar, family: DanielAvatar, community: TownshipAvatar }

// Illustrated badge with a white border and a soft edge ring. Named "Mei, Neighbour" for screen readers.
// size is the outer size; order (1, 2, 3) adds the small dark badge that shows who is asked first.
export function Avatar({ who, size = 58, order }: { who: Contact; size?: number; order?: number }) {
  const t = useT()
  const Art = ART[who]
  return (
    <span className="relative block shrink-0 rounded-full border-[3px] border-white ring-2 ring-edge/65" style={{ width: size, height: size }}>
      <Art size={size - 6} label={`${t(PEOPLE[who].name)}, ${t(PEOPLE[who].role)}`} />
      {order !== undefined && (
        <span
          aria-hidden
          className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full border-2 border-white bg-ink text-[20px] leading-none font-bold text-white"
        >
          {order}
        </span>
      )}
    </span>
  )
}

// The resident's Circle: three illustrated badges, numbered in the order they are asked. Home only.
export default function CircleStrip() {
  const t = useT()
  const people = Object.keys(PEOPLE) as Contact[]
  return (
    <section aria-labelledby="circle-title" className="flex flex-col gap-4 rounded-[26px] border-2 border-edge bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Eyebrow>{t('yourCircle')}</Eyebrow>
          <h2 id="circle-title" className="text-title font-bold">
            {t('peopleWhoHelp')}
          </h2>
        </div>
        <Users size={26} strokeWidth={2.4} className="mt-1 shrink-0 text-ink-soft" aria-hidden />
      </div>
      <ul className="grid grid-cols-3 gap-2">
        {people.map((c, i) => (
          <li key={c} className="flex flex-col items-center gap-1 text-center">
            <Avatar who={c} order={i + 1} />
            <span className="mt-1 text-small leading-tight font-bold">{t(PEOPLE[c].name)}</span>
            <span className="text-small leading-tight text-ink-soft">{t(PEOPLE[c].role)}</span>
          </li>
        ))}
      </ul>
      <p className="flex items-center justify-center gap-2 border-t-2 border-line pt-4 text-small font-bold text-done">
        <CheckCircle2 size={24} strokeWidth={2.4} aria-hidden />
        {t('allAgreed')}
      </p>
    </section>
  )
}
