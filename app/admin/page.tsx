import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import EventTable from '@/components/admin/EventTable'
import { CalendarEvent } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = createClient()

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .neq('status', 'deleted')
    .order('event_date', { ascending: true })

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700 font-medium">Failed to load events</p>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-cwth-dark font-heading">
            Events
          </h1>
          <p className="text-sm text-cwth-mid-grey mt-1">
            Manage all events in the calendar.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="px-4 py-2 bg-cwth-blue text-white text-sm font-semibold rounded-md hover:bg-blue-800 transition-colors"
        >
          + New Event
        </Link>
      </div>

      <EventTable events={(events as CalendarEvent[]) ?? []} />
    </div>
  )
}
