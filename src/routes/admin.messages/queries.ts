import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
/**
 * Fetches contact messages from the `contact_messages` table ordered by `created_at` descending.
 *
 * @returns The React Query result whose `data` contains an array of contact message rows (or `undefined` while loading).
 * @throws The Supabase error if the query fails.
 */
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

/**
 * Provides a callback that marks a contact message as read and refreshes related admin caches.
 *
 * @returns A function that accepts a message `id` and marks that message as read in the database; it then invalidates the `["admin-messages"]` and `["admin-stats"]` query caches.
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return async (id: string) => {
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
    queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
  };
}

/**
 * Creates a function that deletes a contact message by id and refreshes related admin queries when the deletion succeeds.
 *
 * @returns `(id: string) => Promise<void>` — Async function that deletes the contact message with the given `id`; if the deletion completes without an error, invalidates the `["admin-messages"]` and `["admin-stats"]` query caches.
 */
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

/**
 * Manages local UI state and provides data and actions for administering contact messages.
 *
 * @returns An object with:
 * - `expandedId` — the id of the currently expanded message or `null`.
 * - `setExpandedId` — setter for `expandedId`.
 * - `deleteId` — the id of the message selected for deletion or `null`.
 * - `setDeleteId` — setter for `deleteId`.
 * - `messages` — fetched list of contact messages (or `undefined` while loading).
 * - `isLoading` — `true` while messages are being fetched, `false` otherwise.
 * - `markAsRead` — async function `(id: string) => Promise<void>` that marks a message as read and refreshes relevant caches.
 * - `deleteMessage` — async function `(id: string) => Promise<void>` that deletes a message and refreshes relevant caches when successful.
 */
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
