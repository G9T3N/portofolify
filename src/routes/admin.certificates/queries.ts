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
