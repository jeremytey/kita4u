import { Check, Sun } from 'lucide-react'
import { useState } from 'react'
import BigButton from './components/BigButton'
import { ActionCard } from './components/Card'
import CircleStrip from './components/CircleStrip'
import PhoneFrame from './components/PhoneFrame'
import TopBar from './components/TopBar'
import { useT } from './strings'
import type { Role, Screen } from './types'

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [role, setRole] = useState<Role>('resident')
  const t = useT()

  // Phase 1: a foundation preview. Real screens arrive in phase 2.
  return (
    <PhoneFrame>
      <TopBar
        left={
          <span className="flex items-center gap-2 text-body font-bold">
            <Sun size={26} aria-hidden /> {t('appName')}
          </span>
        }
      />
      <main className="flex flex-col gap-6 px-4 py-6">
        <h1 className="text-greet font-bold">{t('residentName')}</h1>
        <CircleStrip />
        <div className="flex flex-col gap-4">
          <ActionCard icon={Check} title={t('roleResident')} sub={`${screen} / ${role}`} tone="done" onClick={() => setScreen('home')} />
        </div>
        <div className="flex flex-col gap-3">
          <BigButton icon={Check} onClick={() => setRole('neighbour')}>{t('roleNeighbour')}</BigButton>
          <BigButton variant="secondary" onClick={() => setRole('resident')}>{t('back')}</BigButton>
        </div>
      </main>
    </PhoneFrame>
  )
}
