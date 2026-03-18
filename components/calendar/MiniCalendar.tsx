'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CalendarEvent } from '@/lib/types'
import { toDateString } from '@/lib/utils'

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

interface MiniCalendarProps {
  events: CalendarEvent[]
  selectedDate: string | null
  onSelectDate: (date: string | null) => void
}

export default function MiniCalendar({ events, selectedDate, onSelectDate }: MiniCalendarProps) {
  const todayStr = toDateString(new Date())
  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  // Build set of dates that have events
  const eventDates = new Set(events.map(e => e.event_date))

  // Count events per date for the dot badge
  const eventCount: Record<string, number> = {}
  for (const e of events) {
    eventCount[e.event_date] = (eventCount[e.event_date] ?? 0) + 1
  }

  // First day of the month (0 = Sun)
  const firstDay = new Date(cursor.year, cursor.month, 1)
  // Offset so Monday = 0
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad to complete last week
  while (cells.length % 7 !== 0) cells.push(null)

  const monthLabel = firstDay.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })

  function dateStr(day: number) {
    return `${cursor.year}-${String(cursor.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  function prevMonth() {
    setCursor(c => {
      const m = c.month === 0 ? 11 : c.month - 1
      const y = c.month === 0 ? c.year - 1 : c.year
      return { year: y, month: m }
    })
  }

  function nextMonth() {
    setCursor(c => {
      const m = c.month === 11 ? 0 : c.month + 1
      const y = c.month === 11 ? c.year + 1 : c.year
      return { year: y, month: m }
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-cwth-border p-4 shadow-sm select-none">
      {/* Month header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="p-1 rounded-lg hover:bg-cwth-light-blue text-cwth-mid-grey transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold text-cwth-dark">{monthLabel}</span>
        <button
          onClick={nextMonth}
          className="p-1 rounded-lg hover:bg-cwth-light-blue text-cwth-mid-grey transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-cwth-mid-grey py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const ds = dateStr(day)
          const isToday = ds === todayStr
          const isSelected = ds === selectedDate
          const hasEvents = eventDates.has(ds)
          const count = eventCount[ds] ?? 0

          return (
            <button
              key={ds}
              onClick={() => onSelectDate(isSelected ? null : ds)}
              className={`
                relative flex flex-col items-center justify-center h-8 w-full rounded-lg text-xs font-medium transition-colors
                ${isSelected ? 'bg-cwth-blue text-white' : isToday ? 'bg-cwth-light-blue text-cwth-blue font-bold' : 'hover:bg-gray-50 text-cwth-dark'}
              `}
              aria-label={`${day} ${monthLabel}${hasEvents ? `, ${count} event${count > 1 ? 's' : ''}` : ''}`}
            >
              {day}
              {hasEvents && (
                <span
                  className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-cwth-teal'}`}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 pt-3 border-t border-cwth-border flex items-center gap-3 text-[10px] text-cwth-mid-grey">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cwth-teal inline-block" /> Has events
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cwth-blue inline-block" /> Selected
        </span>
      </div>

      {/* Clear selection */}
      {selectedDate && (
        <button
          onClick={() => onSelectDate(null)}
          className="mt-2 w-full text-xs text-cwth-mid-grey hover:text-cwth-blue transition-colors"
        >
          Show all dates
        </button>
      )}
    </div>
  )
}
