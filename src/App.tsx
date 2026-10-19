import { useCallback, useState } from 'react'
import DemoPanel, { DemoBar } from './components/DemoPanel'
import PhoneFrame from './components/PhoneFrame'
import Ribbon from './components/Ribbon'
import { useCircle } from './lib/circle'
import { useStore, type Preset } from './lib/store'
import AskChooser from './screens/AskChooser'
import CircleSetup from './screens/CircleSetup'
import Community from './screens/Community'
import ContactCard from './screens/ContactCard'
import Family from './screens/Family'
import HelpYourCircle from './screens/HelpYourCircle'
import Home from './screens/Home'
import Landing from './screens/Landing'
import NeedHelp, { type Task } from './screens/NeedHelp'
import WhatIsThis from './screens/WhatIsThis'
import type { Role, Screen } from './types'

// Screens added in phase 12 live here; types.ts is frozen. activities arrives in 12D.
type AppScreen = Screen | 'setup' | 'askChooser' | 'helpCircle' | 'activities'

const ROLE_SCREEN: Record<Role, Screen> = { resident: 'home', neighbour: 'contact', family: 'family', community: 'community' }

// ?clean=1: recording mode. Hides the presenter bar; a faint corner button still opens the Demo panel.
const CLEAN = new URLSearchParams(location.search).get('clean') === '1'

export default function App() {
  const store = useStore()
  const { setupDone } = useCircle()
  const [screen, setScreen] = useState<AppScreen>('landing')
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
      <div className={screen === 'landing' ? 'flex flex-1 flex-col' : 'flex flex-1 flex-col pb-24'}>
        {/* First visit: Try as Aminah opens the Circle setup. Presets and View as never need it. */}
        {screen === 'landing' && <Landing onStart={() => setScreen(setupDone ? 'home' : 'setup')} onDemo={() => setPanel(true)} />}
        {screen === 'setup' && <CircleSetup key={visit} onExit={() => setScreen('landing')} onDone={() => setScreen('home')} />}
        {screen === 'home' && (
          <Home onAsk={() => setScreen('askChooser')} onHelp={() => setScreen('helpCircle')} />
        )}
        {screen === 'askChooser' && (
          <AskChooser
            onBack={() => setScreen('home')}
            onMessage={() => setScreen('whatIsThis')}
            onFavour={() => {
              setHelpTask(undefined)
              setScreen('needHelp')
            }}
          />
        )}
        {screen === 'helpCircle' && <HelpYourCircle onBack={() => setScreen('home')} />}
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

      {screen !== 'landing' && <DemoBar clean={CLEAN} onOpen={() => setPanel(true)} />}
      <DemoPanel
        open={panel}
        role={role}
        onClose={closePanel}
        onRole={pickRole}
        onPreset={pickPreset}
        onSetup={() => {
          setRole('resident')
          setScreen('setup')
          setVisit((v) => v + 1)
          setPanel(false)
        }}
      />
    </PhoneFrame>
  )
}
