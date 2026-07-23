import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Pill'
import { EmptyState } from '@/components/ui/EmptyState'
import { useCriativosStore } from '@/features/criativos/useCriativosStore'
import { useTemasStore } from '@/features/temas/useTemasStore'
import { TemaIcon } from '@/features/temas/TemaIcon'
import { CriativoCard } from '@/features/criativos/CriativoCard'
import { NodePrincipalModal, type NodePrincipalInput } from '@/features/criativos/NodePrincipalModal'
import { CRIATIVO_STATUS_LABEL, type CriativoStatus } from '@/types/criativo'

const STATUS_FILTROS: CriativoStatus[] = ['rascunho', 'pronto', 'agendado', 'publicado']

export function CriativosPage() {
  const navigate = useNavigate()
  const { criativos, loaded, load, create } = useCriativosStore()
  const { temas, loaded: temasLoaded, load: loadTemas } = useTemasStore()
  const [formOpen, setFormOpen] = useState(false)
  const [temaFiltro, setTemaFiltro] = useState<string | null>(null)
  const [statusFiltro, setStatusFiltro] = useState<CriativoStatus | null>(null)

  useEffect(() => {
    if (!loaded) load()
    if (!temasLoaded) loadTemas()
  }, [loaded, load, temasLoaded, loadTemas])

  const temasPorId = useMemo(() => new Map(temas.map((tema) => [tema.id, tema])), [temas])

  const criativosFiltrados = criativos.filter((criativo) => {
    if (temaFiltro && criativo.temaId !== temaFiltro) return false
    if (statusFiltro && criativo.status !== statusFiltro) return false
    return true
  })

  async function handleCreate(input: NodePrincipalInput) {
    const criativo = await create(input)
    navigate(`/criativos/${criativo.id}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-text-primary">Criativos</h1>
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={18} strokeWidth={2} />
          Novo criativo
        </Button>
      </div>

      {temas.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Pill active={temaFiltro === null} onClick={() => setTemaFiltro(null)}>
              Todos os temas
            </Pill>
            {temas.map((tema) => (
              <Pill key={tema.id} active={temaFiltro === tema.id} onClick={() => setTemaFiltro(tema.id)}>
                <TemaIcon tema={tema} size="xs" />
                {tema.nome}
              </Pill>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill active={statusFiltro === null} onClick={() => setStatusFiltro(null)}>
              Todos os status
            </Pill>
            {STATUS_FILTROS.map((status) => (
              <Pill key={status} active={statusFiltro === status} onClick={() => setStatusFiltro(status)}>
                {CRIATIVO_STATUS_LABEL[status]}
              </Pill>
            ))}
          </div>
        </div>
      )}

      {loaded && criativosFiltrados.length === 0 && (
        <EmptyState
          icon={Sparkles}
          title="Nenhum criativo ainda"
          description="Crie um carrossel do zero e gere texto e imagem com IA para cada slide."
          action={<Button onClick={() => setFormOpen(true)}>Criar primeiro criativo</Button>}
        />
      )}

      {criativosFiltrados.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {criativosFiltrados.map((criativo) => (
            <CriativoCard
              key={criativo.id}
              criativo={criativo}
              tema={criativo.temaId ? temasPorId.get(criativo.temaId) : undefined}
              onOpen={() => navigate(`/criativos/${criativo.id}`)}
            />
          ))}
        </div>
      )}

      <NodePrincipalModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleCreate} />
    </div>
  )
}
