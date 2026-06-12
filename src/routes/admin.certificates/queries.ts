import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  logo_url: string | null;
  display_order: number;
  is_visible: boolean;
}

/**
 * Fetches certificate records for admin, ordered by `display_order`.
 *
 * @returns A query result whose `data` is an array of `Certificate` records sorted by `display_order`.
 * @throws If the Supabase query returns an error. 
 */
export function useAdminCertificates() {
  return useQuery({
    queryKey: ['admin-certificates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) {throw error;}
      return data as Certificate[];
    },
  });
}

/**
 * Creates a mutation hook to add a new certificate with an auto-assigned `display_order`.
 *
 * @param onSuccess - Callback invoked after a certificate is successfully created and cache invalidation completes
 * @returns A React Query mutation configured to insert a certificate into the `certificates` table; on success it invalidates the `['admin-certificates']` query, shows a success toast, and calls `onSuccess`; on error it shows a destructive toast.
 */
export function useCreateCertificateMutation(onSuccess: () => void) {
  const queryClient = useQueryClient();
  const { data: certificates } = useAdminCertificates();

  return useMutation({
    mutationFn: async (data: Omit<Certificate, 'id'>) => {
      const maxOrder = certificates?.length ? Math.max(...certificates.map(c => c.display_order)) : -1;
      const { error } = await supabase.from('certificates').insert({
        ...data,
        display_order: maxOrder + 1,
      });
      if (error) {throw error;}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
      toast({ title: 'Certificate added successfully' });
      onSuccess();
    },
    onError: () => {
      toast({ title: 'Failed to add certificate', variant: 'destructive' });
    },
  });
}

/**
 * Provides a React Query mutation to update a certificate by id and refresh the admin certificates list.
 *
 * @param onSuccess - Callback invoked after a successful update.
 * @returns A mutation object that accepts `{ id, data }` to update the certificate; on success it invalidates the `['admin-certificates']` query, shows a success toast and calls `onSuccess`; on error it shows a destructive failure toast.
 */
export function useUpdateCertificateMutation(onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { data: Omit<Certificate, 'id'>; id: string; }) => {
      const { error } = await supabase.from('certificates').update(data).eq('id', id);
      if (error) {throw error;}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
      toast({ title: 'Certificate updated successfully' });
      onSuccess();
    },
    onError: () => {
      toast({ title: 'Failed to update certificate', variant: 'destructive' });
    },
  });
}

/**
 * Provides a mutation hook to delete a certificate by id and refresh the admin certificates list.
 *
 * @returns A React Query mutation that accepts a certificate `id` and deletes that record from the `certificates` table; on success it invalidates the `['admin-certificates']` query and shows a success toast, on error it shows a destructive error toast.
 */
export function useDeleteCertificateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('certificates').delete().eq('id', id);
      if (error) {throw error;}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
      toast({ title: 'Certificate deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete certificate', variant: 'destructive' });
    },
  });
}

/**
 * Toggles the `is_visible` flag for a certificate record.
 *
 * @returns A React Query mutation that accepts `{ id, is_visible }`, flips `is_visible` for the specified certificate in the database, and invalidates the `['admin-certificates']` query on success.
 */
export function useToggleCertificateVisibilityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_visible }: { id: string; is_visible: boolean }) => {
      const { error } = await supabase.from('certificates').update({ is_visible: !is_visible }).eq('id', id);
      if (error) {throw error;}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
    },
  });
}
