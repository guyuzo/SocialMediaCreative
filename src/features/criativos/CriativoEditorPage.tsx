import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, Copy, Download, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Tabs } from '@/components/ui/Tabs'
import { Spinner } from '@/components/ui/Spinner'
import { useCriativosStore, proximoStatus } from '@/features/criativos/useCriativosStore'
import { useTemasStore } from '@/features/temas/useTemasStore'
import { useReferenciasStore } from '@/features/referencias/useReferenciasStore'
import { useDesignSystemsStore } from '@/features/designSystems/useDesignSystemsStore'
import { useTonsDeVozStore } from '@/features/tonsDeVoz/useTonsDeVozStore'
import { SlideEditor } from '@/features/criativos/SlideEditor'
import { STATUS_BADGE_CLASSES } from '@/features/criativos/statusStyles'
import { textGenerationService } from '@/lib/ai/textService'
import { imageGenerationService } from '@/lib/ai/imageService'
import { buildContextoFromReferencias } from '@/lib/content/buildContexto'
import { useToastStore } from '@/lib/toast/useToastStore'
import { CRIATIVO_STATUS_LABEL, SLIDE_MAX, SLIDE_MIN, type SlideTipo } from '@/types/criativo'

export function CriativoEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    criativos,
    loaded,
    load,
    update,
    remove,
    duplicate,
    updateSlide,
    updateSlides,
    addSlide,
    removeSlide,
    moveSlide,
  } = useCriativosStore()
  const { temas, loaded: temasLoaded, load: loadTemas } = useTemasStore()
  const { referencias, loaded: referenciasLoaded, load: loadReferencias } = useReferenciasStore()
  const { designSystems, loaded: designSystemsLoaded, load: loadDesignSystems } = useDesignSystemsStore()
  const { tonsDeVoz, loaded: tonsDeVozLoaded, load: loadTonsDeVoz } = useTonsDeVozStore()
  const showToast = useToastStore((state) => state.show)

  const [slideAtivo, setSlideAtivo] = useState<string | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [gerandoCarrossel, setGerandoCarrossel] = useState(false)
  const autoGerarDisparado = useRef(false)

  useEffect(() => {
    if (!loaded) load()
    if (!temasLoaded) loadTemas()
    if (!referenciasLoaded) loadReferencias()
    if (!designSystemsLoaded) loadDesignSystems()
    if (!tonsDeVozLoaded) loadTonsDeVoz()
  }, [
    loaded,
    load,
    temasLoaded,
    loadTemas,
    referenciasLoaded,
    loadReferencias,
    designSystemsLoaded,
    loadDesignSystems,
    tonsDeVozLoaded,
    loadTonsDeVoz,
  ])

  const criativo = criativos.find((item) => item.id === id)
  const tema = useMemo(() => temas.find((t) => t.id === criativo?.temaId), [temas, criativo])
  const designSystem = useMemo(
    () => designSystems.find((ds) => ds.id === criativo?.designSystemId),
    [designSystems, criativo],
  )

  useEffect(() => {
    if (criativo && (!slideAtivo || !criativo.slides.some((slide) => slide.id === slideAtivo))) {
      setSlideAtivo(criativo.slides[0]?.id ?? null)
    }
  }, [criativo, slideAtivo])

  useEffect(() => {
    if (!criativo || autoGerarDisparado.current) return
    if (!(location.state as { autoGerar?: boolean } | null)?.autoGerar) return
    autoGerarDisparado.current = true
    navigate(location.pathname, { replace: true, state: {} })
    gerarCarrosselCompleto()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criativo])

  if (loaded && !criativo) {
    return (
      <Card>
        <p className="text-sm text-text-secondary">Criativo não encontrado.</p>
        <Button className="mt-4" onClick={() => navigate('/criativos')}>
          Voltar para Criativos
        </Button>
      </Card>
    )
  }

  if (!criativo) return null

  const slide = criativo.slides.find((s) => s.id === slideAtivo)
  const avancar = proximoStatus(criativo.status)

  async function gerarTexto() {
    if (!slide) return
    await updateSlide(criativo!.id, slide.id, { status: 'gerando' })
    try {
      const contextoTema = buildContextoFromReferencias(referencias, criativo!.temaId)
      const contexto = [criativo!.referenciasTexto, contextoTema].filter((parte) => parte?.trim()).join('\n\n') || undefined
      const texto = await textGenerationService.generateSlideText({
        tema: tema?.nome ?? 'Geral',
        contexto,
        slideIndex: slide.ordem,
      })
      await updateSlide(criativo!.id, slide.id, { texto, status: 'gerado', promptTexto: tema?.nome })
    } catch {
      await updateSlide(criativo!.id, slide.id, { status: 'erro' })
      showToast('Falha ao gerar texto do slide.', 'error')
    }
  }

  async function gerarImagem() {
    if (!slide) return
    await updateSlide(criativo!.id, slide.id, { status: 'gerando' })
    try {
      const { url } = await imageGenerationService.generateSlideImage({
        formato: criativo!.formato,
        tipo: slide.tipo,
        tagText: slide.tagText,
        headline: slide.headline,
        subheadline: slide.subheadline,
        ctaMessage: slide.ctaMessage,
        texto: slide.texto,
        designSystemMarkdown: designSystem?.documentacaoMarkdown,
      })
      await updateSlide(criativo!.id, slide.id, {
        imagemUrl: url,
        status: 'gerado',
        promptImagem: slide.headline || slide.texto || tema?.nome || 'criativo',
        imageSource: 'generated',
      })
    } catch {
      await updateSlide(criativo!.id, slide.id, { status: 'erro' })
      showToast('Falha ao gerar imagem do slide.', 'error')
    }
  }

  /**
   * Dispara a geração automática de texto + imagem de todos os slides de uma
   * vez, a partir do contexto do Node Principal — a IA já entrega o carrossel
   * pronto; os botões "Gerar novamente" por slide ficam só pra ajustes pontuais.
   */
  async function gerarCarrosselCompleto() {
    if (!criativo) return
    setGerandoCarrossel(true)
    try {
      await updateSlides(
        criativo.id,
        criativo.slides.map((s) => ({ slideId: s.id, patch: { status: 'gerando' } })),
      )

      const contextoTema = buildContextoFromReferencias(referencias, criativo.temaId)
      const contexto = [criativo.referenciasTexto, contextoTema].filter((parte) => parte?.trim()).join('\n\n') || undefined
      const tom = tonsDeVoz.find((t) => t.id === criativo.tomDeVozId)

      let conteudos: { tipo: SlideTipo; texto: string }[]
      try {
        conteudos = await textGenerationService.generateCarrossel({
          titulo: criativo.titulo,
          descricao: criativo.descricao,
          contexto,
          tomDeVoz: tom ? { nome: tom.nome, descricao: tom.descricao, exemploFrase: tom.exemploFrase } : undefined,
          designSystemMarkdown: designSystem?.documentacaoMarkdown,
          formato: criativo.formato,
          quantidadeSlides: criativo.slides.length,
        })
      } catch {
        await updateSlides(
          criativo.id,
          criativo.slides.map((s) => ({ slideId: s.id, patch: { status: 'erro' } })),
        )
        showToast('Falha ao gerar o texto do carrossel.', 'error')
        return
      }

      await updateSlides(
        criativo.id,
        criativo.slides.map((s, index) => {
          const conteudo = conteudos[index]
          return {
            slideId: s.id,
            patch: conteudo
              ? { texto: conteudo.texto, tipo: conteudo.tipo, originalTexto: conteudo.texto, status: 'gerando' as const }
              : { status: 'gerando' as const },
          }
        }),
      )

      for (const s of criativo.slides) {
        const conteudo = conteudos[s.ordem]
        const texto = conteudo?.texto ?? s.texto
        try {
          const { url } = await imageGenerationService.generateSlideImage({
            formato: criativo.formato,
            tipo: conteudo?.tipo ?? s.tipo,
            texto,
            designSystemMarkdown: designSystem?.documentacaoMarkdown,
          })
          await updateSlide(criativo.id, s.id, {
            imagemUrl: url,
            status: 'gerado',
            imageSource: 'generated',
            promptImagem: texto,
          })
        } catch {
          await updateSlide(criativo.id, s.id, { status: 'erro' })
          showToast(`Falha ao gerar imagem do slide ${s.ordem + 1}.`, 'error')
        }
      }
    } finally {
      setGerandoCarrossel(false)
    }
  }

  function exportarImagens() {
    const comImagem = criativo!.slides.filter((s) => s.imagemUrl)
    if (comImagem.length === 0) {
      showToast('Nenhuma imagem gerada ainda para exportar.')
      return
    }
    comImagem.forEach((s, index) => {
      const extensao = s.imagemUrl!.split('.').pop()?.split(/[?#]/)[0]
      const link = document.createElement('a')
      link.href = s.imagemUrl!
      link.download = `${criativo!.titulo}-slide-${index + 1}.${extensao && extensao.length <= 4 ? extensao : 'png'}`
      link.click()
    })
    showToast('Download iniciado.', 'success')
  }

  async function handleDuplicate() {
    const copia = await duplicate(criativo!.id)
    showToast('Criativo duplicado.', 'success')
    navigate(`/criativos/${copia.id}`)
  }

  async function handleDelete() {
    await remove(criativo!.id)
    setDeleteOpen(false)
    navigate('/criativos')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <IconButton label="Voltar" onClick={() => navigate('/criativos')}>
          <ArrowLeft size={18} strokeWidth={2} />
        </IconButton>
        <Input
          value={criativo.titulo}
          onChange={(e) => update(criativo.id, { titulo: e.target.value })}
          className="max-w-sm font-semibold"
        />
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE_CLASSES[criativo.status]}`}>
          {CRIATIVO_STATUS_LABEL[criativo.status]}
        </span>
      </div>

      {gerandoCarrossel && (
        <div className="flex items-center gap-2 rounded-md bg-accent-soft px-3 py-2 text-sm text-accent-primary">
          <Spinner size={16} />
          Gerando o carrossel com IA ({criativo.slides.filter((s) => s.status === 'gerado').length}/
          {criativo.slides.length} slides prontos)...
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {avancar && (
          <Button variant="secondary" onClick={() => update(criativo.id, { status: avancar })}>
            Avançar para {CRIATIVO_STATUS_LABEL[avancar]}
          </Button>
        )}
        <Button variant="ghost" onClick={handleDuplicate}>
          <Copy size={16} strokeWidth={2} />
          Duplicar
        </Button>
        <Button variant="ghost" onClick={exportarImagens}>
          <Download size={16} strokeWidth={2} />
          Exportar imagens
        </Button>
        <Button variant="danger" onClick={() => setDeleteOpen(true)}>
          <Trash2 size={16} strokeWidth={2} />
          Excluir
        </Button>
      </div>

      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <Tabs
            tabs={criativo.slides.map((s, index) => ({ id: s.id, label: `Slide ${index + 1}` }))}
            value={slideAtivo ?? ''}
            onChange={setSlideAtivo}
          />
          <div className="flex shrink-0 gap-1">
            <IconButton
              label="Mover slide para a esquerda"
              disabled={gerandoCarrossel || !slide || slide.ordem === 0}
              onClick={() => slide && moveSlide(criativo.id, slide.id, 'left')}
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </IconButton>
            <IconButton
              label="Mover slide para a direita"
              disabled={gerandoCarrossel || !slide || slide.ordem === criativo.slides.length - 1}
              onClick={() => slide && moveSlide(criativo.id, slide.id, 'right')}
            >
              <ChevronRight size={16} strokeWidth={2} />
            </IconButton>
            <IconButton
              label="Remover slide"
              disabled={gerandoCarrossel || criativo.slides.length <= SLIDE_MIN}
              onClick={() => slide && removeSlide(criativo.id, slide.id)}
            >
              <Trash2 size={16} strokeWidth={2} />
            </IconButton>
            <IconButton
              label="Adicionar slide"
              disabled={gerandoCarrossel || criativo.slides.length >= SLIDE_MAX}
              onClick={() => addSlide(criativo.id)}
            >
              <Plus size={16} strokeWidth={2} />
            </IconButton>
          </div>
        </div>

        {slide && (
          <SlideEditor
            slide={slide}
            formato={criativo.formato}
            onChangeTexto={(texto) => updateSlide(criativo.id, slide.id, { texto, status: 'editado' })}
            onGerarTexto={gerarTexto}
            onGerarImagem={gerarImagem}
          />
        )}
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-text-secondary">Preview do carrossel ({criativo.formato})</h2>
        <div className="flex gap-3 overflow-x-auto">
          {criativo.slides.map((s, index) => (
            <div
              key={s.id}
              className={`flex w-24 shrink-0 flex-col gap-1 ${
                criativo.formato === '4:5' ? 'aspect-[4/5]' : 'aspect-square'
              }`}
            >
              <div className="flex h-full items-center justify-center overflow-hidden rounded-md bg-bg-app">
                {s.imagemUrl ? (
                  <img src={s.imagemUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-text-muted">{index + 1}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Excluir criativo"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Excluir
            </Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary">
          Tem certeza que quer excluir <strong>{criativo.titulo}</strong>? Essa ação não pode ser desfeita.
        </p>
      </Modal>
    </div>
  )
}
