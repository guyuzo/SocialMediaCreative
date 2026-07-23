import { Pencil, Trash2, MessagesSquare } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { IconButton } from '@/components/ui/IconButton'
import type { TomDeVoz } from '@/types/tomDeVoz'

interface TomDeVozCardProps {
  tomDeVoz: TomDeVoz
  onEdit: () => void
  onDelete: () => void
}

export function TomDeVozCard({ tomDeVoz, onEdit, onDelete }: TomDeVozCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent-primary">
            <MessagesSquare size={18} strokeWidth={1.75} />
          </span>
          <h3 className="font-semibold text-text-primary">{tomDeVoz.nome}</h3>
        </div>
        <div className="flex -mr-2 shrink-0">
          <IconButton label={`Editar ${tomDeVoz.nome}`} onClick={onEdit}>
            <Pencil size={16} strokeWidth={1.75} />
          </IconButton>
          <IconButton label={`Excluir ${tomDeVoz.nome}`} onClick={onDelete}>
            <Trash2 size={16} strokeWidth={1.75} />
          </IconButton>
        </div>
      </div>
      {tomDeVoz.descricao && <p className="line-clamp-2 text-sm text-text-secondary">{tomDeVoz.descricao}</p>}
      {tomDeVoz.exemploFrase && (
        <p className="line-clamp-2 text-sm italic text-text-muted">"{tomDeVoz.exemploFrase}"</p>
      )}
    </Card>
  )
}
