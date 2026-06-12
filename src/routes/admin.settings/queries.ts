import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
