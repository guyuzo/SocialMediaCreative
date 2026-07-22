import { create } from 'zustand'
import { tonsDeVozRepository } from '@/features/tonsDeVoz/tonsDeVozRepository'
import type { TomDeVoz } from '@/types/tomDeVoz'

type TomDeVozInput = Pick<TomDeVoz, 'nome' | 'descricao' | 'exemploFrase'>

interface TonsDeVozState {
  tonsDeVoz: TomDeVoz[]
  loaded: boolean
  load: () => Promise<void>
  create: (input: TomDeVozInput) => Promise<TomDeVoz>
  update: (id: string, patch: Partial<TomDeVozInput>) => Promise<void>
  remove: (id: string) => Promise<void>
}

/** Store global de Tons de Voz — consumido pelo Node Principal do canvas de Criativos (seletor). */
export const useTonsDeVozStore = create<TonsDeVozState>((set, get) => ({
  tonsDeVoz: [],
  loaded: false,

  async load() {
    const tonsDeVoz = await tonsDeVozRepository.list()
    set({ tonsDeVoz, loaded: true })
  },

  async create(input) {
    const now = new Date().toISOString()
    const tomDeVoz: TomDeVoz = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now,
    }
    await tonsDeVozRepository.create(tomDeVoz)
    set({ tonsDeVoz: [...get().tonsDeVoz, tomDeVoz] })
    return tomDeVoz
  },

  async update(id, patch) {
    const updated = await tonsDeVozRepository.update(id, { ...patch, updatedAt: new Date().toISOString() })
    set({ tonsDeVoz: get().tonsDeVoz.map((t) => (t.id === id ? updated : t)) })
  },

  async remove(id) {
    await tonsDeVozRepository.remove(id)
    set({ tonsDeVoz: get().tonsDeVoz.filter((t) => t.id !== id) })
  },
}))
