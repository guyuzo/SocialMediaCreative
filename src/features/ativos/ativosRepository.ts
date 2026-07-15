import { createLocalStorageRepository } from '@/lib/repository/localStorageRepository'
import type { Ativo } from '@/types/ativo'

export const ativosRepository = createLocalStorageRepository<Ativo>('social-creative:ativos')
