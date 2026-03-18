'use client'

import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'

interface ParsedRow {
  title: string
  event_date: string
  category: string
  booking_url?: string
  description?: string
  start_time?: string
  end_time?: string
  location?: string
  delivery_mode?: string
  organiser_name?: string
  organiser_email?: string
  organiser_team?: string
  target_audience?: string
  status?: string
  _valid: boolean
  _errors: string[]
}

// Detect which canonical field a column header maps to.
// Priority: exact match → contains match → null (ignored)
function detectField(raw: string): string | null {
  const h = raw.toLowerCase().trim()

  // Exact matches first
  const exact: Record<string, string> = {
    name: 'title', title: 'title',
    'event name': 'title', 'event title': 'title',
    date: 'event_date', 'event date': 'event_date', event_date: 'event_date',
    category: 'category', type: 'category',
    url: 'booking_url', link: 'booking_url',
    'booking url': 'booking_url', booking_url: 'booking_url',
    'registration url': 'booking_url', 'sign up': 'booking_url',
    description: 'description', details: 'description', about: 'description',
    time: 'start_time', 'start time': 'start_time', start_time: 'start_time',
    'end time': 'end_time', end_time: 'end_time',
    location: 'location', venue: 'location', place: 'location',
    'delivery mode': 'delivery_mode', delivery_mode: 'delivery_mode',
    delivery: 'delivery_mode', format: 'delivery_mode',
    organiser: 'organiser_name', 'organiser name': 'organiser_name', organiser_name: 'organiser_name',
    'organiser email': 'organiser_email', organiser_email: 'organiser_email',
    team: 'organiser_team', 'organiser team': 'organiser_team', organiser_team: 'organiser_team',
    audience: 'target_audience', 'target audience': 'target_audience', target_audience: 'target_audience',
    status: 'status',
  }
  if (exact[h]) return exact[h]

  // Contains-based fallback — ordered from most specific to least
  if (h.includes('date')) return 'event_date'
  if (h.includes('audience') || h.includes('who is')) return 'target_audience'
  if (h.includes('location') || h.includes('venue')) return 'location'
  if (h.includes('description') || h.includes('detail') || h.includes('about')) return 'description'
  if (h.includes('category') || h.includes('topic')) return 'category'
  if (h.includes('organis') || (h.includes('contact') && !h.includes('email'))) return 'organiser_name'
  if (h.includes('email')) return 'organiser_email'
  if (h.includes('team') || h.includes('department')) return 'organiser_team'
  if (h.includes('delivery') || h.includes('format') || (h.includes('mode') && !h.includes('url'))) return 'delivery_mode'
  if (h.includes('end time') || h.includes('end_time') || h.includes('finish')) return 'end_time'
  if ((h.includes('start') && h.includes('time')) || h === 'time') return 'start_time'
  if (h.includes('status')) return 'status'
  // URL/link — only if header is clearly a booking/event link, not a scraper artifact
  if ((h.includes('booking') || h.includes('register') || h.includes('sign up') || h === 'url' || h === 'link') && h.includes('url') || h === 'url' || h === 'link') return 'booking_url'

  return null
}

