import { callGemini } from '@/lib/ai/geminiClient'

export interface TextGenerationService {
  generateIdeia(input: { tema: string; contexto?: string }): Promise<{ titulo: string; resumo: string }>
  generateSlideText(input: { tema: string; contexto?: string; slideIndex: number }): Promise<string>
}

/**
 * Chama a Edge Function `gemini` (Fase 10 do PLANO_IMPLEMENTACAO.md) — texto
 * gerado via Gemini, com `contexto` opcional montado a partir das Referências
 * do Tema (ver src/lib/content/buildContexto.ts) pra ancorar o conteúdo no
 * material real em vez de inventar do zero.
 */
export const textGenerationService: TextGenerationService = {
  async generateIdeia({ tema, contexto }) {
    return callGemini<{ titulo: string; resumo: string }>('gerar-ideia', { tema, contexto })
  },
  async generateSlideText({ tema, contexto, slideIndex }) {
    const { texto } = await callGemini<{ texto: string }>('gerar-slide-texto', { tema, contexto, slideIndex })
    return texto
  },
}
