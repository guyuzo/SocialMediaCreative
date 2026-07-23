import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import type { TomDeVoz } from '@/types/tomDeVoz'

interface TomDeVozFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (input: { nome: string; descricao: string; exemploFrase: string }) => Promise<void>
  initialValue?: TomDeVoz
}

export function TomDeVozFormModal({ open, onClose, onSubmit, initialValue }: TomDeVozFormModalProps) {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [exemploFrase, setExemploFrase] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setNome(initialValue?.nome ?? '')
    setDescricao(initialValue?.descricao ?? '')
    setExemploFrase(initialValue?.exemploFrase ?? '')
  }, [open, initialValue])

  async function handleSubmit() {
    if (!nome.trim()) return
    setSaving(true)
    try {
      await onSubmit({ nome: nome.trim(), descricao: descricao.trim(), exemploFrase: exemploFrase.trim() })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialValue ? 'Editar tom de voz' : 'Novo tom de voz'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving || !nome.trim()}>
            {initialValue ? 'Salvar' : 'Criar tom de voz'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Nome</label>
          <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Direto e provocador" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Descrição</label>
          <Textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            placeholder="Como esse tom de voz deve soar — vocabulário, ritmo, atitude..."
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Exemplo de frase</label>
          <Textarea
            value={exemploFrase}
            onChange={(e) => setExemploFrase(e.target.value)}
            rows={2}
            placeholder="Uma frase que ilustre esse tom na prática..."
          />
        </div>
      </div>
    </Modal>
  )
}
