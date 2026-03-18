'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CalendarEvent } from '@/lib/types'
import { formatDateShort } from '@/lib/utils'
import { StatusBadge, CategoryBadge } from '@/components/shared/Badge'
import { Toast, useToast } from '@/components/shared/Toast'

interface EventTableProps {
  events: CalendarEvent[]
}

export default function EventTable({ events: initialEvents }: EventTableProps) {
  const router = useRouter()
  const { toast, showToast, hideToast } = useToast()
  const [events, setEvents] = useState(initialEvents)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const filtered = events.filter(e => {
    if (statusFilter && e.status !== statusFilter) return false
    if (categoryFilter && e.category !== categoryFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        e.title.toLowerCase().includes(q) ||
        (e.organiser_team ?? '').toLowerCase().includes(q) ||
        (e.description ?? '').toLowerCase().includes(q)
      )
    }
    return true
  })

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setEvents(prev => prev.filter(e => e.id !== id))
      showToast('Event deleted successfully.', 'success')
    } catch {
      showToast('Failed to delete event. Please try again.', 'error')
    } finally {
      setDeleteId(null)
    }
  }

  async function handleDuplicate(event: CalendarEvent) {
    try {
      const { id, created_at, updated_at, ...rest } = event
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...rest,
          title: `${rest.title} (copy)`,
          status: 'draft',
        }),
      })
      if (!res.ok) throw new Error('Duplicate failed')
      const { event: newEvent } = await res.json()
      setEvents(prev => [newEvent, ...prev])
      showToast('Event duplicated as draft.', 'success')
    } catch {
      showToast('Failed to duplicate event.', 'error')
    }
  }

  const uniqueCategories = Array.from(new Set(events.map(e => e.category))).sort()

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search events…"
          className="h-9 px-3 rounded-md border border-cwth-border text-sm text-cwth-dark focus:outline-none focus:ring-2 focus:ring-cwth-teal flex-1 min-w-[200px]"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-9 px-3 rounded-md border border-cwth-border text-sm text-cwth-dark focus:outline-none focus:ring-2 focus:ring-cwth-teal"
        >
          <option value="">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="h-9 px-3 rounded-md border border-cwth-border text-sm text-cwth-dark focus:outline-none focus:ring-2 focus:ring-cwth-teal"
        >
          <option value="">All Categories</option>
          {uniqueCategories.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-cwth-border">
        <table className="min-w-full divide-y divide-cwth-border text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-cwth-dark">
                Title
              </th>
              <th className="px-4 py-3 text-left font-semibold text-cwth-dark">
                Date
              </th>
              <th className="px-4 py-3 text-left font-semibold text-cwth-dark hidden sm:table-cell">
                Category
              </th>
              <th className="px-4 py-3 text-left font-semibold text-cwth-dark">
                Status
              </th>
              <th className="px-4 py-3 text-left font-semibold text-cwth-dark hidden md:table-cell">
                Organiser
              </th>
              <th className="px-4 py-3 text-right font-semibold text-cwth-dark">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-cwth-border">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-cwth-mid-grey"
                >
                  No events match your filters.
                </td>
              </tr>
            ) : (
              filtered.map(event => (
                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-cwth-dark max-w-[200px]">
                    <span className="line-clamp-2">{event.title}</span>
                  </td>
                  <td className="px-4 py-3 text-cwth-mid-grey whitespace-nowrap">
                    {formatDateShort(event.event_date)}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <CategoryBadge label={event.category} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={event.status} />
                  </td>
                  <td className="px-4 py-3 text-cwth-mid-grey hidden md:table-cell">
                    {event.organiser_team ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="text-xs text-cwth-blue hover:underline font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDuplicate(event)}
                        className="text-xs text-cwth-teal hover:underline font-medium"
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={() => setDeleteId(event.id)}
                        className="text-xs text-red-600 hover:underline font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-cwth-mid-grey mt-2">
        Showing {filtered.length} of {events.length} events
      </p>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative z-10 bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-cwth-dark mb-2">
              Delete event?
            </h3>
            <p className="text-sm text-cwth-mid-grey mb-6">
              This action cannot be undone. The event will be permanently
              removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm border border-cwth-border rounded-md text-cwth-dark hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  )
}
