import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Images, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Pill'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAtivosStore } from '@/features/ativos/useAtivosStore'
import { useTemasStore } from '@/features/temas/useTemasStore'
import { AtivoCard } from '@/features/ativos/AtivoCard'
import { ATIVO_ORIGEM_LABEL, type Ativo, type AtivoOrigem } from '@/types/ativo'

const ORIGENS: AtivoOrigem[] = ['gerado', 'upload']

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function AtivosPage() {
  const navigate = useNavigate()
  const { ativos, loaded, load, create, remove } = useAtivosStore()
  const { temas, loaded: temasLoaded, load: loadTemas } = useTemasStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [origemFiltro, setOrigemFiltro] = useState<AtivoOrigem | null>(null)
  const [temaFiltro, setTemaFiltro] = useState<string | null>(null)
  const [uploadTemaId, setUploadTemaId] = useState<string | undefined>(undefined)
  const [selecionado, setSelecionado] = useState<Ativo | undefined>(undefined)

  useEffect(() => {
    if (!loaded) load()
    if (!temasLoaded) loadTemas()
  }, [loaded, load, temasLoaded, loadTemas])

  const temasPorId = useMemo(() => new Map(temas.map((tema) => [tema.id, tema])), [temas])

  const filtrados = ativos.filter((ativo) => {
    if (origemFiltro && ativo.origem !== origemFiltro) return false
    if (temaFiltro && ativo.temaId !== temaFiltro) return false
    return true
  })

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const url = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
    await create({ origem: 'upload', url, nome: file.name, temaId: uploadTemaId })
  }

  async function handleDelete() {
    if (!selecionado) return
    await remove(selecionado.id)
    setSelecionado(undefined)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-text-primary">Ativos</h1>
        <Button onClick={() => fileInputRef.current?.click()}>
          <Upload size={18} strokeWidth={2} />
          Enviar imagem
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      {temas.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-text-muted">Tema do próximo upload:</span>
          <Pill active={uploadTemaId === undefined} onClick={() => setUploadTemaId(undefined)}>
            Sem tema
          </Pill>
          {temas.map((tema) => (
            <Pill key={tema.id} active={uploadTemaId === tema.id} onClick={() => setUploadTemaId(tema.id)}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tema.cor }} aria-hidden />
              {tema.nome}
            </Pill>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <Pill active={origemFiltro === null} onClick={() => setOrigemFiltro(null)}>
            Todos
          </Pill>
          {ORIGENS.map((origem) => (
            <Pill key={origem} active={origemFiltro === origem} onClick={() => setOrigemFiltro(origem)}>
              {ATIVO_ORIGEM_LABEL[origem]}
            </Pill>
          ))}
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
      </div>

      {loaded && filtrados.length === 0 && (
        <EmptyState
          icon={Images}
          title="Nenhum ativo ainda"
          description="Imagens geradas em Criativos caem aqui automaticamente, ou envie uma imagem manualmente."
          action={<Button onClick={() => fileInputRef.current?.click()}>Enviar primeira imagem</Button>}
        />
      )}

      {filtrados.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filtrados.map((ativo) => (
            <AtivoCard key={ativo.id} ativo={ativo} onOpen={() => setSelecionado(ativo)} />
          ))}
        </div>
      )}

      <Modal
        open={!!selecionado}
        onClose={() => setSelecionado(undefined)}
        title={selecionado?.nome ?? ''}
        footer={
          <>
            <Button variant="ghost" onClick={() => setSelecionado(undefined)}>
              Fechar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <Trash2 size={16} strokeWidth={2} />
              Excluir
            </Button>
          </>
        }
      >
        {selecionado && (
          <div className="flex flex-col gap-3">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md bg-bg-app">
              <img src={selecionado.url} alt={selecionado.nome} className="h-full w-full object-cover" />
            </div>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-text-muted">Origem</dt>
              <dd className="text-text-primary">{ATIVO_ORIGEM_LABEL[selecionado.origem]}</dd>
              <dt className="text-text-muted">Data</dt>
              <dd className="text-text-primary">{formatarData(selecionado.createdAt)}</dd>
              {selecionado.temaId && (
                <>
                  <dt className="text-text-muted">Tema</dt>
                  <dd className="text-text-primary">{temasPorId.get(selecionado.temaId)?.nome ?? '—'}</dd>
                </>
              )}
            </dl>
            {selecionado.criativoId && (
              <Button variant="secondary" onClick={() => navigate(`/criativos/${selecionado.criativoId}`)}>
                Ver criativo de origem
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
