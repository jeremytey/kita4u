import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import BigButton from '../components/BigButton'
import { Avatar } from '../components/CircleStrip'
import { formatTime } from '../lib/engine'
import { useStore } from '../lib/store'
import { useT, type StrKey } from '../strings'

// Scripted demo chat with Mei. Local state only: nothing goes to the store or the event log. No text input.
interface Msg {
  from: 'mei' | 'aminah'
  text: StrKey
  time: number
}

const REPLIES: { ask: StrKey; answer: StrKey }[] = [
  { ask: 'replyThanks', answer: 'meiRThanks' },
  { ask: 'replyWhen', answer: 'meiRWhen' },
  { ask: 'replyDoor', answer: 'meiRDoor' },
]

export default function DemoChat() {
  const t = useT()
  const { now } = useStore()
  const reduce = useReducedMotion()
  const [messages, setMessages] = useState<Msg[]>(() => [{ from: 'mei', text: 'meiHello', time: now }])
  const [pending, setPending] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const send = (ask: StrKey, answer: StrKey) => {
    setMessages((m) => [...m, { from: 'aminah', text: ask, time: now }])
    setPending(true)
    timer.current = window.setTimeout(() => {
      setMessages((m) => [...m, { from: 'mei', text: answer, time: now }])
      setPending(false)
    }, 800)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Avatar who="neighbour" size={44} />
        <h1 className="text-title font-bold">{t('mei')}</h1>
        <span className="rounded-full bg-quiet-tint px-3 py-1 text-small font-bold text-quiet">{t('chatTag')}</span>
      </div>

      <ol role="log" aria-live="polite" className="flex flex-col gap-3">
        {messages.map((m, i) => {
          const mine = m.from === 'aminah'
          return (
            <motion.li
              key={i}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex max-w-[85%] flex-col gap-1 ${mine ? 'items-end self-end' : 'items-start self-start'}`}
            >
              <p
                className={`rounded-2xl px-3 py-2 text-body ${
                  mine ? 'rounded-tr-md bg-accent-tint' : 'rounded-tl-md bg-quiet-tint'
                }`}
              >
                <span className="sr-only">{mine ? t('residentName') : t('mei')}: </span>
                {t(m.text)}
              </p>
              <span className="text-small text-ink-soft">{formatTime(m.time)}</span>
            </motion.li>
          )
        })}
      </ol>

      <div className="flex flex-col gap-3">
        {REPLIES.map((r) => (
          <BigButton key={r.ask} variant="secondary" disabled={pending} onClick={() => send(r.ask, r.answer)}>
            {t(r.ask)}
          </BigButton>
        ))}
      </div>
    </div>
  )
}
