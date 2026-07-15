import { createLocalStorageRepository } from '@/lib/repository/localStorageRepository'
import type { Referencia } from '@/types/referencia'

export const referenciasRepository = createLocalStorageRepository<Referencia>('social-creative:referencias')
