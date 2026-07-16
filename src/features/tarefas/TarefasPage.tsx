import { useEffect, useMemo, useState } from 'react'
import { ListChecks, Plus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Pill } from '@/components/ui/Pill'
import { EmptyState } from '@/components/ui/EmptyState'
import { useTarefasStore } from '@/features/tarefas/useTarefasStore'
import { TarefaItem } from '@/features/tarefas/TarefaItem'
import { TAREFA_STATUS_LABEL, type TarefaStatus } from '@/types/tarefa'

const STATUS_FILTROS: TarefaStatus[] = ['pendente', 'em_andamento', 'concluida']

export function TarefasPage() {
  const { tarefas, loaded, load, create, rename, setDeadline, cicloStatus, remove } = useTarefasStore()
  const [novoTitulo, setNovoTitulo] = useState('')
  const [novoDeadline, setNovoDeadline] = useState('')
  const [statusFiltro, setStatusFiltro] = useState<TarefaStatus | null>(null)

  useEffect(() => {
    if (!loaded) load()
  }, [loaded, load])

  async function handleAdicionar() {
    const titulo = novoTitulo.trim()
    if (!titulo) return
    await create(titulo, novoDeadline || undefined)
    setNovoTitulo('')
    setNovoDeadline('')
  }

  const visiveis = useMemo(() => {
    const filtradas = statusFiltro ? tarefas.filter((tarefa) => tarefa.status === statusFiltro) : tarefas
    return [...filtradas].sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0
      if (!a.deadline) return 1
      if (!b.deadline) return -1
      return a.deadline.localeCompare(b.deadline)
    })
  }, [tarefas, statusFiltro])

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-bold text-text-primary">Tarefas</h1>

      <Card padding="compact" className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={novoTitulo}
          onChange={(e) => setNovoTitulo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdicionar()}
          placeholder="Nova tarefa..."
          className="flex-1"
        />
        <input
          type="date"
          value={novoDeadline}
          onChange={(e) => setNovoDeadline(e.target.value)}
          className="h-11 rounded-md border border-border-subtle bg-bg-app px-3 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
        />
        <Button onClick={handleAdicionar} disabled={!novoTitulo.trim()}>
          <Plus size={18} strokeWidth={2} />
          Adicionar
        </Button>
      </Card>

      {tarefas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Pill active={statusFiltro === null} onClick={() => setStatusFiltro(null)}>
            Todas
          </Pill>
          {STATUS_FILTROS.map((status) => (
            <Pill key={status} active={statusFiltro === status} onClick={() => setStatusFiltro(status)}>
              {TAREFA_STATUS_LABEL[status]}
            </Pill>
          ))}
        </div>
      )}

      {loaded && tarefas.length === 0 && (
        <EmptyState
          icon={ListChecks}
          title="Nenhuma tarefa ainda"
          description="Um checklist livre, sem depender de tema ou criativo nenhum."
        />
      )}

      {visiveis.length > 0 && (
        <Card padding="compact" className="flex flex-col divide-y divide-border-subtle">
          {visiveis.map((tarefa) => (
            <TarefaItem
              key={tarefa.id}
              tarefa={tarefa}
              onCicloStatus={() => cicloStatus(tarefa.id)}
              onRename={(titulo) => rename(tarefa.id, titulo)}
              onSetDeadline={(deadline) => setDeadline(tarefa.id, deadline)}
              onDelete={() => remove(tarefa.id)}
            />
          ))}
        </Card>
      )}
    </div>
  )
}
