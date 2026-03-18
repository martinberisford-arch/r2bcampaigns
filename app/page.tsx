'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Header from '@/components/shared/Header'
import FilterBar from '@/components/calendar/FilterBar'
import WeeklyView from '@/components/calendar/WeeklyView'
import ListView from '@/components/calendar/ListView'
import { CalendarEvent } from '@/lib/types'

function CalendarContent() {
  const searchParams = useSearchParams()
  const [view, setView] = useState<'weekly' | 'list'>('weekly')
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
      if (category) params.set('category', category)
      if (delivery_mode) params.set('delivery_mode', delivery_mode)
      if (month) params.set('month', month)
      if (q) params.set('q', q)

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

      {/* View toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-cwth-mid-grey font-medium mr-2">View:</span>
          <button
            onClick={() => setView('weekly')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === 'weekly'
                ? 'bg-cwth-blue text-white'
                : 'border border-cwth-border text-cwth-dark hover:bg-cwth-light-blue'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === 'list'
                ? 'bg-cwth-blue text-white'
                : 'border border-cwth-border text-cwth-dark hover:bg-cwth-light-blue'
            }`}
          >
            List
          </button>
        </div>

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
            <button
              onClick={fetchEvents}
              className="text-sm text-cwth-blue underline"
            >
              Try again
            </button>
          </div>
        ) : view === 'weekly' ? (
          <WeeklyView events={events} />
        ) : (
          <ListView events={events} />
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
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <span className="text-cwth-mid-grey text-sm">Loading…</span>
            </div>
          }
        >
          <CalendarContent />
        </Suspense>
      </main>
    </div>
  )
}
