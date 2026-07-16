import { createSupabaseRepository } from '@/lib/repository/supabaseRepository'
import type { Tema } from '@/types/tema'

export const temasRepository = createSupabaseRepository<Tema>('temas')
