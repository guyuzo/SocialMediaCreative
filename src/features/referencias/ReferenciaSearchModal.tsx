import { useEffect, useState } from 'react'
import { Search, Plus, Check } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Pill'
import { Spinner } from '@/components/ui/Spinner'
import { Card } from '@/components/ui/Card'
import { TemaIcon } from '@/features/temas/TemaIcon'
import { useReferenciasStore } from '@/features/referencias/useReferenciasStore'
import { useToastStore } from '@/lib/toast/useToastStore'
import { researchService, type ResearchResult } from '@/lib/ai/researchService'
import type { Tema } from '@/types/tema'

interface ReferenciaSearchModalProps {
  open: boolean
  onClose: () => void
  temas: Tema[]
}

export function ReferenciaSearchModal({ open, onClose, temas }: ReferenciaSearchModalProps) {
  const [temaId, setTemaId] = useState(temas[0]?.id ?? '')
  const [query, setQuery] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [resultados, setResultados] = useState<ResearchResult[]>([])
  const [adicionadas, setAdicionadas] = useState<Set<string>>(new Set())
  const { create } = useReferenciasStore()
  const showToast = useToastStore((state) => state.show)

  useEffect(() => {
    if (!open) return
    setTemaId(temas[0]?.id ?? '')
    setQuery('')
    setResultados([])
    setAdicionadas(new Set())
  }, [open, temas])

  const tema = temas.find((t) => t.id === temaId)

  async function handlePesquisar() {
    if (!tema) return
    setBuscando(true)
    setResultados([])
    try {
      const encontrados = await researchService.searchLinks({ tema: tema.nome, query: query.trim() || undefined })
      setResultados(encontrados)
      if (encontrados.length === 0) showToast('Nenhum resultado encontrado.')
    } catch {
      showToast('Falha ao pesquisar links.', 'error')
    } finally {
      setBuscando(false)
    }
  }

  async function handleAdicionar(resultado: ResearchResult) {
    if (!temaId) return
    try {
      await create({ temaId, tipo: 'link', titulo: resultado.titulo, url: resultado.url, conteudo: resultado.resumo })
      setAdicionadas((prev) => new Set(prev).add(resultado.url))
      showToast('Referência adicionada.', 'success')
    } catch {
      showToast('Falha ao adicionar referência.', 'error')
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Pesquisar com IA"
      footer={
        <Button variant="ghost" onClick={onClose}>
          Fechar
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Tema</label>
          <div className="flex flex-wrap gap-2">
            {temas.map((t) => (
              <Pill key={t.id} active={t.id === temaId} onClick={() => setTemaId(t.id)}>
                <TemaIcon tema={t} size="xs" />
                {t.nome}
              </Pill>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            Buscar por (opcional, padrão é o nome do Tema)
          </label>
          <div className="flex gap-2">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ex: tendências 2026" className="flex-1" />
            <Button onClick={handlePesquisar} disabled={buscando || !temaId}>
              {buscando ? <Spinner size={16} /> : <Search size={16} strokeWidth={2} />}
              Pesquisar
            </Button>
          </div>
        </div>

        {resultados.length > 0 && (
          <div className="flex flex-col gap-3">
            {resultados.map((resultado) => {
              const jaAdicionada = adicionadas.has(resultado.url)
              return (
                <Card key={resultado.url} padding="compact" className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-text-primary">{resultado.titulo}</p>
                      <a
                        href={resultado.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate text-xs text-text-muted hover:underline"
                      >
                        {resultado.url}
                      </a>
                    </div>
                    <Button
                      variant={jaAdicionada ? 'ghost' : 'secondary'}
                      className="shrink-0"
                      disabled={jaAdicionada}
                      onClick={() => handleAdicionar(resultado)}
                    >
                      {jaAdicionada ? <Check size={16} strokeWidth={2} /> : <Plus size={16} strokeWidth={2} />}
                      {jaAdicionada ? 'Adicionada' : 'Adicionar'}
                    </Button>
                  </div>
                  {resultado.resumo && <p className="line-clamp-3 text-sm text-text-secondary">{resultado.resumo}</p>}
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </Modal>
  )
}
