import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, MessageSquareText, Square, Users, Volume2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import BigButton from '../components/BigButton'
import { SimTag } from '../components/Card'
import CircleStrip from '../components/CircleStrip'
import TopBar from '../components/TopBar'
import { SAMPLES, type Sample, type SampleId } from '../lib/samples'
import { useSpeech } from '../lib/speech'
import { useLang, useT } from '../strings'

type Step = 'choose' | 'reading' | 'result' | 'sent'
const READING_MS = 1500

interface Props {
  checkedIn: boolean
  onCheckIn: () => void
  onExit: () => void
  onChecked: (id: SampleId) => void
  onAskCircle: (id: SampleId) => void
}

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}

// A message drawn in HTML/CSS, like a phone notification. Not an image.
function MessageThumb({ sample, full = false }: { sample: Sample; full?: boolean }) {
  const { lang } = useLang()
  return (
    <div className="rounded-2xl bg-quiet-tint p-3">
      <div className="mb-2 flex items-center gap-2 text-small font-bold text-ink-soft">
        <MessageSquareText size={20} aria-hidden />
        <span className="truncate">{sample.sender[lang]}</span>
      </div>
      <p className={`rounded-2xl rounded-tl-md bg-surface px-3 py-2 text-ink ${full ? 'text-body' : 'text-[16px] leading-snug'}`}>
        <span className={full ? '' : 'line-clamp-2'}>{sample.message[lang]}</span>
      </p>
    </div>
  )
}

function CheckInPrompt({ checkedIn, onCheckIn }: { checkedIn: boolean; onCheckIn: () => void }) {
  const t = useT()
  return (
    <div className="flex flex-col gap-3 rounded-[24px] bg-accent-tint p-4">
      <p className="text-body font-bold">{t('whileHere')}</p>
      <BigButton
        icon={CheckCircle2}
        variant={checkedIn ? 'quiet' : 'primary'}
        disabled={checkedIn}
        onClick={onCheckIn}
      >
        {checkedIn ? t('checkedInCard') : t('imOkay')}
      </BigButton>
    </div>
  )
}

export default function WhatIsThis({ checkedIn, onCheckIn, onExit, onChecked, onAskCircle }: Props) {
  const t = useT()
  const { lang } = useLang()
  const [step, setStep] = useState<Step>('choose')
  const [sample, setSample] = useState<Sample>(SAMPLES[0])
  const speech = useSpeech(lang)

  // The "reading" pause is only for the demo. Nothing is sent anywhere.
  useEffect(() => {
    if (step !== 'reading') return
    const id = window.setTimeout(() => setStep('result'), READING_MS)
    return () => window.clearTimeout(id)
  }, [step])

  const pick = (s: Sample) => {
    setSample(s)
    setStep('reading')
    onChecked(s.id)
  }

  const back = () => {
    speech.stop()
    if (step === 'choose') onExit()
    else if (step === 'sent') setStep('result')
    else setStep('choose')
  }

  const verdict = sample.suspicious ? t('suspiciousBox') : t('normalBox')

  return (
    <>
      <TopBar onBack={back} />
      <main className="flex flex-1 flex-col px-4 pt-6 pb-8">
        <AnimatePresence mode="wait">
          {step === 'choose' && (
            <motion.div key="choose" {...fade} className="flex flex-col gap-4">
              <h1 className="text-title font-bold">{t('chooseTitle')}</h1>
              <p className="flex flex-wrap items-center gap-2 text-body text-ink-soft">
                {t('samplesLabel')} <SimTag />
              </p>
              {SAMPLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => pick(s)}
                  className="flex w-full flex-col gap-3 rounded-[24px] bg-surface p-4 text-left shadow-card transition-transform duration-200 active:scale-[0.98]"
                >
                  <span className="text-title font-bold">{s.title[lang]}</span>
                  <MessageThumb sample={s} />
                </button>
              ))}
            </motion.div>
          )}

          {step === 'reading' && (
            <motion.div key="reading" {...fade} className="flex flex-col gap-5" aria-live="polite">
              <div className="relative overflow-hidden rounded-[24px] bg-surface p-4 shadow-card">
                <MessageThumb sample={sample} full />
                <span
                  aria-hidden
                  className="absolute inset-x-0 h-1 bg-accent shadow-[0_0_16px_4px_var(--color-accent)]"
                  style={{ animation: `scan ${READING_MS}ms ease-in-out infinite alternate` }}
                />
              </div>
              <p className="text-center text-title font-bold">{t('reading')}</p>
              <p className="flex justify-center">
                <SimTag />
              </p>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div key="result" {...fade} className="flex flex-col gap-4">
              <MessageThumb sample={sample} full />

              <p className="ml-10 rounded-[24px] rounded-br-md bg-accent-tint px-4 py-3 text-body font-bold">
                {t('askQuestion')}
              </p>

              <section
                aria-live="polite"
                className={`rounded-[24px] p-5 ${
                  sample.suspicious ? 'border-[3px] border-warn-line bg-warn-tint' : 'bg-done-tint'
                }`}
              >
                <p className={`flex items-start gap-3 text-title font-bold ${sample.suspicious ? 'text-warn' : 'text-done'}`}>
                  {sample.suspicious ? (
                    <AlertTriangle size={32} className="mt-0.5 shrink-0" aria-hidden />
                  ) : (
                    <CheckCircle2 size={32} className="mt-0.5 shrink-0" aria-hidden />
                  )}
                  <span>{verdict}</span>
                </p>
                <p className="mt-3 text-body text-ink">{sample.explanation[lang]}</p>
              </section>

              <p className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-quiet-tint px-3 py-1 text-small font-bold text-quiet">{t('demoTag')}</span>
                <SimTag />
              </p>

              <CircleStrip />

              <div className="flex flex-col gap-3">
                <BigButton
                  icon={speech.speaking ? Square : Volume2}
                  variant="secondary"
                  disabled={speech.state !== 'ready'}
                  onClick={() => (speech.speaking ? speech.stop() : speech.speak(`${verdict} ${sample.explanation[lang]}`))}
                >
                  {speech.speaking ? t('stopReading') : t('readAloud')}
                </BigButton>
                {speech.state === 'none' && <p className="text-center text-small text-ink-soft">{t('voiceUnavailable')}</p>}
                {speech.state === 'loading' && <p className="text-center text-small text-ink-soft">{t('voiceLoading')}</p>}
                <BigButton
                  icon={Users}
                  onClick={() => {
                    speech.stop()
                    onAskCircle(sample.id)
                    setStep('sent')
                  }}
                >
                  {t('askCircle')}
                </BigButton>
                <BigButton variant="quiet" onClick={() => { speech.stop(); onExit() }}>
                  {t('done')}
                </BigButton>
              </div>

              <CheckInPrompt checkedIn={checkedIn} onCheckIn={onCheckIn} />
            </motion.div>
          )}

          {step === 'sent' && (
            <motion.div key="sent" {...fade} className="flex flex-col items-center gap-5 text-center">
              <motion.span
                className="mt-6 flex size-28 items-center justify-center rounded-full bg-done-tint text-done"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <CheckCircle2 size={64} strokeWidth={2.2} aria-hidden />
              </motion.span>
              <h1 className="text-greet font-bold" aria-live="polite">
                {t('sentTo')}
              </h1>
              <p className="text-body text-ink-soft">{t('sentSub')}</p>
              <div className="flex w-full flex-col gap-4 text-left">
                <CheckInPrompt checkedIn={checkedIn} onCheckIn={onCheckIn} />
                <BigButton variant="quiet" onClick={onExit}>
                  {t('done')}
                </BigButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  )
}
