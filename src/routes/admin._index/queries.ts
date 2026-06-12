import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useNavigate } from "react-router";
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
