import type { Outcome } from '../../types/domain';
import type { OutcomeInput } from '../../lib/validation/schemas';
import { mockOutcomes } from '../../lib/mockData';
import { supabase } from '../../lib/supabase/client';

export async function listOutcomes(projectId?: string): Promise<Outcome[]> {
  if (!supabase) return projectId ? mockOutcomes.filter((x) => x.project_id === projectId) : mockOutcomes;
  let query = supabase.from('outcomes').select('*').order('date', { ascending: false });
  if (projectId) query = query.eq('project_id', projectId);
  const { data, error, status } = await query;
  if (status === 404) return projectId ? mockOutcomes.filter((x) => x.project_id === projectId) : mockOutcomes;
  if (error) throw error;
  return (data as Outcome[]) ?? [];
}

export async function createOutcome(payload: OutcomeInput): Promise<Outcome> {
  if (!supabase) {
    const item: Outcome = { id: crypto.randomUUID(), ...payload, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    mockOutcomes.unshift(item);
    return item;
  }
  const { data, error } = await supabase.from('outcomes').insert(payload).select('*').single();
  if (error) throw error;
  return data as Outcome;
}
