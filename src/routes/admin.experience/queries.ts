import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  achievements: string[] | null;
  company_logo_url: string | null;
  display_order: number;
  is_visible: boolean;
}

export function useAdminExperiences() {
  return useQuery({
    queryKey: ['admin-experiences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('work_experiences')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) {throw error;}
      return data as WorkExperience[];
    },
  });
}

export function useCreateExperienceMutation(onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const { error } = await supabase.from('work_experiences').insert([data]);
      if (error) {throw error;}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
      toast({ title: 'Experience added successfully' });
      onSuccess();
    },
    onError: () => {
      toast({ title: 'Failed to add experience', variant: 'destructive' });
    },
  });
}

export function useUpdateExperienceMutation(onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { data: Record<string, unknown>; id: string; }) => {
      const { error } = await supabase.from('work_experiences').update(data).eq('id', id);
      if (error) {throw error;}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
      toast({ title: 'Experience updated successfully' });
      onSuccess();
    },
    onError: () => {
      toast({ title: 'Failed to update experience', variant: 'destructive' });
    },
  });
}

export function useDeleteExperienceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('work_experiences').delete().eq('id', id);
      if (error) {throw error;}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
      toast({ title: 'Experience deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete experience', variant: 'destructive' });
    },
  });
}

export function useToggleExperienceVisibilityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_visible }: { id: string; is_visible: boolean }) => {
      const { error } = await supabase.from('work_experiences').update({ is_visible: !is_visible }).eq('id', id);
      if (error) {throw error;}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
      toast({ title: 'Visibility updated' });
    },
  });
}
