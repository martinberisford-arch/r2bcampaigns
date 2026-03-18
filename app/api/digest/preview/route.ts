import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildDigestHtml } from '@/lib/email/digestTemplate'
import { CalendarEvent } from '@/lib/types'
import { addDays, today } from '@/lib/utils'

export const dynamic = 'force-dynamic'

// GET /api/digest/preview — admin only, returns rendered HTML for in-panel preview
export async function GET(_request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const startDate = today()
    const endDate = addDays(startDate, 7)

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .gte('event_date', startDate)
      .lte('event_date', endDate)
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true, nullsFirst: false })

    if (error) {
      console.error('[GET /api/digest/preview]:', error)
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: 500 }
      )
    }

    const weekLabel = new Date(startDate + 'T00:00:00').toLocaleDateString(
      'en-GB',
      { day: 'numeric', month: 'long', year: 'numeric' }
    )
    const html = buildDigestHtml((events ?? []) as CalendarEvent[], weekLabel)

    return NextResponse.json({ html, eventCount: events?.length ?? 0 })
  } catch (err) {
    console.error('[GET /api/digest/preview]:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
