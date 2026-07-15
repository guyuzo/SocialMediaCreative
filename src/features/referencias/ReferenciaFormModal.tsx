import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Pill'
import { Spinner } from '@/components/ui/Spinner'
import { urlExtractionService } from '@/lib/content/urlExtractionService'
import { REFERENCIA_TIPO_LABEL, type Referencia, type ReferenciaTipo } from '@/types/referencia'
import type { Tema } from '@/types/tema'

const TIPOS: ReferenciaTipo[] = ['link', 'site', 'anotacao']

interface ReferenciaFormModalProps {
  open: boolean
  onClose: () => void
  temas: Tema[]
  onSubmit: (input: { temaId: string; tipo: ReferenciaTipo; titulo: string; url?: string; conteudo: string }) => Promise<void>
  initialValue?: Referencia
}

export function ReferenciaFormModal({ open, onClose, temas, onSubmit, initialValue }: ReferenciaFormModalProps) {
  const [tipo, setTipo] = useState<ReferenciaTipo>('link')
  const [temaId, setTemaId] = useState(temas[0]?.id ?? '')
  const [titulo, setTitulo] = useState('')
  const [url, setUrl] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [saving, setSaving] = useState(false)
  const [extraindo, setExtraindo] = useState(false)

  useEffect(() => {
    if (!open) return
    setTipo(initialValue?.tipo ?? 'link')
    setTemaId(initialValue?.temaId ?? temas[0]?.id ?? '')
    setTitulo(initialValue?.titulo ?? '')
    setUrl(initialValue?.url ?? '')
    setConteudo(initialValue?.conteudo ?? '')
  }, [open, initialValue, temas])

  async function handleExtrair() {
    if (!url.trim()) return
    setExtraindo(true)
    try {
      const resultado = await urlExtractionService.extract(url.trim())
      setTitulo(resultado.titulo)
      setConteudo(resultado.conteudo)
    } finally {
      setExtraindo(false)
    }
  }

  async function handleSubmit() {
    if (!titulo.trim() || !temaId) return
    setSaving(true)
    try {
      await onSubmit({
        temaId,
        tipo,
        titulo: titulo.trim(),
        url: tipo === 'anotacao' ? undefined : url.trim() || undefined,
        conteudo: conteudo.trim(),
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
      title={initialValue ? 'Editar referência' : 'Nova referência'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving || !titulo.trim() || !temaId}>
            {initialValue ? 'Salvar' : 'Criar referência'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Tipo</label>
          <div className="flex flex-wrap gap-2">
            {TIPOS.map((t) => (
              <Pill key={t} active={tipo === t} onClick={() => setTipo(t)}>
                {REFERENCIA_TIPO_LABEL[t]}
              </Pill>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Tema</label>
          <div className="flex flex-wrap gap-2">
            {temas.map((tema) => (
              <Pill key={tema.id} active={tema.id === temaId} onClick={() => setTemaId(tema.id)}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tema.cor }} aria-hidden />
                {tema.nome}
              </Pill>
            ))}
          </div>
        </div>

        {(tipo === 'link' || tipo === 'site') && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">URL</label>
            <div className="flex gap-2">
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="flex-1" />
              {tipo === 'link' && (
                <Button variant="secondary" onClick={handleExtrair} disabled={extraindo || !url.trim()}>
                  {extraindo ? <Spinner size={16} /> : <Download size={16} strokeWidth={2} />}
                  Extrair
                </Button>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            {tipo === 'site' ? 'Nome do site' : 'Título'}
          </label>
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Blog de referência" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            {tipo === 'anotacao' ? 'Anotação' : 'Conteúdo / observações'}
          </label>
          <Textarea
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            rows={4}
            placeholder={tipo === 'anotacao' ? 'Escreva sua anotação livre...' : 'Conteúdo extraído ou observações...'}
          />
        </div>
      </div>
    </Modal>
  )
}
