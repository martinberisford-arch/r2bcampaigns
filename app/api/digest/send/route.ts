import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getResendClient } from '@/lib/email/resend'
import { buildDigestHtml } from '@/lib/email/digestTemplate'
import { CalendarEvent } from '@/lib/types'
import { addDays, today } from '@/lib/utils'

export const dynamic = 'force-dynamic'

// POST /api/digest/send — admin only, sends the weekly digest email
export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const recipientEmail: string =
      body.to ||
      process.env.DIGEST_RECIPIENT_EMAIL ||
      ''

    if (!recipientEmail) {
      return NextResponse.json(
        { error: 'No recipient email configured. Set DIGEST_RECIPIENT_EMAIL.' },
        { status: 400 }
      )
    }

    // Fetch events for next 7 days
    const startDate = today()
    const endDate = addDays(startDate, 7)

    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .gte('event_date', startDate)
      .lte('event_date', endDate)
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true, nullsFirst: false })

    if (eventsError) {
      console.error('[POST /api/digest/send] Supabase error:', eventsError)
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

    // Send via Resend
    const resend = getResendClient()
    const { data: sendData, error: sendError } = await resend.emails.send({
      from: `CWTH Events <${process.env.ADMIN_EMAIL || 'noreply@cwtraininghub.co.uk'}>`,
      to: recipientEmail,
      subject: `CWTH Events & Training — Week of ${weekLabel}`,
      html,
    })

    if (sendError) {
      console.error('[POST /api/digest/send] Resend error:', sendError)
      return NextResponse.json(
        { error: `Email send failed: ${sendError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      messageId: sendData?.id,
      eventCount: events?.length ?? 0,
    })
  } catch (err) {
    console.error('[POST /api/digest/send] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
