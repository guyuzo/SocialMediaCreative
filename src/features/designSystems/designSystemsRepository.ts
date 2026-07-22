import { createSupabaseRepository } from '@/lib/repository/supabaseRepository'
import type { DesignSystem } from '@/types/designSystem'

export const designSystemsRepository = createSupabaseRepository<DesignSystem>('design_systems')
