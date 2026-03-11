export type Role = 'admin' | 'member';

export type ProjectStatus = 'Idea' | 'Planned' | 'Active' | 'On Hold' | 'Complete';

export const PROJECT_STATUSES = ['Idea', 'Planned', 'Active', 'On Hold', 'Complete'] as const;

export type ProjectType =
  | 'Service Delivery'
  | 'Event'
  | 'Campaign'
  | 'Fundraising'
  | 'Volunteer Recruitment'
  | 'Partnership'
  | 'Training / Workshop'
  | 'Awareness Activity'
  | 'School Activity'
  | 'Family Support'
  | 'Other';

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
  'Other'
] as const;

export interface LinkItem {
  label: string;
  url: string;
}

export interface ActionItem {
  title: string;
  done: boolean;
}

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
  action_items: ActionItem[];
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface CalendarItem {
  id: string;
  project_id: string | null;
  title: string;
  type: 'Meeting' | 'Activity' | 'Deadline' | 'Community Event' | 'Other';
  starts_at: string;
  ends_at: string;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  notes: string;
}

export interface Story {
  id: string;
  title: string;
  what_happened: string;
  why_it_matters: string;
  evidence_note: string;
  project_id: string | null;
  date: string;
}
