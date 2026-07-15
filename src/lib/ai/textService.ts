export interface TextGenerationService {
  generateSlideText(input: { tema: string; contexto?: string; slideIndex: number }): Promise<string>
}

const PLACEHOLDERS = [
  'Descubra como transformar sua rotina com pequenas mudanças que fazem grande diferença.',
  'Você sabia que esse detalhe pode ser o que está faltando na sua estratégia?',
  'Separamos os pontos principais para você aplicar ainda hoje.',
  'O resultado surpreende: veja o antes e depois de quem já testou.',
  'Guarde esse post — ele vai te ajudar na próxima decisão importante.',
]

/**
 * Mock da Fase 4 (PLANO_IMPLEMENTACAO.md) — trocado pela chamada real à API
 * Claude via backend na Fase 10, sem alterar a assinatura da interface.
 */
export const textGenerationService: TextGenerationService = {
  async generateSlideText({ tema, slideIndex }) {
    await new Promise((resolve) => setTimeout(resolve, 900 + Math.random() * 600))
    const base = PLACEHOLDERS[slideIndex % PLACEHOLDERS.length]
    return `[${tema}] ${base}`
  },
}
