'use client'

import { CalendarEvent } from '@/lib/types'
import { formatDateShort, formatTimeRange } from '@/lib/utils'
import { CategoryBadge, DeliveryModeBadge } from '@/components/shared/Badge'

interface EventCardProps {
  event: CalendarEvent
  compact?: boolean
  onClick?: () => void
}

export default function EventCard({
  event,
  compact = false,
  onClick,
}: EventCardProps) {
  const timeRange = formatTimeRange(event.start_time, event.end_time)
  const isCancelled = event.status === 'cancelled'

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left rounded border p-2 mb-1.5 transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-cwth-teal ${
          isCancelled
            ? 'border-red-200 bg-red-50'
            : 'border-cwth-border bg-white'
        }`}
        aria-label={`View details for ${event.title}`}
      >
        {isCancelled && (
          <span className="block text-xs font-bold text-red-600 mb-1">
            CANCELLED
          </span>
        )}
        <span className="block text-xs font-semibold text-cwth-dark leading-tight line-clamp-2">
          {event.title}
        </span>
        {timeRange && (
          <span className="block text-xs text-cwth-mid-grey mt-0.5">
            {timeRange}
          </span>
        )}
        <span className="mt-1 block">
          <CategoryBadge label={event.category} />
        </span>
      </button>
    )
  }

  return (
    <div
      className={`rounded-lg border p-4 bg-white shadow-sm ${
        isCancelled ? 'border-red-300' : 'border-cwth-border'
      }`}
    >
      {isCancelled && (
        <div className="mb-3 -mx-4 -mt-4 px-4 py-1.5 bg-red-600 rounded-t-lg">
          <span className="text-white text-xs font-bold tracking-wider uppercase">
            Cancelled
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-2">
        <CategoryBadge label={event.category} />
        {event.delivery_mode && (
          <DeliveryModeBadge mode={event.delivery_mode} />
        )}
      </div>

      <h3 className="font-bold text-cwth-dark text-base leading-snug mb-1">
        {event.title}
      </h3>

      <p className="text-sm text-cwth-mid-grey mb-1">
        <span>{formatDateShort(event.event_date)}</span>
        {timeRange && <span> · {timeRange}</span>}
      </p>

      {event.location && (
        <p className="text-sm text-cwth-mid-grey mb-1">
          📍 {event.location}
        </p>
      )}

      {event.organiser_team && (
        <p className="text-xs text-cwth-mid-grey mb-2">
          {event.organiser_team}
        </p>
      )}

      {event.description && (
        <p className="text-sm text-cwth-dark leading-relaxed mt-2 mb-3">
          {event.description}
        </p>
      )}

      {event.target_audience && (
        <p className="text-xs text-cwth-mid-grey mb-3">
          <span className="font-medium">For:</span> {event.target_audience}
        </p>
      )}

      {event.booking_url && (
        <a
          href={event.booking_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-cwth-teal text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-teal-600 transition-colors"
          onClick={e => e.stopPropagation()}
        >
          Book / Find Out More →
        </a>
      )}
    </div>
  )
}
