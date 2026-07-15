import { NavLink } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { appRoutes } from '@/routes'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen shrink-0 flex-col justify-between border-r border-border-subtle bg-bg-surface md:flex md:w-20 lg:w-64">
      <div>
        <div className="flex items-center gap-2 p-4 lg:p-6">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-primary text-white">
            <Sparkles size={18} strokeWidth={2} />
          </div>
          <span className="hidden text-md font-bold text-text-primary lg:inline">
            Social Creative
          </span>
        </div>
        <nav className="flex flex-col gap-1 px-2 lg:px-4">
          {appRoutes.map((route) => {
            const Icon = route.icon
            return (
              <NavLink
                key={route.path}
                to={route.path}
                end={route.path === '/'}
                className={({ isActive }) =>
                  `flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors md:justify-center lg:justify-start ${
                    isActive
                      ? 'bg-accent-soft text-accent-primary'
                      : 'text-text-secondary hover:bg-accent-soft/60 hover:text-text-primary'
                  }`
                }
                title={route.label}
              >
                <Icon size={20} strokeWidth={1.75} className="shrink-0" />
                <span className="hidden lg:inline">{route.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>
      <div className="hidden p-6 lg:block">
        <ThemeToggle />
      </div>
    </aside>
  )
}
