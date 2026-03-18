'use client'

import { useState, useMemo } from 'react'
import { CalendarEvent } from '@/lib/types'
import {
  getWeekStart,
  getWeekDays,
  toDateString,
  groupEventsByDate,
  formatWeekDayHeader,
} from '@/lib/utils'
import EventCard from './EventCard'
import EventModal from './EventModal'

interface WeeklyViewProps {
  events: CalendarEvent[]
}

export default function WeeklyView({ events }: WeeklyViewProps) {
  const [weekStart, setWeekStart] = useState<Date>(() =>
    getWeekStart(new Date())
  )
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart])
  const eventsByDate = useMemo(() => groupEventsByDate(events), [events])

  function goToPrevWeek() {
    setWeekStart(prev => {
      const d = new Date(prev)
      d.setDate(d.getDate() - 7)
      return d
    })
  }

  function goToNextWeek() {
    setWeekStart(prev => {
      const d = new Date(prev)
      d.setDate(d.getDate() + 7)
      return d
    })
  }

  function goToThisWeek() {
    setWeekStart(getWeekStart(new Date()))
  }

  const hasAnyEvents = weekDays.some(
    d => (eventsByDate[toDateString(d)] ?? []).length > 0
  )

  const weekLabel = (() => {
    const start = weekDays[0]
    const end = weekDays[6]
    const startStr = start.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    })
    const endStr = end.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    return `${startStr} – ${endStr}`
  })()

  return (
    <div>
      {/* Week navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevWeek}
            className="h-8 w-8 flex items-center justify-center rounded-md border border-cwth-border text-cwth-dark hover:bg-cwth-light-blue transition-colors"
            aria-label="Previous week"
          >
            ‹
          </button>
          <button
            onClick={goToNextWeek}
            className="h-8 w-8 flex items-center justify-center rounded-md border border-cwth-border text-cwth-dark hover:bg-cwth-light-blue transition-colors"
            aria-label="Next week"
          >
            ›
          </button>
          <button
            onClick={goToThisWeek}
            className="h-8 px-3 text-sm border border-cwth-border text-cwth-dark rounded-md hover:bg-cwth-light-blue transition-colors"
          >
            This week
          </button>
        </div>
        <span className="text-sm font-medium text-cwth-dark">{weekLabel}</span>
      </div>

      {/* Desktop: 7-column grid */}
      <div className="hidden md:grid grid-cols-7 gap-px bg-cwth-border rounded-lg overflow-hidden border border-cwth-border">
        {weekDays.map(day => {
          const dateStr = toDateString(day)
          const dayEvents = eventsByDate[dateStr] ?? []
          const { day: dayName, date: dateLabel } = formatWeekDayHeader(day)
          const isToday = dateStr === toDateString(new Date())

          return (
            <div key={dateStr} className="bg-white min-h-[140px]">
              {/* Column header */}
              <div
                className={`px-2 py-2 text-center border-b border-cwth-border ${
                  isToday ? 'bg-cwth-light-blue' : 'bg-gray-50'
                }`}
              >
                <p
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    isToday ? 'text-cwth-blue' : 'text-cwth-mid-grey'
                  }`}
                >
                  {dayName}
                </p>
                <p
                  className={`text-sm font-bold ${
                    isToday ? 'text-cwth-blue' : 'text-cwth-dark'
                  }`}
                >
                  {dateLabel}
                </p>
              </div>

              {/* Events */}
              <div className="p-1.5">
                {dayEvents.length === 0 ? (
                  <p className="text-xs text-cwth-mid-grey/50 text-center pt-4">
                    —
                  </p>
                ) : (
                  dayEvents.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      compact
                      onClick={() => setSelectedEvent(event)}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Mobile: single-day scroll */}
      <div className="md:hidden">
        <div className="flex overflow-x-auto gap-3 pb-2 snap-x snap-mandatory">
          {weekDays.map(day => {
            const dateStr = toDateString(day)
            const dayEvents = eventsByDate[dateStr] ?? []
            const { day: dayName, date: dateLabel } = formatWeekDayHeader(day)
            const isToday = dateStr === toDateString(new Date())

            return (
              <div
                key={dateStr}
                className="flex-none w-[85vw] snap-center rounded-lg border border-cwth-border overflow-hidden"
              >
                <div
                  className={`px-3 py-2 border-b border-cwth-border ${
                    isToday ? 'bg-cwth-light-blue' : 'bg-gray-50'
                  }`}
                >
                  <p
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      isToday ? 'text-cwth-blue' : 'text-cwth-mid-grey'
                    }`}
                  >
                    {dayName}
                  </p>
                  <p
                    className={`text-sm font-bold ${
                      isToday ? 'text-cwth-blue' : 'text-cwth-dark'
                    }`}
                  >
                    {dateLabel}
                  </p>
                </div>
                <div className="p-2 bg-white min-h-[120px]">
                  {dayEvents.length === 0 ? (
                    <p className="text-sm text-cwth-mid-grey text-center pt-4">
                      No events
                    </p>
                  ) : (
                    dayEvents.map(event => (
                      <EventCard
                        key={event.id}
                        event={event}
                        compact
                        onClick={() => setSelectedEvent(event)}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* No events message */}
      {!hasAnyEvents && (
        <div className="mt-6 text-center py-10 text-cwth-mid-grey">
          <p className="text-base">No events this week.</p>
          <p className="text-sm mt-1">
            Try navigating to another week or adjusting your filters.
          </p>
        </div>
      )}

      {/* Event modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  )
}
