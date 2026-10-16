import { Check, CheckCircle2, Heart, Info, X } from 'lucide-react'
import BigButton from '../components/BigButton'
import { Card } from '../components/Card'
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
  const Icon = TASKS[help.task].icon
  const meta = { task: help.task }

  return (
    <section className="flex flex-col gap-4">
      <Card className="flex flex-col gap-3">
        <p className="flex items-start gap-3 text-title font-bold">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-accent-tint">
            <Icon size={30} strokeWidth={2.2} aria-hidden />
          </span>
          <span className="pt-2">{t('neighbourAsk', { task: t(TASKS[help.task].phrase) })}</span>
        </p>
        <p className="text-small text-ink-soft">{formatTime(help.requestedAt)}</p>
        <p className="text-body">{t('doorstepOnly')}</p>
      </Card>

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
