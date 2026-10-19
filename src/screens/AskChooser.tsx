import { HeartHandshake, MessageCircleQuestion } from 'lucide-react'
import { ActionCard } from '../components/Card'
import TopBar from '../components/TopBar'
import { useT } from '../strings'

// Ask your Circle: pick one of the two working Ask jobs. Both open the screens they opened from Home before.
export default function AskChooser({ onBack, onMessage, onFavour }: { onBack: () => void; onMessage: () => void; onFavour: () => void }) {
  const t = useT()
  return (
    <>
      <TopBar onBack={onBack} />
      <main className="flex flex-1 flex-col gap-4 px-4 pt-6 pb-8">
        <h1 className="text-greet font-bold">{t('whatDoYouNeed')}</h1>
        <ActionCard icon={MessageCircleQuestion} tone="warn" title={t('explainMessage')} sub={t('makeSimple')} onClick={onMessage} />
        <ActionCard icon={HeartHandshake} tone="done" title={t('askFavour')} sub={t('askMeiSub')} onClick={onFavour} />
      </main>
    </>
  )
}
