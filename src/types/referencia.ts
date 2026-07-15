export type ReferenciaTipo = 'link' | 'site' | 'anotacao'

export interface Referencia {
  id: string
  temaId: string
  tipo: ReferenciaTipo
  titulo: string
  url?: string
  conteudo: string
  createdAt: string
  updatedAt: string
}

export const REFERENCIA_TIPO_LABEL: Record<ReferenciaTipo, string> = {
  link: 'Link',
  site: 'Site recorrente',
  anotacao: 'Anotação',
}
