import { useState } from 'react'
import ChainBar from './components/ChainBar'
import DemoPanel, { DemoChip } from './components/DemoPanel'
import PhoneFrame from './components/PhoneFrame'
import TopBar from './components/TopBar'
import { useStore, type Preset } from './lib/store'
import Home, { type AwayChoice } from './screens/Home'
import Landing from './screens/Landing'
import WhatIsThis from './screens/WhatIsThis'
import { useT } from './strings'
import type { HomeStatus, Role, Screen } from './types'

// Until phase 5 wires real data, Home status is local. Preview any state with ?status=reminder etc.
const STATUSES: HomeStatus[] = ['normal', 'checkedIn', 'reminder', 'chainRunning', 'away', 'contactChecked']
function initialStatus(): HomeStatus {
  const s = new URLSearchParams(location.search).get('status') as HomeStatus | null
  return s && STATUSES.includes(s) ? s : 'normal'
}

const ROLE_SCREEN: Record<Role, Screen> = { resident: 'home', neighbour: 'contact', family: 'family', community: 'community' }
const ROLE_NAME = { neighbour: 'mei', family: 'daniel', community: 'township' } as const

// Temporary view for Neighbour, Family and Community until phases 5 to 7 build their screens.
function RolePreview({ role }: { role: Exclude<Role, 'resident'> }) {
  const t = useT()
  const { chain } = useStore()
  return (
    <>
      <TopBar left={<span className="text-body font-bold">{t(ROLE_NAME[role])}</span>} />
      <main className="flex flex-col gap-6 px-4 pt-4 pb-8">
        <h1 className="text-greet font-bold">{t('residentName')}</h1>
        <ChainBar chain={chain} />
      </main>
    </>
  )
}

export default function App() {
  const store = useStore()
  const [screen, setScreen] = useState<Screen>(() => {
    const q = new URLSearchParams(location.search)
    if (q.get('screen') === 'whatIsThis') return 'whatIsThis'
    return q.has('status') ? 'home' : 'landing'
  })
  const [role, setRole] = useState<Role>('resident')
  const [panel, setPanel] = useState(false)
  const [status, setStatus] = useState<HomeStatus>(initialStatus)
  const [awayUntil, setAwayUntil] = useState<AwayChoice>('tomorrow')

  const away = (u: AwayChoice) => {
    setAwayUntil(u)
    setStatus('away')
  }
  const pickRole = (r: Role) => {
    setRole(r)
    setScreen(ROLE_SCREEN[r])
    setPanel(false)
  }
  const pickPreset = (p: Preset) => {
    store.preset(p)
    setRole('resident')
    setScreen(p === 'sample' ? 'whatIsThis' : 'home') // help: NeedHelp screen arrives in phase 6
    setPanel(false)
  }

  return (
    <PhoneFrame>
      <div className={screen === 'landing' ? 'flex flex-1 flex-col' : 'flex flex-1 flex-col pb-20'}>
        {screen === 'landing' && <Landing onStart={() => setScreen('home')} onDemo={() => setPanel(true)} />}
        {screen === 'home' && (
          <Home
            status={status}
            checkedInTime="08:05"
            awayUntil={awayUntil}
            checkerName="Mei"
            checkerTime="11:40"
            chain={<ChainBar chain={store.chain} />}
            onCheckIn={() => setStatus('checkedIn')}
            onAway={away}
            onBack={() => setStatus('normal')}
            onWhatIsThis={() => setScreen('whatIsThis')}
            onNeedHelp={() => {}}
          />
        )}
        {screen === 'whatIsThis' && (
          <WhatIsThis
            checkedIn={status === 'checkedIn'}
            onCheckIn={() => setStatus('checkedIn')}
            onExit={() => setScreen('home')}
            onChecked={(id) => store.add('MESSAGE_CHECKED', 'resident', { sample: id })}
            onAskCircle={(id) => store.add('ASKED_CIRCLE', 'resident', { sample: id, to: 'family' })}
          />
        )}
        {role !== 'resident' && screen === ROLE_SCREEN[role] && <RolePreview role={role} />}
      </div>

      {screen !== 'landing' && !panel && <DemoChip onOpen={() => setPanel(true)} />}
      <DemoPanel open={panel} role={role} onClose={() => setPanel(false)} onRole={pickRole} onPreset={pickPreset} />
    </PhoneFrame>
  )
}