function parseExcelDate(value: unknown): string | null {
  if (typeof value === 'number') {
    const date = new Date((value - 25569) * 86400 * 1000)
    if (!isNaN(date.getTime())) return date.toISOString().split('T')[0]
  }
  const str = String(value ?? '').trim()
  if (!str) return null

  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str

  // DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const dmy = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/)
  if (dmy) {
    const [, d, m, y] = dmy
    const year = y.length === 2 ? `20${y}` : y
    return `${year}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }

  // Natural parse fallback
  const parsed = new Date(str)
  if (!isNaN(parsed.getTime())) return parsed.toISOString().split('T')[0]

  return null
}

interface DetectedColumn { original: string; field: string }

function parseSheetToRows(sheet: XLSX.WorkSheet): { rows: ParsedRow[]; detected: DetectedColumn[]; ignored: string[] } {
  const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
    raw: false,
  })

  if (json.length === 0) return { rows: [], detected: [], ignored: [] }

  const headers = Object.keys(json[0])

  // Build index→field mapping, tracking detected vs ignored columns
  const indexToField: Record<number, string> = {}
  const detected: DetectedColumn[] = []
  const ignored: string[] = []
  // Track which canonical fields have been claimed (first match wins)
  const claimed = new Set<string>()

  headers.forEach((h, i) => {
    const field = detectField(h)
    if (field && !claimed.has(field)) {
      indexToField[i] = field
      claimed.add(field)
      detected.push({ original: h, field })
    } else if (!field || claimed.has(field)) {
      // Only list as "ignored" if it's a non-scraper-internal column
      const lower = h.toLowerCase()
      if (!lower.startsWith('web_scraper') && !lower.startsWith('data') && !['price', 'image', 'id'].includes(lower)) {
        ignored.push(h)
      }
    }
  })

  const rows = json.map((rawRow) => {
    const row: Record<string, string> = {}
    headers.forEach((key, i) => {
      const field = indexToField[i]
      if (field) {
        const val = String(rawRow[key] ?? '').trim()
        // Don't overwrite with empty
        if (val) row[field] = val
      }
    })

    // Re-parse date
    if (row.event_date) {
      const parsed = parseExcelDate(row.event_date)
      if (parsed) row.event_date = parsed
    }

    // Default category to 'Other' — never block import over a missing category
    if (!row.category) row.category = 'Other'

    const errors: string[] = []
    if (!row.title) errors.push('Missing title/name column')
    if (!row.event_date) errors.push('Missing date')
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(row.event_date)) errors.push(`Unrecognised date: "${row.event_date}"`)

    return {
      ...row,
      _valid: errors.length === 0,
      _errors: errors,
    } as ParsedRow
  })

  return { rows, detected, ignored }
}

const FIELD_LABELS: Record<string, string> = {
  title: 'Title', event_date: 'Date', category: 'Category',
  booking_url: 'Booking URL', description: 'Description',
  start_time: 'Start time', end_time: 'End time', location: 'Location',
  delivery_mode: 'Delivery mode', organiser_name: 'Organiser',
  organiser_email: 'Email', organiser_team: 'Team',
  target_audience: 'Audience', status: 'Status',
}

export default function BulkUploadPage() {
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [detected, setDetected] = useState<DetectedColumn[]>([])
  const [ignored, setIgnored] = useState<string[]>([])
  const [fileName, setFileName] = useState('')
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ inserted: number; errors: Array<{ row: number; message: string }> } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    setFileName(file.name)
    setResult(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result
      const workbook = XLSX.read(data, { type: 'array', cellDates: true })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const parsed = parseSheetToRows(sheet)
      setRows(parsed.rows)
      setDetected(parsed.detected)
      setIgnored(parsed.ignored)
    }
    reader.readAsArrayBuffer(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  async function handleImport() {
    const valid = rows.filter(r => r._valid)
    if (valid.length === 0) return
    setImporting(true)
    setResult(null)
    try {
      const res = await fetch('/api/events/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rows: valid.map(({ _valid: _, _errors: __, ...rest }) => rest),
        }),
      })
      const data = await res.json()
      setResult(data)
      if (data.inserted > 0) {
        setRows(prev => prev.filter(r => !r._valid))
        setDetected([])
        setIgnored([])
      }
    } catch {
      setResult({ inserted: 0, errors: [{ row: 0, message: 'Network error — please try again' }] })
    } finally {
      setImporting(false)
    }
  }

  const validCount = rows.filter(r => r._valid).length
  const invalidCount = rows.filter(r => !r._valid).length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-cwth-dark font-heading">Bulk Upload</h1>
        <p className="text-sm text-cwth-mid-grey mt-1">
          Import events from an Excel (.xlsx) or CSV file. Column order doesn&apos;t matter — headers are matched automatically.
        </p>
      </div>

      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <strong>Only two columns are required:</strong> a title/name column and a date column.
        Everything else (location, audience, description, URL&hellip;) is detected automatically from your headers.
        Missing category defaults to <em>Other</em>.
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-cwth-border rounded-xl p-10 text-center cursor-pointer hover:border-cwth-teal hover:bg-teal-50 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />
        <p className="text-cwth-mid-grey text-sm">
          {fileName
            ? <>Loaded: <strong className="text-cwth-dark">{fileName}</strong> — click to replace</>
            : <>Drop your <strong>.xlsx</strong> or <strong>.csv</strong> file here, or click to browse</>}
        </p>
      </div>

      {/* Column detection summary */}
      {detected.length > 0 && (
        <div className="mt-4 rounded-lg border border-cwth-border bg-white p-4 text-sm">
          <p className="font-semibold text-cwth-dark mb-2">Columns detected</p>
          <div className="flex flex-wrap gap-2">
            {detected.map(({ original, field }) => (
              <span key={original} className="inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-xs text-green-800">
                <span className="font-mono text-green-600">{original}</span>
                <span className="text-green-400">→</span>
                {FIELD_LABELS[field] ?? field}
              </span>
            ))}
            {ignored.length > 0 && ignored.map(col => (
              <span key={col} className="inline-flex items-center rounded-full bg-gray-100 border border-gray-200 px-2.5 py-0.5 text-xs text-gray-400">
                <span className="font-mono">{col}</span>
                <span className="ml-1 text-gray-300">ignored</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Result banner */}
      {result && (
        <div className={`mt-4 rounded-lg p-4 text-sm ${result.inserted > 0 ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          {result.inserted > 0 && (
            <p className="font-semibold">✓ {result.inserted} event{result.inserted !== 1 ? 's' : ''} imported successfully.</p>
          )}
          {result.errors.length > 0 && (
            <ul className="mt-1 list-disc list-inside">
              {result.errors.map((e, i) => (
                <li key={i}>Row {e.row}: {e.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Preview table */}
      {rows.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-cwth-mid-grey">
              {rows.length} row{rows.length !== 1 ? 's' : ''} parsed —{' '}
              <span className="text-green-700 font-medium">{validCount} valid</span>
              {invalidCount > 0 && (
                <>, <span className="text-red-600 font-medium">{invalidCount} with errors</span></>
              )}
            </p>
            <button
              onClick={handleImport}
              disabled={validCount === 0 || importing}
              className="px-4 py-2 bg-cwth-blue text-white text-sm font-semibold rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing ? 'Importing…' : `Import ${validCount} event${validCount !== 1 ? 's' : ''}`}
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-cwth-border">
            <table className="min-w-full text-xs text-cwth-dark">
              <thead className="bg-gray-50 text-cwth-mid-grey uppercase tracking-wide">
                <tr>
                  <th className="px-3 py-2 text-left w-6">#</th>
                  <th className="px-3 py-2 text-left">Title</th>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-left">Location</th>
                  <th className="px-3 py-2 text-left">URL</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cwth-border">
                {rows.map((row, i) => (
                  <tr key={i} className={row._valid ? 'bg-white' : 'bg-red-50'}>
                    <td className="px-3 py-2 text-cwth-mid-grey">{i + 1}</td>
                    <td className="px-3 py-2 font-medium max-w-[180px] truncate" title={row.title}>
                      {row.title || <span className="text-red-500 italic">missing</span>}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.event_date || <span className="text-red-500 italic">missing</span>}
                    </td>
                    <td className="px-3 py-2 max-w-[120px] truncate">{row.category}</td>
                    <td className="px-3 py-2 max-w-[120px] truncate text-cwth-mid-grey" title={row.location}>
                      {row.location || '—'}
                    </td>
                    <td className="px-3 py-2 max-w-[140px] truncate">
                      {row.booking_url
                        ? <a href={row.booking_url} target="_blank" rel="noopener noreferrer" className="text-cwth-teal hover:underline">{row.booking_url}</a>
                        : <span className="text-cwth-mid-grey">—</span>}
                    </td>
                    <td className="px-3 py-2">
                      {row._valid
                        ? <span className="text-green-700 font-medium">✓ Ready</span>
                        : <span className="text-red-600">{row._errors.join(', ')}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
