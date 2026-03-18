'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarEvent, CATEGORIES, DELIVERY_MODES } from '@/lib/types'
import { isValidUrl, today } from '@/lib/utils'
import { Toast, useToast } from '@/components/shared/Toast'

interface EventFormProps {
  event?: CalendarEvent
}

type FormData = {
  title: string
  description: string
  event_date: string
  start_time: string
  end_time: string
  location: string
  delivery_mode: string
  category: string
  target_audience: string
  booking_url: string
  organiser_team: string
  organiser_name: string
  organiser_email: string
  status: string
}

function validate(data: FormData): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!data.title.trim()) errors.title = 'Title is required'
  if (data.title.length > 100) errors.title = 'Title must be 100 characters or fewer'
  if (!data.event_date) errors.event_date = 'Date is required'
  if (!data.category) errors.category = 'Category is required'
  if (data.booking_url && !isValidUrl(data.booking_url))
    errors.booking_url = 'Must be a valid URL (include https://)'
  if (data.start_time && data.end_time && data.end_time <= data.start_time)
    errors.end_time = 'End time must be after start time'
  return errors
}

export default function EventForm({ event }: EventFormProps) {
  const router = useRouter()
  const { toast, showToast, hideToast } = useToast()
  const isEdit = Boolean(event)

  const [form, setForm] = useState<FormData>({
    title: event?.title ?? '',
    description: event?.description ?? '',
    event_date: event?.event_date ?? '',
    start_time: event?.start_time ?? '',
    end_time: event?.end_time ?? '',
    location: event?.location ?? '',
    delivery_mode: event?.delivery_mode ?? '',
    category: event?.category ?? '',
    target_audience: event?.target_audience ?? '',
    booking_url: event?.booking_url ?? '',
    organiser_team: event?.organiser_team ?? '',
    organiser_name: event?.organiser_name ?? '',
    organiser_email: event?.organiser_email ?? '',
    status: event?.status ?? 'draft',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [pastDateWarning, setPastDateWarning] = useState(false)

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (name === 'event_date') {
      setPastDateWarning(Boolean(value && value < today()))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    try {
      // Clean empty strings to null for optional fields
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])
      )

      const url = isEdit ? `/api/events/${event!.id}` : '/api/events'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Save failed')
      }

      showToast(
        isEdit ? 'Event updated successfully.' : 'Event created successfully.',
        'success'
      )
      setTimeout(() => router.push('/admin'), 1500)
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'An error occurred. Please try again.',
        'error'
      )
    } finally {
      setSubmitting(false)
    }
  }

  function fieldClass(name: string) {
    return `w-full rounded-md border px-3 py-2 text-sm text-cwth-dark focus:outline-none focus:ring-2 focus:ring-cwth-teal ${
      errors[name] ? 'border-red-400' : 'border-cwth-border'
    }`
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 max-w-2xl">
      {/* Status */}
      <div>
        <label className="block text-sm font-semibold text-cwth-dark mb-1">
          Status <span className="text-red-500">*</span>
        </label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className={fieldClass('status')}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {form.status === 'published' && (
          <p className="text-xs text-green-600 mt-1">
            This event will be visible on the public calendar.
          </p>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-cwth-dark mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          maxLength={100}
          className={fieldClass('title')}
          placeholder="e.g. Diabetes Management Update"
        />
        <div className="flex justify-between mt-1">
          {errors.title && (
            <p className="text-xs text-red-600">{errors.title}</p>
          )}
          <p className="text-xs text-cwth-mid-grey ml-auto">
            {form.title.length}/100
          </p>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-cwth-dark mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className={fieldClass('description')}
          placeholder="Brief description of the event…"
        />
      </div>

      {/* Date, Start time, End time */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-cwth-dark mb-1">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="event_date"
            value={form.event_date}
            onChange={handleChange}
            className={fieldClass('event_date')}
          />
          {errors.event_date && (
            <p className="text-xs text-red-600 mt-1">{errors.event_date}</p>
          )}
          {pastDateWarning && (
            <p className="text-xs text-amber-600 mt-1">
              This date is in the past.
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-cwth-dark mb-1">
            Start Time
          </label>
          <input
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            className={fieldClass('start_time')}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-cwth-dark mb-1">
            End Time
          </label>
          <input
            type="time"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            className={fieldClass('end_time')}
          />
          {errors.end_time && (
            <p className="text-xs text-red-600 mt-1">{errors.end_time}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-cwth-dark mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className={fieldClass('category')}
        >
          <option value="">Select a category…</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-xs text-red-600 mt-1">{errors.category}</p>
        )}
      </div>

      {/* Location & Delivery Mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-cwth-dark mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className={fieldClass('location')}
            placeholder="e.g. Rugby Library / Microsoft Teams"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-cwth-dark mb-1">
            Delivery Mode
          </label>
          <select
            name="delivery_mode"
            value={form.delivery_mode}
            onChange={handleChange}
            className={fieldClass('delivery_mode')}
          >
            <option value="">Select…</option>
            {DELIVERY_MODES.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Audience */}
      <div>
        <label className="block text-sm font-semibold text-cwth-dark mb-1">
          Target Audience
        </label>
        <input
          type="text"
          name="target_audience"
          value={form.target_audience}
          onChange={handleChange}
          className={fieldClass('target_audience')}
          placeholder="e.g. GPs, Practice Nurses, All Primary Care Staff"
        />
      </div>

      {/* Booking URL */}
      <div>
        <label className="block text-sm font-semibold text-cwth-dark mb-1">
          Booking / Find Out More URL
        </label>
        <input
          type="url"
          name="booking_url"
          value={form.booking_url}
          onChange={handleChange}
          className={fieldClass('booking_url')}
          placeholder="https://…"
        />
        {errors.booking_url && (
          <p className="text-xs text-red-600 mt-1">{errors.booking_url}</p>
        )}
      </div>

      {/* Organiser */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-cwth-dark mb-1">
            Organiser Team
          </label>
          <input
            type="text"
            name="organiser_team"
            value={form.organiser_team}
            onChange={handleChange}
            className={fieldClass('organiser_team')}
            placeholder="e.g. CWTH Education Team"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-cwth-dark mb-1">
            Organiser Name
          </label>
          <input
            type="text"
            name="organiser_name"
            value={form.organiser_name}
            onChange={handleChange}
            className={fieldClass('organiser_name')}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-cwth-dark mb-1">
            Organiser Email
          </label>
          <input
            type="email"
            name="organiser_email"
            value={form.organiser_email}
            onChange={handleChange}
            className={fieldClass('organiser_email')}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-cwth-blue text-white font-semibold rounded-md hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Event'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="px-6 py-2.5 border border-cwth-border text-cwth-dark rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </form>
  )
}
