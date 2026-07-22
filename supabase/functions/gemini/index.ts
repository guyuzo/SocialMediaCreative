// Edge Function única que fala com a API do Gemini (texto, pesquisa de links via
// Google Search grounding e extração de URL via url_context) em nome do frontend.
// A GEMINI_API_KEY nunca sai daqui — o browser só conhece a anon key do Supabase
// (já usada por `supabase.functions.invoke`, que exige um JWT válido pra chamar).

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
// gemini-2.5-flash não está mais disponível para chaves novas (confirmado em
// teste direto contra a API: 404 "no longer available to new users").
const MODEL = 'gemini-3-flash-preview'
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

interface GeminiPart {
  text?: string
}
interface GeminiCandidate {
  content?: { parts?: GeminiPart[] }
  groundingMetadata?: {
    groundingChunks?: { web?: { uri?: string; title?: string } }[]
    groundingSupports?: { segment?: { text?: string }; groundingChunkIndices?: number[] }[]
  }
}
interface GeminiResponse {
  candidates?: GeminiCandidate[]
}

async function callGemini(body: Record<string, unknown>): Promise<GeminiCandidate> {
  const res = await fetch(`${API_BASE}/${MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Gemini API respondeu ${res.status}: ${errText}`)
  }
  const data = (await res.json()) as GeminiResponse
  const candidate = data.candidates?.[0]
  if (!candidate) throw new Error('Gemini não retornou nenhum candidate.')
  return candidate
}

function textOf(candidate: GeminiCandidate): string {
  const text = candidate.content?.parts?.map((p) => p.text ?? '').join('') ?? ''
  if (!text.trim()) throw new Error('Gemini retornou resposta vazia.')
  return text
}

function parseJsonText<T>(text: string): T {
  const semFences = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '')
  try {
    return JSON.parse(semFences) as T
  } catch {
    throw new Error(`Resposta do Gemini não é JSON válido: ${semFences.slice(0, 200)}`)
  }
}

// --- actions ---

interface GerarIdeiaInput { tema: string; contexto?: string }
async function gerarIdeia({ tema, contexto }: GerarIdeiaInput) {
  const prompt = [
    `Gere uma ideia de post para redes sociais sobre o tema "${tema}".`,
    contexto ? `Use como base o material de referência abaixo (não invente fatos fora dele quando possível):\n${contexto}` : null,
    'Responda em português do Brasil.',
  ].filter(Boolean).join('\n\n')

  const candidate = await callGemini({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: { titulo: { type: 'STRING' }, resumo: { type: 'STRING' } },
        required: ['titulo', 'resumo'],
      },
    },
  })
  return parseJsonText<{ titulo: string; resumo: string }>(textOf(candidate))
}

interface GerarSlideTextoInput { tema: string; contexto?: string; slideIndex: number }
async function gerarSlideTexto({ tema, contexto, slideIndex }: GerarSlideTextoInput) {
  const prompt = [
    `Escreva o texto do slide ${slideIndex + 1} de um carrossel de post para redes sociais sobre "${tema}".`,
    contexto ? `Baseie o conteúdo no material de referência abaixo:\n${contexto}` : null,
    'Seja direto, no máximo 2-3 frases curtas, sem markdown. Responda em português do Brasil.',
  ].filter(Boolean).join('\n\n')

  const candidate = await callGemini({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: { type: 'OBJECT', properties: { texto: { type: 'STRING' } }, required: ['texto'] },
    },
  })
  return parseJsonText<{ texto: string }>(textOf(candidate))
}

interface ExtrairUrlInput { url: string }
async function extrairUrl({ url }: ExtrairUrlInput) {
  const prompt = [
    `Leia o conteúdo da página em ${url}.`,
    'Responda APENAS com um JSON no formato {"titulo": string, "conteudo": string}, sem markdown/crases.',
    '"titulo" é o título da página/matéria. "conteudo" é um resumo do conteúdo principal, em português do Brasil, até ~500 palavras.',
  ].join('\n')

  const candidate = await callGemini({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    tools: [{ urlContext: {} }],
  })
  return parseJsonText<{ titulo: string; conteudo: string }>(textOf(candidate))
}

interface PesquisarLinksInput { tema: string; query?: string }
async function pesquisarLinks({ tema, query }: PesquisarLinksInput) {
  const prompt = [
    `Pesquise material relevante e atual sobre "${tema}"${query ? ` com foco em: ${query}` : ''}.`,
    'Cite as fontes que encontrar e resuma o que cada uma traz de relevante. Responda em português do Brasil.',
  ].join(' ')

  const candidate = await callGemini({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    tools: [{ googleSearch: {} }],
  })

  const chunks = candidate.groundingMetadata?.groundingChunks ?? []
  const supports = candidate.groundingMetadata?.groundingSupports ?? []

  const resultados = chunks
    .map((chunk, index) => {
      const uri = chunk.web?.uri
      if (!uri) return null
      const trechos = supports
        .filter((s) => s.groundingChunkIndices?.includes(index))
        .map((s) => s.segment?.text ?? '')
        .filter(Boolean)
      return {
        titulo: chunk.web?.title ?? uri,
        url: uri,
        resumo: trechos.length > 0 ? trechos.join(' ') : (chunk.web?.title ?? ''),
      }
    })
    .filter((r): r is { titulo: string; url: string; resumo: string } => r !== null)

  return { resultados }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS })

  try {
    if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY não configurada no projeto Supabase.')

    const { action, ...input } = await req.json()

    switch (action) {
      case 'gerar-ideia':
        return json(await gerarIdeia(input as GerarIdeiaInput))
      case 'gerar-slide-texto':
        return json(await gerarSlideTexto(input as GerarSlideTextoInput))
      case 'extrair-url':
        return json(await extrairUrl(input as ExtrairUrlInput))
      case 'pesquisar-links':
        return json(await pesquisarLinks(input as PesquisarLinksInput))
      default:
        return json({ error: `Ação desconhecida: ${action}` }, 400)
    }
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : String(err) }, 500)
  }
})
