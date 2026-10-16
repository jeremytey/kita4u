import { createContext, createElement, useCallback, useContext, useState, type ReactNode } from 'react'
import type { Lang } from './types'

// Working title, placeholder.
export const APP_NAME = 'Care Circle'

type Str = { en: string; bm: string; zh: string }
const same = (s: string): Str => ({ en: s, bm: s, zh: s })

export const S = {
  appName: same(APP_NAME),
  back: { en: 'Back', bm: 'Kembali', zh: '返回' },
  language: { en: 'Language', bm: 'Bahasa', zh: '语言' },

  // People. Everyone is fictional.
  residentName: same('Mak Cik Aminah'),
  unit: { en: 'Unit 12-3', bm: 'Unit 12-3', zh: '12-3 单位' },
  mei: same('Mei'),
  daniel: same('Daniel'),
  township: { en: 'Township Support', bm: 'Sokongan Taman', zh: '社区支援' },
  roleResident: { en: 'Resident', bm: 'Penduduk', zh: '居民' },
  roleNeighbour: { en: 'Neighbour', bm: 'Jiran', zh: '邻居' },
  roleSon: { en: 'Son', bm: 'Anak lelaki', zh: '儿子' },
  roleFamily: { en: 'Family', bm: 'Keluarga', zh: '家人' },
  roleCommunity: { en: 'Community', bm: 'Komuniti', zh: '社区' },
  yourCircle: { en: 'Your Circle', bm: 'Bulatan anda', zh: '你的关怀圈' },
  allAgreed: { en: 'All agreed to help', bm: 'Semua setuju membantu', zh: '都已同意帮忙' },
  simulated: same('SIMULATED'),
} satisfies Record<string, Str>

export type StrKey = keyof typeof S

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'en',
  setLang: () => {},
})

const LANG_KEY = 'care-circle-lang'

function initialLang(): Lang {
  try {
    const v = localStorage.getItem(LANG_KEY)
    if (v === 'en' || v === 'bm' || v === 'zh') return v
  } catch {
    // ignore
  }
  return 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(LANG_KEY, l)
    } catch {
      // ignore
    }
  }, [])
  return createElement(LangContext.Provider, { value: { lang, setLang } }, children)
}

export function useLang() {
  return useContext(LangContext)
}

// t('key', { name: 'Mei' }) fills {name} placeholders.
export function useT() {
  const { lang } = useContext(LangContext)
  return useCallback(
    (key: StrKey, vars?: Record<string, string | number>) => {
      let s = S[key][lang]
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v))
      return s
    },
    [lang],
  )
}
