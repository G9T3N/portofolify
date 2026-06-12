import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches aggregated admin dashboard counts from Supabase and exposes them through React Query.
 *
 * @returns An object with numeric counts (each defaults to `0` when missing):
 * - `totalProjects`: number of projects
 * - `totalMessages`: total contact messages
 * - `unreadMessages`: contact messages where `is_read` is `false`
 * - `totalCertificates`: number of certificates
 * - `totalExperiences`: number of work experiences
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin-dashboard-stats"],
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
