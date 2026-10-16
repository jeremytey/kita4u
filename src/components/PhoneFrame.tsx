import type { ReactNode } from 'react'

// Full screen on a phone. Centred 430px column on desktop.
export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-surround sm:py-6">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-bg sm:min-h-[calc(100dvh-3rem)] sm:overflow-hidden sm:rounded-[32px] sm:shadow-card">
        {children}
      </div>
    </div>
  )
}
