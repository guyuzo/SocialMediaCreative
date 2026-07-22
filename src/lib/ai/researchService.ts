import { callGemini } from '@/lib/ai/geminiClient'

export interface ResearchResult {
  titulo: string
  url: string
  resumo: string
}

export interface ResearchService {
  searchLinks(input: { tema: string; query?: string }): Promise<ResearchResult[]>
}

/**
 * Chama a Edge Function `gemini` (action `pesquisar-links`), que usa a tool
 * `google_search` do Gemini — os links vêm do `groundingMetadata` real da
 * resposta (URLs verificáveis, não inventadas pelo modelo).
 */
export const researchService: ResearchService = {
  async searchLinks({ tema, query }) {
    const { resultados } = await callGemini<{ resultados: ResearchResult[] }>('pesquisar-links', { tema, query })
    return resultados
  },
}
