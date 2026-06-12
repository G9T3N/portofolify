import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Fetches the `cv_url` setting from the `site_settings` table.
 *
 * @returns The row containing the `cv_url` setting, or `null`/`undefined` if no matching row exists.
 */
export function useCVSetting() {
  return useQuery({
    queryKey: ['cv-setting'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'cv_url')
        .maybeSingle();
      if (error) {throw error;}
      return data;
    },
  });
}

/**
 * Create a React Query mutation to update the site's `cv_url` setting in `site_settings`.
 *
 * The mutation accepts a single argument — `url` (`string | null`) — which will be stored as the setting's `value`.
 *
 * @returns A React Query mutation object configured to update the `cv_url` row and invalidate the `['cv-setting']` query on success.
 * @throws The Supabase error when the update operation fails.
 */
export function useUpdateCVMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (url: string | null) => {
      const { error } = await supabase
        .from('site_settings')
        .update({ value: url, updated_at: new Date().toISOString() })
        .eq('key', 'cv_url');
      if (error) {throw error;}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cv-setting'] });
      toast({ title: 'CV updated successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to update CV', variant: 'destructive' });
    },
  });
}
