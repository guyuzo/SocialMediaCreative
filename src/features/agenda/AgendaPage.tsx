import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { useCriativosStore } from '@/features/criativos/useCriativosStore'
import { useTemasStore } from '@/features/temas/useTemasStore'
import { TemaIcon } from '@/features/temas/TemaIcon'
import { AgendarDiaModal } from '@/features/agenda/AgendarDiaModal'
import { buildMonthGrid, isSameMonth, isToday, toISODateOnly } from '@/features/agenda/dateUtils'

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export function AgendaPage() {
  const navigate = useNavigate()
  const { criativos, loaded, load, agendar, desagendar } = useCriativosStore()
  const { temas, loaded: temasLoaded, load: loadTemas } = useTemasStore()

  const [mesAtual, setMesAtual] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [diaSelecionado, setDiaSelecionado] = useState<Date | undefined>(undefined)

  useEffect(() => {
    if (!loaded) load()
    if (!temasLoaded) loadTemas()
  }, [loaded, load, temasLoaded, loadTemas])

  const temasPorId = useMemo(() => new Map(temas.map((tema) => [tema.id, tema])), [temas])
  const dias = useMemo(() => buildMonthGrid(mesAtual), [mesAtual])

  const criativosPorDia = useMemo(() => {
    const mapa = new Map<string, typeof criativos>()
    for (const criativo of criativos) {
      if (!criativo.dataPublicacao) continue
      const lista = mapa.get(criativo.dataPublicacao) ?? []
      lista.push(criativo)
      mapa.set(criativo.dataPublicacao, lista)
    }
    return mapa
  }, [criativos])

  function mudarMes(delta: number) {
    setMesAtual((atual) => new Date(atual.getFullYear(), atual.getMonth() + delta, 1))
  }

  if (loaded && criativos.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Crie um criativo antes"
        description="A Agenda marca a publicação de criativos já existentes. Crie e finalize um criativo primeiro."
        action={<Button onClick={() => navigate('/criativos')}>Ir para Criativos</Button>}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-text-primary">Agenda</h1>
        <div className="flex items-center gap-2">
          <IconButton label="Mês anterior" onClick={() => mudarMes(-1)}>
            <ChevronLeft size={18} strokeWidth={2} />
          </IconButton>
          <span className="min-w-32 text-center text-sm font-semibold text-text-primary">
            {(() => {
              const texto = mesAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
              return texto.charAt(0).toUpperCase() + texto.slice(1)
            })()}
          </span>
          <IconButton label="Próximo mês" onClick={() => mudarMes(1)}>
            <ChevronRight size={18} strokeWidth={2} />
          </IconButton>
        </div>
      </div>

      <Card padding="compact">
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-text-muted">
          {DIAS_SEMANA.map((dia) => (
            <div key={dia} className="py-1">
              {dia}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {dias.map((dia) => {
            const diaISO = toISODateOnly(dia)
            const agendadosNoDia = criativosPorDia.get(diaISO) ?? []
            const foraDoMes = !isSameMonth(dia, mesAtual)

            return (
              <button
                key={diaISO}
                type="button"
                onClick={() => setDiaSelecionado(dia)}
                aria-label={`Ver agendamentos de ${dia.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`}
                className={`flex min-h-20 flex-col gap-1 rounded-md border p-1.5 text-left transition-colors sm:min-h-24 ${
                  foraDoMes ? 'border-transparent opacity-40' : 'border-border-subtle hover:border-accent-primary'
                }`}
              >
                <span
                  className={`text-xs font-semibold ${
                    isToday(dia) ? 'flex h-5 w-5 items-center justify-center rounded-full bg-accent-primary text-white' : 'text-text-secondary'
                  }`}
                >
                  {dia.getDate()}
                </span>
                <div className="flex flex-col gap-0.5">
                  {agendadosNoDia.slice(0, 2).map((criativo) => (
                    <span
                      key={criativo.id}
                      className="flex items-center gap-1 truncate rounded bg-accent-soft px-1 py-0.5 text-[11px] text-accent-primary"
                    >
                      <TemaIcon tema={criativo.temaId ? temasPorId.get(criativo.temaId) : undefined} size="xs" />
                      <span className="truncate">{criativo.titulo}</span>
                    </span>
                  ))}
                  {agendadosNoDia.length > 2 && (
                    <span className="text-[11px] text-text-muted">+{agendadosNoDia.length - 2} mais</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </Card>

      {diaSelecionado && (
        <AgendarDiaModal
          open={!!diaSelecionado}
          onClose={() => setDiaSelecionado(undefined)}
          dia={diaSelecionado}
          criativos={criativos}
          temasPorId={temasPorId}
          onAgendar={(criativoId) => agendar(criativoId, toISODateOnly(diaSelecionado))}
          onDesagendar={desagendar}
        />
      )}
    </div>
  )
}
