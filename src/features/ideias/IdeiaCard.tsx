import { Pencil, Sparkles, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { IconButton } from '@/components/ui/IconButton'
import { Button } from '@/components/ui/Button'
import { TemaIcon } from '@/features/temas/TemaIcon'
import type { Ideia } from '@/types/ideia'
import type { Tema } from '@/types/tema'

interface IdeiaCardProps {
  ideia: Ideia
  tema?: Tema
  onEdit: () => void
  onDelete: () => void
  onPromover: () => void
}

export function IdeiaCard({ ideia, tema, onEdit, onDelete, onPromover }: IdeiaCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <TemaIcon tema={tema} size="sm" />
          <h3 className="font-semibold text-text-primary">{ideia.titulo}</h3>
        </div>
        <div className="flex -mr-2 shrink-0">
          <IconButton label={`Editar ${ideia.titulo}`} onClick={onEdit}>
            <Pencil size={16} strokeWidth={1.75} />
          </IconButton>
          <IconButton label={`Descartar ${ideia.titulo}`} onClick={onDelete}>
            <Trash2 size={16} strokeWidth={1.75} />
          </IconButton>
        </div>
      </div>
      {ideia.resumo && <p className="text-sm text-text-secondary line-clamp-3">{ideia.resumo}</p>}
      <div className="flex items-center justify-between">
        {ideia.promovida ? (
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent-primary">
            Promovida
          </span>
        ) : (
          <span className="text-xs text-text-muted">{tema?.nome ?? 'Sem tema'}</span>
        )}
        <Button variant="secondary" onClick={onPromover}>
          <Sparkles size={16} strokeWidth={2} />
          Promover para Criativo
        </Button>
      </div>
    </Card>
  )
}
