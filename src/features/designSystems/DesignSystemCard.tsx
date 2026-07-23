import { Pencil, Trash2, Palette } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { IconButton } from '@/components/ui/IconButton'
import type { DesignSystem } from '@/types/designSystem'

interface DesignSystemCardProps {
  designSystem: DesignSystem
  onEdit: () => void
  onDelete: () => void
}

export function DesignSystemCard({ designSystem, onEdit, onDelete }: DesignSystemCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent-primary">
            <Palette size={18} strokeWidth={1.75} />
          </span>
          <h3 className="font-semibold text-text-primary">{designSystem.titulo}</h3>
        </div>
        <div className="flex -mr-2 shrink-0">
          <IconButton label={`Editar ${designSystem.titulo}`} onClick={onEdit}>
            <Pencil size={16} strokeWidth={1.75} />
          </IconButton>
          <IconButton label={`Excluir ${designSystem.titulo}`} onClick={onDelete}>
            <Trash2 size={16} strokeWidth={1.75} />
          </IconButton>
        </div>
      </div>
      {designSystem.documentacaoMarkdown && (
        <p className="line-clamp-3 whitespace-pre-line text-sm text-text-secondary">
          {designSystem.documentacaoMarkdown}
        </p>
      )}
    </Card>
  )
}
