import { create } from 'zustand'
import { temasRepository } from '@/features/temas/temasRepository'
import type { Tema } from '@/types/tema'

type TemaInput = Pick<Tema, 'nome' | 'cor' | 'descricao'>

interface TemasState {
  temas: Tema[]
  loaded: boolean
  load: () => Promise<void>
  create: (input: TemaInput) => Promise<Tema>
  update: (id: string, patch: Partial<TemaInput>) => Promise<void>
  remove: (id: string) => Promise<void>
}

/**
 * Store global de Temas — outros módulos (Ideias, Referências, Criativos)
 * consomem `useTemasStore` diretamente para popular seletores de tema,
 * sem duplicar a lógica de acesso a dados.
 */
export const useTemasStore = create<TemasState>((set, get) => ({
  temas: [],
  loaded: false,

  async load() {
    const temas = await temasRepository.list()
    set({ temas, loaded: true })
  },

  async create(input) {
    const now = new Date().toISOString()
    const tema: Tema = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now,
    }
    await temasRepository.create(tema)
    set({ temas: [...get().temas, tema] })
    return tema
  },

  async update(id, patch) {
    const updated = await temasRepository.update(id, { ...patch, updatedAt: new Date().toISOString() })
    set({ temas: get().temas.map((tema) => (tema.id === id ? updated : tema)) })
  },

  async remove(id) {
    await temasRepository.remove(id)
    set({ temas: get().temas.filter((tema) => tema.id !== id) })
  },
}))
