'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { Monitor, Users, Shuffle, ExternalLink } from 'lucide-react'
import { CalendarEvent, CATEGORY_COLOURS } from '@/lib/types'
import { formatTimeRange } from '@/lib/utils'

// Delivery mode indicator — 3-bar style like the economic calendar's volatility icon
const DeliveryIcon = ({ mode }: { mode: string | null | undefined }) => {
  if (!mode) return <div className="w-8" />
  const icon =
    mode === 'Online' ? (
      <Monitor className="h-3.5 w-3.5 text-blue-500" />
    ) : mode === 'Hybrid' ? (
      <Shuffle className="h-3.5 w-3.5 text-violet-500" />
    ) : (
      <Users className="h-3.5 w-3.5 text-orange-500" />
    )

  const label =
    mode === 'Online' ? 'Online' : mode === 'Hybrid' ? 'Hybrid' : 'In Person'

  return (
    <div className="flex items-center gap-1">
      {icon}
      <span className="text-[10px] font-medium text-cwth-mid-grey">{label}</span>
    </div>
  )
}

// Category accent dot
const CATEGORY_ACCENT: Record<string, string> = {
  'Training & Education': 'bg-blue-500',
  'Clinical Development': 'bg-teal-500',
  'Leadership & Management': 'bg-indigo-500',
  'Wellbeing & Support': 'bg-green-500',
  'Networking & Events': 'bg-sky-500',
  'PCN & ICB Updates': 'bg-purple-500',
  Other: 'bg-gray-400',
}

export const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 120, damping: 16 },
  },
}

interface EventCardSlideProps {
  event: CalendarEvent
  onClick?: () => void
}

export const EventCardSlide = React.forwardRef<HTMLDivElement, EventCardSlideProps>(
  ({ event, onClick }, ref) => {
    const timeRange = formatTimeRange(event.start_time, event.end_time)
    const accentDot = CATEGORY_ACCENT[event.category] ?? 'bg-gray-400'
    const isCancelled = event.status === 'cancelled'

    const infoFields = [
      {
        label: 'Time',
        value: timeRange || 'TBC',
      },
      {
        label: 'Where',
        value: event.location ?? (event.delivery_mode === 'Online' ? 'Online' : 'TBC'),
      },
      {
        label: 'For',
        value: event.target_audience ?? event.organiser_team ?? '—',
      },
    ]

    return (
      <div
        ref={ref}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick() } : undefined}
        className={`flex-shrink-0 w-72 bg-white border border-cwth-border rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-shadow duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      >
        {/* Top row: time badge + delivery mode */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            {event.start_time ? (
              <span className="text-xs font-semibold text-cwth-teal bg-teal-50 px-2 py-0.5 rounded-md">
                {event.start_time.slice(0, 5)}
              </span>
            ) : (
              <span className="text-xs text-cwth-mid-grey">All day</span>
            )}
            {isCancelled && (
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                CANCELLED
              </span>
            )}
          </div>
          <DeliveryIcon mode={event.delivery_mode} />
        </div>

        {/* Category dot + title */}
        <div className="flex items-start gap-2.5 mb-3">
          <span className={`mt-1 shrink-0 w-2.5 h-2.5 rounded-full ${accentDot}`} />
          <h3 className="text-sm font-semibold text-cwth-dark leading-snug line-clamp-2">
            {event.title}
          </h3>
        </div>

        {/* Info grid — 3 fields like actual / forecast / prior */}
        <div className="grid grid-cols-3 text-center text-xs border-t border-cwth-border pt-2 mb-2">
          {infoFields.map(({ label, value }) => (
            <div key={label}>
              <p className="text-cwth-mid-grey mb-1">{label}</p>
              <p className="font-medium text-cwth-dark leading-tight line-clamp-2 px-0.5">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Booking link */}
        {event.booking_url && (
          <a
            href={event.booking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-cwth-teal hover:underline"
            onClick={e => e.stopPropagation()}
          >
            Book / Find Out More
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    )
  }
)
EventCardSlide.displayName = 'EventCardSlide'
