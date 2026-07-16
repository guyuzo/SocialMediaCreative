import { X } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Pill'
import { TemaIcon } from '@/features/temas/TemaIcon'
import { toISODateOnly } from '@/features/agenda/dateUtils'
import type { Criativo } from '@/types/criativo'
import type { Tema } from '@/types/tema'

interface AgendarDiaModalProps {
  open: boolean
  onClose: () => void
  dia: Date
  criativos: Criativo[]
  temasPorId: Map<string, Tema>
  onAgendar: (criativoId: string) => void
  onDesagendar: (criativoId: string) => void
}

export function AgendarDiaModal({
  open,
  onClose,
  dia,
  criativos,
  temasPorId,
  onAgendar,
  onDesagendar,
}: AgendarDiaModalProps) {
  const diaISO = toISODateOnly(dia)
  const agendados = criativos.filter((criativo) => criativo.dataPublicacao === diaISO)
  const elegiveis = criativos.filter(
    (criativo) =>
      criativo.dataPublicacao !== diaISO &&
      (criativo.status === 'pronto' || criativo.status === 'agendado'),
  )

  const titulo = dia.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <Modal open={open} onClose={onClose} title={titulo} footer={<Button onClick={onClose}>Fechar</Button>}>
      <div className="flex flex-col gap-5">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-text-secondary">Agendados para este dia</h3>
          {agendados.length === 0 ? (
            <p className="text-sm text-text-muted">Nenhum criativo agendado ainda.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {agendados.map((criativo) => (
                <li key={criativo.id} className="flex items-center justify-between gap-2 rounded-md border border-border-subtle px-3 py-2">
                  <span className="flex items-center gap-2 text-sm text-text-primary">
                    <TemaIcon tema={temasPorId.get(criativo.temaId)} size="xs" />
                    {criativo.titulo}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remover ${criativo.titulo} deste dia`}
                    onClick={() => onDesagendar(criativo.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-accent-soft hover:text-danger"
                  >
                    <X size={16} strokeWidth={2} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-text-secondary">Agendar um criativo pronto</h3>
          {elegiveis.length === 0 ? (
            <p className="text-sm text-text-muted">
              Nenhum criativo pronto disponível. Marque um criativo como "Pronto" no editor primeiro.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {elegiveis.map((criativo) => (
                <Pill key={criativo.id} onClick={() => onAgendar(criativo.id)}>
                  <TemaIcon tema={temasPorId.get(criativo.temaId)} size="xs" />
                  {criativo.titulo}
                </Pill>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
