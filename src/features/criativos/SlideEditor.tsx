import { ImageIcon, RefreshCw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Spinner } from '@/components/ui/Spinner'
import { Skeleton } from '@/components/ui/Skeleton'
import type { CriativoFormato, Slide } from '@/types/criativo'

interface SlideEditorProps {
  slide: Slide
  formato: CriativoFormato
  onChangeTexto: (texto: string) => void
  onGerarTexto: () => void
  onGerarImagem: () => void
}

export function SlideEditor({ slide, formato, onChangeTexto, onGerarTexto, onGerarImagem }: SlideEditorProps) {
  const gerandoTexto = slide.status === 'gerando'

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-text-secondary">Texto do slide</label>
          <Button variant="secondary" onClick={onGerarTexto} disabled={gerandoTexto}>
            {gerandoTexto ? <Spinner size={16} /> : <Sparkles size={16} strokeWidth={2} />}
            {slide.status === 'erro' ? 'Tentar novamente' : 'Gerar com IA'}
          </Button>
        </div>
        <Textarea
          value={slide.texto}
          onChange={(e) => onChangeTexto(e.target.value)}
          rows={6}
          placeholder="Escreva o texto do slide ou gere com IA..."
        />
        {slide.status === 'erro' && (
          <p className="text-sm text-danger">Falha ao gerar texto. Tente novamente.</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-text-secondary">Imagem do slide</label>
          <Button variant="secondary" onClick={onGerarImagem} disabled={gerandoTexto}>
            {gerandoTexto ? <Spinner size={16} /> : <RefreshCw size={16} strokeWidth={2} />}
            {slide.imagemUrl ? 'Gerar novamente' : 'Gerar com IA'}
          </Button>
        </div>
        <div
          className={`flex items-center justify-center overflow-hidden rounded-md bg-bg-app ${
            formato === '4:5' ? 'aspect-[4/5]' : 'aspect-square'
          }`}
        >
          {gerandoTexto ? (
            <Skeleton className="h-full w-full" />
          ) : slide.imagemUrl ? (
            <img src={slide.imagemUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon size={28} strokeWidth={1.5} className="text-text-muted" />
          )}
        </div>
      </div>
    </div>
  )
}
