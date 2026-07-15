import type { CriativoFormato } from '@/types/criativo'

export interface ImageGenerationService {
  generateSlideImage(input: { prompt: string; formato: CriativoFormato }): Promise<{ url: string }>
}

const PLACEHOLDER_COLORS = ['#6C5CE7', '#FF6B1A', '#FF4D8D', '#3B5BDB', '#34C759']

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

function placeholderSvg(prompt: string, formato: CriativoFormato): string {
  const [w, h] = formato === '4:5' ? [400, 500] : [500, 500]
  const color = PLACEHOLDER_COLORS[hashString(prompt) % PLACEHOLDER_COLORS.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="100%" height="100%" fill="${color}" />
    <text x="50%" y="50%" fill="white" font-family="sans-serif" font-size="20" text-anchor="middle" dominant-baseline="middle">Imagem gerada</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/**
 * Mock da Fase 4 (PLANO_IMPLEMENTACAO.md) — gera um placeholder local (sem
 * chamada de rede) e é trocado pela chamada real ao Gemini/Nano Banana via
 * backend na Fase 10, sem alterar a assinatura da interface.
 */
export const imageGenerationService: ImageGenerationService = {
  async generateSlideImage({ prompt, formato }) {
    await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 800))
    return { url: placeholderSvg(prompt, formato) }
  },
}
