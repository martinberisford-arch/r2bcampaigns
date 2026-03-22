export type DeliveryMode = 'In Person' | 'Online' | 'Hybrid'

export type EventStatus = 'published' | 'draft' | 'cancelled'

export type EventCategory =
  | 'Training & Education'
  | 'Clinical Development'
  | 'Leadership & Management'
  | 'Wellbeing & Support'
  | 'Networking & Events'
  | 'PCN & ICB Updates'
  | 'Other'

export interface CalendarEvent {
  id: string
  title: string
  description?: string | null
  event_date: string
  start_time?: string | null
  end_time?: string | null
  location?: string | null
  delivery_mode?: DeliveryMode | null
  category: string
  target_audience?: string | null
  booking_url?: string | null
  organiser_team?: string | null
  organiser_name?: string | null
  organiser_email?: string | null
  status: EventStatus
  created_at: string
  updated_at: string
}

export interface EventFilters {
  category?: string
  delivery_mode?: string
  month?: string
  q?: string
}

export const CATEGORIES: EventCategory[] = [
  'Training & Education',
  'Clinical Development',
  'Leadership & Management',
  'Wellbeing & Support',
  'Networking & Events',
  'PCN & ICB Updates',
  'Other',
]

export const DELIVERY_MODES: DeliveryMode[] = ['In Person', 'Online', 'Hybrid']

// Staff role filter options — used in FilterBar and for digest grouping
export const ROLES = [
  'All Staff',
  'GP',
  'GPNs',
  'GPAs',
  'PAs',
  'Paramedics',
  'OTs',
  'Dietitians',
  'Care Coordinators',
  'Administration and Clerical',
  'Clinical Pharmacists',
  'FCPs',
  'Health and Wellbeing Coaches',
  'Healthcare Assistants',
  'Pharmacy Technicians',
  'Podiatrists',
  'Practice Managers',
  'Social Prescribing Link Workers',
  'Internal CWTH Event',
] as const

export const CATEGORY_COLOURS: Record<string, string> = {
  'Training & Education': 'bg-blue-100 text-blue-800',
  'Clinical Development': 'bg-teal-100 text-teal-800',
  'Leadership & Management': 'bg-indigo-100 text-indigo-800',
  'Wellbeing & Support': 'bg-green-100 text-green-800',
  'Networking & Events': 'bg-sky-100 text-sky-800',
  'PCN & ICB Updates': 'bg-purple-100 text-purple-800',
  Other: 'bg-gray-100 text-gray-700',
}
