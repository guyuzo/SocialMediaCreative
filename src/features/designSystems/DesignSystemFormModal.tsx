import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import type { DesignSystem } from '@/types/designSystem'

interface DesignSystemFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (input: { titulo: string; documentacaoMarkdown: string }) => Promise<void>
  initialValue?: DesignSystem
}

/**
 * Sem campos de padding/cor/alinhamento separados, de propósito — o Design
 * System é só título + um markdown livre com toda a documentação visual
 * (capa, corpo, CTA), que a IA consulta como contexto na geração do
 * carrossel. Ver esquema-prisma.md.
 */
export function DesignSystemFormModal({ open, onClose, onSubmit, initialValue }: DesignSystemFormModalProps) {
  const [titulo, setTitulo] = useState('')
  const [documentacaoMarkdown, setDocumentacaoMarkdown] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setTitulo(initialValue?.titulo ?? '')
    setDocumentacaoMarkdown(initialValue?.documentacaoMarkdown ?? '')
  }, [open, initialValue])

  async function handleSubmit() {
    if (!titulo.trim()) return
    setSaving(true)
    try {
      await onSubmit({ titulo: titulo.trim(), documentacaoMarkdown: documentacaoMarkdown.trim() })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialValue ? 'Editar Design System' : 'Novo Design System'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving || !titulo.trim()}>
            {initialValue ? 'Salvar' : 'Criar Design System'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Título</label>
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Padrão Instagram 2026" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            Documentação (markdown — paddings, cores, alinhamento de capa, corpo e CTA)
          </label>
          <Textarea
            value={documentacaoMarkdown}
            onChange={(e) => setDocumentacaoMarkdown(e.target.value)}
            rows={14}
            className="font-mono text-xs"
            placeholder={'## Capa\n- padding: 48px\n- cor de fundo: #...\n- alinhamento: centro\n\n## Corpo\n...\n\n## CTA\n...'}
          />
        </div>
      </div>
    </Modal>
  )
}
