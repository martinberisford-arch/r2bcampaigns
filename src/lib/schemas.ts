import { z } from 'zod';
import { PROJECT_STATUSES, PROJECT_TYPES } from './types';

const linkSchema = z.object({ label: z.string().min(1), url: z.string().url() });
const actionSchema = z.object({ title: z.string().min(1), done: z.boolean() });

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
  key_purpose: z.string().min(5),
  partners: z.array(z.string()),
  funding_source: z.string().nullable(),
  budget_note: z.string().nullable(),
  tags: z.array(z.string()),
  related_links: z.array(linkSchema),
  action_items: z.array(actionSchema)
});

export type ProjectInput = z.infer<typeof projectSchema>;
