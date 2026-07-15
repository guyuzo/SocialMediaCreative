import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Pill'
import type { Tema } from '@/types/tema'
import type { CriativoFormato } from '@/types/criativo'

interface NovoCriativoModalProps {
  open: boolean
  onClose: () => void
  temas: Tema[]
  onSubmit: (input: { temaId: string; titulo: string; formato: CriativoFormato }) => Promise<void>
}

export function NovoCriativoModal({ open, onClose, temas, onSubmit }: NovoCriativoModalProps) {
  const [titulo, setTitulo] = useState('')
  const [temaId, setTemaId] = useState(temas[0]?.id ?? '')
  const [formato, setFormato] = useState<CriativoFormato>('4:5')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setTitulo('')
    setTemaId(temas[0]?.id ?? '')
    setFormato('4:5')
  }, [open, temas])

  async function handleSubmit() {
    if (!titulo.trim() || !temaId) return
    setSaving(true)
    try {
      await onSubmit({ temaId, titulo: titulo.trim(), formato })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Novo criativo"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving || !titulo.trim() || !temaId}>
            Criar criativo
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Título</label>
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Carrossel de lançamento" />
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
      </div>
    </Modal>
  )
}
