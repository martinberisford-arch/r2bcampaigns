import { mockCalendar } from '../../lib/mockData';
import { supabase } from '../../lib/supabase';
import type { CalendarItem } from '../../lib/types';

const hasSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

export async function listCalendarItems(): Promise<CalendarItem[]> {
  if (!hasSupabase) return mockCalendar;
  const { data, error } = await supabase.from('calendar_items').select('*').order('starts_at');
  if (error) throw error;
  return data as CalendarItem[];
}
