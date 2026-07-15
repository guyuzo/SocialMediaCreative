import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lightbulb, Plus, Tags } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Pill'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { useIdeiasStore } from '@/features/ideias/useIdeiasStore'
import { useTemasStore } from '@/features/temas/useTemasStore'
import { useCriativosStore } from '@/features/criativos/useCriativosStore'
import { IdeiaCard } from '@/features/ideias/IdeiaCard'
import { IdeiaFormModal } from '@/features/ideias/IdeiaFormModal'
import type { Ideia } from '@/types/ideia'

export function IdeiasPage() {
  const navigate = useNavigate()
  const { ideias, loaded, load, create, update, remove, marcarPromovida } = useIdeiasStore()
  const { temas, loaded: temasLoaded, load: loadTemas } = useTemasStore()
  const { create: createCriativo } = useCriativosStore()

  const [formOpen, setFormOpen] = useState(false)
  const [editingIdeia, setEditingIdeia] = useState<Ideia | undefined>(undefined)
  const [ideiaToDelete, setIdeiaToDelete] = useState<Ideia | undefined>(undefined)
  const [temaFiltro, setTemaFiltro] = useState<string | null>(null)

  useEffect(() => {
    if (!loaded) load()
    if (!temasLoaded) loadTemas()
  }, [loaded, load, temasLoaded, loadTemas])

  const temasPorId = useMemo(() => new Map(temas.map((tema) => [tema.id, tema])), [temas])
  const ideiasFiltradas = ideias.filter((ideia) => !temaFiltro || ideia.temaId === temaFiltro)

  function openCreate() {
    setEditingIdeia(undefined)
    setFormOpen(true)
  }

  function openEdit(ideia: Ideia) {
    setEditingIdeia(ideia)
    setFormOpen(true)
  }

  async function handleSubmit(input: { temaId: string; titulo: string; resumo: string }) {
    if (editingIdeia) {
      await update(editingIdeia.id, input)
    } else {
      await create(input)
    }
  }

  async function handleConfirmDelete() {
    if (!ideiaToDelete) return
    await remove(ideiaToDelete.id)
    setIdeiaToDelete(undefined)
  }

  async function handlePromover(ideia: Ideia) {
    const criativo = await createCriativo({
      temaId: ideia.temaId,
      titulo: ideia.titulo,
      formato: '4:5',
      ideiaId: ideia.id,
    })
    await marcarPromovida(ideia.id)
    navigate(`/criativos/${criativo.id}`)
  }

  if (temasLoaded && temas.length === 0) {
    return (
      <EmptyState
        icon={Tags}
        title="Crie um tema antes"
        description="Uma ideia precisa pertencer a um tema. Crie o primeiro tema para depois anotar ou gerar ideias."
        action={<Button onClick={() => navigate('/temas')}>Ir para Temas</Button>}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-text-primary">Biblioteca de Ideias</h1>
        <Button onClick={openCreate}>
          <Plus size={18} strokeWidth={2} />
          Nova ideia
        </Button>
      </div>

      {temas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Pill active={temaFiltro === null} onClick={() => setTemaFiltro(null)}>
            Todos os temas
          </Pill>
          {temas.map((tema) => (
            <Pill key={tema.id} active={temaFiltro === tema.id} onClick={() => setTemaFiltro(tema.id)}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tema.cor }} aria-hidden />
              {tema.nome}
            </Pill>
          ))}
        </div>
      )}

      {loaded && ideiasFiltradas.length === 0 && (
        <EmptyState
          icon={Lightbulb}
          title="Nenhuma ideia ainda"
          description="Anote uma ideia solta ou gere com IA a partir de um tema."
          action={<Button onClick={openCreate}>Criar primeira ideia</Button>}
        />
      )}

      {ideiasFiltradas.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ideiasFiltradas.map((ideia) => (
            <IdeiaCard
              key={ideia.id}
              ideia={ideia}
              tema={temasPorId.get(ideia.temaId)}
              onEdit={() => openEdit(ideia)}
              onDelete={() => setIdeiaToDelete(ideia)}
              onPromover={() => handlePromover(ideia)}
            />
          ))}
        </div>
      )}

      <IdeiaFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        temas={temas}
        initialValue={editingIdeia}
      />

      <Modal
        open={!!ideiaToDelete}
        onClose={() => setIdeiaToDelete(undefined)}
        title="Descartar ideia"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIdeiaToDelete(undefined)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Descartar
            </Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary">
          Tem certeza que quer descartar <strong>{ideiaToDelete?.titulo}</strong>? Essa ação não pode ser desfeita.
        </p>
      </Modal>
    </div>
  )
}
