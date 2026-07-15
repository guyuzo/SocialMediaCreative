export interface TabItem {
  id: string
  label: string
}

interface TabsProps {
  tabs: TabItem[]
  value: string
  onChange: (id: string) => void
}

export function Tabs({ tabs, value, onChange }: TabsProps) {
  return (
    <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-border-subtle">
      {tabs.map((tab) => {
        const active = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={`min-h-11 shrink-0 whitespace-nowrap border-b-2 px-4 text-sm font-semibold transition-colors ${
              active
                ? 'border-accent-primary text-accent-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
