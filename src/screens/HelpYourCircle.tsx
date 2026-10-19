import { Check, CheckCircle2, Minus, ShieldCheck, X } from 'lucide-react'
import BigButton from '../components/BigButton'
import { Avatar } from '../components/CircleStrip'
import TopBar from '../components/TopBar'
import { setCircle, useCircle } from '../lib/circle'
import { useT } from '../strings'

// A scripted request from Mei to Aminah. Only circle.parcel changes: no event, no timeline line, nothing the chain reads.
export default function HelpYourCircle({ onBack }: { onBack: () => void }) {
  const t = useT()
  const { parcel } = useCircle()
  return (
    <>
      <TopBar onBack={onBack} />
      <main className="flex flex-1 flex-col gap-6 px-4 pt-6 pb-8">
        <h1 className="text-greet font-bold">{t('helpYourCircle')}</h1>

        <section aria-labelledby="parcel-title" className="flex flex-col gap-4 rounded-[24px] border-2 border-edge bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Avatar who="neighbour" size={60} />
            <span className="rounded-xl bg-quiet-tint px-3 py-1 text-small font-bold tracking-wide text-quiet">{t('parcelTag')}</span>
          </div>
          <h2 id="parcel-title" className="text-title font-bold">
            {t('parcelAsk')}
          </h2>
          <p className="flex items-start gap-3 text-body">
            <ShieldCheck size={26} strokeWidth={2.4} className="mt-0.5 shrink-0 text-done" aria-hidden />
            {t('parcelNote')}
          </p>

          {parcel === 'open' ? (
            <div className="flex flex-col gap-3">
              <BigButton icon={Check} onClick={() => setCircle({ parcel: 'helping' })}>
                {t('iCanHelp')}
              </BigButton>
              <BigButton icon={X} variant="secondary" onClick={() => setCircle({ parcel: 'cantNow' })}>
                {t('cantNow')}
              </BigButton>
            </div>
          ) : (
            <div aria-live="polite" className="flex flex-col gap-1 border-t-2 border-line pt-4">
              <p className={`flex items-center gap-3 text-body font-bold ${parcel === 'helping' ? 'text-done' : 'text-ink'}`}>
                {parcel === 'helping' ? (
                  <CheckCircle2 size={26} strokeWidth={2.4} className="shrink-0" aria-hidden />
                ) : (
                  <Minus size={26} strokeWidth={2.4} className="shrink-0 text-quiet" aria-hidden />
                )}
                {t(parcel === 'helping' ? 'youCanHelp' : 'youDeclined')}
              </p>
              <p className="text-body text-ink-soft">{t('savedDemoOnly')}</p>
            </div>
          )}
        </section>
        {/* Room below the parcel card is kept free. */}
      </main>
    </>
  )
}
