import { MotionConfig } from 'framer-motion'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LangProvider } from './strings'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </LangProvider>
  </StrictMode>,
)
