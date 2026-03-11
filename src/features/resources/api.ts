import type { Resource } from '../../types/domain';
import type { ResourceInput } from '../../lib/validation/schemas';
import { mockResources } from '../../lib/mockData';
import { supabase } from '../../lib/supabase/client';

export async function listResources(projectId?: string): Promise<Resource[]> {
  if (!supabase) return projectId ? mockResources.filter((x) => x.project_id === projectId) : mockResources;
  let query = supabase.from('resources').select('*').order('created_at', { ascending: false });
  if (projectId) query = query.eq('project_id', projectId);
  const { data, error, status } = await query;
  if (status === 404) return projectId ? mockResources.filter((x) => x.project_id === projectId) : mockResources;
  if (error) throw error;
  return (data as Resource[]) ?? [];
}

export async function createResource(payload: ResourceInput): Promise<Resource> {
  if (!supabase) {
    const item: Resource = { id: crypto.randomUUID(), ...payload, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    mockResources.unshift(item);
    return item;
  }
  const { data, error } = await supabase.from('resources').insert(payload).select('*').single();
  if (error) throw error;
  return data as Resource;
}
