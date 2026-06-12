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

/**
 * Fetches and caches skill category rows ordered by `display_order`.
 *
 * @returns The query result containing an array of `SkillCategory` objects.
 * @throws The Supabase error returned when fetching categories fails.
 */
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

/**
 * Retrieve the list of skills sorted by `display_order`.
 *
 * @returns The React Query result whose `data` is an array of `Skill` objects sorted by `display_order`.
 */
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

/**
 * Provides a React Query mutation for creating or updating a skill.
 *
 * The mutation either updates an existing skill when `isEdit` and `skillId` are provided, or inserts a new skill when creating. On success it invalidates the `['skills']` query, shows a success toast, and calls the supplied callback; on error it shows a destructive toast.
 *
 * @param onSuccess - Callback invoked after a successful insert or update
 * @returns The React Query mutation object used to execute the skill create/update operation
 */
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

/**
 * Creates a React Query mutation that deletes a skill by id.
 *
 * The mutation function accepts a single `id: string` argument and deletes the corresponding row from the `skills` table. On success it invalidates the `['skills']` query and shows a "Skill deleted" toast. The mutation throws the Supabase error if deletion fails.
 *
 * @returns A mutation object whose mutation function expects `id: string`
 */
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

/**
 * Create a mutation that toggles a skill's `is_visible` flag.
 *
 * The mutation accepts an object `{ id, isVisible }`, updates the skill's `is_visible`
 * column to the inverse of `isVisible`, and invalidates the `['skills']` query on success.
 *
 * @returns A React Query mutation result that performs the visibility toggle when executed.
 * @throws The Supabase error if the update operation fails.
 */
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

/**
 * Creates a React Query mutation for inserting or updating skill categories.
 *
 * @param onSuccess - Callback invoked after a successful create or update operation
 * @returns A React Query mutation that accepts `{ isEdit, categoryId?, category }` and either inserts a new category or updates an existing one
 */
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

/**
 * Creates a React Query mutation that deletes a skill category by id.
 *
 * The mutation deletes the row from `skill_categories`, and on success invalidates both
 * `['skill-categories']` and `['skills']`, shows a "Category deleted" toast, and invokes the
 * provided `onSuccess` callback.
 *
 * @param onSuccess - Callback invoked after successful deletion and cache invalidation
 * @returns A React Query mutation object for deleting a category by `id`
 * @throws Throws the Supabase error when the delete operation fails
 */
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
