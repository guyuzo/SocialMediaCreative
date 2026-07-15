import { Pencil, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { IconButton } from '@/components/ui/IconButton'
import type { Tema } from '@/types/tema'

interface TemaCardProps {
  tema: Tema
  onEdit: () => void
  onDelete: () => void
}

export function TemaCard({ tema, onEdit, onDelete }: TemaCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: tema.cor }}
            aria-hidden
          />
          <h3 className="font-semibold text-text-primary">{tema.nome}</h3>
        </div>
        <div className="flex -mr-2 shrink-0">
          <IconButton label={`Editar ${tema.nome}`} onClick={onEdit}>
            <Pencil size={16} strokeWidth={1.75} />
          </IconButton>
          <IconButton label={`Excluir ${tema.nome}`} onClick={onDelete}>
            <Trash2 size={16} strokeWidth={1.75} />
          </IconButton>
        </div>
      </div>
      {tema.descricao && (
        <p className="text-sm text-text-secondary line-clamp-2">{tema.descricao}</p>
      )}
    </Card>
  )
}
