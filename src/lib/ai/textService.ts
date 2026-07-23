import { callGemini } from '@/lib/ai/geminiClient'
import type { CriativoFormato, SlideTipo } from '@/types/criativo'

export interface GerarCarrosselInput {
  titulo: string
  descricao?: string
  contexto?: string
  tomDeVoz?: { nome: string; descricao?: string; exemploFrase?: string }
  designSystemMarkdown?: string
  formato: CriativoFormato
  quantidadeSlides: number
}

export interface TextGenerationService {
  generateIdeia(input: { tema: string; contexto?: string }): Promise<{ titulo: string; resumo: string }>
  generateSlideText(input: { tema: string; contexto?: string; slideIndex: number }): Promise<string>
  generateCarrossel(input: GerarCarrosselInput): Promise<{ tipo: SlideTipo; texto: string }[]>
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
  async generateCarrossel({ titulo, descricao, contexto, tomDeVoz, designSystemMarkdown, formato, quantidadeSlides }) {
    const { slides } = await callGemini<{ slides: { tipo: SlideTipo; texto: string }[] }>('gerar-carrossel', {
      titulo,
      descricao,
      contexto,
      tomDeVozNome: tomDeVoz?.nome,
      tomDeVozDescricao: tomDeVoz?.descricao,
      tomDeVozExemplo: tomDeVoz?.exemploFrase,
      designSystemMarkdown,
      formato,
      quantidadeSlides,
    })
    return slides
  },
}
