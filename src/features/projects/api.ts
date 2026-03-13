import type { Project } from '../../types/domain';
import type { ProjectInput } from '../../lib/validation/schemas';
import { mockProjects } from '../../lib/mockData';
import { supabase } from '../../lib/supabase/client';

export async function listProjects(): Promise<Project[]> {
  if (!supabase) return mockProjects;
  const { data, error, status } = await supabase.from('projects').select('*').is('archived_at', null).order('start_date', { ascending: false });
  if (status === 404) return mockProjects;
  if (error) throw error;
  return (data as Project[]) ?? [];
}

export async function getProject(id: string): Promise<Project | null> {
  if (!supabase) return mockProjects.find((item) => item.id === id) ?? null;
  const { data, error, status } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();
  if (status === 404) return mockProjects.find((item) => item.id === id) ?? null;
  if (error) throw error;
  return data as Project | null;
}

export async function createProject(payload: ProjectInput): Promise<Project> {
  if (!supabase) {
    const item: Project = { id: crypto.randomUUID(), ...payload, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), archived_at: null };
    mockProjects.unshift(item);
    return item;
  }
  const { data, error } = await supabase.from('projects').insert(payload).select('*').single();
  if (error) throw error;
  return data as Project;
}
