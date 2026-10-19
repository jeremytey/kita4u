import { Check, CheckCircle2, Info, UserPlus, X } from 'lucide-react'
import BigButton from '../components/BigButton'
import { Eyebrow, IconTile } from '../components/Card'
import { setCircle, useCircle } from '../lib/circle'
import { useT } from '../strings'

// Prototype of consent, Mei only. Shown once the resident finished setup. Accept or Decline never changes the chain.
export default function MeiInvite() {
  const t = useT()
  const { setupDone, meiInvite } = useCircle()
  if (!setupDone || meiInvite === 'none') return null

  if (meiInvite === 'pending') {
    return (
      <section aria-labelledby="invite-title" className="flex flex-col gap-4 rounded-[24px] border-2 border-edge bg-surface p-5">
        <div className="flex items-center gap-4">
          <IconTile icon={UserPlus} tone="accent" />
          <Eyebrow>{t('inviteEyebrow')}</Eyebrow>
        </div>
        <h2 id="invite-title" className="text-title font-bold">
          {t('inviteTitle')}
        </h2>
        <div className="flex flex-col gap-3">
          <BigButton icon={Check} onClick={() => setCircle({ meiInvite: 'accepted' })}>
            {t('accept')}
          </BigButton>
          <BigButton icon={X} variant="secondary" onClick={() => setCircle({ meiInvite: 'declined' })}>
            {t('inviteDecline')}
          </BigButton>
        </div>
      </section>
    )
  }

  const accepted = meiInvite === 'accepted'
  return (
    <section
      aria-live="polite"
      className={`flex items-start gap-4 rounded-[24px] border-2 p-5 ${accepted ? 'border-done bg-done-tint' : 'border-edge bg-surface'}`}
    >
      <IconTile icon={accepted ? CheckCircle2 : Info} tone={accepted ? 'done' : 'quiet'} />
      <div className="flex min-w-0 flex-col gap-1 pt-1">
        <Eyebrow className={accepted ? 'text-done' : 'text-ink-soft'}>{t('inviteEyebrow')}</Eyebrow>
        <p className="text-body font-bold">{t(accepted ? 'inviteAccepted' : 'inviteDeclined')}</p>
      </div>
    </section>
  )
}
