import { Compass, Play, User } from 'lucide-react'
import BigButton from '../components/BigButton'
import CircleRing from '../components/CircleRing'
import TopBar from '../components/TopBar'
import { useT } from '../strings'

export default function Landing({ onStart, onDemo, onPreview }: { onStart: () => void; onDemo: () => void; onPreview: () => void }) {
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
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <BigButton icon={User} onClick={onStart}>
            {t('tryAs')}
          </BigButton>
          <BigButton icon={Play} variant="quiet" onClick={onDemo}>
            {t('demoMode')}
          </BigButton>
          <BigButton icon={Compass} variant="quiet" onClick={onPreview}>
            {t('whatsNext')}
          </BigButton>
        </div>
      </main>
    </>
  )
}
