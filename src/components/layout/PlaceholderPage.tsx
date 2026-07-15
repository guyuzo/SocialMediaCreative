import { Card } from '@/components/ui/Card'

interface PlaceholderPageProps {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <Card>
      <h1 className="text-lg font-bold text-text-primary">{title}</h1>
      <p className="mt-2 text-sm text-text-secondary">{description}</p>
    </Card>
  )
}
