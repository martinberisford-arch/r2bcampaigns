'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { DELIVERY_MODES, ROLES } from '@/lib/types'

const MONTHS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
]

export default function FilterBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get('q') ?? '')

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    updateParams('q', search)
  }

  function handleReset() {
    setSearch('')
    startTransition(() => {
      router.push(pathname)
    })
  }

  const activeRole = searchParams.get('role') ?? ''
  const hasFilters =
    searchParams.get('delivery_mode') ||
    searchParams.get('month') ||
    searchParams.get('q') ||
    activeRole

  return (
    <div className="bg-white border-b border-cwth-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">

        {/* ── Role filter — primary, full-width row ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label
            htmlFor="filter-role"
            className="text-xs font-bold text-cwth-dark uppercase tracking-wide whitespace-nowrap"
          >
            Filter by role
          </label>
          <select
            id="filter-role"
            value={activeRole}
            onChange={e => updateParams('role', e.target.value === 'All Staff' ? '' : e.target.value)}
            className="h-9 rounded-md border-2 border-cwth-teal bg-white px-3 text-sm font-medium text-cwth-dark focus:outline-none focus:ring-2 focus:ring-cwth-teal sm:w-72"
          >
            {ROLES.map(r => (
              <option key={r} value={r === 'All Staff' ? '' : r}>
                {r}
              </option>
            ))}
          </select>
          <p className="text-xs text-cwth-mid-grey sm:ml-2">
            Select your staff group to see the most relevant opportunities.
          </p>
        </div>

        {/* ── Secondary filters ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">
          {/* Delivery Mode */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="filter-mode"
              className="text-xs font-semibold text-cwth-mid-grey uppercase tracking-wide"
            >
              Format
            </label>
            <select
              id="filter-mode"
              value={searchParams.get('delivery_mode') ?? ''}
              onChange={e => updateParams('delivery_mode', e.target.value)}
              className="h-9 rounded-md border border-cwth-border bg-white px-3 text-sm text-cwth-dark focus:outline-none focus:ring-2 focus:ring-cwth-teal"
            >
              <option value="">All Formats</option>
              {DELIVERY_MODES.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Month */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="filter-month"
              className="text-xs font-semibold text-cwth-mid-grey uppercase tracking-wide"
            >
              Month
            </label>
            <select
              id="filter-month"
              value={searchParams.get('month') ?? ''}
              onChange={e => updateParams('month', e.target.value)}
              className="h-9 rounded-md border border-cwth-border bg-white px-3 text-sm text-cwth-dark focus:outline-none focus:ring-2 focus:ring-cwth-teal"
            >
              <option value="">All Months</option>
              {MONTHS.map(m => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col gap-1 flex-1 min-w-[200px]"
          >
            <label
              htmlFor="filter-search"
              className="text-xs font-semibold text-cwth-mid-grey uppercase tracking-wide"
            >
              Search
            </label>
            <div className="flex gap-2">
              <input
                id="filter-search"
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search events…"
                className="h-9 flex-1 rounded-md border border-cwth-border bg-white px-3 text-sm text-cwth-dark placeholder:text-cwth-mid-grey focus:outline-none focus:ring-2 focus:ring-cwth-teal"
              />
              <button
                type="submit"
                className="h-9 px-3 bg-cwth-teal text-white text-sm rounded-md hover:bg-teal-600 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Reset */}
          {hasFilters && (
            <button
              onClick={handleReset}
              className="h-9 px-4 text-sm text-cwth-mid-grey border border-cwth-border rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
