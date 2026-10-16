import { useState } from 'react'
import PhoneFrame from './components/PhoneFrame'
import Home, { type AwayChoice } from './screens/Home'
import Landing from './screens/Landing'
import type { HomeStatus, Role, Screen } from './types'

// Until phase 5 wires real data, Home status is local. Preview any state with ?status=reminder etc.
const STATUSES: HomeStatus[] = ['normal', 'checkedIn', 'reminder', 'chainRunning', 'away', 'contactChecked']
function initialStatus(): HomeStatus {
  const s = new URLSearchParams(location.search).get('status') as HomeStatus | null
  return s && STATUSES.includes(s) ? s : 'normal'
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(location.search.includes('status=') ? 'home' : 'landing')
  const [role] = useState<Role>('resident')
  const [status, setStatus] = useState<HomeStatus>(initialStatus)
  const [awayUntil, setAwayUntil] = useState<AwayChoice>('tomorrow')

  const away = (u: AwayChoice) => {
    setAwayUntil(u)
    setStatus('away')
  }

  return (
    <PhoneFrame>
      {screen === 'landing' && <Landing onStart={() => setScreen('home')} onDemo={() => setScreen('home')} />}
      {screen === 'home' && role === 'resident' && (
        <Home
          status={status}
          checkedInTime="08:05"
          awayUntil={awayUntil}
          checkerName="Mei"
          checkerTime="11:40"
          onCheckIn={() => setStatus('checkedIn')}
          onAway={away}
          onBack={() => setStatus('normal')}
          onWhatIsThis={() => {}}
          onNeedHelp={() => {}}
        />
      )}
    </PhoneFrame>
  )
}
