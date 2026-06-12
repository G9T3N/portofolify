import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) { throw error; }
      return data;
    },
  });
}

export function useSkillCategories() {
  return useQuery({
    queryKey: ["skill-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skill_categories")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) { throw error; }
      return data;
    },
  });
}
