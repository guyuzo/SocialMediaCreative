import { createSupabaseRepository } from '@/lib/repository/supabaseRepository'
import type { TomDeVoz } from '@/types/tomDeVoz'

export const tonsDeVozRepository = createSupabaseRepository<TomDeVoz>('tons_de_voz')
