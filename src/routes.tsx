import type { ReactNode } from 'react'
import {
  LayoutDashboard,
  Tags,
  Lightbulb,
  BookOpen,
  Sparkles,
  Calendar,
  ListChecks,
  type LucideIcon,
} from 'lucide-react'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { TemasPage } from '@/features/temas/TemasPage'
import { IdeiasPage } from '@/features/ideias/IdeiasPage'
import { ReferenciasPage } from '@/features/referencias/ReferenciasPage'
import { CriativosPage } from '@/features/criativos/CriativosPage'
import { AgendaPage } from '@/features/agenda/AgendaPage'
import { TarefasPage } from '@/features/tarefas/TarefasPage'

export interface AppRoute {
  path: string
  label: string
  icon: LucideIcon
  /** Aparece na navegação inferior no mobile; os demais ficam atrás do "Mais". */
  mobilePrimary?: boolean
  /** Rótulo curto para caber na bottom nav; usa `label` se ausente. */
  mobileLabel?: string
  element: ReactNode
}

export const appRoutes: AppRoute[] = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, mobilePrimary: true, element: <DashboardPage /> },
  { path: '/temas', label: 'Temas', icon: Tags, element: <TemasPage /> },
  { path: '/ideias', label: 'Biblioteca de Ideias', icon: Lightbulb, mobilePrimary: true, mobileLabel: 'Ideias', element: <IdeiasPage /> },
  { path: '/referencias', label: 'Referências', icon: BookOpen, element: <ReferenciasPage /> },
  { path: '/criativos', label: 'Criativos', icon: Sparkles, mobilePrimary: true, element: <CriativosPage /> },
  { path: '/agenda', label: 'Agenda', icon: Calendar, mobilePrimary: true, element: <AgendaPage /> },
  { path: '/tarefas', label: 'Tarefas', icon: ListChecks, element: <TarefasPage /> },
]
