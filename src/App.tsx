import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import DemoPanel, { DemoBar } from './components/DemoPanel'
import PhoneFrame from './components/PhoneFrame'
import Ribbon from './components/Ribbon'
import { setCircle, useCircle } from './lib/circle'
import { useNextStep } from './lib/demoNext'
import { useStore, type Preset } from './lib/store'
import ActivitiesPreview from './screens/ActivitiesPreview'
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

// Screens added in phase 12 live here; types.ts is frozen.
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
  const [from, setFrom] = useState<AppScreen>('landing') // where the proposed preview's Back goes
  const [origin, setOrigin] = useState<'chooser' | 'home'>('home') // where Back at the first step of WhatIsThis / NeedHelp goes

  // Home keeps its scroll position. The page scrolls on window (no inner scroll container).
  // Leaving Home saves it; coming back restores it; every other screen starts at the top. Presets, Landing and Reset set it to 0.
  const homeY = useRef(0)
  const go = (next: AppScreen) => {
    if (screen === 'home' && next !== 'home') homeY.current = window.scrollY
    if (next === 'landing' || next === 'setup') homeY.current = 0
    setScreen(next)
  }
  useLayoutEffect(() => {
    const y = screen === 'home' ? homeY.current : 0
    window.scrollTo(0, y)
    const id = requestAnimationFrame(() => window.scrollTo(0, y)) // once more after the screen has laid out
    return () => cancelAnimationFrame(id)
  }, [screen, visit])

  const closePanel = useCallback(() => setPanel(false), [])
  // Next step pill: only while a case is open or being checked, never on Landing or Setup.
  const nextAt = useNextStep()
  const caseRunning = store.chain.status === 'open' || store.chain.status === 'beingChecked'
  const showNext = nextAt !== null && caseRunning && screen !== 'landing' && screen !== 'setup' && !CLEAN
  // Demo mode: a prepared demo state, no setup. The Normal story, setup done and Mei marked as accepted
  // (so Home shows the standard "Demo Circle" caption). Help types stay at their defaults.
  const startDemo = () => {
    store.preset('normal')
    setCircle({ setupDone: true, meiInvite: 'accepted' })
    setRole('resident')
    homeY.current = 0
    setVisit((v) => v + 1)
    setPanel(false)
    setScreen('home')
  }
  const openPreview = () => {
    if (screen !== 'activities') setFrom(screen)
    go('activities')
    setPanel(false)
  }
  const pickRole = (r: Role) => {
    setRole(r)
    go(ROLE_SCREEN[r])
    setPanel(false)
  }
  const pickPreset = (p: Preset) => {
    store.preset(p)
    setRole('resident')
    homeY.current = 0
    setOrigin('home') // a preset opens WhatIsThis / NeedHelp directly: Back goes Home
    setScreen(p === 'sample' ? 'whatIsThis' : p === 'help' ? 'needHelp' : 'home')
    setHelpTask(p === 'help' ? 'groceries' : undefined) // Help request opens on the confirm step
    setVisit((v) => v + 1)
    setPanel(false)
  }

  return (
    <PhoneFrame>
      <Ribbon />
      <div className={screen === 'landing' ? 'flex flex-1 flex-col' : showNext ? 'flex flex-1 flex-col pb-36' : 'flex flex-1 flex-col pb-24'}>
        {/* First visit: Try as Aminah opens the Circle setup. Presets and View as never need it. */}
        {screen === 'landing' && <Landing onStart={() => go(setupDone ? 'home' : 'setup')} onDemo={startDemo} onPreview={openPreview} />}
        {screen === 'setup' && <CircleSetup key={visit} onExit={() => go('landing')} onDone={() => go('home')} onDemo={startDemo} />}
        {screen === 'home' && (
          <Home onAsk={() => go('askChooser')} onHelp={() => go('helpCircle')} onActivities={openPreview} />
        )}
        {screen === 'askChooser' && (
          <AskChooser
            onBack={() => go('home')}
            onMessage={() => {
              setOrigin('chooser')
              go('whatIsThis')
            }}
            onFavour={() => {
              setHelpTask(undefined)
              setOrigin('chooser')
              go('needHelp')
            }}
          />
        )}
        {screen === 'helpCircle' && <HelpYourCircle onBack={() => go('home')} />}
        {screen === 'activities' && <ActivitiesPreview onBack={() => go(from)} />}
        {screen === 'needHelp' && (
          <NeedHelp key={visit} initialTask={helpTask} onExit={() => go('home')} onBack={() => go(origin === 'chooser' ? 'askChooser' : 'home')} />
        )}
        {screen === 'whatIsThis' && (
          <WhatIsThis
            key={visit}
            checkedIn={store.chain.checkedInAt !== undefined}
            onCheckIn={() => store.add('CHECK_IN', 'resident')}
            onExit={() => go('home')}
            onBack={() => go(origin === 'chooser' ? 'askChooser' : 'home')}
            onChecked={(id) => store.add('MESSAGE_CHECKED', 'resident', { sample: id })}
            onAskCircle={(id) => store.add('ASKED_CIRCLE', 'resident', { sample: id, to: 'family' })}
          />
        )}
        {screen === 'contact' && <ContactCard who="neighbour" />}
        {screen === 'family' && <Family />}
        {screen === 'community' && <Community />}
      </div>

      {screen !== 'landing' && (
        <DemoBar
          clean={CLEAN}
          role={role}
          next={showNext ? nextAt : null}
          onNext={() => nextAt !== null && store.advance(nextAt - store.now)}
          onOpen={() => setPanel(true)}
        />
      )}
      <DemoPanel
        open={panel}
        role={role}
        onClose={closePanel}
        onRole={pickRole}
        onPreset={pickPreset}
        onPreview={openPreview}
        onReset={() => {
          homeY.current = 0
          window.scrollTo(0, 0)
        }}
        onSetup={() => {
          setRole('resident')
          go('setup')
          setVisit((v) => v + 1)
          setPanel(false)
        }}
      />
    </PhoneFrame>
  )
}
