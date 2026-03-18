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

  const eventCount: Record<string, number> = {}
  for (const e of events) {
    eventCount[e.event_date] = (eventCount[e.event_date] ?? 0) + 1
  }

  const firstDay = new Date(cursor.year, cursor.month, 1)
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
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
    <div className="bg-white rounded-2xl border border-cwth-border p-5 shadow-sm select-none">
      {/* Month header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-cwth-light-blue text-cwth-mid-grey transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-base font-bold text-cwth-dark">{monthLabel}</span>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-cwth-light-blue text-cwth-mid-grey transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[11px] font-semibold text-cwth-mid-grey py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const ds = dateStr(day)
          const isToday = ds === todayStr
          const isSelected = ds === selectedDate
          const count = eventCount[ds] ?? 0
          const hasEvents = count > 0

          // Layer priority: selected > has-events > today > plain
          const cellCls = isSelected
            ? 'bg-cwth-blue text-white ring-2 ring-cwth-blue ring-offset-1'
            : hasEvents
            ? 'bg-teal-50 text-cwth-dark ring-1 ring-cwth-teal hover:bg-teal-100'
            : isToday
            ? 'ring-2 ring-cwth-blue text-cwth-blue font-bold hover:bg-cwth-light-blue'
            : 'hover:bg-gray-50 text-cwth-dark'

          return (
            <button
              key={ds}
              onClick={() => onSelectDate(isSelected ? null : ds)}
              className={`relative flex flex-col items-center justify-center h-10 w-full rounded-xl text-xs font-medium transition-all ${cellCls}`}
              aria-label={`${day} ${monthLabel}${hasEvents ? `, ${count} event${count > 1 ? 's' : ''}` : ''}`}
            >
              <span className="leading-none">{day}</span>
              {hasEvents && (
                <span
                  className={`mt-0.5 text-[9px] font-bold leading-none ${
                    isSelected ? 'text-white/80' : 'text-cwth-teal'
                  }`}
                >
                  {count > 1 ? `×${count}` : '·'}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Clear selection */}
      {selectedDate && (
        <div className="mt-4 pt-3 border-t border-cwth-border">
          <button
            onClick={() => onSelectDate(null)}
            className="w-full text-xs text-cwth-mid-grey hover:text-cwth-blue transition-colors"
          >
            ← Show all dates
          </button>
        </div>
      )}
    </div>
  )
}
