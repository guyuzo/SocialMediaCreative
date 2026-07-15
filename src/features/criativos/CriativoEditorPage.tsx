import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, Copy, Download, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Tabs } from '@/components/ui/Tabs'
import { useCriativosStore, proximoStatus } from '@/features/criativos/useCriativosStore'
import { useTemasStore } from '@/features/temas/useTemasStore'
import { useAtivosStore } from '@/features/ativos/useAtivosStore'
import { SlideEditor } from '@/features/criativos/SlideEditor'
import { STATUS_BADGE_CLASSES } from '@/features/criativos/statusStyles'
import { textGenerationService } from '@/lib/ai/textService'
import { imageGenerationService } from '@/lib/ai/imageService'
import { useToastStore } from '@/lib/toast/useToastStore'
import { CRIATIVO_STATUS_LABEL, SLIDE_MAX, SLIDE_MIN } from '@/types/criativo'

export function CriativoEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { criativos, loaded, load, update, remove, duplicate, updateSlide, addSlide, removeSlide, moveSlide } =
    useCriativosStore()
  const { temas, loaded: temasLoaded, load: loadTemas } = useTemasStore()
  const createAtivo = useAtivosStore((state) => state.create)
  const showToast = useToastStore((state) => state.show)

  const [slideAtivo, setSlideAtivo] = useState<string | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    if (!loaded) load()
    if (!temasLoaded) loadTemas()
  }, [loaded, load, temasLoaded, loadTemas])

  const criativo = criativos.find((item) => item.id === id)
  const tema = useMemo(() => temas.find((t) => t.id === criativo?.temaId), [temas, criativo])

  useEffect(() => {
    if (criativo && (!slideAtivo || !criativo.slides.some((slide) => slide.id === slideAtivo))) {
      setSlideAtivo(criativo.slides[0]?.id ?? null)
    }
  }, [criativo, slideAtivo])

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
      const texto = await textGenerationService.generateSlideText({
        tema: tema?.nome ?? 'Geral',
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
      const prompt = slide.texto || tema?.nome || 'criativo'
      const { url } = await imageGenerationService.generateSlideImage({ prompt, formato: criativo!.formato })
      await updateSlide(criativo!.id, slide.id, { imagemUrl: url, status: 'gerado', promptImagem: prompt })
      await createAtivo({
        origem: 'gerado',
        url,
        nome: `${criativo!.titulo} — slide ${slide.ordem + 1}`,
        temaId: criativo!.temaId,
        criativoId: criativo!.id,
      })
    } catch {
      await updateSlide(criativo!.id, slide.id, { status: 'erro' })
      showToast('Falha ao gerar imagem do slide.', 'error')
    }
  }

  function exportarImagens() {
    const comImagem = criativo!.slides.filter((s) => s.imagemUrl)
    if (comImagem.length === 0) {
      showToast('Nenhuma imagem gerada ainda para exportar.')
      return
    }
    comImagem.forEach((s, index) => {
      const link = document.createElement('a')
      link.href = s.imagemUrl!
      link.download = `${criativo!.titulo}-slide-${index + 1}.svg`
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
              disabled={!slide || slide.ordem === 0}
              onClick={() => slide && moveSlide(criativo.id, slide.id, 'left')}
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </IconButton>
            <IconButton
              label="Mover slide para a direita"
              disabled={!slide || slide.ordem === criativo.slides.length - 1}
              onClick={() => slide && moveSlide(criativo.id, slide.id, 'right')}
            >
              <ChevronRight size={16} strokeWidth={2} />
            </IconButton>
            <IconButton
              label="Remover slide"
              disabled={criativo.slides.length <= SLIDE_MIN}
              onClick={() => slide && removeSlide(criativo.id, slide.id)}
            >
              <Trash2 size={16} strokeWidth={2} />
            </IconButton>
            <IconButton
              label="Adicionar slide"
              disabled={criativo.slides.length >= SLIDE_MAX}
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
