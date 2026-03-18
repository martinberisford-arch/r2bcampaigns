import { CATEGORY_COLOURS } from '@/lib/types'

interface BadgeProps {
  label: string
  className?: string
}

export function CategoryBadge({ label, className = '' }: BadgeProps) {
  const colour = CATEGORY_COLOURS[label] ?? 'bg-gray-100 text-gray-700'
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colour} ${className}`}
    >
      {label}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const colours: Record<string, string> = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-800',
  }
  const dots: Record<string, string> = {
    published: 'bg-green-500',
    draft: 'bg-gray-400',
    cancelled: 'bg-red-500',
  }
  const colour = colours[status] ?? 'bg-gray-100 text-gray-600'
  const dot = dots[status] ?? 'bg-gray-400'
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${colour}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export function DeliveryModeBadge({ mode }: { mode: string }) {
  const colours: Record<string, string> = {
    'In Person': 'bg-orange-100 text-orange-800',
    Online: 'bg-blue-100 text-blue-800',
    Hybrid: 'bg-violet-100 text-violet-800',
  }
  const colour = colours[mode] ?? 'bg-gray-100 text-gray-700'
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colour}`}
    >
      {mode}
    </span>
  )
}
