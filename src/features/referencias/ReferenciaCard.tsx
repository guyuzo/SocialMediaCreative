import { Link2, NotebookPen, Pencil, Globe, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { IconButton } from '@/components/ui/IconButton'
import type { Referencia } from '@/types/referencia'
import type { Tema } from '@/types/tema'

const TIPO_ICON = {
  link: Link2,
  site: Globe,
  anotacao: NotebookPen,
} as const

interface ReferenciaCardProps {
  referencia: Referencia
  tema?: Tema
  onEdit: () => void
  onDelete: () => void
}

export function ReferenciaCard({ referencia, tema, onEdit, onDelete }: ReferenciaCardProps) {
  const Icon = TIPO_ICON[referencia.tipo]

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon size={16} strokeWidth={1.75} className="shrink-0 text-accent-primary" />
          <h3 className="font-semibold text-text-primary">{referencia.titulo}</h3>
        </div>
        <div className="flex -mr-2 shrink-0">
          <IconButton label={`Editar ${referencia.titulo}`} onClick={onEdit}>
            <Pencil size={16} strokeWidth={1.75} />
          </IconButton>
          <IconButton label={`Excluir ${referencia.titulo}`} onClick={onDelete}>
            <Trash2 size={16} strokeWidth={1.75} />
          </IconButton>
        </div>
      </div>
      {referencia.url && (
        <p className="truncate text-xs text-text-muted">{referencia.url}</p>
      )}
      {referencia.conteudo && (
        <p className="text-sm text-text-secondary line-clamp-3">{referencia.conteudo}</p>
      )}
      <div className="flex items-center gap-1.5 text-xs text-text-muted">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tema?.cor ?? '#9CA0AF' }} aria-hidden />
        {tema?.nome ?? 'Sem tema'}
      </div>
    </Card>
  )
}
