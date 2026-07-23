import { callGemini } from '@/lib/ai/geminiClient'
import type { CriativoFormato, SlideTipo } from '@/types/criativo'

export interface GenerateSlideImageInput {
  formato: CriativoFormato
  tipo?: SlideTipo
  tagText?: string
  headline?: string
  subheadline?: string
  ctaMessage?: string
  texto?: string
  designSystemMarkdown?: string
}

export interface ImageGenerationService {
  generateSlideImage(input: GenerateSlideImageInput): Promise<{ url: string }>
}

/**
 * Chama a Edge Function `gemini` (action `gerar-imagem-slide`, modelo
 * gemini-3.1-flash-image / "Nano Banana 2") — a imagem já nasce com o texto
 * do slide renderizado nela (não é overlay separado), seguindo a
 * documentação do Design System quando houver. A function salva o resultado
 * no Storage (`carousel-images`) e devolve a URL pública.
 */
export const imageGenerationService: ImageGenerationService = {
  async generateSlideImage(input) {
    return callGemini<{ url: string }>('gerar-imagem-slide', { ...input })
  },
}
