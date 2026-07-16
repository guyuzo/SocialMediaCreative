export function toISODateOnly(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function isSameMonth(date: Date, reference: Date): boolean {
  return date.getFullYear() === reference.getFullYear() && date.getMonth() === reference.getMonth()
}

export function isToday(date: Date): boolean {
  return toISODateOnly(date) === toISODateOnly(new Date())
}

/** Grade de semanas (domingo a sábado) cobrindo o mês inteiro do `reference`. */
export function buildMonthGrid(reference: Date): Date[] {
  const firstOfMonth = new Date(reference.getFullYear(), reference.getMonth(), 1)
  const start = new Date(firstOfMonth)
  start.setDate(start.getDate() - start.getDay())

  const lastOfMonth = new Date(reference.getFullYear(), reference.getMonth() + 1, 0)
  const end = new Date(lastOfMonth)
  end.setDate(end.getDate() + (6 - end.getDay()))

  const days: Date[] = []
  const cursor = new Date(start)
  while (cursor <= end) {
    days.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}
