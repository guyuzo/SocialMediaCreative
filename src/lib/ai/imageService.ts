import type { CriativoFormato } from '@/types/criativo'

export interface ImageGenerationService {
  generateSlideImage(input: { prompt: string; formato: CriativoFormato }): Promise<{ url: string }>
}

/**
 * Gera uma URL de imagem real via Picsum Photos (banco de fotos gratuito,
 * sem necessidade de chave de API), com seed determinística — o mesmo
 * `seed` sempre devolve a mesma foto, útil pra dados de exemplo estáveis.
 */
export function generateMockImageUrl(seed: string, formato: CriativoFormato): string {
  const [w, h] = formato === '4:5' ? [400, 500] : [500, 500]
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`
}

/**
 * Mock da Fase 4 (PLANO_IMPLEMENTACAO.md) — usa Picsum Photos pra simular
 * imagens reais durante o desenvolvimento, sem chamada de rede a nenhuma
 * IA ainda. Trocado pela chamada real ao Gemini/Nano Banana via backend na
 * Fase 10, sem alterar a assinatura da interface.
 */
export const imageGenerationService: ImageGenerationService = {
  async generateSlideImage({ prompt, formato }) {
    await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 800))
    return { url: generateMockImageUrl(prompt, formato) }
  },
}
