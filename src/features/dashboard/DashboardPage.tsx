import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock,
  Lightbulb,
  ListChecks,
  Sparkles,
  Tags,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatTile } from '@/components/ui/StatTile'
import { EmptyState } from '@/components/ui/EmptyState'
import { useTarefasStore } from '@/features/tarefas/useTarefasStore'
import { useCriativosStore } from '@/features/criativos/useCriativosStore'
import { useTemasStore } from '@/features/temas/useTemasStore'
import { useIdeiasStore } from '@/features/ideias/useIdeiasStore'
import { classificarPrazo, diasRestantes } from '@/features/tarefas/deadlineUtils'

export function DashboardPage() {
  const navigate = useNavigate()
  const { tarefas, loaded: tarefasLoaded, load: loadTarefas } = useTarefasStore()
  const { criativos, loaded: criativosLoaded, load: loadCriativos } = useCriativosStore()
  const { temas, loaded: temasLoaded, load: loadTemas } = useTemasStore()
  const { ideias, loaded: ideiasLoaded, load: loadIdeias } = useIdeiasStore()

  useEffect(() => {
    if (!tarefasLoaded) loadTarefas()
    if (!criativosLoaded) loadCriativos()
    if (!temasLoaded) loadTemas()
    if (!ideiasLoaded) loadIdeias()
  }, [tarefasLoaded, loadTarefas, criativosLoaded, loadCriativos, temasLoaded, loadTemas, ideiasLoaded, loadIdeias])

  const resumoTarefas = useMemo(() => {
    const pendentes = tarefas.filter((t) => t.status === 'pendente').length
    const emAndamento = tarefas.filter((t) => t.status === 'em_andamento').length
    const concluidas = tarefas.filter((t) => t.status === 'concluida').length
    const abertas = tarefas.filter((t) => t.status !== 'concluida' && t.deadline)

    const vencemHoje = abertas.filter((t) => diasRestantes(t.deadline!) === 0).length
    const vencemEssaSemana = abertas.filter((t) => {
      const dias = diasRestantes(t.deadline!)
      return dias >= 0 && dias <= 7
    }).length
    const atrasadas = abertas.filter((t) => diasRestantes(t.deadline!) < 0).length

    const proximosPrazos = [...abertas].sort((a, b) => a.deadline!.localeCompare(b.deadline!)).slice(0, 5)

    return { pendentes, emAndamento, concluidas, vencemHoje, vencemEssaSemana, atrasadas, proximosPrazos }
  }, [tarefas])

  const visaoGeral = useMemo(() => {
    const criativosProntos = criativos.filter((c) => c.status === 'pronto').length
    const criativosAgendadosEssaSemana = criativos.filter((c) => {
      if (c.status !== 'agendado' || !c.dataPublicacao) return false
      const dias = diasRestantes(c.dataPublicacao)
      return dias >= 0 && dias <= 7
    }).length
    const ideiasAguardando = ideias.filter((i) => !i.promovida).length
    return { criativosProntos, criativosAgendadosEssaSemana, ideiasAguardando }
  }, [criativos, ideias])

  const semDados = tarefasLoaded && criativosLoaded && temasLoaded && ideiasLoaded && tarefas.length === 0 && criativos.length === 0 && temas.length === 0

  if (semDados) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Bem-vindo ao Social Creative"
        description="Crie um tema, um criativo ou uma tarefa para começar a ver a visão geral aqui."
        action={<Button onClick={() => navigate('/temas')}>Criar primeiro tema</Button>}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-bold text-text-primary">Dashboard</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-text-secondary">Resumo de tarefas</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatTile icon={ListChecks} label="Pendentes" value={resumoTarefas.pendentes} badgeClassName="bg-gray-200 text-gray-600" />
          <StatTile
            icon={Clock}
            label="Em andamento"
            value={resumoTarefas.emAndamento}
            badgeClassName="bg-orange-500/10 text-orange-500"
          />
          <StatTile
            icon={CheckCircle2}
            label="Concluídas"
            value={resumoTarefas.concluidas}
            badgeClassName="bg-green-500/10 text-green-500"
          />
          <StatTile
            icon={CalendarClock}
            label="Vencem hoje"
            value={resumoTarefas.vencemHoje}
            badgeClassName="bg-danger/10 text-danger"
          />
          <StatTile
            icon={CalendarClock}
            label="Vencem na semana"
            value={resumoTarefas.vencemEssaSemana}
            badgeClassName="bg-orange-500/10 text-orange-500"
          />
          <StatTile
            icon={AlertTriangle}
            label="Atrasadas"
            value={resumoTarefas.atrasadas}
            badgeClassName="bg-danger/10 text-danger"
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-secondary">Próximos prazos</h2>
          <Button variant="ghost" onClick={() => navigate('/tarefas')}>
            Ver todas as tarefas
          </Button>
        </div>
        <Card padding="compact">
          {resumoTarefas.proximosPrazos.length === 0 ? (
            <p className="p-2 text-sm text-text-muted">Nenhum prazo em aberto no momento.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-border-subtle">
              {resumoTarefas.proximosPrazos.map((tarefa) => {
                const prazo = classificarPrazo(tarefa.deadline, tarefa.status)
                return (
                  <li key={tarefa.id} className="flex items-center justify-between gap-2 px-2 py-2">
                    <span className="truncate text-sm text-text-primary">{tarefa.titulo}</span>
                    <span className={`shrink-0 text-xs ${prazo.className}`}>{prazo.texto}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-text-secondary">Visão geral do conteúdo</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile icon={Tags} label="Temas ativos" value={temas.length} />
          <StatTile icon={Sparkles} label="Criativos prontos" value={visaoGeral.criativosProntos} />
          <StatTile
            icon={CalendarClock}
            label="Agendados essa semana"
            value={visaoGeral.criativosAgendadosEssaSemana}
          />
          <StatTile icon={Lightbulb} label="Ideias aguardando" value={visaoGeral.ideiasAguardando} />
        </div>
      </section>
    </div>
  )
}
