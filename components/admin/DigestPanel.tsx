'use client'

import { useState } from 'react'
import { CalendarEvent } from '@/lib/types'

// Returns bounds for N weeks starting from next Monday
function getWeekRangeBounds(weeks: number = 1): { start: string; end: string; label: string } {
  const today = new Date()
  const day = today.getDay() // 0 = Sun, 1 = Mon … 6 = Sat
  const daysUntilMonday = day === 0 ? 1 : 8 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + daysUntilMonday)
  const endDate = new Date(monday)
  endDate.setDate(monday.getDate() + (weeks * 7) - 1)

  const toISO = (d: Date) => d.toISOString().split('T')[0]
  const toLabel = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  const label = weeks === 1
    ? toLabel(monday)
    : `${toLabel(monday)} – ${toLabel(endDate)}`

  return { start: toISO(monday), end: toISO(endDate), label }
}

// Given a date string, return which week number (1-based) it falls in relative to startMonday
function getWeekNumber(dateStr: string, startMonday: string): number {
  const d = new Date(dateStr + 'T00:00:00')
  const s = new Date(startMonday + 'T00:00:00')
  const diff = Math.floor((d.getTime() - s.getTime()) / (1000 * 60 * 60 * 24))
  return Math.floor(diff / 7) + 1
}

// Get the Monday date string for a given week number relative to startMonday
function getMondayForWeek(weekNum: number, startMonday: string): string {
  const s = new Date(startMonday + 'T00:00:00')
  s.setDate(s.getDate() + (weekNum - 1) * 7)
  return s.toISOString().split('T')[0]
}

// Pick up to 3 highlight events from a list — prioritise variety by category
function pickHighlights(events: CalendarEvent[], max: number = 3): CalendarEvent[] {
  if (events.length <= max) return events
  const seen = new Set<string>()
  const picks: CalendarEvent[] = []
  // First pass: one per category
  for (const e of events) {
    if (picks.length >= max) break
    if (!seen.has(e.category)) {
      seen.add(e.category)
      picks.push(e)
    }
  }
  // Second pass: fill remaining slots
  for (const e of events) {
    if (picks.length >= max) break
    if (!picks.includes(e)) picks.push(e)
  }
  return picks
}

// HH:MM:SS → HH:MM
function fmtTime(t: string | null | undefined) {
  return t ? t.slice(0, 5) : null
}

