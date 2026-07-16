export type TarefaStatus = 'pendente' | 'em_andamento' | 'concluida'

export interface Tarefa {
  id: string
  titulo: string
  status: TarefaStatus
  /** Prazo (YYYY-MM-DD), opcional. */
  deadline?: string
  createdAt: string
  updatedAt: string
}

export const TAREFA_STATUS_LABEL: Record<TarefaStatus, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
}

const TAREFA_STATUS_ORDEM: TarefaStatus[] = ['pendente', 'em_andamento', 'concluida']

export function proximoStatusTarefa(status: TarefaStatus): TarefaStatus {
  const index = TAREFA_STATUS_ORDEM.indexOf(status)
  return TAREFA_STATUS_ORDEM[(index + 1) % TAREFA_STATUS_ORDEM.length]
}
