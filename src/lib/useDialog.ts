import { useEffect, type RefObject } from 'react'

const FOCUSABLE = 'button:not([disabled]), select:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'

// For the Demo panel and the away sheet: focus moves in, Tab stays inside, Escape closes,
// and focus goes back to the button that opened it (or the first button on the screen if that one is gone).
export function useDialog(ref: RefObject<HTMLElement | null>, open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    const items = () => [...(ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])]
    items()[0]?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const list = items()
      if (list.length === 0) return
      const first = list[0]
      const last = list[list.length - 1]
      const inside = ref.current?.contains(document.activeElement)
      if (e.shiftKey && (document.activeElement === first || !inside)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      const back = opener?.isConnected ? opener : document.querySelector<HTMLElement>('main button')
      // After the close animation starts, so the dialog no longer holds focus.
      requestAnimationFrame(() => back?.focus())
    }
  }, [ref, open, onClose])
}
