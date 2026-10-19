import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleHelp,
  Megaphone,
  MessageCircleQuestion,
  MessageSquareText,
  Receipt,
  ScanSearch,
  Send,
  Square,
  Undo2,
  Volume2,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import BigButton from '../components/BigButton'
import { Eyebrow, IconTile } from '../components/Card'
import TopBar from '../components/TopBar'
import { SAMPLES, type Sample, type SampleId } from '../lib/samples'
import { useSpeech } from '../lib/speech'
import { useLang, useT } from '../strings'

type Step = 'choose' | 'reading' | 'result' | 'sent'
const READING_MS = 1500

// One icon per sample on the picker. The tile tone is the same calm accent for all three: the result gives the verdict.
const SAMPLE_ICON: Record<SampleId, LucideIcon> = { sms: MessageSquareText, bill: Receipt, notice: Megaphone }

interface Props {
  checkedIn: boolean
  onCheckIn: () => void
  onExit: () => void // Done: back to Home
  onBack?: () => void // Back at the first step: one level up (the Ask chooser); Home when opened by a preset
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
      <p className="rounded-2xl rounded-tl-md bg-surface px-3 py-2 text-body text-ink">
        <span className={full ? '' : 'line-clamp-2'}>{sample.message[lang]}</span>
      </p>
    </div>
  )
}

// The message itself, sender first. Behind the Show message toggle on the result.
function Quote({ sample }: { sample: Sample }) {
  const { lang } = useLang()
  return (
    <div className="flex flex-col gap-1 rounded-[18px] bg-quiet-tint p-4">
      <p className="text-small font-bold text-ink-soft">{sample.sender[lang]}</p>
      <p className="text-body text-ink">{sample.message[lang]}</p>
    </div>
  )
}

function CheckInPrompt({ checkedIn, onCheckIn }: { checkedIn: boolean; onCheckIn: () => void }) {
  const t = useT()
  return (
    <div className="flex flex-col gap-3 rounded-[24px] bg-done-tint p-4">
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

export default function WhatIsThis({ checkedIn, onCheckIn, onExit, onBack, onChecked, onAskCircle }: Props) {
  const t = useT()
  const { lang } = useLang()
  const [step, setStep] = useState<Step>('choose')
  const [sample, setSample] = useState<Sample>(SAMPLES[0])
  const [showMsg, setShowMsg] = useState(false)
  const speech = useSpeech(lang)

  // The "reading" pause is only for the demo. Nothing is sent anywhere.
  useEffect(() => {
    if (step !== 'reading') return
    const id = window.setTimeout(() => setStep('result'), READING_MS)
    return () => window.clearTimeout(id)
  }, [step])

  const pick = (s: Sample) => {
    setSample(s)
    setShowMsg(false)
    setStep('reading')
    onChecked(s.id)
  }

  const back = () => {
    speech.stop()
    if (step === 'choose') (onBack ?? onExit)()
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
              <div className="flex items-center gap-4">
                <IconTile icon={MessageCircleQuestion} tone="warn" />
                <Eyebrow>{t('messageHelper')}</Eyebrow>
              </div>
              <h1 className="text-title font-bold">{t('chooseTitle')}</h1>
              <p className="text-body text-ink-soft">{t('samplesLabel')}</p>
              {SAMPLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => pick(s)}
                  className="grid min-h-[124px] w-full grid-cols-[56px_1fr_auto] items-center gap-3.5 rounded-[22px] border-2 border-edge bg-surface p-3.5 text-left shadow-[0_4px_0_rgba(154,133,112,0.14)] transition-transform duration-200 active:scale-[0.98]"
                >
                  <IconTile icon={SAMPLE_ICON[s.id]} tone="accent" />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-title leading-tight font-bold">{s.title[lang]}</span>
                    <span className="text-small text-ink-soft">{s.sender[lang]}</span>
                    <span className="line-clamp-3 text-body">{s.message[lang]}</span>
                  </span>
                  <ChevronRight size={27} strokeWidth={2.4} className="text-ink-soft" aria-hidden />
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
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div key="result" {...fade} className="flex flex-col gap-4">
              <div className="flex flex-col items-center gap-3">
                <IconTile icon={ScanSearch} tone={sample.suspicious ? 'warn' : 'done'} size="xl" className="rotate-[-3deg]" />
                <span className="rounded-full bg-quiet-tint px-3 py-1 text-small font-bold text-quiet">{t('demoTag')}</span>
              </div>

              {/* Orange box = suspicious. The verdict always has an icon and a word. */}
              <section
                aria-live="polite"
                className={`rounded-[24px] p-5 ${sample.suspicious ? 'border-[3px] border-warn-line bg-warn-tint' : 'bg-done-tint'}`}
              >
                <h1 className={`flex items-start gap-3 text-title font-bold ${sample.suspicious ? 'text-warn' : 'text-done'}`}>
                  {sample.suspicious ? (
                    <AlertTriangle size={32} className="mt-0.5 shrink-0" aria-hidden />
                  ) : (
                    <CheckCircle2 size={32} className="mt-0.5 shrink-0" aria-hidden />
                  )}
                  <span>{verdict}</span>
                </h1>
              </section>

              <section aria-labelledby="simple-title" className="flex flex-col gap-3 rounded-[26px] border-2 border-edge bg-surface p-5">
                <h2 id="simple-title" className="flex items-center gap-2 text-body font-bold">
                  <CircleHelp size={26} strokeWidth={2.4} className="shrink-0 text-accent-ink" aria-hidden />
                  {t('inSimpleWords')}
                </h2>
                <p className="text-body text-ink">{sample.explanation[lang]}</p>
              </section>

              <BigButton
                icon={showMsg ? ChevronUp : ChevronDown}
                variant="secondary"
                expanded={showMsg}
                onClick={() => setShowMsg((v) => !v)}
              >
                {showMsg ? t('hideMessage') : t('showMessage')}
              </BigButton>
              {showMsg && <Quote sample={sample} />}

              <div className="flex flex-col gap-3">
                <BigButton
                  icon={Send}
                  onClick={() => {
                    speech.stop()
                    onAskCircle(sample.id)
                    setStep('sent')
                  }}
                >
                  {t('askCircle')}
                </BigButton>
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
                  icon={Undo2}
                  variant="secondary"
                  onClick={() => {
                    speech.stop()
                    setStep('choose')
                  }}
                >
                  {t('chooseAnother')}
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
