import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { appRoutes } from '@/routes'
import { Sheet } from '@/components/ui/Sheet'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false)
  const primaryRoutes = appRoutes.filter((route) => route.mobilePrimary)
  const secondaryRoutes = appRoutes.filter((route) => !route.mobilePrimary)

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-border-subtle bg-bg-surface md:hidden">
        {primaryRoutes.map((route) => {
          const Icon = route.icon
          return (
            <NavLink
              key={route.path}
              to={route.path}
              end={route.path === '/'}
              className={({ isActive }) =>
                `flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium ${
                  isActive ? 'text-accent-primary' : 'text-text-secondary'
                }`
              }
            >
              <Icon size={20} strokeWidth={1.75} />
              <span className="w-full truncate text-center">{route.mobileLabel ?? route.label}</span>
            </NavLink>
          )
        })}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className="flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium text-text-secondary"
        >
          <MoreHorizontal size={20} strokeWidth={1.75} />
          <span>Mais</span>
        </button>
      </nav>

      <Sheet open={moreOpen} onClose={() => setMoreOpen(false)} title="Mais opções">
        <div className="flex flex-col gap-1">
          {secondaryRoutes.map((route) => {
            const Icon = route.icon
            return (
              <NavLink
                key={route.path}
                to={route.path}
                onClick={() => setMoreOpen(false)}
                className={({ isActive }) =>
                  `flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium ${
                    isActive
                      ? 'bg-accent-soft text-accent-primary'
                      : 'text-text-secondary hover:bg-accent-soft/60 hover:text-text-primary'
                  }`
                }
              >
                <Icon size={20} strokeWidth={1.75} />
                {route.label}
              </NavLink>
            )
          })}
        </div>
        <div className="mt-6 border-t border-border-subtle pt-6">
          <ThemeToggle />
        </div>
      </Sheet>
    </>
  )
}
