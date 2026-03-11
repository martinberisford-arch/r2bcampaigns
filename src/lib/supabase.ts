import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const fallbackSupabaseUrl = 'https://bbztaupejoabismgrzwj.supabase.co';
const fallbackPublishableKey = 'sb_publishable_5SxWfH26uoEjBdFHtcwM1A_Zr7gCXNU';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? fallbackSupabaseUrl;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? fallbackPublishableKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null;
