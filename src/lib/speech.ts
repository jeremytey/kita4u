import { useCallback, useEffect, useState } from 'react'
import type { Lang } from '../types'

// Read aloud with the browser's own voices. Voices load late in Chrome, so we wait for voiceschanged.
const PREFIX: Record<Lang, string> = { en: 'en', bm: 'ms', zh: 'zh' }
const GIVE_UP_MS = 2000 // some browsers never fire voiceschanged when there are no voices

type VoiceState = 'loading' | 'ready' | 'none'

function findVoice(lang: Lang): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  const p = PREFIX[lang]
  return voices.find((v) => v.lang.toLowerCase().replace('_', '-').startsWith(p))
}

export function useSpeech(lang: Lang) {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [state, setState] = useState<VoiceState>(supported ? 'loading' : 'none')
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    if (!supported) return
    const synth = window.speechSynthesis
    const check = (final: boolean) => {
      if (findVoice(lang)) setState('ready')
      else if (final || synth.getVoices().length > 0) setState('none')
      else setState('loading')
    }
    check(false)
    const onChange = () => check(false)
    synth.addEventListener('voiceschanged', onChange)
    const timer = window.setTimeout(() => check(true), GIVE_UP_MS)
    return () => {
      synth.removeEventListener('voiceschanged', onChange)
      window.clearTimeout(timer)
    }
  }, [lang, supported])

  // Stop talking when the screen closes or the language changes.
  useEffect(() => {
    if (!supported) return
    return () => {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    }
  }, [lang, supported])

  const speak = useCallback(
    (text: string) => {
      const voice = findVoice(lang)
      if (!voice) return
      const synth = window.speechSynthesis
      synth.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.voice = voice
      u.lang = voice.lang
      u.rate = 0.9
      u.onend = () => setSpeaking(false)
      u.onerror = () => setSpeaking(false)
      setSpeaking(true)
      synth.speak(u)
    },
    [lang],
  )

  const stop = useCallback(() => {
    if (supported) window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [supported])

  return { state, speaking, speak, stop }
}
