'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Header from '@/components/shared/Header'
import EventsHero from '@/components/calendar/EventsHero'
import FilterBar from '@/components/calendar/FilterBar'
import SplitCalendarView from '@/components/calendar/SplitCalendarView'
import { CalendarEvent } from '@/lib/types'

function CalendarContent() {
  const searchParams = useSearchParams()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      const category = searchParams.get('category')
      const delivery_mode = searchParams.get('delivery_mode')
      const month = searchParams.get('month')
      const q = searchParams.get('q')
      const role = searchParams.get('role')
      if (category) params.set('category', category)
      if (delivery_mode) params.set('delivery_mode', delivery_mode)
      if (month) params.set('month', month)
      if (q) params.set('q', q)
      if (role) params.set('role', role)

      const res = await fetch(`/api/events?${params.toString()}`, {
        cache: 'no-store',
      })
      if (!res.ok) throw new Error('Failed to load events')
      const data = await res.json()
      setEvents(data.events ?? [])
    } catch {
      setError('Unable to load events. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return (
    <div>
      <FilterBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-cwth-mid-grey">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span className="text-sm">Loading events…</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600 text-base mb-2">{error}</p>
            <p className="text-xs text-cwth-mid-grey mb-4">
              If you are on a restricted NHS network, please check your connection or contact your IT support.
            </p>
            <button
              onClick={fetchEvents}
              className="text-sm text-cwth-blue underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <SplitCalendarView events={events} />
        )}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <EventsHero />
        <section id="calendar-section">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20">
                <span className="text-cwth-mid-grey text-sm">Loading…</span>
              </div>
            }
          >
            <CalendarContent />
          </Suspense>
        </section>
      </main>
    </div>
  )
}
