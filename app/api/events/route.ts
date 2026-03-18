import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// GET /api/events — public, returns published events
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const delivery_mode = searchParams.get('delivery_mode')
  const month = searchParams.get('month')
  const q = searchParams.get('q')

  try {
    const supabase = createClient()
    const today = new Date().toISOString().split('T')[0]

    let query = supabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .gte('event_date', today)
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true, nullsFirst: false })

    if (category) {
      query = query.eq('category', category)
    }
    if (delivery_mode) {
      query = query.eq('delivery_mode', delivery_mode)
    }
    if (month) {
      const monthNum = parseInt(month, 10)
      const year = new Date().getFullYear()
      // Get events in a specific month (current year first, then next if past)
      const currentMonth = new Date().getMonth() + 1
      const targetYear = monthNum < currentMonth ? year + 1 : year
      const startDate = `${targetYear}-${String(monthNum).padStart(2, '0')}-01`
      const endDate = new Date(targetYear, monthNum, 0)
        .toISOString()
        .split('T')[0]
      query = query.gte('event_date', startDate).lte('event_date', endDate)
    }
    if (q) {
      query = query.or(
        `title.ilike.%${q}%,description.ilike.%${q}%,organiser_team.ilike.%${q}%`
      )
    }

    const { data: events, error } = await query

    if (error) {
      console.error('[GET /api/events] Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: 500 }
      )
    }

    return NextResponse.json({ events: events ?? [] })
  } catch (err) {
    console.error('[GET /api/events] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/events — admin only, creates an event
export async function POST(request: NextRequest) {
  try {
    // Check auth
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const body = await request.json()
    const { title, event_date, category, status = 'draft', ...rest } = body

    // Validate required fields
    if (!title || !event_date || !category) {
      return NextResponse.json(
        { error: 'title, event_date, and category are required' },
        { status: 400 }
      )
    }

    const adminClient = createAdminClient()
    const { data: event, error } = await adminClient
      .from('events')
      .insert({ title, event_date, category, status, ...rest })
      .select()
      .single()

    if (error) {
      console.error('[POST /api/events] Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create event' },
        { status: 500 }
      )
    }

    return NextResponse.json({ event }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/events] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
