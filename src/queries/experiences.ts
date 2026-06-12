import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useWorkExperiences() {
  return useQuery({
    queryKey: ["work-experiences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("work_experiences")
        .select("*")
        .order("start_date", { ascending: false });
      if (error) { throw error; }
      return data;
    },
  });
}
