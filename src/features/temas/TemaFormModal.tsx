import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { ColorPicker } from '@/features/temas/ColorPicker'
import { TEMA_CORES, type Tema } from '@/types/tema'

interface TemaFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (input: { nome: string; cor: string; descricao: string }) => Promise<void>
  initialValue?: Tema
}

export function TemaFormModal({ open, onClose, onSubmit, initialValue }: TemaFormModalProps) {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [cor, setCor] = useState<string>(TEMA_CORES[0])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setNome(initialValue?.nome ?? '')
    setDescricao(initialValue?.descricao ?? '')
    setCor(initialValue?.cor ?? TEMA_CORES[0])
  }, [open, initialValue])

  async function handleSubmit() {
    if (!nome.trim()) return
    setSaving(true)
    try {
      await onSubmit({ nome: nome.trim(), cor, descricao: descricao.trim() })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialValue ? 'Editar tema' : 'Novo tema'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving || !nome.trim()}>
            {initialValue ? 'Salvar' : 'Criar tema'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Nome</label>
          <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Produtividade" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            Descrição (contexto que a IA vai usar)
          </label>
          <Textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            placeholder="Sobre o que é esse tema..."
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Cor</label>
          <ColorPicker value={cor} onChange={setCor} />
        </div>
      </div>
    </Modal>
  )
}
