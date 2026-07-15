import type { CriativoStatus } from '@/types/criativo'

export const STATUS_BADGE_CLASSES: Record<CriativoStatus, string> = {
  rascunho: 'bg-gray-200 text-gray-600',
  pronto: 'bg-accent-soft text-accent-primary',
  agendado: 'bg-blue-500/10 text-blue-500',
  publicado: 'bg-green-500/10 text-green-500',
}
