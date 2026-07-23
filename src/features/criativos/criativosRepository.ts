import { supabase } from '@/lib/supabase/client'
import { fromRow } from '@/lib/repository/caseMap'
import type { Repository } from '@/lib/repository/types'
import type { Criativo, Slide } from '@/types/criativo'

const SELECT = '*, slides(*)'

interface CriativoRow {
  slides: Record<string, unknown>[]
  [key: string]: unknown
}

function rowToCriativo(row: CriativoRow): Criativo {
  const { slides, ...criativoRow } = row
  const base = fromRow<Omit<Criativo, 'slides'>>(criativoRow)
  return {
    ...base,
    slides: [...slides]
      .sort((a, b) => (a.ordem as number) - (b.ordem as number))
      .map((s) => fromRow<Slide>(s)),
  }
}

function toRpcArgs(criativo: Criativo) {
  return {
    p_criativo: {
      id: criativo.id,
      temaId: criativo.temaId ?? null,
      ideiaId: criativo.ideiaId ?? null,
      titulo: criativo.titulo,
      descricao: criativo.descricao,
      status: criativo.status,
      formato: criativo.formato,
      dataPublicacao: criativo.dataPublicacao ?? null,
      designSystemId: criativo.designSystemId ?? null,
      tomDeVozId: criativo.tomDeVozId ?? null,
      linksReferencia: criativo.linksReferencia,
      referenciasTexto: criativo.referenciasTexto,
      version: criativo.version,
      parentCriativoId: criativo.parentCriativoId ?? null,
    },
    p_slides: criativo.slides.map((s) => ({
      id: s.id,
      ordem: s.ordem,
      texto: s.texto,
      imagemUrl: s.imagemUrl ?? null,
      promptTexto: s.promptTexto ?? null,
      promptImagem: s.promptImagem ?? null,
      status: s.status,
      tipo: s.tipo ?? null,
      tagText: s.tagText ?? null,
      headline: s.headline ?? null,
      subheadline: s.subheadline ?? null,
      ctaMessage: s.ctaMessage ?? null,
      originalTexto: s.originalTexto ?? null,
      originalTagText: s.originalTagText ?? null,
      originalHeadline: s.originalHeadline ?? null,
      originalSubheadline: s.originalSubheadline ?? null,
      originalCtaMessage: s.originalCtaMessage ?? null,
      imageSource: s.imageSource,
      isTextoEditado: s.isTextoEditado,
      isImagemEditada: s.isImagemEditada,
      regenerarTextoCount: s.regenerarTextoCount,
      regenerarImagemCount: s.regenerarImagemCount,
    })),
  }
}

async function fetchOne(id: string): Promise<Criativo | undefined> {
  const { data, error } = await supabase
    .from('criativos')
    .select(SELECT)
    .eq('id', id)
    .order('ordem', { referencedTable: 'slides' })
    .maybeSingle()
  if (error) throw error
  return data ? rowToCriativo(data as unknown as CriativoRow) : undefined
}

/**
 * Repositório de Criativos: sob medida, não usa createSupabaseRepository,
 * porque `slides` é uma relação 1:N (tabela `slides`) que a UI ainda
 * consome como array embutido (`Criativo.slides: Slide[]`). `create`/
 * `update` chamam a RPC transacional `save_criativo` (ver
 * supabase/schemas/04_criativos_slides.sql), que recebe o Criativo +
 * TODOS os seus Slides de uma vez — o mesmo padrão que
 * `useCriativosStore.ts` já usa internamente (a função `persist()` sempre
 * manda o objeto inteiro). Zero mudança de store necessária.
 */
export const criativosRepository: Repository<Criativo> = {
  async list() {
    const { data, error } = await supabase
      .from('criativos')
      .select(SELECT)
      .order('created_at', { ascending: true })
      .order('ordem', { referencedTable: 'slides' })
    if (error) throw error
    return (data ?? []).map((row) => rowToCriativo(row as unknown as CriativoRow))
  },

  async get(id) {
    return fetchOne(id)
  },

  async create(item) {
    const { error } = await supabase.rpc('save_criativo', toRpcArgs(item))
    if (error) throw error
    const saved = await fetchOne(item.id)
    if (!saved) throw new Error(`Criativo ${item.id} não encontrado após criação`)
    return saved
  },

  async update(id, patch) {
    const current = await fetchOne(id)
    if (!current) throw new Error(`Criativo ${id} não encontrado`)
    // mesma semântica de shallow-merge que o repositório mock já tinha
    const merged: Criativo = { ...current, ...patch }
    const { error } = await supabase.rpc('save_criativo', toRpcArgs(merged))
    if (error) throw error
    const saved = await fetchOne(id)
    if (!saved) throw new Error(`Criativo ${id} não encontrado após atualização`)
    return saved
  },

  async remove(id) {
    const { error } = await supabase.from('criativos').delete().eq('id', id)
    if (error) throw error
  },
}
