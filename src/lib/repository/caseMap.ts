const READONLY_KEYS = new Set(['createdAt', 'updatedAt'])

function camelToSnake(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

function snakeToCamel(key: string): string {
  return key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
}

/**
 * Item completo (create) → linha para insert. created_at/updated_at ficam
 * de fora: o banco controla os dois (default now() / trigger set_updated_at).
 */
export function toInsertRow<T extends { id: string }>(item: T): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(item)) {
    if (READONLY_KEYS.has(key)) continue
    row[camelToSnake(key)] = value === undefined ? null : value
  }
  return row
}

/**
 * Patch parcial (update) → linha parcial. Uma chave presente no patch com
 * valor `undefined` vira `null` explícito (limpa o campo no banco) — não
 * depende de `JSON.stringify` silenciosamente descartar a chave, que é o
 * que fazia o campo "sumir" no localStorage sem realmente virar NULL.
 */
export function toPatchRow<T>(patch: Partial<T>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(patch as object)) {
    if (READONLY_KEYS.has(key)) continue
    row[camelToSnake(key)] = value === undefined ? null : value
  }
  return row
}

export function fromRow<T>(row: Record<string, unknown>): T {
  const obj: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(row)) {
    obj[snakeToCamel(key)] = value === null ? undefined : value
  }
  return obj as T
}
