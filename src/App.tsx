import { useCallback, useState } from 'react'
import DemoPanel, { DemoBar } from './components/DemoPanel'
import PhoneFrame from './components/PhoneFrame'
import Ribbon from './components/Ribbon'
import { useStore, type Preset } from './lib/store'
import Community from './screens/Community'
import ContactCard from './screens/ContactCard'
import Family from './screens/Family'
import Home from './screens/Home'
import Landing from './screens/Landing'
import NeedHelp, { type Task } from './screens/NeedHelp'
import WhatIsThis from './screens/WhatIsThis'
import type { Role, Screen } from './types'

const ROLE_SCREEN: Record<Role, Screen> = { resident: 'home', neighbour: 'contact', family: 'family', community: 'community' }

// ?clean=1: recording mode. Hides the presenter bar; a faint corner button still opens the Demo panel.
const CLEAN = new URLSearchParams(location.search).get('clean') === '1'

export default function App() {
  const store = useStore()
  const [screen, setScreen] = useState<Screen>('landing')
  const [role, setRole] = useState<Role>('resident')
  const [panel, setPanel] = useState(false)
  const [helpTask, setHelpTask] = useState<Task | undefined>()
  const [visit, setVisit] = useState(0) // remounts a screen when a preset re-opens it

  const closePanel = useCallback(() => setPanel(false), [])
  const pickRole = (r: Role) => {
    setRole(r)
    setScreen(ROLE_SCREEN[r])
    setPanel(false)
  }
  const pickPreset = (p: Preset) => {
    store.preset(p)
    setRole('resident')
    setScreen(p === 'sample' ? 'whatIsThis' : p === 'help' ? 'needHelp' : 'home')
    setHelpTask(p === 'help' ? 'groceries' : undefined) // Help request opens on the confirm step
    setVisit((v) => v + 1)
    setPanel(false)
  }

  return (
    <PhoneFrame>
      <Ribbon />
      <div className={screen === 'landing' || CLEAN ? 'flex flex-1 flex-col' : 'flex flex-1 flex-col pb-16'}>
        {screen === 'landing' && <Landing onStart={() => setScreen('home')} onDemo={() => setPanel(true)} />}
        {screen === 'home' && (
          <Home
            onWhatIsThis={() => setScreen('whatIsThis')}
            onNeedHelp={() => {
              setHelpTask(undefined)
              setScreen('needHelp')
            }}
          />
        )}
        {screen === 'needHelp' && <NeedHelp key={visit} initialTask={helpTask} onExit={() => setScreen('home')} />}
        {screen === 'whatIsThis' && (
          <WhatIsThis
            key={visit}
            checkedIn={store.chain.checkedInAt !== undefined}
            onCheckIn={() => store.add('CHECK_IN', 'resident')}
            onExit={() => setScreen('home')}
            onChecked={(id) => store.add('MESSAGE_CHECKED', 'resident', { sample: id })}
            onAskCircle={(id) => store.add('ASKED_CIRCLE', 'resident', { sample: id, to: 'family' })}
          />
        )}
        {screen === 'contact' && <ContactCard who="neighbour" />}
        {screen === 'family' && <Family />}
        {screen === 'community' && <Community />}
      </div>

      {screen !== 'landing' && !panel && <DemoBar clean={CLEAN} onOpen={() => setPanel(true)} />}
      <DemoPanel open={panel} role={role} onClose={closePanel} onRole={pickRole} onPreset={pickPreset} />
    </PhoneFrame>
  )
}
