'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'motion/react'
import { EventsColumn } from '@/components/ui/EventsColumn'
import { CalendarEvent } from '@/lib/types'

export default function EventsHero() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [ready, setReady] = useState(false)
  const calendarRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(d => {
        setEvents(d.events ?? [])
        setReady(true)
      })
      .catch(() => setReady(true))
  }, [])

  function scrollToCalendar() {
    const el = document.getElementById('calendar-section')
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Don't render hero if there are very few events — not enough to look good
  if (ready && events.length < 4) return null

  // Distribute events round-robin across three columns so each gets variety
  const col1 = events.filter((_, i) => i % 3 === 0)
  const col2 = events.filter((_, i) => i % 3 === 1)
  const col3 = events.filter((_, i) => i % 3 === 2)

  return (
    <section className="relative overflow-hidden bg-cwth-dark">
      {/* Subtle grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-0 pt-14 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <div className="mb-4 inline-block rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-medium text-white/70 backdrop-blur-sm">
            Coventry &amp; Warwickshire Training Hub
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Upcoming Training &amp; Events
          </h1>
          <p className="mt-3 text-sm text-white/60">
            CPD, clinical development, leadership courses and networking across the region.
          </p>
          <button
            onClick={scrollToCalendar}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-cwth-teal px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cwth-teal/25 transition-all hover:bg-teal-400 hover:-translate-y-0.5 active:translate-y-0"
          >
            Browse the full calendar
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </motion.div>

        {/* Scrolling columns — fade out at top and bottom */}
        {ready && events.length >= 4 ? (
          <div className="flex justify-center gap-5 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_80%,transparent)] max-h-[420px]">
            <EventsColumn events={col1} duration={20} />
            <EventsColumn events={col2} className="hidden md:block" duration={27} />
            <EventsColumn events={col3} className="hidden lg:block" duration={23} />
          </div>
        ) : (
          // Loading skeleton — three ghost columns
          <div className="flex justify-center gap-5 overflow-hidden max-h-[420px]">
            {[1, 2, 3].map((col) => (
              <div
                key={col}
                className={`flex flex-col gap-4 w-72 ${col === 2 ? 'hidden md:flex' : col === 3 ? 'hidden lg:flex' : ''}`}
              >
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-36 w-72 rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
