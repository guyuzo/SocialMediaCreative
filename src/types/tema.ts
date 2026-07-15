export const TEMA_CORES = [
  '#6C5CE7', // violet-500
  '#FF6B1A', // orange-500
  '#FF4D8D', // pink-500
  '#3B5BDB', // blue-500
  '#34C759', // green-500
  '#FF3B30', // red-500
  '#FFC93C', // yellow-500
] as const

export interface Tema {
  id: string
  nome: string
  cor: string
  descricao: string
  createdAt: string
  updatedAt: string
}
