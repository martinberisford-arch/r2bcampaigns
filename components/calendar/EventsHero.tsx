'use client'

import { motion } from 'motion/react'

export default function EventsHero() {
  function scrollToCalendar() {
    document.getElementById('calendar-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
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
      </div>
    </section>
  )
}
