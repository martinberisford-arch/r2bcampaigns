export type Role = 'admin' | 'member';

export const PROJECT_TYPES = [
  'Service Delivery',
  'Event',
  'Campaign',
  'Fundraising',
  'Volunteer Recruitment',
  'Partnership',
  'Training / Workshop',
  'Awareness Activity',
  'School Activity',
  'Family Support',
  'Community Support',
  'Other'
] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const PROJECT_STATUSES = ['Idea', 'Planned', 'Active', 'On Hold', 'Complete'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const ACTION_STATUSES = ['To Do', 'Doing', 'Done'] as const;
export type ActionStatus = (typeof ACTION_STATUSES)[number];

export const PRIORITIES = ['Low', 'Medium', 'High'] as const;
export type Priority = (typeof PRIORITIES)[number];

export const CALENDAR_TYPES = ['Event', 'Deadline', 'Meeting', 'Social Post', 'Awareness Day', 'Review Date', 'Activity', 'Other'] as const;
export type CalendarType = (typeof CALENDAR_TYPES)[number];

export const OUTCOME_TYPES = [
  'Engagement',
  'Attendance',
  'Feedback',
  'Referral',
  'Volunteer Interest',
  'Partnership Development',
  'Resource Distribution',
  'Awareness Raising',
  'Family Support',
  'Other'
] as const;
export type OutcomeType = (typeof OUTCOME_TYPES)[number];

export const RESOURCE_TYPES = ['Document', 'Image', 'Template', 'Link', 'Social Copy', 'Brand Asset', 'Report', 'Form', 'Other'] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

export interface LinkItem { label: string; url: string }

export interface Project {
  id: string;
  title: string;
  type: ProjectType;
  status: ProjectStatus;
  summary: string;
  description: string;
  lead_name: string;
  start_date: string;
  end_date: string | null;
  target_audience: string;
  key_purpose: string;
  partners: string[];
  funding_source: string | null;
  budget_note: string | null;
  tags: string[];
  related_links: LinkItem[];
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface Action {
  id: string;
  project_id: string;
  title: string;
  notes: string;
  owner_name: string;
  status: ActionStatus;
  due_date: string | null;
  priority: Priority;
  created_at: string;
  updated_at: string;
}

export interface CalendarItem {
  id: string;
  project_id: string | null;
  title: string;
  type: CalendarType;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Outcome {
  id: string;
  project_id: string;
  date: string;
  activity: string;
  outcome_type: OutcomeType;
  audience: string;
  number_reached: number | null;
  summary: string;
  impact_note: string;
  quote_or_story: string | null;
  evidence_links: LinkItem[];
  follow_up_needed: boolean;
  follow_up_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  project_id: string | null;
  title: string;
  type: ResourceType;
  description: string;
  link: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Profile {
  user_id: string;
  full_name: string;
  role: Role;
}
