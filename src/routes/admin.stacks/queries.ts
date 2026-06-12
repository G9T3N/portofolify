import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SkillCategory {
  id: string;
  name: string;
  display_order: number;
  created_at: string;
}

export interface Skill {
  id: string;
  category_id: string;
  name: string;
  logo_url: string | null;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  display_order: number;
  is_visible: boolean;
  created_at: string;
}

export function useSkillCategories() {
  return useQuery({
    queryKey: ['skill-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skill_categories')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) {throw error;}
      return data as SkillCategory[];
    },
  });
}

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) {throw error;}
      return data as Skill[];
    },
  });
}

export function useSkillMutation(onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      isEdit: boolean;
      skillId?: string;
      categoryId?: string;
      skill: { name: string; logo_url: string; proficiency: Skill['proficiency']; display_order: number };
    }) => {
      if (data.isEdit && data.skillId) {
        const { error } = await supabase
          .from('skills')
          .update({
            name: data.skill.name,
            logo_url: data.skill.logo_url || null,
            proficiency: data.skill.proficiency,
            display_order: data.skill.display_order,
          })
          .eq('id', data.skillId);
        if (error) {throw error;}
      } else {
        const { error } = await supabase.from('skills').insert([{
          name: data.skill.name,
          logo_url: data.skill.logo_url || null,
          proficiency: data.skill.proficiency,
          display_order: data.skill.display_order,
          category_id: data.categoryId!,
        }]);
        if (error) {throw error;}
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast({ title: variables.isEdit ? 'Skill updated' : 'Skill added successfully' });
      onSuccess();
    },
    onError: () => {
      toast({ title: 'Failed to save skill', variant: 'destructive' });
    },
  });
}

export function useDeleteSkillMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) {throw error;}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast({ title: 'Skill deleted' });
    },
  });
}

export function useToggleSkillVisibilityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isVisible }: { id: string; isVisible: boolean }) => {
      const { error } = await supabase
        .from('skills')
        .update({ is_visible: !isVisible })
        .eq('id', id);
      if (error) {throw error;}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}

export function useCategoryMutation(onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      isEdit: boolean;
      categoryId?: string;
      category: { name: string; display_order: number };
    }) => {
      if (data.isEdit && data.categoryId) {
        const { error } = await supabase
          .from('skill_categories')
          .update({
            name: data.category.name,
            display_order: data.category.display_order,
          })
          .eq('id', data.categoryId);
        if (error) {throw error;}
      } else {
        const { error } = await supabase.from('skill_categories').insert([{
          name: data.category.name,
          display_order: data.category.display_order,
        }]);
        if (error) {throw error;}
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['skill-categories'] });
      toast({ title: variables.isEdit ? 'Category updated' : 'Category added' });
      onSuccess();
    },
    onError: () => {
      toast({ title: 'Failed to save category', variant: 'destructive' });
    },
  });
}

export function useDeleteCategoryMutation(onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('skill_categories').delete().eq('id', id);
      if (error) {throw error;}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skill-categories'] });
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast({ title: 'Category deleted' });
      onSuccess();
    },
  });
}
