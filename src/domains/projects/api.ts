import { supabase } from '../../lib/supabase';
import type { Project } from '../../lib/types';
import { mockProjects } from '../../lib/mockData';
import type { ProjectInput } from '../../lib/schemas';

const hasSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

export async function listProjects(): Promise<Project[]> {
  if (!hasSupabase) return mockProjects;
  const { data, error } = await supabase.from('projects').select('*').is('archived_at', null).order('start_date', { ascending: false });
  if (error) throw error;
  return data as Project[];
}

export async function createProject(payload: ProjectInput): Promise<Project> {
  if (!hasSupabase) {
    const project: Project = {
      id: crypto.randomUUID(),
      ...payload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      archived_at: null
    };
    mockProjects.unshift(project);
    return project;
  }

  const { data, error } = await supabase.from('projects').insert(payload).select('*').single();
  if (error) throw error;
  return data as Project;
}
