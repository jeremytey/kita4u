import { Play, User } from 'lucide-react'
import BigButton from '../components/BigButton'
import { Avatar, PEOPLE } from '../components/CircleStrip'
import TopBar from '../components/TopBar'
import { useT } from '../strings'
import type { Contact } from '../types'

// The three Circle faces sit on a ring around Aminah.
const RING: { who: Contact; x: number; y: number }[] = [
  { who: 'neighbour', x: 59, y: 78 },
  { who: 'family', x: 241, y: 78 },
  { who: 'community', x: 150, y: 235 },
]

function CircleRing() {
  const t = useT()
  return (
    <div className="relative mx-auto h-[300px] w-[300px]" aria-hidden>
      <span className="absolute top-[25px] left-[45px] size-[210px] rounded-full border-[3px] border-dashed border-line" />
      <span className="absolute top-[86px] left-[106px] flex size-[88px] items-center justify-center rounded-full bg-accent text-[38px] font-bold text-ink">
        A
      </span>
      {RING.map(({ who, x, y }) => (
        <span key={who} className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: x, top: y + 22 }}>
          <span className="rounded-full ring-[6px] ring-bg">
            <Avatar who={who} size={60} />
          </span>
          <span className="mt-1 rounded-full bg-bg px-2 text-small font-bold whitespace-nowrap">{t(PEOPLE[who].name)}</span>
        </span>
      ))}
    </div>
  )
}

export default function Landing({ onStart, onDemo }: { onStart: () => void; onDemo: () => void }) {
  const t = useT()
  return (
    <>
      <TopBar left={null} />
      <main className="flex flex-1 flex-col px-4 pt-6 pb-8">
        <h1 className="text-[40px] leading-tight font-bold">{t('appName')}</h1>
        <p className="mt-3 text-title font-bold text-ink">{t('tagline')}</p>
        <p className="mt-3 text-body text-ink-soft">{t('landingIntro')}</p>

        <div className="my-6">
          <CircleRing />
          <p className="sr-only">
            {(['neighbour', 'family', 'community'] as Contact[])
              .map((c) => `${t(PEOPLE[c].name)}, ${t(PEOPLE[c].role)}`)
              .join('; ')}
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <BigButton icon={User} onClick={onStart}>
            {t('tryAs')}
          </BigButton>
          <BigButton icon={Play} variant="quiet" onClick={onDemo}>
            {t('demoMode')}
          </BigButton>
        </div>
      </main>
    </>
  )
}
