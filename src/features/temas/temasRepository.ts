import { createLocalStorageRepository } from '@/lib/repository/localStorageRepository'
import type { Tema } from '@/types/tema'

export const temasRepository = createLocalStorageRepository<Tema>('social-creative:temas')
