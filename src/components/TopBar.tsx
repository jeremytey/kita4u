import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useLang, useT } from '../strings'
import type { Lang } from '../types'

const LANGS: { id: Lang; label: string }[] = [
  { id: 'en', label: 'EN' },
  { id: 'bm', label: 'BM' },
  { id: 'zh', label: '中文' },
]

function LangToggle() {
  const { lang, setLang } = useLang()
  const t = useT()
  return (
    <div role="group" aria-label={t('language')} className="flex gap-1 rounded-2xl bg-surface shadow-card">
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          aria-pressed={lang === l.id}
          onClick={() => setLang(l.id)}
          className={`min-h-16 min-w-14 rounded-2xl px-2 text-small font-bold transition-colors duration-200 ${
            lang === l.id ? 'bg-accent text-ink' : 'text-ink-soft'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}

// Left: a Back button or any content (e.g. greeting). Right: language toggle.
export default function TopBar({ onBack, left }: { onBack?: () => void; left?: ReactNode }) {
  const t = useT()
  return (
    <header className="flex min-h-16 items-center justify-between gap-3 px-4 pt-4">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex min-h-16 items-center gap-2 rounded-2xl bg-surface pr-5 pl-3 text-body font-bold shadow-card"
        >
          <ArrowLeft size={28} strokeWidth={2.4} aria-hidden />
          {t('back')}
        </button>
      ) : (
        <div className="flex min-h-16 items-center">{left}</div>
      )}
      <LangToggle />
    </header>
  )
}
