export type SlideStatus = 'vazio' | 'gerando' | 'gerado' | 'editado' | 'erro'

/** Tipo do Sub-Node: define quais campos de texto o slide usa (arquitetura de nodes). */
export type SlideTipo = 'cover' | 'body' | 'cta'

/** Origem da imagem atual do slide (arquitetura de nodes). */
export type SlideImageSource = 'none' | 'uploaded' | 'generated'

export interface Slide {
  id: string
  ordem: number
  texto: string
  imagemUrl?: string
  promptTexto?: string
  promptImagem?: string
  status: SlideStatus
  /** Tipo do Sub-Node. `undefined` em slides antigos, criados antes da arquitetura de nodes. */
  tipo?: SlideTipo
  // Campos estruturados por tipo — cover usa tagText/headline/subheadline,
  // body usa headline/texto (parágrafo), cta usa ctaMessage.
  tagText?: string
  headline?: string
  subheadline?: string
  ctaMessage?: string
  // Cópia do texto gerado originalmente, preservada pro botão "Reset".
  originalTexto?: string
  originalTagText?: string
  originalHeadline?: string
  originalSubheadline?: string
  originalCtaMessage?: string
  imageSource: SlideImageSource
  isTextoEditado: boolean
  isImagemEditada: boolean
  regenerarTextoCount: number
  regenerarImagemCount: number
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
  /** Data de publicação planejada (YYYY-MM-DD), definida na Agenda (Fase 8). */
  dataPublicacao?: string
  /** Design System (Node Principal) consultado na geração do carrossel. */
  designSystemId?: string
  /** Tom de voz (Node Principal) usado na geração do carrossel. */
  tomDeVozId?: string
  /** Links de referência colados no Node Principal. */
  linksReferencia: string[]
  /** Texto de referência/contexto adicional do Node Principal. */
  referenciasTexto: string
  /** Versão do carrossel — nova geração completa cria uma nova versão, não sobrescreve. */
  version: number
  /** Criativo anterior desta cadeia de versões (não destrutivo). */
  parentCriativoId?: string
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
  return {
    id: crypto.randomUUID(),
    ordem,
    texto: '',
    status: 'vazio',
    imageSource: 'none',
    isTextoEditado: false,
    isImagemEditada: false,
    regenerarTextoCount: 0,
    regenerarImagemCount: 0,
  }
}
