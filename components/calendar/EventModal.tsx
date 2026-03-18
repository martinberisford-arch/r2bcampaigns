'use client'

import { useEffect } from 'react'
import { CalendarEvent } from '@/lib/types'
import EventCard from './EventCard'

interface EventModalProps {
  event: CalendarEvent
  onClose: () => void
}

export default function EventModal({ event, onClose }: EventModalProps) {
  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Trap scroll on body
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Event details: ${event.title}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-cwth-dark hover:bg-white shadow transition-colors"
          aria-label="Close modal"
        >
          ×
        </button>
        <EventCard event={event} />
      </div>
    </div>
  )
}
