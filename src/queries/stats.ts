import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches aggregated admin counts (projects, contact messages, unread messages, certificates, and work experiences) from Supabase and exposes them through React Query.
 *
 * @returns The React Query result object containing status flags and a `data` object with numeric fields: `totalProjects`, `totalMessages`, `unreadMessages`, `totalCertificates`, and `totalExperiences` (each defaults to `0` when missing).
 */
export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [
        { count: projectsCount, error: projectsError },
        { count: messagesCount, error: messagesError },
        { count: unreadCount, error: unreadError },
        { count: certificatesCount, error: certsError },
        { count: experiencesCount, error: expError },
      ] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("certificates").select("*", { count: "exact", head: true }),
        supabase.from("work_experiences").select("*", { count: "exact", head: true }),
      ]);
      if (projectsError || messagesError || unreadError || certsError || expError) {
        throw projectsError || messagesError || unreadError || certsError || expError;
      }
      return {
        totalProjects: projectsCount ?? 0,
        totalMessages: messagesCount ?? 0,
        unreadMessages: unreadCount ?? 0,
        totalCertificates: certificatesCount ?? 0,
        totalExperiences: experiencesCount ?? 0,
      };
    },
  });
}
