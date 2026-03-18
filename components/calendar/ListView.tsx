'use client'

import { useMemo } from 'react'
import { CalendarEvent } from '@/lib/types'
import { groupEventsByDate, formatDateLong, today } from '@/lib/utils'
import EventCard from './EventCard'

interface ListViewProps {
  events: CalendarEvent[]
}

export default function ListView({ events }: ListViewProps) {
  const todayStr = today()

  const upcomingEvents = useMemo(
    () => events.filter(e => e.event_date >= todayStr),
    [events, todayStr]
  )

  const grouped = useMemo(
    () => groupEventsByDate(upcomingEvents),
    [upcomingEvents]
  )

  const sortedDates = useMemo(
    () => Object.keys(grouped).sort(),
    [grouped]
  )

  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-16 text-cwth-mid-grey">
        <p className="text-base">No upcoming events found.</p>
        <p className="text-sm mt-1">
          Try adjusting your filters or check back soon.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {sortedDates.map(dateStr => (
        <section key={dateStr}>
          <h2 className="text-base font-bold text-cwth-dark mb-3 pb-2 border-b border-cwth-border">
            {formatDateLong(dateStr)}
          </h2>
          <div className="space-y-4">
            {grouped[dateStr].map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
