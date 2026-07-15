import { create } from 'zustand'
import { referenciasRepository } from '@/features/referencias/referenciasRepository'
import type { Referencia } from '@/types/referencia'

type ReferenciaInput = Pick<Referencia, 'temaId' | 'tipo' | 'titulo' | 'url' | 'conteudo'>
type ReferenciaPatch = Partial<ReferenciaInput>

interface ReferenciasState {
  referencias: Referencia[]
  loaded: boolean
  load: () => Promise<void>
  create: (input: ReferenciaInput) => Promise<Referencia>
  update: (id: string, patch: ReferenciaPatch) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const useReferenciasStore = create<ReferenciasState>((set, get) => ({
  referencias: [],
  loaded: false,

  async load() {
    const referencias = await referenciasRepository.list()
    set({ referencias, loaded: true })
  },

  async create(input) {
    const now = new Date().toISOString()
    const referencia: Referencia = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now,
    }
    await referenciasRepository.create(referencia)
    set({ referencias: [...get().referencias, referencia] })
    return referencia
  },

  async update(id, patch) {
    const updated = await referenciasRepository.update(id, { ...patch, updatedAt: new Date().toISOString() })
    set({ referencias: get().referencias.map((referencia) => (referencia.id === id ? updated : referencia)) })
  },

  async remove(id) {
    await referenciasRepository.remove(id)
    set({ referencias: get().referencias.filter((referencia) => referencia.id !== id) })
  },
}))
