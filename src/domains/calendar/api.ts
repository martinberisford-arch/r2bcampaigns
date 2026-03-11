import { mockCalendar } from '../../lib/mockData';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import type { CalendarItem } from '../../lib/types';

export async function listCalendarItems(): Promise<CalendarItem[]> {
  if (!isSupabaseConfigured || !supabase) return mockCalendar;
  const { data, error } = await supabase.from('calendar_items').select('*').order('starts_at');
  if (error) throw error;
  return data as CalendarItem[];
}
