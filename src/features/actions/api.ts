import type { Action } from '../../types/domain';
import type { ActionInput } from '../../lib/validation/schemas';
import { mockActions } from '../../lib/mockData';
import { supabase } from '../../lib/supabase/client';

export async function listActions(projectId?: string): Promise<Action[]> {
  if (!supabase) return projectId ? mockActions.filter((x) => x.project_id === projectId) : mockActions;
  let query = supabase.from('actions').select('*').order('due_date', { ascending: true });
  if (projectId) query = query.eq('project_id', projectId);
  const { data, error, status } = await query;
  if (status === 404) return projectId ? mockActions.filter((x) => x.project_id === projectId) : mockActions;
  if (error) throw error;
  return (data as Action[]) ?? [];
}

export async function createAction(payload: ActionInput): Promise<Action> {
  if (!supabase) {
    const item: Action = { id: crypto.randomUUID(), ...payload, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    mockActions.unshift(item);
    return item;
  }
  const { data, error } = await supabase.from('actions').insert(payload).select('*').single();
  if (error) throw error;
  return data as Action;
}
