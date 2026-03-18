'use client'

import React from 'react'
import { motion } from 'motion/react'
import { CalendarEvent } from '@/lib/types'
import { CategoryBadge } from '@/components/shared/Badge'
import { formatDateShort, formatTimeRange } from '@/lib/utils'

interface EventsColumnProps {
  events: CalendarEvent[]
  duration?: number
  className?: string
}

export function EventsColumn({ events, duration = 15, className }: EventsColumnProps) {
  // Need at least 2 events to fill a scrolling column meaningfully
  if (events.length < 2) return null

  return (
    <div className={`overflow-hidden ${className ?? ''}`}>
      <motion.div
        animate={{ translateY: '-50%' }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="flex flex-col gap-4 pb-4"
      >
        {[0, 1].map((copy) => (
          <React.Fragment key={copy}>
            {events.map((event) => (
              <EventScrollCard key={`${copy}-${event.id}`} event={event} />
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  )
}

function EventScrollCard({ event }: { event: CalendarEvent }) {
  const timeRange = formatTimeRange(event.start_time, event.end_time)

  return (
    <div className="w-72 rounded-2xl border border-cwth-border bg-white p-5 shadow-md shadow-cwth-blue/5">
      <div className="mb-3 flex items-start justify-between gap-2">
        <CategoryBadge label={event.category} />
        {event.delivery_mode && (
          <span className="shrink-0 text-xs text-cwth-mid-grey">
            {event.delivery_mode === 'Online' ? '💻' : event.delivery_mode === 'Hybrid' ? '🔀' : '📍'}
          </span>
        )}
      </div>

      <h3 className="mb-2 text-sm font-semibold leading-snug text-cwth-dark line-clamp-2">
        {event.title}
      </h3>

      <p className="text-xs text-cwth-mid-grey">
        {formatDateShort(event.event_date)}
        {timeRange && <span> · {timeRange}</span>}
      </p>

      {event.location && (
        <p className="mt-0.5 truncate text-xs text-cwth-mid-grey">
          📍 {event.location}
        </p>
      )}

      {event.target_audience && (
        <p className="mt-1 text-xs text-cwth-mid-grey line-clamp-1">
          For: {event.target_audience}
        </p>
      )}

      {event.booking_url ? (
        <a
          href={event.booking_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-xs font-semibold text-cwth-teal hover:underline"
          onClick={e => e.stopPropagation()}
        >
          Book / Find Out More →
        </a>
      ) : (
        <div className="mt-3" />
      )}
    </div>
  )
}
