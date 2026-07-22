import { callGemini } from '@/lib/ai/geminiClient'

export interface UrlExtractionService {
  extract(url: string): Promise<{ titulo: string; conteudo: string }>
}

/**
 * Chama a Edge Function `gemini` (action `extrair-url`), que usa a tool
 * `url_context` do Gemini pra ler a página de verdade no servidor e devolver
 * um resumo real do conteúdo.
 */
export const urlExtractionService: UrlExtractionService = {
  async extract(url) {
    return callGemini<{ titulo: string; conteudo: string }>('extrair-url', { url })
  },
}
