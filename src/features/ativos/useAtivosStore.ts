import { create } from 'zustand'
import { ativosRepository } from '@/features/ativos/ativosRepository'
import type { Ativo } from '@/types/ativo'

type AtivoInput = Pick<Ativo, 'origem' | 'url' | 'nome' | 'temaId' | 'criativoId'>

interface AtivosState {
  ativos: Ativo[]
  loaded: boolean
  load: () => Promise<void>
  create: (input: AtivoInput) => Promise<Ativo>
  remove: (id: string) => Promise<void>
}

/**
 * Store global de Ativos (Fase 7). Imagens geradas em Criativos caem aqui
 * automaticamente (ver CriativoEditorPage.gerarImagem); upload manual usa o
 * mesmo `create`.
 */
export const useAtivosStore = create<AtivosState>((set, get) => ({
  ativos: [],
  loaded: false,

  async load() {
    const ativos = await ativosRepository.list()
    set({ ativos, loaded: true })
  },

  async create(input) {
    const ativo: Ativo = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: new Date().toISOString(),
    }
    await ativosRepository.create(ativo)
    set({ ativos: [...get().ativos, ativo] })
    return ativo
  },

  async remove(id) {
    await ativosRepository.remove(id)
    set({ ativos: get().ativos.filter((ativo) => ativo.id !== id) })
  },
}))
