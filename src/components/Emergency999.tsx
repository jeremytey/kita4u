import { useState } from 'react'
import { Phone } from 'lucide-react'
import { useT } from '../strings'

// 999 is outside the chain. Only inside Needs help (every view) and Unresolved (Daniel and Township only).
// The button never dials (presenters record on phones). Tapping it shows a demo note until the screen changes.
export default function Emergency999({ variant }: { variant: 'needsHelp' | 'unresolved' }) {
  const t = useT()
  const [noteShown, setNoteShown] = useState(false)
  return (
    <div className="flex flex-col gap-3">
      <p className="text-body font-bold text-alert">{t(variant === 'needsHelp' ? 'call999Needs' : 'call999Unresolved')}</p>
      <div>
        <button
          type="button"
          onClick={() => setNoteShown(true)}
          aria-label={t('call999Aria')}
          className="flex min-h-[68px] w-full items-center justify-center gap-3 rounded-[19px] bg-alert px-5 text-body font-bold text-white transition-transform duration-200 active:scale-[0.98]"
        >
          <Phone size={28} strokeWidth={2.2} aria-hidden />
          <span>{t('call999Btn')}</span>
        </button>
        <div role="status">{noteShown && <p className="mt-3 text-body font-bold text-ink">{t('call999DemoNote')}</p>}</div>
      </div>
      <p className="text-body text-ink">{t('notEmergencyService')}</p>
    </div>
  )
}
