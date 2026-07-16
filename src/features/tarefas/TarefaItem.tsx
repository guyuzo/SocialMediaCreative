import { useState } from 'react'
import { CalendarClock, Trash2 } from 'lucide-react'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'
import { TAREFA_STATUS_LABEL, type Tarefa } from '@/types/tarefa'
import { TAREFA_STATUS_BADGE_CLASSES } from '@/features/tarefas/statusStyles'
import { classificarPrazo } from '@/features/tarefas/deadlineUtils'

interface TarefaItemProps {
  tarefa: Tarefa
  onCicloStatus: () => void
  onRename: (titulo: string) => void
  onSetDeadline: (deadline: string | undefined) => void
  onDelete: () => void
}

export function TarefaItem({ tarefa, onCicloStatus, onRename, onSetDeadline, onDelete }: TarefaItemProps) {
  const [editandoTitulo, setEditandoTitulo] = useState(false)
  const [titulo, setTitulo] = useState(tarefa.titulo)
  const [editandoPrazo, setEditandoPrazo] = useState(false)

  function salvarTitulo() {
    setEditandoTitulo(false)
    const valor = titulo.trim()
    if (valor && valor !== tarefa.titulo) {
      onRename(valor)
    } else {
      setTitulo(tarefa.titulo)
    }
  }

  const criadaEm = new Date(tarefa.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const prazo = classificarPrazo(tarefa.deadline, tarefa.status)

  return (
    <div className="flex flex-col gap-1.5 rounded-md px-2 py-2 hover:bg-accent-soft/40">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCicloStatus}
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${TAREFA_STATUS_BADGE_CLASSES[tarefa.status]}`}
        >
          {TAREFA_STATUS_LABEL[tarefa.status]}
        </button>

        {editandoTitulo ? (
          <Input
            autoFocus
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            onBlur={salvarTitulo}
            onKeyDown={(e) => {
              if (e.key === 'Enter') salvarTitulo()
              if (e.key === 'Escape') {
                setTitulo(tarefa.titulo)
                setEditandoTitulo(false)
              }
            }}
            className="flex-1"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditandoTitulo(true)}
            className={`flex-1 truncate text-left text-sm ${
              tarefa.status === 'concluida' ? 'text-text-muted line-through' : 'text-text-primary'
            }`}
          >
            {tarefa.titulo}
          </button>
        )}

        <IconButton label={`Excluir ${tarefa.titulo}`} onClick={onDelete}>
          <Trash2 size={16} strokeWidth={1.75} />
        </IconButton>
      </div>

      <div className="ml-1 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-text-muted">Criada em {criadaEm}</span>
        <span className="text-text-muted">·</span>
        {editandoPrazo ? (
          <input
            type="date"
            autoFocus
            defaultValue={tarefa.deadline ?? ''}
            onBlur={(e) => {
              onSetDeadline(e.target.value || undefined)
              setEditandoPrazo(false)
            }}
            className="rounded-md border border-border-subtle bg-bg-app px-2 py-1 text-xs text-text-primary focus:border-accent-primary focus:outline-none"
          />
        ) : (
          <button type="button" onClick={() => setEditandoPrazo(true)} className={`flex items-center gap-1 ${prazo.className}`}>
            <CalendarClock size={12} strokeWidth={2} />
            {prazo.texto}
          </button>
        )}
      </div>
    </div>
  )
}
