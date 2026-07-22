/**
 * Design System de um carrossel: título + documentação em markdown (padding,
 * cores, alinhamento de capa/corpo/CTA). Sem campos de estilo separados de
 * propósito — a IA consulta `documentacaoMarkdown` como contexto na hora de
 * gerar o carrossel (Node Principal). Ver esquema-prisma.md.
 */
export interface DesignSystem {
  id: string
  titulo: string
  documentacaoMarkdown: string
  isAtivo: boolean
  createdAt: string
  updatedAt: string
}
