import { create } from 'zustand'
import { tarefasRepository } from '@/features/tarefas/tarefasRepository'
import { proximoStatusTarefa } from '@/types/tarefa'
import type { Tarefa, TarefaStatus } from '@/types/tarefa'

interface TarefasState {
  tarefas: Tarefa[]
  loaded: boolean
  load: () => Promise<void>
  create: (titulo: string, deadline?: string) => Promise<Tarefa>
  rename: (id: string, titulo: string) => Promise<void>
  setDeadline: (id: string, deadline: string | undefined) => Promise<void>
  cicloStatus: (id: string) => Promise<void>
  remove: (id: string) => Promise<void>
}

async function persist(id: string, patch: Partial<Tarefa>) {
  return tarefasRepository.update(id, { ...patch, updatedAt: new Date().toISOString() })
}

export const useTarefasStore = create<TarefasState>((set, get) => ({
  tarefas: [],
  loaded: false,

  async load() {
    const tarefas = await tarefasRepository.list()
    set({ tarefas, loaded: true })
  },

  async create(titulo, deadline) {
    const now = new Date().toISOString()
    const tarefa: Tarefa = {
      id: crypto.randomUUID(),
      titulo,
      status: 'pendente',
      deadline,
      createdAt: now,
      updatedAt: now,
    }
    await tarefasRepository.create(tarefa)
    set({ tarefas: [...get().tarefas, tarefa] })
    return tarefa
  },

  async rename(id, titulo) {
    const updated = await persist(id, { titulo })
    set({ tarefas: get().tarefas.map((tarefa) => (tarefa.id === id ? updated : tarefa)) })
  },

  async setDeadline(id, deadline) {
    const updated = await persist(id, { deadline })
    set({ tarefas: get().tarefas.map((tarefa) => (tarefa.id === id ? updated : tarefa)) })
  },

  async cicloStatus(id) {
    const current = get().tarefas.find((tarefa) => tarefa.id === id)
    if (!current) return
    const updated = await persist(id, { status: proximoStatusTarefa(current.status) })
    set({ tarefas: get().tarefas.map((tarefa) => (tarefa.id === id ? updated : tarefa)) })
  },

  async remove(id) {
    await tarefasRepository.remove(id)
    set({ tarefas: get().tarefas.filter((tarefa) => tarefa.id !== id) })
  },
}))

export type { TarefaStatus }
