import type { TarefaStatus } from '@/types/tarefa'

export const TAREFA_STATUS_BADGE_CLASSES: Record<TarefaStatus, string> = {
  pendente: 'bg-gray-200 text-gray-600',
  em_andamento: 'bg-orange-500/10 text-orange-500',
  concluida: 'bg-green-500/10 text-green-500',
}
