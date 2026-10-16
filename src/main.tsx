import { MotionConfig } from 'framer-motion'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StoreProvider } from './lib/store'
import { LangProvider } from './strings'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <StoreProvider>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </StoreProvider>
    </LangProvider>
  </StrictMode>,
)
