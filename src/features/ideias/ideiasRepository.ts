import { createSupabaseRepository } from '@/lib/repository/supabaseRepository'
import type { Ideia } from '@/types/ideia'

export const ideiasRepository = createSupabaseRepository<Ideia>('ideias')
