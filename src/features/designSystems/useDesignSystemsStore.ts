import { create } from 'zustand'
import { designSystemsRepository } from '@/features/designSystems/designSystemsRepository'
import type { DesignSystem } from '@/types/designSystem'

type DesignSystemInput = Pick<DesignSystem, 'titulo' | 'documentacaoMarkdown'>

interface DesignSystemsState {
  designSystems: DesignSystem[]
  loaded: boolean
  load: () => Promise<void>
  create: (input: DesignSystemInput) => Promise<DesignSystem>
  update: (id: string, patch: Partial<DesignSystemInput>) => Promise<void>
  remove: (id: string) => Promise<void>
}

/**
 * Store global de Design Systems — consumido pela tela `/design-systems`
 * (CRUD) e pelo Node Principal do canvas de Criativos (seletor).
 */
export const useDesignSystemsStore = create<DesignSystemsState>((set, get) => ({
  designSystems: [],
  loaded: false,

  async load() {
    const designSystems = await designSystemsRepository.list()
    set({ designSystems, loaded: true })
  },

  async create(input) {
    const now = new Date().toISOString()
    const designSystem: DesignSystem = {
      id: crypto.randomUUID(),
      ...input,
      isAtivo: true,
      createdAt: now,
      updatedAt: now,
    }
    await designSystemsRepository.create(designSystem)
    set({ designSystems: [...get().designSystems, designSystem] })
    return designSystem
  },

  async update(id, patch) {
    const updated = await designSystemsRepository.update(id, { ...patch, updatedAt: new Date().toISOString() })
    set({ designSystems: get().designSystems.map((ds) => (ds.id === id ? updated : ds)) })
  },

  async remove(id) {
    await designSystemsRepository.remove(id)
    set({ designSystems: get().designSystems.filter((ds) => ds.id !== id) })
  },
}))
