import { createLocalStorageRepository } from '@/lib/repository/localStorageRepository'
import type { Criativo } from '@/types/criativo'

export const criativosRepository = createLocalStorageRepository<Criativo>('social-creative:criativos')
