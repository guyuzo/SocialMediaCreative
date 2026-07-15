export type AtivoOrigem = 'gerado' | 'upload'

export interface Ativo {
  id: string
  origem: AtivoOrigem
  url: string
  nome: string
  temaId?: string
  criativoId?: string
  createdAt: string
}

export const ATIVO_ORIGEM_LABEL: Record<AtivoOrigem, string> = {
  gerado: 'Gerado por IA',
  upload: 'Enviado manualmente',
}
