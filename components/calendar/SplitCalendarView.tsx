'use client'

import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { CalendarEvent } from '@/lib/types'
import { EventCardSlide, itemVariants } from '@/components/ui/event-card-slide'
import MiniCalendar from '@/components/calendar/MiniCalendar'
import { formatDateLong } from '@/lib/utils'

// Groups events by date, returns sorted array of [dateStr, events[]] pairs
function groupByDate(events: CalendarEvent[]): [string, CalendarEvent[]][] {
  const map: Record<string, CalendarEvent[]> = {}
  for (const e of events) {
    if (!map[e.event_date]) map[e.event_date] = []
    map[e.event_date].push(e)
  }
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
}

// Horizontal scrollable row of event cards for a single day
function DayEventRow({ dateStr, events }: { dateStr: string; events: CalendarEvent[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(events.length > 1)

  function onScroll() {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 0)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }

  function scroll(dir: 'left' | 'right') {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -288 : 288, behavior: 'smooth' })
  }

  const isToday = dateStr === new Date().toISOString().split('T')[0]

  return (
    <div className="mb-8" id={`day-${dateStr}`}>
      {/* Date header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-cwth-teal" />
          <h3 className="text-sm font-semibold text-cwth-dark">
            {formatDateLong(dateStr)}
          </h3>
          {isToday && (
            <span className="text-[10px] font-bold text-white bg-cwth-teal px-2 py-0.5 rounded-full">
              TODAY
            </span>
          )}
          <span className="text-xs text-cwth-mid-grey">
            {events.length} event{events.length > 1 ? 's' : ''}
          </span>
        </div>
        {/* Scroll controls — only when more than ~1 card fits */}
        {events.length > 1 && (
          <div className="flex gap-1">
            <button
              onClick={() => scroll('left')}
              disabled={!canLeft}
              className="p-1 rounded-full border border-cwth-border hover:bg-cwth-light-blue disabled:opacity-30 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4 text-cwth-dark" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canRight}
              className="p-1 rounded-full border border-cwth-border hover:bg-cwth-light-blue disabled:opacity-30 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4 text-cwth-dark" />
            </button>
          </div>
        )}
      </div>

      {/* Horizontally scrollable card row */}
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.08 } } as const,
        }}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex gap-4 overflow-x-auto pb-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {events.map(event => (
            <motion.div key={event.id} variants={itemVariants}>
              <EventCardSlide event={event} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

interface SplitCalendarViewProps {
  events: CalendarEvent[]
}

export default function SplitCalendarView({ events }: SplitCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const grouped = groupByDate(events)

  const displayed = selectedDate
    ? grouped.filter(([d]) => d === selectedDate)
    : grouped

  return (
    <div className="flex gap-6 items-start">
      {/* ── Left: sticky mini calendar ── */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-4">
        <MiniCalendar
          events={events}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </aside>

      {/* ── Right: event groups ── */}
      <div className="flex-1 min-w-0">
        {/* Mobile: inline mini calendar (collapsed) */}
        <div className="lg:hidden mb-6">
          <MiniCalendar
            events={events}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>

        <AnimatePresence mode="wait">
          {displayed.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <CalendarDays className="h-10 w-10 text-cwth-border mb-4" />
              <p className="text-cwth-mid-grey text-sm">
                {selectedDate
                  ? `No events on ${formatDateLong(selectedDate)}`
                  : 'No upcoming events found.'}
              </p>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="mt-3 text-xs text-cwth-blue underline"
                >
                  Show all dates
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={selectedDate ?? 'all'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {displayed.map(([dateStr, dayEvents]) => (
                <DayEventRow key={dateStr} dateStr={dateStr} events={dayEvents} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
