import { useEffect, useState } from 'react'
import { Plus, Palette } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { useDesignSystemsStore } from '@/features/designSystems/useDesignSystemsStore'
import { DesignSystemCard } from '@/features/designSystems/DesignSystemCard'
import { DesignSystemFormModal } from '@/features/designSystems/DesignSystemFormModal'
import type { DesignSystem } from '@/types/designSystem'

export function DesignSystemsPage() {
  const { designSystems, loaded, load, create, update, remove } = useDesignSystemsStore()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<DesignSystem | undefined>(undefined)
  const [toDelete, setToDelete] = useState<DesignSystem | undefined>(undefined)

  useEffect(() => {
    if (!loaded) load()
  }, [loaded, load])

  function openCreate() {
    setEditing(undefined)
    setFormOpen(true)
  }

  function openEdit(designSystem: DesignSystem) {
    setEditing(designSystem)
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
        <h1 className="text-lg font-bold text-text-primary">Design Systems</h1>
        <Button onClick={openCreate}>
          <Plus size={18} strokeWidth={2} />
          Novo Design System
        </Button>
      </div>

      {loaded && designSystems.length === 0 && (
        <EmptyState
          icon={Palette}
          title="Nenhum Design System ainda"
          description="Crie um Design System com título e documentação em markdown (padding, cores, alinhamento) para a IA consultar na geração dos carrosséis."
          action={<Button onClick={openCreate}>Criar primeiro Design System</Button>}
        />
      )}

      {designSystems.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {designSystems.map((designSystem) => (
            <DesignSystemCard
              key={designSystem.id}
              designSystem={designSystem}
              onEdit={() => openEdit(designSystem)}
              onDelete={() => setToDelete(designSystem)}
            />
          ))}
        </div>
      )}

      <DesignSystemFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} initialValue={editing} />

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(undefined)}
        title="Excluir Design System"
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
          Tem certeza que quer excluir <strong>{toDelete?.titulo}</strong>? Criativos que usam esse Design System
          ficam sem referência (não são excluídos). Essa ação não pode ser desfeita.
        </p>
      </Modal>
    </div>
  )
}
