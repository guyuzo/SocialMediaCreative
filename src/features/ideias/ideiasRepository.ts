import { createLocalStorageRepository } from '@/lib/repository/localStorageRepository'
import type { Ideia } from '@/types/ideia'

export const ideiasRepository = createLocalStorageRepository<Ideia>('social-creative:ideias')
