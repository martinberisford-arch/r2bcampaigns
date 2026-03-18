import Link from 'next/link'
import EventForm from '@/components/admin/EventForm'

export default function NewEventPage() {
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
          Create New Event
        </h1>
      </div>
      <EventForm />
    </div>
  )
}
