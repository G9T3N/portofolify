import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) { throw error; }
      return data;
    },
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) { throw error; }
      return data;
    },
    enabled: !!id,
  });
}

export function useProjectImages(projectId: string) {
  return useQuery({
    queryKey: ["project-images", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_images")
        .select("*")
        .eq("project_id", projectId)
        .order("display_order", { ascending: true });
      if (error) { throw error; }
      return data;
    },
    enabled: !!projectId,
  });
}
