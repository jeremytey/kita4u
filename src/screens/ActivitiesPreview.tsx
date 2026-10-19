import { Activity, CalendarDays, Coffee, Footprints, Info, Sprout, ThumbsUp, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import BigButton from '../components/BigButton'
import { Eyebrow, IconTile } from '../components/Card'
import { Avatar } from '../components/CircleStrip'
import TopBar from '../components/TopBar'
import { useT, type StrKey } from '../strings'

// Read-only examples of shared interests. A list, not buttons.
const INTERESTS: { icon: LucideIcon; label: StrKey }[] = [
  { icon: Activity, label: 'actBadminton' },
  { icon: Footprints, label: 'actWalks' },
  { icon: Sprout, label: 'actGardening' },
  { icon: Coffee, label: 'actCoffee' },
]

const tag = (bg: string) => `self-start rounded-xl px-3 py-1 text-small font-bold tracking-wide text-quiet ${bg}`

// A labelled product-direction preview, not a feature: grey and dashed on purpose, nothing stored,
// no event log, no engine. The only number of people is the "3 more players" in the sample sentence.
export default function ActivitiesPreview({ onBack }: { onBack: () => void }) {
  const t = useT()
  const [interested, setInterested] = useState(false) // this screen only; gone when it closes
  return (
    <>
      <TopBar onBack={onBack} />
      <main className="flex flex-1 flex-col gap-6 px-4 pt-6 pb-8">
        <span className={tag('bg-quiet-tint')}>{t('previewTag')}</span>
        <div className="flex flex-col gap-2">
          <Eyebrow>{t('proposedNextStep')}</Eyebrow>
          <h1 className="text-greet font-bold">{t('connectTitle')}</h1>
          <p className="text-body text-ink-soft">{t('connectLine')}</p>
        </div>

        <ul className="flex flex-col gap-3 rounded-[24px] border-2 border-dashed border-edge bg-surface p-4">
          {INTERESTS.map(({ icon, label }) => (
            <li key={label} className="flex items-center gap-4">
              <IconTile icon={icon} tone="quiet" />
              <span className="text-body font-bold">{t(label)}</span>
            </li>
          ))}
        </ul>

        <section aria-labelledby="sample-activity" className="flex flex-col gap-4 rounded-[24px] border-2 border-dashed border-edge bg-quiet-tint p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Avatar who="neighbour" size={60} />
            <span className={tag('bg-surface')}>{t('sampleActivityTag')}</span>
          </div>
          <div className="flex flex-col gap-1">
            <h2 id="sample-activity" className="text-title font-bold">
              {t('actBadminton')}
            </h2>
            <p className="text-body font-bold">{t('meiLooking')}</p>
            <p className="flex items-start gap-3 text-body text-ink-soft">
              <CalendarDays size={26} strokeWidth={2.4} className="mt-0.5 shrink-0" aria-hidden />
              {t('activityWhen')}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <BigButton icon={ThumbsUp} variant="secondary" onClick={() => setInterested(true)}>
              {t('imInterested')}
            </BigButton>
            {/* Always in the DOM so the line is announced when it appears; the button keeps focus. */}
            <p aria-live="polite" className="text-body font-bold">
              {interested ? t('savedDemoOnly') : ''}
            </p>
          </div>
        </section>

        <p className="flex items-start gap-3 text-body text-ink-soft">
          <Info size={26} strokeWidth={2.4} className="mt-0.5 shrink-0" aria-hidden />
          {t('connectClosing')}
        </p>
      </main>
    </>
  )
}
