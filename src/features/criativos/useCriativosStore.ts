import { create } from 'zustand'
import { criativosRepository } from '@/features/criativos/criativosRepository'
import { criarSlideVazio, SLIDE_MIN, SLIDE_MAX } from '@/types/criativo'
import type { Criativo, CriativoFormato, CriativoStatus, Slide } from '@/types/criativo'

type CriativoInput = {
  temaId: string
  titulo: string
  formato: CriativoFormato
  ideiaId?: string
  designSystemId?: string
  tomDeVozId?: string
  linksReferencia?: string[]
  referenciasTexto?: string
}
type CriativoPatch = Partial<Pick<Criativo, 'titulo' | 'status' | 'formato' | 'ideiaId'>>

interface CriativosState {
  criativos: Criativo[]
  loaded: boolean
  load: () => Promise<void>
  create: (input: CriativoInput) => Promise<Criativo>
  update: (id: string, patch: CriativoPatch) => Promise<void>
  remove: (id: string) => Promise<void>
  duplicate: (id: string) => Promise<Criativo>
  updateSlide: (criativoId: string, slideId: string, patch: Partial<Slide>) => Promise<void>
  addSlide: (criativoId: string) => Promise<void>
  removeSlide: (criativoId: string, slideId: string) => Promise<void>
  moveSlide: (criativoId: string, slideId: string, direction: 'left' | 'right') => Promise<void>
  agendar: (id: string, dataPublicacao: string) => Promise<void>
  desagendar: (id: string) => Promise<void>
}

async function persist(criativo: Criativo) {
  const updated = { ...criativo, updatedAt: new Date().toISOString() }
  await criativosRepository.update(criativo.id, updated)
  return updated
}

/**
 * Store global de Criativos (Fase 4). Segue o mesmo padrão do useTemasStore:
 * repositório mockado hoje (localStorage), API real na Fase 11 sem tocar telas.
 */
export const useCriativosStore = create<CriativosState>((set, get) => ({
  criativos: [],
  loaded: false,

  async load() {
    const criativos = await criativosRepository.list()
    set({ criativos, loaded: true })
  },

  async create({ temaId, titulo, formato, ideiaId, designSystemId, tomDeVozId, linksReferencia, referenciasTexto }) {
    const now = new Date().toISOString()
    const criativo: Criativo = {
      id: crypto.randomUUID(),
      temaId,
      ideiaId,
      titulo,
      status: 'rascunho',
      formato,
      slides: Array.from({ length: SLIDE_MIN }, (_, index) => criarSlideVazio(index)),
      designSystemId,
      tomDeVozId,
      linksReferencia: linksReferencia ?? [],
      referenciasTexto: referenciasTexto ?? '',
      version: 1,
      createdAt: now,
      updatedAt: now,
    }
    await criativosRepository.create(criativo)
    set({ criativos: [...get().criativos, criativo] })
    return criativo
  },

  async update(id, patch) {
    const current = get().criativos.find((criativo) => criativo.id === id)
    if (!current) return
    const updated = await persist({ ...current, ...patch })
    set({ criativos: get().criativos.map((criativo) => (criativo.id === id ? updated : criativo)) })
  },

  async remove(id) {
    await criativosRepository.remove(id)
    set({ criativos: get().criativos.filter((criativo) => criativo.id !== id) })
  },

  async duplicate(id) {
    const original = get().criativos.find((criativo) => criativo.id === id)
    if (!original) throw new Error(`Criativo ${id} não encontrado`)
    const now = new Date().toISOString()
    const copy: Criativo = {
      ...original,
      id: crypto.randomUUID(),
      titulo: `${original.titulo} (cópia)`,
      status: 'rascunho',
      slides: original.slides.map((slide) => ({ ...slide, id: crypto.randomUUID() })),
      createdAt: now,
      updatedAt: now,
    }
    await criativosRepository.create(copy)
    set({ criativos: [...get().criativos, copy] })
    return copy
  },

  async updateSlide(criativoId, slideId, patch) {
    const current = get().criativos.find((criativo) => criativo.id === criativoId)
    if (!current) return
    const slides = current.slides.map((slide) => (slide.id === slideId ? { ...slide, ...patch } : slide))
    const updated = await persist({ ...current, slides })
    set({ criativos: get().criativos.map((criativo) => (criativo.id === criativoId ? updated : criativo)) })
  },

  async addSlide(criativoId) {
    const current = get().criativos.find((criativo) => criativo.id === criativoId)
    if (!current || current.slides.length >= SLIDE_MAX) return
    const slides = [...current.slides, criarSlideVazio(current.slides.length)]
    const updated = await persist({ ...current, slides })
    set({ criativos: get().criativos.map((criativo) => (criativo.id === criativoId ? updated : criativo)) })
  },

  async removeSlide(criativoId, slideId) {
    const current = get().criativos.find((criativo) => criativo.id === criativoId)
    if (!current || current.slides.length <= SLIDE_MIN) return
    const slides = current.slides
      .filter((slide) => slide.id !== slideId)
      .map((slide, index) => ({ ...slide, ordem: index }))
    const updated = await persist({ ...current, slides })
    set({ criativos: get().criativos.map((criativo) => (criativo.id === criativoId ? updated : criativo)) })
  },

  async moveSlide(criativoId, slideId, direction) {
    const current = get().criativos.find((criativo) => criativo.id === criativoId)
    if (!current) return
    const index = current.slides.findIndex((slide) => slide.id === slideId)
    const targetIndex = direction === 'left' ? index - 1 : index + 1
    if (index === -1 || targetIndex < 0 || targetIndex >= current.slides.length) return
    const slides = [...current.slides]
    ;[slides[index], slides[targetIndex]] = [slides[targetIndex], slides[index]]
    const reordered = slides.map((slide, i) => ({ ...slide, ordem: i }))
    const updated = await persist({ ...current, slides: reordered })
    set({ criativos: get().criativos.map((criativo) => (criativo.id === criativoId ? updated : criativo)) })
  },

  async agendar(id, dataPublicacao) {
    const current = get().criativos.find((criativo) => criativo.id === id)
    if (!current) return
    const updated = await persist({ ...current, dataPublicacao, status: 'agendado' })
    set({ criativos: get().criativos.map((criativo) => (criativo.id === id ? updated : criativo)) })
  },

  async desagendar(id) {
    const current = get().criativos.find((criativo) => criativo.id === id)
    if (!current) return
    const updated = await persist({
      ...current,
      dataPublicacao: undefined,
      status: current.status === 'agendado' ? 'pronto' : current.status,
    })
    set({ criativos: get().criativos.map((criativo) => (criativo.id === id ? updated : criativo)) })
  },
}))

export function proximoStatus(status: CriativoStatus): CriativoStatus | undefined {
  const ordem: CriativoStatus[] = ['rascunho', 'pronto', 'agendado', 'publicado']
  const index = ordem.indexOf(status)
  return ordem[index + 1]
}
