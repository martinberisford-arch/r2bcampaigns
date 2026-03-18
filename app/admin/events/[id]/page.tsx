import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EventForm from '@/components/admin/EventForm'
import { CalendarEvent } from '@/lib/types'

export const dynamic = 'force-dynamic'

interface Props {
  params: { id: string }
}

export default async function EditEventPage({ params }: Props) {
  const supabase = createClient()

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !event) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-sm text-cwth-teal hover:underline"
        >
          ← Back to events
        </Link>
        <h1 className="text-2xl font-bold text-cwth-dark font-heading mt-2">
          Edit Event
        </h1>
        <p className="text-sm text-cwth-mid-grey mt-1">{event.title}</p>
      </div>
      <EventForm event={event as CalendarEvent} />
    </div>
  )
}