// Build an HTML digest — condensed bullet-point format, inline styles for Outlook
function buildDigestHtml(events: CalendarEvent[], weekLabel: string, weeks: number, startMonday: string): string {
  const TEAL = '#007b7b'
  const DARK = '#1a2d45'
  const MID  = '#6b7a8d'
  const BORDER = '#e2e8f0'

  const title = weeks === 1 ? 'Weekly Training &amp; Events Digest' : `Training &amp; Events Digest — ${weeks} Weeks`

  // Group events by week number
  const weekGroups: Record<number, CalendarEvent[]> = {}
  for (const e of events) {
    const wn = getWeekNumber(e.event_date, startMonday)
    if (!weekGroups[wn]) weekGroups[wn] = []
    weekGroups[wn].push(e)
  }

  let bodyContent = ''
  if (events.length === 0) {
    bodyContent = `<p style="color:${MID};font-size:14px;">No events scheduled for this period.</p>`
  } else {
    for (let w = 1; w <= weeks; w++) {
      const weekEvents = weekGroups[w] ?? []
      const mondayStr = getMondayForWeek(w, startMonday)
      const wcLabel = new Date(mondayStr + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })

      bodyContent += `
        <div style="margin-top:20px;">
          <h2 style="margin:0 0 8px 0;font-size:15px;font-weight:bold;color:${DARK};border-bottom:2px solid ${TEAL};padding-bottom:5px;">
            Week ${w} — w/c ${wcLabel}
          </h2>`

      if (weekEvents.length === 0) {
        bodyContent += `<p style="color:${MID};font-size:13px;margin:4px 0 0 16px;">No events this week.</p>`
      } else {
        const highlights = pickHighlights(weekEvents)
        const remaining = weekEvents.length - highlights.length
        bodyContent += `<ul style="margin:4px 0 0 0;padding-left:20px;">`
        for (const e of highlights) {
          const timeStr = fmtTime(e.start_time) ?? 'TBC'
          const dayLabel = new Date(e.event_date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
          const format = e.delivery_mode ? ` · ${e.delivery_mode}` : ''
          const bookLink = e.booking_url
            ? ` — <a href="${e.booking_url}" style="color:${TEAL};font-size:12px;">Book</a>`
            : ''
          bodyContent += `
            <li style="margin-bottom:8px;font-size:13px;color:${DARK};">
              <strong>${e.title}</strong><br>
              <span style="color:${MID};font-size:12px;">${dayLabel} · ${timeStr}${format}</span>${bookLink}
            </li>`
        }
        bodyContent += `</ul>`
        if (remaining > 0) {
          bodyContent += `<p style="color:${MID};font-size:12px;margin:2px 0 0 20px;">+ ${remaining} more event${remaining > 1 ? 's' : ''}</p>`
        }
      }
      bodyContent += `</div>`
    }
  }

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${DARK};max-width:640px;margin:0 auto;padding:16px;">
  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
    <tr>
      <td>
        <h1 style="margin:0;font-size:20px;font-weight:bold;color:${DARK};">
          ${title}
        </h1>
        <p style="margin:4px 0 0 0;font-size:13px;color:${MID};">${weekLabel}</p>
      </td>
    </tr>
  </table>
  <hr style="border:none;border-top:2px solid ${TEAL};margin-bottom:4px;">
  ${bodyContent}
  <hr style="border:none;border-top:1px solid ${BORDER};margin-top:32px;">
  <p style="font-size:11px;color:${MID};margin-top:8px;">Generated by CWTH Events Calendar</p>
</body></html>`
}

// Plain-text fallback — condensed bullet-point format
function buildDigestText(events: CalendarEvent[], weekLabel: string, weeks: number, startMonday: string): string {
  const heading = weeks === 1
    ? `Weekly Training & Events Digest — w/c ${weekLabel}`
    : `Training & Events Digest — ${weeks} Weeks\n${weekLabel}`

  if (events.length === 0) {
    return `${heading}\n\nNo events scheduled for this period.`
  }

  // Group by week number
  const weekGroups: Record<number, CalendarEvent[]> = {}
  for (const e of events) {
    const wn = getWeekNumber(e.event_date, startMonday)
    if (!weekGroups[wn]) weekGroups[wn] = []
    weekGroups[wn].push(e)
  }

  const lines = [heading, '═'.repeat(50), '']
  for (let w = 1; w <= weeks; w++) {
    const weekEvents = weekGroups[w] ?? []
    const mondayStr = getMondayForWeek(w, startMonday)
    const wcLabel = new Date(mondayStr + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
    lines.push(`WEEK ${w} — w/c ${wcLabel}`, '─'.repeat(30))

    if (weekEvents.length === 0) {
      lines.push('  No events this week.', '')
      continue
    }

    const highlights = pickHighlights(weekEvents)
    for (const e of highlights) {
      const timeStr = fmtTime(e.start_time) ?? 'TBC'
      const dayLabel = new Date(e.event_date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
      const format = e.delivery_mode ? ` · ${e.delivery_mode}` : ''
      lines.push(`• ${e.title}`)
      lines.push(`  ${dayLabel} · ${timeStr}${format}`)
      if (e.booking_url) lines.push(`  Book: ${e.booking_url}`)
      lines.push('')
    }
    const remaining = weekEvents.length - highlights.length
    if (remaining > 0) lines.push(`  + ${remaining} more event${remaining > 1 ? 's' : ''}`, '')
  }
  lines.push('═'.repeat(50), 'Generated by CWTH Events Calendar')
  return lines.join('\n')
}

// Copy rich HTML + plain-text fallback to clipboard
async function copyRichText(html: string, plain: string) {
  if (typeof ClipboardItem !== 'undefined') {
    const htmlBlob  = new Blob([html],  { type: 'text/html' })
    const textBlob  = new Blob([plain], { type: 'text/plain' })
    await navigator.clipboard.write([new ClipboardItem({ 'text/html': htmlBlob, 'text/plain': textBlob })])
  } else {
    // Fallback for browsers without ClipboardItem (e.g. Firefox without flag)
    await navigator.clipboard.writeText(plain)
  }
}

type CopyState = 'idle' | 'loading' | 'copied' | 'empty' | 'error'

const WEEK_OPTIONS = [1, 2, 3, 4] as const

export default function DigestPanel() {
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const [eventCount, setEventCount] = useState<number | null>(null)
  const [digestHtml, setDigestHtml] = useState<string | null>(null)
  const [weeks, setWeeks] = useState<number>(1)

  const { label: rangeLabel } = getWeekRangeBounds(weeks)

  async function handleGenerateAndCopy() {
    setCopyState('loading')
    setDigestHtml(null)

    try {
      const { start, end, label } = getWeekRangeBounds(weeks)

      const res = await fetch('/api/events', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to fetch events')

      const allEvents: CalendarEvent[] = (await res.json()).events ?? []

      const rangeEvents = allEvents.filter(e => e.event_date >= start && e.event_date <= end)
      setEventCount(rangeEvents.length)

      const html  = buildDigestHtml(rangeEvents, label, weeks, start)
      const plain = buildDigestText(rangeEvents, label, weeks, start)

      setDigestHtml(html)
      await copyRichText(html, plain)

      setCopyState(rangeEvents.length === 0 ? 'empty' : 'copied')
      setTimeout(() => setCopyState('idle'), 5000)
    } catch {
      setCopyState('error')
      setTimeout(() => setCopyState('idle'), 3000)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">

      {/* How it works */}
      <div className="bg-cwth-light-blue rounded-lg p-5 border border-blue-200">
        <h2 className="text-base font-bold text-cwth-dark mb-1">How it works</h2>
        <ol className="text-sm text-cwth-dark space-y-1 list-decimal list-inside">
          <li>Choose how many weeks to include (1–4), then click <strong>Generate</strong>.</li>
          <li>A condensed digest (3 highlights per week) is copied to your clipboard.</li>
          <li>Paste directly into a new Outlook email — formatting will be preserved.</li>
          <li>Review and send manually.</li>
        </ol>
        <p className="text-xs text-cwth-mid-grey mt-2">
          Generated entirely in your browser — no mailing list, no NHS email restrictions.
        </p>
      </div>

      {/* Week range selector */}
      <div>
        <label className="block text-sm font-medium text-cwth-dark mb-2">
          Digest length
        </label>
        <div className="inline-flex rounded-lg border border-cwth-border overflow-hidden">
          {WEEK_OPTIONS.map(n => (
            <button
              key={n}
              onClick={() => setWeeks(n)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                weeks === n
                  ? 'bg-cwth-teal text-white'
                  : 'bg-white text-cwth-dark hover:bg-cwth-light-blue'
              } ${n > 1 ? 'border-l border-cwth-border' : ''}`}
            >
              {n} week{n > 1 ? 's' : ''}
            </button>
          ))}
        </div>
        <p className="text-sm text-cwth-mid-grey mt-2">
          Will generate: <strong className="text-cwth-dark">{rangeLabel}</strong>
          <span className="text-xs ml-2">(3 highlights per week)</span>
        </p>
      </div>

      {/* Generate & Copy button */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          onClick={handleGenerateAndCopy}
          disabled={copyState === 'loading'}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-cwth-teal text-white font-semibold rounded-md hover:bg-teal-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {copyState === 'loading' ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating…
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Generate {weeks === 1 ? 'Weekly' : `${weeks}-Week`} Digest
            </>
          )}
        </button>

        {/* Status feedback */}
        {copyState === 'copied' && (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-green-700">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Digest copied — paste into Outlook to send.
          </span>
        )}
        {copyState === 'empty' && (
          <span className="text-sm text-cwth-mid-grey">
            No events found for the selected period — empty digest copied.
          </span>
        )}
        {copyState === 'error' && (
          <span className="text-sm text-red-600">
            Could not copy to clipboard. Check your browser permissions and try again.
          </span>
        )}
        {eventCount !== null && copyState === 'idle' && (
          <span className="text-sm text-cwth-mid-grey">
            Last run: {eventCount} event{eventCount !== 1 ? 's' : ''} found.
          </span>
        )}
      </div>

      {/* HTML preview — rendered in a sandboxed iframe so it looks like the actual email */}
      {digestHtml && (
        <div className="border border-cwth-border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-cwth-border flex items-center justify-between">
            <span className="text-xs font-semibold text-cwth-mid-grey uppercase tracking-wide">
              Email Preview
            </span>
            <span className="text-xs text-cwth-mid-grey">
              Formatting is preserved when pasted into Outlook
            </span>
          </div>
          <iframe
            srcDoc={digestHtml}
            title="Digest preview"
            className="w-full bg-white"
            style={{ height: '480px', border: 'none' }}
            sandbox="allow-same-origin"
          />
        </div>
      )}
    </div>
  )
}
