import { supabase } from '../../lib/supabase/client';

export async function signIn(email: string, password: string) {
  if (!supabase) return { demo: true };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return { demo: false };
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
