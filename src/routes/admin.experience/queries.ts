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

/**
 * Fetches work experience records from Supabase ordered by `display_order` ascending.
 *
 * @returns The React Query result object whose `data` is an array of `WorkExperience` records.
 * @throws The Supabase error if the query fails.
 */
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

/**
 * Create a React Query mutation that inserts a work experience record into the database.
 *
 * @param onSuccess - Callback invoked after a successful insert and after cache invalidation and success toast have been performed.
 * @returns The React Query mutation configured to insert a `work_experiences` record and perform success/error side effects.
 */
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

/**
 * Creates a React Query mutation for updating a work experience record by id.
 *
 * @param onSuccess - Callback invoked after the experience is successfully updated
 * @returns A React Query mutation object for performing the update and handling success/error side effects
 */
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

/**
 * Creates a mutation that deletes a work experience by id.
 *
 * @returns A React Query mutation object whose mutation function accepts an `id` string and deletes the matching `work_experiences` record; on success it invalidates `['admin-experiences']` and shows a success toast, on error it shows a destructive error toast.
 */
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

/**
 * Creates a mutation to toggle the `is_visible` flag of a work experience by id.
 *
 * @returns A mutation that accepts `{ id, is_visible }` and, when executed, sets `is_visible` to the opposite value for the specified work experience, invalidates the `['admin-experiences']` query, and shows a success toast.
 */
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
