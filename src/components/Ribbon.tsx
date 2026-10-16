import { useClockLabel } from './DemoPanel'

// Thin honesty bar on every screen. English on purpose (only the day name follows the language),
// so PROTOTYPE and SIMULATED are always recognisable. 16px: the one place below 20px.
export default function Ribbon() {
  const clock = useClockLabel()
  return (
    <div
      role="note"
      aria-label="Prototype with sample data. Times shown are simulated."
      className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-x-3 border-b-2 border-edge bg-quiet-tint px-4 py-1.5 text-[16px] leading-snug font-bold text-ink"
    >
      <span>PROTOTYPE · SAMPLE DATA</span>
      <span className="tabular-nums">SIMULATED TIME · {clock}</span>
    </div>
  )
}
