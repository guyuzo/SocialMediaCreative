import { useThemeStore, type Theme } from '@/lib/theme/useThemeStore'

const OPTIONS: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
]

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  return (
    <div className="inline-flex gap-1 rounded-full bg-accent-soft p-1">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setTheme(option.value)}
          className={`min-h-11 rounded-full px-4 text-sm font-medium transition-colors ${
            theme === option.value
              ? 'bg-accent-primary text-white'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
