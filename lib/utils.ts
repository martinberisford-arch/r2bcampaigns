import { CalendarEvent } from './types'

/**
 * Merge class names (lightweight cn without tailwind-merge).
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Format a date string (YYYY-MM-DD) to display format.
 * e.g. "Tuesday 25 March 2025"
 */
export function formatDateLong(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Format a date string to abbreviated form.
 * e.g. "Tue 25 Mar"
 */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

/**
 * Format time string (HH:MM:SS or HH:MM) to HH:MM display.
 */
export function formatTime(timeStr: string | null | undefined): string {
  if (!timeStr) return ''
  return timeStr.slice(0, 5)
}

/**
 * Format event time range, e.g. "10:00–12:00"
 */
export function formatTimeRange(
  startTime: string | null | undefined,
  endTime: string | null | undefined
): string {
  const start = formatTime(startTime)
  const end = formatTime(endTime)
  if (start && end) return `${start}–${end}`
  if (start) return start
  return ''
}

/**
 * Get the Monday of the week containing the given date.
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // adjust for Sunday
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Get all 7 days (Mon–Sun) of the week starting from weekStart.
 */
export function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })
}

/**
 * Format a Date to YYYY-MM-DD string.
 */
export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Group events by date string.
 */
export function groupEventsByDate(
  events: CalendarEvent[]
): Record<string, CalendarEvent[]> {
  return events.reduce(
    (acc, event) => {
      const key = event.event_date
      if (!acc[key]) acc[key] = []
      acc[key].push(event)
      return acc
    },
    {} as Record<string, CalendarEvent[]>
  )
}

/**
 * Truncate text to maxLength with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '…'
}

/**
 * Check if a URL is valid.
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Get today's date as YYYY-MM-DD string.
 */
export function today(): string {
  return toDateString(new Date())
}

/**
 * Add days to a date string and return YYYY-MM-DD.
 */
export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return toDateString(d)
}

/**
 * Format a Date for week column header, e.g. "Mon\n24 Mar"
 */
export function formatWeekDayHeader(date: Date): { day: string; date: string } {
  const day = date.toLocaleDateString('en-GB', { weekday: 'short' })
  const dateStr = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
  return { day, date: dateStr }
}
