import { supabase } from '@/lib/supabase/client'
import { toInsertRow, toPatchRow, fromRow } from '@/lib/repository/caseMap'
import type { Repository } from '@/lib/repository/types'
import type { Database } from '@/types/supabase'

type TableName = keyof Database['public']['Tables'] & string

/**
 * Repositório genérico contra o Supabase, mesma interface `Repository<T>`
 * do mock de localStorage (ver PLANO_IMPLEMENTACAO.md, Fase 11) — troca de
 * implementação sem tocar em nenhuma store/tela. Usado por Temas, Ideias,
 * Referências e Tarefas; Criativos tem repositório próprio (ver
 * src/features/criativos/criativosRepository.ts) por causa dos Slides.
 */
export function createSupabaseRepository<T extends { id: string }>(table: TableName): Repository<T> {
  return {
    async list() {
      const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: true })
      if (error) throw error
      return (data ?? []).map((row) => fromRow<T>(row))
    },
    async get(id) {
      const { data, error } = await supabase.from(table).select('*').eq('id', id).maybeSingle()
      if (error) throw error
      return data ? fromRow<T>(data) : undefined
    },
    async create(item) {
      // `table` é genérico entre 4 entidades diferentes, então o postgrest-js
      // não consegue inferir o shape exato da linha de insert aqui — só o
      // nome da tabela é checado em tempo de compilação (via `TableName`),
      // não o formato da linha. Tradeoff aceito (ver esquema-prisma.md).
      const { data, error } = await supabase
        .from(table)
        .insert(toInsertRow(item) as never)
        .select('*')
        .single()
      if (error) throw error
      return fromRow<T>(data)
    },
    async update(id, patch) {
      const { data, error } = await supabase
        .from(table)
        .update(toPatchRow(patch) as never)
        .eq('id', id)
        .select('*')
        .single()
      if (error) throw error
      return fromRow<T>(data)
    },
    async remove(id) {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
    },
  }
}
