import { Check, CheckCircle2, Heart, Info, ShoppingBag, X } from 'lucide-react'
import BigButton from '../components/BigButton'
import { Eyebrow, IconTile } from '../components/Card'
import { formatTime } from '../lib/engine'
import { useStore } from '../lib/store'
import { useT } from '../strings'
import { currentHelp, TASKS } from './NeedHelp'

// Mei's view of Aminah's favour request. Shown under the welfare card when both exist.
export default function NeighbourHelp() {
  const t = useT()
  const { events, now, add } = useStore()
  const help = currentHelp(events, now)
  if (!help) return null
  const Icon = help.task === 'groceries' ? ShoppingBag : TASKS[help.task].icon
  const meta = { task: help.task }

  return (
    // A separate card below the welfare card. A favour never changes the check-in.
    <section
      aria-labelledby="favour-title"
      className="flex flex-col gap-4 rounded-[24px] border-2 border-edge bg-surface p-5 shadow-[0_4px_0_rgba(154,133,112,0.14)]"
    >
      <div className="flex items-start gap-4">
        <IconTile icon={Icon} tone="done" />
        <div className="flex min-w-0 flex-col gap-1">
          <Eyebrow>{t('smallFavour')}</Eyebrow>
          <h2 id="favour-title" className="text-title font-bold">
            {t('neighbourAsk', { task: t(TASKS[help.task].phrase) })}
          </h2>
          <p className="text-body text-ink-soft">
            {t('forAminah')} · {formatTime(help.requestedAt)}
          </p>
        </div>
      </div>
      <p className="text-body">{t('doorstepOnly')}</p>

      {help.acceptedAt === undefined && help.declinedAt === undefined && (
        <div className="flex flex-col gap-3">
          <BigButton icon={Check} onClick={() => add('HELP_ACCEPTED', 'neighbour', meta)}>
            {t('accept')}
          </BigButton>
          <BigButton icon={X} variant="secondary" onClick={() => add('HELP_DECLINED', 'neighbour', meta)}>
            {t('cantNow')}
          </BigButton>
        </div>
      )}

      {help.declinedAt !== undefined && help.acceptedAt === undefined && (
        <p className="flex items-center gap-3 rounded-[24px] bg-quiet-tint p-4 text-body">
          <Info size={26} className="shrink-0 text-quiet" aria-hidden />
          {t('youDeclined')}
        </p>
      )}

      {help.acceptedAt !== undefined && help.doneAt === undefined && (
        <div className="flex flex-col gap-3">
          <p className="text-body">{t('youAccepted')}</p>
          <BigButton icon={CheckCircle2} onClick={() => add('HELP_DONE', 'neighbour', meta)}>
            {t('done')}
          </BigButton>
        </div>
      )}

      {help.doneAt !== undefined && (
        <p className="flex items-center gap-3 rounded-[24px] bg-done-tint p-4 text-body font-bold text-done">
          <CheckCircle2 size={26} className="shrink-0" aria-hidden />
          {t('helpFinished')}
        </p>
      )}

      {help.thanksAt !== undefined && (
        <p className="flex items-center gap-3 rounded-[24px] bg-accent-tint p-4 text-title font-bold">
          <Heart size={28} className="shrink-0 text-accent-ink" aria-hidden />
          {t('aminahThanks')}
        </p>
      )}
    </section>
  )
}
