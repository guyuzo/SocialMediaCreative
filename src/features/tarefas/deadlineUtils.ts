import { toISODateOnly } from '@/features/agenda/dateUtils'
import type { TarefaStatus } from '@/types/tarefa'

function parseDateOnly(value: string): Date {
  const [ano, mes, dia] = value.split('-').map(Number)
  return new Date(ano, mes - 1, dia)
}

export function diasRestantes(deadline: string): number {
  const hoje = parseDateOnly(toISODateOnly(new Date()))
  const alvo = parseDateOnly(deadline)
  const diffMs = alvo.getTime() - hoje.getTime()
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

export interface PrazoInfo {
  texto: string
  className: string
}

export function classificarPrazo(deadline: string | undefined, status: TarefaStatus): PrazoInfo {
  if (!deadline) return { texto: 'Sem prazo', className: 'text-text-muted' }

  const dias = diasRestantes(deadline)
  const dataFormatada = parseDateOnly(deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

  if (status === 'concluida') {
    return { texto: `Concluída · prazo era ${dataFormatada}`, className: 'text-text-muted' }
  }
  if (dias < 0) {
    return { texto: `Atrasada há ${Math.abs(dias)} dia(s) · ${dataFormatada}`, className: 'font-medium text-danger' }
  }
  if (dias === 0) {
    return { texto: `Vence hoje · ${dataFormatada}`, className: 'font-medium text-danger' }
  }
  if (dias <= 7) {
    return { texto: `Vence em ${dias} dia(s) · ${dataFormatada}`, className: 'font-medium text-orange-500' }
  }
  return { texto: `Vence em ${dias} dias · ${dataFormatada}`, className: 'text-text-secondary' }
}
