import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Plus, X, Minus } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Pill } from '@/components/ui/Pill'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { useDesignSystemsStore } from '@/features/designSystems/useDesignSystemsStore'
import { useTonsDeVozStore } from '@/features/tonsDeVoz/useTonsDeVozStore'
import { SLIDE_MIN, SLIDE_MAX, type CriativoFormato } from '@/types/criativo'

export interface NodePrincipalInput {
  titulo: string
  descricao: string
  linksReferencia: string[]
  referenciasTexto: string
  tomDeVozId?: string
  designSystemId?: string
  formato: CriativoFormato
  quantidadeSlides: number
}

interface NodePrincipalModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (input: NodePrincipalInput) => Promise<void>
}

/**
 * Node Principal: card de configuração global do carrossel — parâmetros que
 * a IA usa pra gerar todos os Sub-Nodes (slides) de uma vez. Reaproveita o
 * `Modal` padrão do design system (nada de estilo especial/gradiente aqui —
 * mesma superfície neutra usada em todo o resto do app).
 */
export function NodePrincipalModal({ open, onClose, onSubmit }: NodePrincipalModalProps) {
  const navigate = useNavigate()
  const { designSystems, loaded: designSystemsLoaded, load: loadDesignSystems } = useDesignSystemsStore()
  const { tonsDeVoz, loaded: tonsDeVozLoaded, load: loadTonsDeVoz } = useTonsDeVozStore()

  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [novoLink, setNovoLink] = useState('')
  const [linksReferencia, setLinksReferencia] = useState<string[]>([])
  const [referenciasTexto, setReferenciasTexto] = useState('')
  const [tomDeVozId, setTomDeVozId] = useState('')
  const [designSystemId, setDesignSystemId] = useState('')
  const [formato, setFormato] = useState<CriativoFormato>('4:5')
  const [quantidadeSlides, setQuantidadeSlides] = useState(5)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setTitulo('')
    setDescricao('')
    setNovoLink('')
    setLinksReferencia([])
    setReferenciasTexto('')
    setTomDeVozId('')
    setDesignSystemId('')
    setFormato('4:5')
    setQuantidadeSlides(5)
  }, [open])

  useEffect(() => {
    if (!open) return
    if (!designSystemsLoaded) loadDesignSystems()
    if (!tonsDeVozLoaded) loadTonsDeVoz()
  }, [open, designSystemsLoaded, loadDesignSystems, tonsDeVozLoaded, loadTonsDeVoz])

  function adicionarLink() {
    const link = novoLink.trim()
    if (!link) return
    setLinksReferencia((prev) => [...prev, link])
    setNovoLink('')
  }

  function removerLink(link: string) {
    setLinksReferencia((prev) => prev.filter((l) => l !== link))
  }

  async function handleSubmit() {
    if (!titulo.trim()) return
    setSaving(true)
    try {
      await onSubmit({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        linksReferencia,
        referenciasTexto: referenciasTexto.trim(),
        tomDeVozId: tomDeVozId || undefined,
        designSystemId: designSystemId || undefined,
        formato,
        quantidadeSlides,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Node Principal"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving || !titulo.trim()} className="flex-1">
            {saving ? 'Gerando...' : 'Gerar carrossel'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="-mt-2 flex items-center gap-2 text-text-secondary">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-primary">
            <Sparkles size={16} strokeWidth={2} />
          </span>
          <p className="text-xs">Configuração do carrossel</p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Título *</label>
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: 5 erros fatais no Instagram" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Descrição</label>
          <Textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={2}
            placeholder="Contexto geral da campanha..."
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Links de referência</label>
          <div className="flex gap-2">
            <Input
              value={novoLink}
              onChange={(e) => setNovoLink(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  adicionarLink()
                }
              }}
              placeholder="https://..."
              className="flex-1"
            />
            <Button variant="secondary" onClick={adicionarLink} disabled={!novoLink.trim()}>
              <Plus size={16} strokeWidth={2} />
            </Button>
          </div>
          {linksReferencia.length > 0 && (
            <ul className="mt-2 flex flex-col gap-1.5">
              {linksReferencia.map((link) => (
                <li
                  key={link}
                  className="flex items-center justify-between gap-2 rounded-md bg-bg-app px-3 py-2 text-xs text-text-secondary"
                >
                  <span className="truncate">{link}</span>
                  <IconButton label={`Remover ${link}`} onClick={() => removerLink(link)} className="h-6 w-6 shrink-0">
                    <X size={14} strokeWidth={2} />
                  </IconButton>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Referências em texto</label>
          <Textarea
            value={referenciasTexto}
            onChange={(e) => setReferenciasTexto(e.target.value)}
            rows={3}
            placeholder="Cole aqui trechos, notas ou contexto adicional..."
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-text-secondary">Tom de voz</label>
            <button type="button" onClick={() => navigate('/tons-de-voz')} className="text-xs text-accent-primary hover:underline">
              Gerenciar tons
            </button>
          </div>
          <Select value={tomDeVozId} onChange={(e) => setTomDeVozId(e.target.value)}>
            <option value="">Selecionar tom...</option>
            {tonsDeVoz.map((tom) => (
              <option key={tom.id} value={tom.id}>
                {tom.nome}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-text-secondary">Design System</label>
            <button type="button" onClick={() => navigate('/design-systems')} className="text-xs text-accent-primary hover:underline">
              Gerenciar Design Systems
            </button>
          </div>
          <Select value={designSystemId} onChange={(e) => setDesignSystemId(e.target.value)}>
            <option value="">Selecionar Design System...</option>
            {designSystems.map((ds) => (
              <option key={ds.id} value={ds.id}>
                {ds.titulo}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Formato</label>
          <div className="flex gap-2">
            <Pill active={formato === '4:5'} onClick={() => setFormato('4:5')}>
              4:5
            </Pill>
            <Pill active={formato === '1:1'} onClick={() => setFormato('1:1')}>
              1:1
            </Pill>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Quantidade de slides</label>
          <div className="flex items-center gap-3">
            <IconButton
              label="Diminuir quantidade de slides"
              className="border border-border-subtle bg-bg-app disabled:opacity-40"
              disabled={quantidadeSlides <= SLIDE_MIN}
              onClick={() => setQuantidadeSlides((q) => Math.max(SLIDE_MIN, q - 1))}
            >
              <Minus size={16} strokeWidth={2} />
            </IconButton>
            <span className="w-8 shrink-0 text-center text-lg font-semibold text-text-primary">{quantidadeSlides}</span>
            <IconButton
              label="Aumentar quantidade de slides"
              className="border border-border-subtle bg-bg-app disabled:opacity-40"
              disabled={quantidadeSlides >= SLIDE_MAX}
              onClick={() => setQuantidadeSlides((q) => Math.min(SLIDE_MAX, q + 1))}
            >
              <Plus size={16} strokeWidth={2} />
            </IconButton>
            <span className="text-xs text-text-muted">
              mín. {SLIDE_MIN}, máx. {SLIDE_MAX}
            </span>
          </div>
        </div>

        <p className="text-xs text-text-secondary">
          A IA gera o texto e a imagem de todos os slides automaticamente. Depois, dá pra ajustar cada slide
          individualmente no editor.
        </p>
      </div>
    </Modal>
  )
}
