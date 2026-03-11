import type { CalendarItem } from '../../types/domain';
import type { CalendarInput } from '../../lib/validation/schemas';
import { mockCalendarItems } from '../../lib/mockData';
import { supabase } from '../../lib/supabase/client';

export async function listCalendarItems(projectId?: string): Promise<CalendarItem[]> {
  if (!supabase) return projectId ? mockCalendarItems.filter((x) => x.project_id === projectId) : mockCalendarItems;
  let query = supabase.from('calendar_items').select('*').order('starts_at', { ascending: true });
  if (projectId) query = query.eq('project_id', projectId);
  const { data, error, status } = await query;
  if (status === 404) return projectId ? mockCalendarItems.filter((x) => x.project_id === projectId) : mockCalendarItems;
  if (error) throw error;
  return (data as CalendarItem[]) ?? [];
}

export async function createCalendarItem(payload: CalendarInput): Promise<CalendarItem> {
  if (!supabase) {
    const item: CalendarItem = { id: crypto.randomUUID(), ...payload, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    mockCalendarItems.unshift(item);
    return item;
  }
  const { data, error } = await supabase.from('calendar_items').insert(payload).select('*').single();
  if (error) throw error;
  return data as CalendarItem;
}
