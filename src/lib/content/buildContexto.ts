import type { Referencia } from '@/types/referencia'

/**
 * Monta o texto de contexto usado pra ancorar a geração de IA (Ideias e texto
 * de Slide) no material real já salvo em Referências do Tema — em vez de
 * gerar do zero. `undefined` quando o Tema ainda não tem nenhuma Referência,
 * mantendo o comportamento de gerar só a partir do nome do Tema.
 */
export function buildContextoFromReferencias(
  referencias: Referencia[],
  temaId: string,
  maxChars = 4000,
): string | undefined {
  const doTema = referencias.filter((r) => r.temaId === temaId && r.conteudo.trim())
  if (doTema.length === 0) return undefined

  const texto = doTema.map((r) => `${r.titulo}: ${r.conteudo}`).join('\n\n')
  return texto.length > maxChars ? `${texto.slice(0, maxChars)}...` : texto
}
