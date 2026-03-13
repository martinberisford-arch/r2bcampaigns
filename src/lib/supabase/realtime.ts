import { useEffect } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { supabase } from './client';

export function useRealtimeInvalidation(queryClient: QueryClient, channels: Array<{ table: string; queryKey: readonly unknown[] }>) {
  useEffect(() => {
    const client = supabase;
    if (!client) return;

    const subscriptions = channels.map(({ table, queryKey }) =>
      client
        .channel(`realtime-${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
          queryClient.invalidateQueries({ queryKey });
        })
        .subscribe()
    );

    return () => {
      subscriptions.forEach((channel) => {
        client.removeChannel(channel);
      });
    };
  }, [channels, queryClient]);
}
