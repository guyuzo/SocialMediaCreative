import { useEffect, useState } from 'react'
import { Plus, Tags } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { useTemasStore } from '@/features/temas/useTemasStore'
import { TemaCard } from '@/features/temas/TemaCard'
import { TemaFormModal } from '@/features/temas/TemaFormModal'
import type { Tema } from '@/types/tema'

export function TemasPage() {
  const { temas, loaded, load, create, update, remove } = useTemasStore()
  const [formOpen, setFormOpen] = useState(false)
  const [editingTema, setEditingTema] = useState<Tema | undefined>(undefined)
  const [temaToDelete, setTemaToDelete] = useState<Tema | undefined>(undefined)

  useEffect(() => {
    if (!loaded) load()
  }, [loaded, load])

  function openCreate() {
    setEditingTema(undefined)
    setFormOpen(true)
  }

  function openEdit(tema: Tema) {
    setEditingTema(tema)
    setFormOpen(true)
  }

  async function handleSubmit(input: { nome: string; cor: string; descricao: string }) {
    if (editingTema) {
      await update(editingTema.id, input)
    } else {
      await create(input)
    }
  }

  async function handleConfirmDelete() {
    if (!temaToDelete) return
    await remove(temaToDelete.id)
    setTemaToDelete(undefined)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-text-primary">Temas</h1>
        <Button onClick={openCreate}>
          <Plus size={18} strokeWidth={2} />
          Novo tema
        </Button>
      </div>

      {loaded && temas.length === 0 && (
        <EmptyState
          icon={Tags}
          title="Nenhum tema ainda"
          description="Crie um tema para organizar referências, ideias e criativos por assunto."
          action={<Button onClick={openCreate}>Criar primeiro tema</Button>}
        />
      )}

      {temas.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {temas.map((tema) => (
            <TemaCard
              key={tema.id}
              tema={tema}
              onEdit={() => openEdit(tema)}
              onDelete={() => setTemaToDelete(tema)}
            />
          ))}
        </div>
      )}

      <TemaFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialValue={editingTema}
      />

      <Modal
        open={!!temaToDelete}
        onClose={() => setTemaToDelete(undefined)}
        title="Excluir tema"
        footer={
          <>
            <Button variant="ghost" onClick={() => setTemaToDelete(undefined)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Excluir
            </Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary">
          Tem certeza que quer excluir o tema <strong>{temaToDelete?.nome}</strong>? Essa ação
          não pode ser desfeita.
        </p>
      </Modal>
    </div>
  )
}
