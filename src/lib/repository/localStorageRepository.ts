import type { Repository } from './types'

function readAll<T>(storageKey: string): T[] {
  const raw = localStorage.getItem(storageKey)
  return raw ? (JSON.parse(raw) as T[]) : []
}

function writeAll<T>(storageKey: string, items: T[]) {
  localStorage.setItem(storageKey, JSON.stringify(items))
}

/**
 * Implementação mock do Repository via localStorage (PLANO_IMPLEMENTACAO.md, Fase 0).
 * Serve só pra desenvolvimento sem backend — troca por uma implementação HTTP
 * na Fase 11 sem que nenhuma tela precise mudar, já que ambas seguem `Repository<T>`.
 */
export function createLocalStorageRepository<T extends { id: string }>(
  storageKey: string,
): Repository<T> {
  return {
    async list() {
      return readAll<T>(storageKey)
    },
    async get(id) {
      return readAll<T>(storageKey).find((item) => item.id === id)
    },
    async create(item) {
      const items = readAll<T>(storageKey)
      items.push(item)
      writeAll(storageKey, items)
      return item
    },
    async update(id, patch) {
      const items = readAll<T>(storageKey)
      const index = items.findIndex((item) => item.id === id)
      if (index === -1) throw new Error(`Item ${id} não encontrado em ${storageKey}`)
      items[index] = { ...items[index], ...patch }
      writeAll(storageKey, items)
      return items[index]
    },
    async remove(id) {
      writeAll(
        storageKey,
        readAll<T>(storageKey).filter((item) => item.id !== id),
      )
    },
  }
}
