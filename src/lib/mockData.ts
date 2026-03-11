import type { Action, CalendarItem, Outcome, Project, Resource } from '../types/domain';

const now = new Date().toISOString();

export const mockProjects: Project[] = [
  {
    id: 'ab877e74-3dd5-4fd6-9be8-5741f58e0f01',
    title: 'Family Support Coffee Morning',
    type: 'Family Support',
    status: 'Active',
    summary: 'Weekly drop-in sessions helping parents feel connected and supported.',
    description: 'Friendly weekly session with refreshments, practical signposting, and peer support.',
    lead_name: 'Aisha Khan',
    start_date: '2026-01-10',
    end_date: null,
    target_audience: 'Parents and carers of autistic children',
    key_purpose: 'Reduce isolation and build confident local support networks.',
    partners: ['Hope Community Hall'],
    funding_source: 'Local donations',
    budget_note: 'Refreshments funded monthly.',
    tags: ['families', 'support group'],
    related_links: [{ label: 'Session checklist', url: 'https://example.com/checklist' }],
    created_at: now,
    updated_at: now,
    archived_at: null
  },
  {
    id: 'ab877e74-3dd5-4fd6-9be8-5741f58e0f02',
    title: 'School Autism Awareness Session',
    type: 'School Activity',
    status: 'Planned',
    summary: 'Interactive awareness workshop with local primary school staff.',
    description: 'Session focused on practical adjustments and inclusive classroom communication.',
    lead_name: 'Ruth Davies',
    start_date: '2026-04-20',
    end_date: null,
    target_audience: 'Teachers and support staff',
    key_purpose: 'Improve understanding and confidence in school settings.',
    partners: ['Oakfield Primary'],
    funding_source: null,
    budget_note: null,
    tags: ['school', 'awareness'],
    related_links: [],
    created_at: now,
    updated_at: now,
    archived_at: null
  }
];

export const mockActions: Action[] = [
  {
    id: '4a66f751-3944-4ccf-ba41-dae7212f2401',
    project_id: mockProjects[0].id,
    title: 'Confirm venue booking for next month',
    notes: 'Ask hall manager about school holiday access.',
    owner_name: 'Aisha Khan',
    status: 'To Do',
    due_date: '2026-03-18',
    priority: 'High',
    created_at: now,
    updated_at: now
  }
];

export const mockCalendarItems: CalendarItem[] = [
  {
    id: 'e89a6795-f75f-439f-b6df-137d4af47311',
    project_id: mockProjects[0].id,
    title: 'Coffee Morning Session',
    type: 'Activity',
    starts_at: '2026-03-20T10:00:00.000Z',
    ends_at: '2026-03-20T12:00:00.000Z',
    location: 'Hope Community Hall',
    notes: null,
    created_at: now,
    updated_at: now
  }
];

export const mockOutcomes: Outcome[] = [
  {
    id: '17d7af09-b3f3-4fbf-97ed-0d123a6bf101',
    project_id: mockProjects[0].id,
    date: '2026-03-01',
    activity: 'Coffee Morning',
    outcome_type: 'Attendance',
    audience: 'Parents and carers',
    number_reached: 14,
    summary: 'Families stayed longer and asked for more peer-led discussion time.',
    impact_note: 'Stronger trust and confidence to seek support from each other.',
    quote_or_story: '"I finally feel like I am not doing this alone."',
    evidence_links: [{ label: 'Attendance note', url: 'https://example.com/evidence' }],
    follow_up_needed: true,
    follow_up_note: 'Share local speech therapy resources next session.',
    created_at: now,
    updated_at: now
  }
];

export const mockResources: Resource[] = [
  {
    id: '59d7e46e-a2ec-4ef8-8fe9-fb220ee77501',
    project_id: null,
    title: 'Trustee Report Template',
    type: 'Template',
    description: 'Lightweight monthly summary template for trustees.',
    link: 'https://example.com/trustee-template',
    tags: ['trustee', 'reporting'],
    created_at: now,
    updated_at: now
  }
];
