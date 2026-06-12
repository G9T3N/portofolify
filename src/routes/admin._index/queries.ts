import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useNavigate } from "react-router";
/**
 * Fetches all projects for the admin view, ordered by `created_at` descending (newest first).
 *
 * @returns The query result containing the fetched array of project records (objects with string keys and unknown values), or `undefined` while loading.
 * @throws The Supabase error if the query fails.
 */
export function useAdminProjects() {
  return useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {throw error;}
      return data;
    },
  });
}

/**
 * Creates a callable that deletes a project by id and refreshes admin query caches.
 *
 * @returns A function that accepts a project `id` and deletes the corresponding row from the `projects` table; on successful deletion it invalidates the `admin-projects` and `admin-stats` queries.
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();
  return async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    }
  };
}

type Project = Record<string, unknown>;

/**
 * Composes navigation, UI state, and data operations used by the admin projects UI.
 *
 * @returns An object containing:
 * - `navigate` — navigation function from React Router.
 * - `projectDialogOpen` — whether the project dialog is open.
 * - `setProjectDialogOpen` — setter for `projectDialogOpen`.
 * - `editingProject` — the project currently being edited, or `null`.
 * - `setEditingProject` — setter for `editingProject`.
 * - `deleteProject` — the project selected for deletion, or `null`.
 * - `setDeleteProject` — setter for `deleteProject`.
 * - `projects` — the list of projects fetched for the admin view (may be `undefined` while loading).
 * - `isLoading` — `true` while projects are being fetched, `false` otherwise.
 * - `deleteProjectFn` — function that deletes a project by its `id`.
 */
export function useAdminProjectsState() {
  const navigate = useNavigate();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);
  const { data: projects, isLoading } = useAdminProjects();
  const deleteProjectFn = useDeleteProject();

  return {
    navigate,
    projectDialogOpen,
    setProjectDialogOpen,
    editingProject,
    setEditingProject,
    deleteProject,
    setDeleteProject,
    projects,
    isLoading,
    deleteProjectFn
  };
}

/**
 * Creates a mutation for saving a project record (inserts a new record or updates an existing one) and invalidates related caches on success.
 *
 * @param onSuccess - Callback invoked after a successful save and cache invalidation.
 * @param onError - Callback invoked with the mutation error when the save fails.
 * @returns A React Query mutation that inserts `data` into the `projects` table when `data.id` is absent or updates the existing row when `data.id` is present; on success it invalidates the `["admin-projects"]` and `["projects"]` queries.
 */
export function useSaveProjectMutation(onSuccess: () => void, onError: (error: unknown) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, unknown> & { id?: string }) => {
      if (data.id) {
        const { error } = await supabase
          .from('projects')
          .update(data)
          .eq('id', data.id);
        if (error) {throw error;}
      } else {
        const { error } = await supabase.from('projects').insert(data);
        if (error) {throw error;}
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onSuccess();
    },
    onError: (error) => {
      onError(error);
    },
  });
}
