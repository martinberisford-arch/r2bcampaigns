import { z } from 'zod';
import {
  ACTION_STATUSES,
  CALENDAR_TYPES,
  OUTCOME_TYPES,
  PRIORITIES,
  PROJECT_STATUSES,
  PROJECT_TYPES,
  RESOURCE_TYPES
} from '../../types/domain';

const linkSchema = z.object({ label: z.string().min(1), url: z.string().url() });

export const projectSchema = z.object({
  title: z.string().min(3),
  type: z.enum(PROJECT_TYPES),
  status: z.enum(PROJECT_STATUSES),
  summary: z.string().min(10),
  description: z.string().min(10),
  lead_name: z.string().min(2),
  start_date: z.string().min(1),
  end_date: z.string().nullable(),
  target_audience: z.string().min(2),
  key_purpose: z.string().min(3),
  partners: z.array(z.string()),
  funding_source: z.string().nullable(),
  budget_note: z.string().nullable(),
  tags: z.array(z.string()),
  related_links: z.array(linkSchema)
});

export const actionSchema = z.object({
  project_id: z.string().uuid(),
  title: z.string().min(2),
  notes: z.string().default(''),
  owner_name: z.string().min(2),
  status: z.enum(ACTION_STATUSES),
  due_date: z.string().nullable(),
  priority: z.enum(PRIORITIES)
});

export const calendarSchema = z.object({
  project_id: z.string().uuid().nullable(),
  title: z.string().min(2),
  type: z.enum(CALENDAR_TYPES),
  starts_at: z.string().min(1),
  ends_at: z.string().nullable(),
  location: z.string().nullable(),
  notes: z.string().nullable()
});

export const outcomeSchema = z.object({
  project_id: z.string().uuid(),
  date: z.string().min(1),
  activity: z.string().min(2),
  outcome_type: z.enum(OUTCOME_TYPES),
  audience: z.string().min(2),
  number_reached: z.number().int().nonnegative().nullable(),
  summary: z.string().min(6),
  impact_note: z.string().min(6),
  quote_or_story: z.string().nullable(),
  evidence_links: z.array(linkSchema),
  follow_up_needed: z.boolean(),
  follow_up_note: z.string().nullable()
});

export const resourceSchema = z.object({
  project_id: z.string().uuid().nullable(),
  title: z.string().min(2),
  type: z.enum(RESOURCE_TYPES),
  description: z.string().min(4),
  link: z.string().url(),
  tags: z.array(z.string())
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type ActionInput = z.infer<typeof actionSchema>;
export type CalendarInput = z.infer<typeof calendarSchema>;
export type OutcomeInput = z.infer<typeof outcomeSchema>;
export type ResourceInput = z.infer<typeof resourceSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
