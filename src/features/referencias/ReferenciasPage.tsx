import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Plus, Tags } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Pill'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { useReferenciasStore } from '@/features/referencias/useReferenciasStore'
import { useTemasStore } from '@/features/temas/useTemasStore'
import { TemaIcon } from '@/features/temas/TemaIcon'
import { ReferenciaCard } from '@/features/referencias/ReferenciaCard'
import { ReferenciaFormModal } from '@/features/referencias/ReferenciaFormModal'
import { REFERENCIA_TIPO_LABEL, type Referencia, type ReferenciaTipo } from '@/types/referencia'

const TIPOS: ReferenciaTipo[] = ['link', 'site', 'anotacao']

export function ReferenciasPage() {
  const navigate = useNavigate()
  const { referencias, loaded, load, create, update, remove } = useReferenciasStore()
  const { temas, loaded: temasLoaded, load: loadTemas } = useTemasStore()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Referencia | undefined>(undefined)
  const [toDelete, setToDelete] = useState<Referencia | undefined>(undefined)
  const [temaFiltro, setTemaFiltro] = useState<string | null>(null)
  const [tipoFiltro, setTipoFiltro] = useState<ReferenciaTipo | null>(null)

  useEffect(() => {
    if (!loaded) load()
    if (!temasLoaded) loadTemas()
  }, [loaded, load, temasLoaded, loadTemas])

  const temasPorId = useMemo(() => new Map(temas.map((tema) => [tema.id, tema])), [temas])

  const filtradas = referencias.filter((referencia) => {
    if (temaFiltro && referencia.temaId !== temaFiltro) return false
    if (tipoFiltro && referencia.tipo !== tipoFiltro) return false
    return true
  })

  function openCreate() {
    setEditing(undefined)
    setFormOpen(true)
  }

  function openEdit(referencia: Referencia) {
    setEditing(referencia)
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

  if (temasLoaded && temas.length === 0) {
    return (
      <EmptyState
        icon={Tags}
        title="Crie um tema antes"
        description="Uma referência precisa pertencer a um tema. Crie o primeiro tema para depois guardar links, sites e anotações."
        action={<Button onClick={() => navigate('/temas')}>Ir para Temas</Button>}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-text-primary">Referências</h1>
        <Button onClick={openCreate}>
          <Plus size={18} strokeWidth={2} />
          Nova referência
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
            <Pill active={tipoFiltro === null} onClick={() => setTipoFiltro(null)}>
              Todos os tipos
            </Pill>
            {TIPOS.map((tipo) => (
              <Pill key={tipo} active={tipoFiltro === tipo} onClick={() => setTipoFiltro(tipo)}>
                {REFERENCIA_TIPO_LABEL[tipo]}
              </Pill>
            ))}
          </div>
        </div>
      )}

      {loaded && filtradas.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="Nenhuma referência ainda"
          description="Cole um link, cadastre um site recorrente ou escreva uma anotação livre."
          action={<Button onClick={openCreate}>Criar primeira referência</Button>}
        />
      )}

      {filtradas.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtradas.map((referencia) => (
            <ReferenciaCard
              key={referencia.id}
              referencia={referencia}
              tema={temasPorId.get(referencia.temaId)}
              onEdit={() => openEdit(referencia)}
              onDelete={() => setToDelete(referencia)}
            />
          ))}
        </div>
      )}

      <ReferenciaFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        temas={temas}
        initialValue={editing}
      />

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(undefined)}
        title="Excluir referência"
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
          Tem certeza que quer excluir <strong>{toDelete?.titulo}</strong>? Essa ação não pode ser desfeita.
        </p>
      </Modal>
    </div>
  )
}
