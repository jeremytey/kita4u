import { PhoneOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import BigButton from '../components/BigButton'
import { Avatar } from '../components/CircleStrip'
import { useT } from '../strings'

// Scripted demo call screen. No number, no tel: link, no audio, no microphone. Nothing is stored.
export default function DemoCall({ onEnd }: { onEnd: () => void }) {
  const t = useT()
  const [connected, setConnected] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setConnected(true), 1500)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        <Avatar who="neighbour" size={96} />
        <div className="flex flex-col">
          <h1 className="text-greet font-bold">{t('mei')}</h1>
          <p className="text-body text-ink-soft">{t('roleNeighbour')}</p>
        </div>
        <p role="status" aria-live="polite" className="text-title font-bold">
          {t(connected ? 'callConnected' : 'callCalling')}
        </p>
        <span className="rounded-[18px] bg-quiet-tint px-3 py-1 text-small font-bold text-quiet">{t('callTag')}</span>
      </div>
      <div className="mt-auto w-full">
        <BigButton variant="dark" icon={PhoneOff} onClick={onEnd}>
          {t('endCall')}
        </BigButton>
      </div>
    </div>
  )
}
