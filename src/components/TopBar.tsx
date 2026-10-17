import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useLang, useT } from '../strings'
import type { Lang } from '../types'

const LANGS: { id: Lang; label: string }[] = [
  { id: 'en', label: 'EN' },
  { id: 'bm', label: 'BM' },
  { id: 'zh', label: '中文' },
]

// One even pill: three equal buttons, 56px wide and 64px tall. The selected one gets an inset fill of the same size.
function LangToggle() {
  const { lang, setLang } = useLang()
  const t = useT()
  return (
    <div role="group" aria-label={t('language')} className="grid h-16 shrink-0 grid-cols-3 rounded-full bg-surface shadow-card">
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          aria-pressed={lang === l.id}
          onClick={() => setLang(l.id)}
          className="flex h-16 w-14 items-center justify-center rounded-full"
        >
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-full text-small font-bold transition-colors duration-200 ${
              lang === l.id ? 'bg-accent text-ink' : 'text-ink-soft'
            }`}
          >
            {l.label}
          </span>
        </button>
      ))}
    </div>
  )
}

// Left: a Back button or any content (e.g. greeting). Right: language toggle.
export default function TopBar({ onBack, left }: { onBack?: () => void; left?: ReactNode }) {
  const t = useT()
  return (
    // Tight gaps on narrow phones first. If the Back pill and the toggle still cannot share one row (BM at 320px),
    // the toggle wraps to its own row on the right. Tap targets never shrink.
    <header className="flex min-h-16 flex-wrap items-center justify-between gap-2 px-4 pt-4 min-[360px]:gap-3">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex min-h-16 shrink-0 items-center gap-2 rounded-full bg-surface pr-4 pl-3 text-body font-bold whitespace-nowrap shadow-card min-[360px]:pr-5 min-[360px]:pl-4"
        >
          <ArrowLeft size={28} strokeWidth={2.4} aria-hidden />
          {t('back')}
        </button>
      ) : (
        // basis-0 + min-w-min: long text wraps onto two lines; only a word wider than the space moves the toggle down.
        <div className="flex min-h-16 min-w-min flex-1 basis-0 items-center">{left}</div>
      )}
      <div className="ml-auto">
        <LangToggle />
      </div>
    </header>
  )
}
