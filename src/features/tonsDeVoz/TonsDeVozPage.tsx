import { useEffect, useState } from 'react'
import { Plus, MessagesSquare } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { useTonsDeVozStore } from '@/features/tonsDeVoz/useTonsDeVozStore'
import { TomDeVozCard } from '@/features/tonsDeVoz/TomDeVozCard'
import { TomDeVozFormModal } from '@/features/tonsDeVoz/TomDeVozFormModal'
import type { TomDeVoz } from '@/types/tomDeVoz'

export function TonsDeVozPage() {
  const { tonsDeVoz, loaded, load, create, update, remove } = useTonsDeVozStore()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<TomDeVoz | undefined>(undefined)
  const [toDelete, setToDelete] = useState<TomDeVoz | undefined>(undefined)

  useEffect(() => {
    if (!loaded) load()
  }, [loaded, load])

  function openCreate() {
    setEditing(undefined)
    setFormOpen(true)
  }

  function openEdit(tomDeVoz: TomDeVoz) {
    setEditing(tomDeVoz)
    setFormOpen(true)
  }

  async function handleSubmit(input: Parameters<typeof create>[0]) {
    if (editing) {
      await update(editing.id, input)
    } else {
      await create(input)
    }
  }

  async function handleConfirmDelete() {
    if (!toDelete) return
    await remove(toDelete.id)
    setToDelete(undefined)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-text-primary">Tons de Voz</h1>
        <Button onClick={openCreate}>
          <Plus size={18} strokeWidth={2} />
          Novo tom de voz
        </Button>
      </div>

      {loaded && tonsDeVoz.length === 0 && (
        <EmptyState
          icon={MessagesSquare}
          title="Nenhum tom de voz ainda"
          description="Cadastre tons de voz reutilizáveis para selecionar na geração dos seus carrosséis."
          action={<Button onClick={openCreate}>Criar primeiro tom de voz</Button>}
        />
      )}

      {tonsDeVoz.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tonsDeVoz.map((tomDeVoz) => (
            <TomDeVozCard
              key={tomDeVoz.id}
              tomDeVoz={tomDeVoz}
              onEdit={() => openEdit(tomDeVoz)}
              onDelete={() => setToDelete(tomDeVoz)}
            />
          ))}
        </div>
      )}

      <TomDeVozFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} initialValue={editing} />

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(undefined)}
        title="Excluir tom de voz"
        footer={
          <>
            <Button variant="ghost" onClick={() => setToDelete(undefined)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Excluir
            </Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary">
          Tem certeza que quer excluir <strong>{toDelete?.nome}</strong>? Criativos que usam esse tom de voz ficam
          sem referência (não são excluídos). Essa ação não pode ser desfeita.
        </p>
      </Modal>
    </div>
  )
}
