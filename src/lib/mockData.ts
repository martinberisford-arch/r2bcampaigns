import type { CalendarItem, Project, Resource, Story } from './types';

export const mockProjects: Project[] = [
  {
    id: 'p1',
    title: 'Family Coffee & Chat Spring Term',
    type: 'Family Support',
    status: 'Active',
    summary: 'Weekly drop-in with childcare support and guided signposting.',
    description: 'An informal weekly support session run at the community hall for parents and carers.',
    lead_name: 'Aisha Khan',
    start_date: '2026-01-20',
    end_date: null,
    target_audience: 'Parents and carers',
    key_purpose: 'Reduce isolation and connect families to practical support.',
    partners: ['Hope Community Hall'],
    funding_source: 'Local donations',
    budget_note: 'Refreshments donated fortnightly.',
    tags: ['families', 'wellbeing'],
    related_links: [{ label: 'Session plan', url: 'https://example.com/plan' }],
    action_items: [{ title: 'Confirm volunteer rota', done: false }],
    created_at: '2026-01-01',
    updated_at: '2026-02-02',
    archived_at: null
  }
];

export const mockCalendar: CalendarItem[] = [
  {
    id: 'c1',
    project_id: 'p1',
    title: 'Coffee Morning',
    type: 'Activity',
    starts_at: '2026-03-14T10:00:00Z',
    ends_at: '2026-03-14T12:00:00Z'
  }
];

export const mockResources: Resource[] = [{ id: 'r1', title: 'Safeguarding guidance', url: 'https://example.com/safe', notes: 'Reviewed Jan 2026' }];

export const mockStories: Story[] = [
  {
    id: 's1',
    title: 'Parent confidence grew',
    what_happened: 'A parent attended three sessions and joined a school volunteering group.',
    why_it_matters: 'Shows confidence and social connection improved.',
    evidence_note: 'Facilitator notes and attendance register.',
    project_id: 'p1',
    date: '2026-02-10'
  }
];
