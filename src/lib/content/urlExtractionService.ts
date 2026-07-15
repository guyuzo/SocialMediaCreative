export interface UrlExtractionService {
  extract(url: string): Promise<{ titulo: string; conteudo: string }>
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

/**
 * Mock da Fase 6 (PLANO_IMPLEMENTACAO.md) — extração real de conteúdo é
 * trabalho de backend (scraping), tratado na Fase 10/12. Aqui só simula o
 * delay e devolve um resumo genérico baseado no domínio da URL.
 */
export const urlExtractionService: UrlExtractionService = {
  async extract(url) {
    await new Promise((resolve) => setTimeout(resolve, 900 + Math.random() * 600))
    const host = hostnameOf(url)
    return {
      titulo: `Conteúdo de ${host}`,
      conteudo: `Resumo extraído automaticamente de ${url}. Este é um conteúdo de exemplo — a extração real do texto da página entra na Fase 10/12 do plano.`,
    }
  },
}
