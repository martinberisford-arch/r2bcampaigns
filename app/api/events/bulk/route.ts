import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { CATEGORIES, DELIVERY_MODES } from '@/lib/types'

export const dynamic = 'force-dynamic'

interface BulkRow {
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
}

// POST /api/events/bulk — admin only, bulk creates events from parsed rows
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const { rows }: { rows: BulkRow[] } = await request.json()

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'No rows provided' }, { status: 400 })
    }

    const adminClient = createAdminClient()
    const inserted: string[] = []
    const errors: Array<{ row: number; message: string }> = []

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      if (!row.title || !row.event_date || !row.category) {
        errors.push({ row: i + 1, message: 'Missing title, date, or category' })
        continue
      }

      // Normalise category: fuzzy match to a valid category
      const normCat = normaliseCategory(row.category)
      // Normalise delivery mode
      const normMode = row.delivery_mode
        ? normaliseDeliveryMode(row.delivery_mode)
        : null

      const payload = {
        title: row.title.trim(),
        event_date: row.event_date,
        category: normCat,
        status: normaliseStatus(row.status),
        booking_url: row.booking_url?.trim() || null,
        description: row.description?.trim() || null,
        start_time: row.start_time?.trim() || null,
        end_time: row.end_time?.trim() || null,
        location: row.location?.trim() || null,
        delivery_mode: normMode,
        organiser_name: row.organiser_name?.trim() || null,
        organiser_email: row.organiser_email?.trim() || null,
        organiser_team: row.organiser_team?.trim() || null,
        target_audience: row.target_audience?.trim() || null,
      }

      const { error } = await adminClient.from('events').insert(payload)
      if (error) {
        errors.push({ row: i + 1, message: error.message })
      } else {
        inserted.push(row.title)
      }
    }

    return NextResponse.json({ inserted: inserted.length, errors })
  } catch (err) {
    console.error('[POST /api/events/bulk]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function normaliseCategory(raw: string): string {
  const lower = raw.toLowerCase().trim()
  for (const cat of CATEGORIES) {
    if (cat.toLowerCase() === lower) return cat
  }
  // Partial match
  for (const cat of CATEGORIES) {
    if (cat.toLowerCase().includes(lower) || lower.includes(cat.toLowerCase().split(' ')[0])) {
      return cat
    }
  }
  return 'Other'
}

function normaliseDeliveryMode(raw: string): string | null {
  const lower = raw.toLowerCase().trim()
  for (const mode of DELIVERY_MODES) {
    if (mode.toLowerCase() === lower) return mode
  }
  if (lower.includes('online') || lower.includes('virtual') || lower.includes('remote')) return 'Online'
  if (lower.includes('person') || lower.includes('face') || lower.includes('f2f')) return 'In Person'
  if (lower.includes('hybrid')) return 'Hybrid'
  return null
}

function normaliseStatus(raw?: string): string {
  if (!raw) return 'published'
  const lower = raw.toLowerCase().trim()
  if (['draft', 'cancelled', 'published'].includes(lower)) return lower
  return 'published'
}
