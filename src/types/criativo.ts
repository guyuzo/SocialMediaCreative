export type SlideStatus = 'vazio' | 'gerando' | 'gerado' | 'editado' | 'erro'

export interface Slide {
  id: string
  ordem: number
  texto: string
  imagemUrl?: string
  promptTexto?: string
  promptImagem?: string
  status: SlideStatus
}

export type CriativoStatus = 'rascunho' | 'pronto' | 'agendado' | 'publicado'

export type CriativoFormato = '4:5' | '1:1'

export interface Criativo {
  id: string
  temaId: string
  ideiaId?: string
  titulo: string
  status: CriativoStatus
  formato: CriativoFormato
  slides: Slide[]
  createdAt: string
  updatedAt: string
}

export const CRIATIVO_STATUS_LABEL: Record<CriativoStatus, string> = {
  rascunho: 'Rascunho',
  pronto: 'Pronto',
  agendado: 'Agendado',
  publicado: 'Publicado',
}

export const SLIDE_MIN = 3
export const SLIDE_MAX = 10

export function criarSlideVazio(ordem: number): Slide {
  return { id: crypto.randomUUID(), ordem, texto: '', status: 'vazio' }
}
