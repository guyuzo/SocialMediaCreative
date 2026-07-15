import { create } from 'zustand'
import { ideiasRepository } from '@/features/ideias/ideiasRepository'
import type { Ideia } from '@/types/ideia'

type IdeiaInput = Pick<Ideia, 'temaId' | 'titulo' | 'resumo'>
type IdeiaPatch = Partial<Pick<Ideia, 'temaId' | 'titulo' | 'resumo'>>

interface IdeiasState {
  ideias: Ideia[]
  loaded: boolean
  load: () => Promise<void>
  create: (input: IdeiaInput) => Promise<Ideia>
  update: (id: string, patch: IdeiaPatch) => Promise<void>
  remove: (id: string) => Promise<void>
  marcarPromovida: (id: string) => Promise<void>
}

/**
 * Store global de Ideias (Fase 5). "Promover para Criativo" mora na tela
 * (IdeiasPage), que cria o Criativo via useCriativosStore e só chama
 * marcarPromovida aqui para manter o histórico da Ideia de origem.
 */
export const useIdeiasStore = create<IdeiasState>((set, get) => ({
  ideias: [],
  loaded: false,

  async load() {
    const ideias = await ideiasRepository.list()
    set({ ideias, loaded: true })
  },

  async create(input) {
    const now = new Date().toISOString()
    const ideia: Ideia = {
      id: crypto.randomUUID(),
      ...input,
      promovida: false,
      createdAt: now,
      updatedAt: now,
    }
    await ideiasRepository.create(ideia)
    set({ ideias: [...get().ideias, ideia] })
    return ideia
  },

  async update(id, patch) {
    const updated = await ideiasRepository.update(id, { ...patch, updatedAt: new Date().toISOString() })
    set({ ideias: get().ideias.map((ideia) => (ideia.id === id ? updated : ideia)) })
  },

  async remove(id) {
    await ideiasRepository.remove(id)
    set({ ideias: get().ideias.filter((ideia) => ideia.id !== id) })
  },

  async marcarPromovida(id) {
    const updated = await ideiasRepository.update(id, { promovida: true, updatedAt: new Date().toISOString() })
    set({ ideias: get().ideias.map((ideia) => (ideia.id === id ? updated : ideia)) })
  },
}))
