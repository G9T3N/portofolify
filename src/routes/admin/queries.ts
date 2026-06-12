import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches and caches admin statistics: total projects, total contact messages, and unread contact messages.
 *
 * @returns An object with `totalProjects`, `totalMessages`, and `unreadMessages`, each a number.
 */
export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [
        { count: projectsCount, error: projectsError },
        { count: messagesCount, error: messagesError },
        { count: unreadCount, error: unreadError },
      ] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
      ]);
      if (projectsError || messagesError || unreadError) {
        throw projectsError || messagesError || unreadError;
      }
      return {
        totalProjects: projectsCount ?? 0,
        totalMessages: messagesCount ?? 0,
        unreadMessages: unreadCount ?? 0,
      };
    },
  });
}
