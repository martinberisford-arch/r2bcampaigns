'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CalendarDays } from 'lucide-react'
import { CalendarEvent } from '@/lib/types'
import { EventCardSlide, itemVariants } from '@/components/ui/event-card-slide'
import MiniCalendar from '@/components/calendar/MiniCalendar'
import { formatDateLong } from '@/lib/utils'

function groupByDate(events: CalendarEvent[]): Record<string, CalendarEvent[]> {
  const map: Record<string, CalendarEvent[]> = {}
  for (const e of events) {
    if (!map[e.event_date]) map[e.event_date] = []
    map[e.event_date].push(e)
  }
  return map
}

interface SplitCalendarViewProps {
  events: CalendarEvent[]
}

export default function SplitCalendarView({ events }: SplitCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const grouped = groupByDate(events)
  const selectedEvents = selectedDate ? (grouped[selectedDate] ?? []) : []

  // Default: show today's or the nearest upcoming date's events
  const todayStr = new Date().toISOString().split('T')[0]
  const defaultDate =
    selectedDate ??
    Object.keys(grouped)
      .sort()
      .find(d => d >= todayStr) ??
    null

  const displayedDate = selectedDate ?? defaultDate
  const displayedEvents = displayedDate ? (grouped[displayedDate] ?? []) : []

  return (
    <div className="space-y-6">
      {/* Calendar — centred, max width keeps it readable */}
      <div className="flex justify-center">
        <div className="w-full max-w-sm">
          <MiniCalendar
            events={events}
            selectedDate={displayedDate}
            onSelectDate={d => setSelectedDate(d === displayedDate ? null : d)}
          />
        </div>
      </div>

      {/* Events for the selected / nearest date */}
      <AnimatePresence mode="wait">
        {displayedDate && (
          <motion.div
            key={displayedDate}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Section header */}
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="h-4 w-4 text-cwth-teal" />
              <h3 className="text-sm font-semibold text-cwth-dark">
                {formatDateLong(displayedDate)}
              </h3>
              {displayedDate === todayStr && (
                <span className="text-[10px] font-bold text-white bg-cwth-teal px-2 py-0.5 rounded-full">
                  TODAY
                </span>
              )}
              <span className="text-xs text-cwth-mid-grey">
                {displayedEvents.length} event{displayedEvents.length !== 1 ? 's' : ''}
              </span>
            </div>

            {displayedEvents.length === 0 ? (
              <p className="text-sm text-cwth-mid-grey">No events on this date.</p>
            ) : (
              <motion.div
                className="flex flex-wrap gap-4"
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } } as const}
                initial="hidden"
                animate="visible"
              >
                {displayedEvents.map(event => (
                  <motion.div key={event.id} variants={itemVariants}>
                    <EventCardSlide event={event} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {!displayedDate && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-12 text-center"
          >
            <CalendarDays className="h-8 w-8 text-cwth-border mb-3" />
            <p className="text-sm text-cwth-mid-grey">Select a date to see events.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
