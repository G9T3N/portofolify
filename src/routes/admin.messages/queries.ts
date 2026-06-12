import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
export function useMessages() {
  return useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {throw error;}
      return data;
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return async (id: string) => {
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
    queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
  };
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();
  return async (id: string) => {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    }
  };
}

export function useAdminMessagesState() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: messages, isLoading } = useMessages();
  const markAsRead = useMarkAsRead();
  const deleteMessage = useDeleteMessage();

  return {
    expandedId,
    setExpandedId,
    deleteId,
    setDeleteId,
    messages,
    isLoading,
    markAsRead,
    deleteMessage
  };
}
