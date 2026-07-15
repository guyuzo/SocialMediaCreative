import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Pill'
import { Spinner } from '@/components/ui/Spinner'
import { textGenerationService } from '@/lib/ai/textService'
import type { Tema } from '@/types/tema'
import type { Ideia } from '@/types/ideia'

interface IdeiaFormModalProps {
  open: boolean
  onClose: () => void
  temas: Tema[]
  onSubmit: (input: { temaId: string; titulo: string; resumo: string }) => Promise<void>
  initialValue?: Ideia
}

export function IdeiaFormModal({ open, onClose, temas, onSubmit, initialValue }: IdeiaFormModalProps) {
  const [titulo, setTitulo] = useState('')
  const [resumo, setResumo] = useState('')
  const [temaId, setTemaId] = useState(temas[0]?.id ?? '')
  const [saving, setSaving] = useState(false)
  const [gerando, setGerando] = useState(false)

  useEffect(() => {
    if (!open) return
    setTitulo(initialValue?.titulo ?? '')
    setResumo(initialValue?.resumo ?? '')
    setTemaId(initialValue?.temaId ?? temas[0]?.id ?? '')
  }, [open, initialValue, temas])

  async function handleSubmit() {
    if (!titulo.trim() || !temaId) return
    setSaving(true)
    try {
      await onSubmit({ temaId, titulo: titulo.trim(), resumo: resumo.trim() })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  async function handleGerarComIA() {
    const tema = temas.find((t) => t.id === temaId)?.nome ?? 'Geral'
    setGerando(true)
    try {
      const texto = await textGenerationService.generateSlideText({
        tema,
        slideIndex: Math.floor(Math.random() * 5),
      })
      setResumo(texto)
      setTitulo(texto.split(' ').slice(0, 6).join(' '))
    } finally {
      setGerando(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialValue ? 'Editar ideia' : 'Nova ideia'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving || !titulo.trim() || !temaId}>
            {initialValue ? 'Salvar' : 'Criar ideia'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
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

        <div className="flex justify-end">
          <Button variant="secondary" onClick={handleGerarComIA} disabled={gerando || !temaId}>
            {gerando ? <Spinner size={16} /> : <Sparkles size={16} strokeWidth={2} />}
            Gerar com IA
          </Button>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Título</label>
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: 5 erros comuns em..." />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Resumo</label>
          <Textarea
            value={resumo}
            onChange={(e) => setResumo(e.target.value)}
            rows={4}
            placeholder="Do que se trata essa ideia..."
          />
        </div>
      </div>
    </Modal>
  )
}
