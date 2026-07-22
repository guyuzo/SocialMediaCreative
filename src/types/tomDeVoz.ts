/**
 * Tom de voz reutilizável, selecionado no Node Principal e usado como
 * instrução na geração de texto do carrossel. Ver esquema-prisma.md.
 */
export interface TomDeVoz {
  id: string
  nome: string
  descricao: string
  exemploFrase: string
  createdAt: string
  updatedAt: string
}
