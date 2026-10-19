import { Phone } from 'lucide-react'
import { useT } from '../strings'

// 999 is outside the chain. Only inside Needs help (every view) and Unresolved (Daniel and Township only).
// The one tel: link in the app.
export default function Emergency999({ variant }: { variant: 'needsHelp' | 'unresolved' }) {
  const t = useT()
  return (
    <div className="flex flex-col gap-3">
      <p className="text-body font-bold text-alert">{t(variant === 'needsHelp' ? 'call999Needs' : 'call999Unresolved')}</p>
      <a
        href="tel:999"
        aria-label={t('call999Aria')}
        className="flex min-h-[68px] w-full items-center justify-center gap-3 rounded-[19px] bg-alert px-5 text-body font-bold text-white transition-transform duration-200 active:scale-[0.98]"
      >
        <Phone size={28} strokeWidth={2.2} aria-hidden />
        <span>{t('call999Btn')}</span>
      </a>
      <p className="text-body text-ink">{t('notEmergencyService')}</p>
    </div>
  )
}
