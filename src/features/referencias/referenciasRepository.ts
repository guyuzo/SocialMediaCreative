import { createSupabaseRepository } from '@/lib/repository/supabaseRepository'
import type { Referencia } from '@/types/referencia'

export const referenciasRepository = createSupabaseRepository<Referencia>('referencias')
