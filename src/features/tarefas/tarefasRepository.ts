import { createSupabaseRepository } from '@/lib/repository/supabaseRepository'
import type { Tarefa } from '@/types/tarefa'

export const tarefasRepository = createSupabaseRepository<Tarefa>('tarefas')
