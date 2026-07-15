import { Images } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { CRIATIVO_STATUS_LABEL, type Criativo } from '@/types/criativo'
import { STATUS_BADGE_CLASSES } from '@/features/criativos/statusStyles'
import type { Tema } from '@/types/tema'

interface CriativoCardProps {
  criativo: Criativo
  tema?: Tema
  onOpen: () => void
}

export function CriativoCard({ criativo, tema, onOpen }: CriativoCardProps) {
  const capa = criativo.slides.find((slide) => slide.imagemUrl)?.imagemUrl

  return (
    <button type="button" onClick={onOpen} className="text-left">
      <Card padding="compact" className="flex flex-col gap-3 transition-shadow hover:shadow-lg">
        <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-md bg-bg-app">
          {capa ? (
            <img src={capa} alt="" className="h-full w-full object-cover" />
          ) : (
            <Images size={28} strokeWidth={1.5} className="text-text-muted" />
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-semibold text-text-primary">{criativo.titulo}</h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE_CLASSES[criativo.status]}`}
          >
            {CRIATIVO_STATUS_LABEL[criativo.status]}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span className="flex items-center gap-1.5">
            {tema && (
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tema.cor }} aria-hidden />
            )}
            {tema?.nome ?? 'Sem tema'}
          </span>
          <span>{criativo.slides.length} slides</span>
        </div>
      </Card>
    </button>
  )
}
