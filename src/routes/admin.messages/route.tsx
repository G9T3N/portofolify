import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminMessagesState } from "./queries";
import MessageItem from "./components/message-item";
import DeleteMessageDialog from "./components/delete-message-dialog";

export default function AdminMessages() {
  const {
    expandedId,
    setExpandedId,
    deleteId,
    setDeleteId,
    messages,
    isLoading,
    markAsRead,
    deleteMessage
  } = useAdminMessagesState();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-bold text-foreground">Messages</h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">
          View and manage contact form submissions
        </p>
      </div>

      <Card className="border-sidebar-border bg-sidebar/50">
        <CardContent className="p-4 space-y-3">
          {(() => {
            if (isLoading) {
              return <p className="text-center font-mono text-muted-foreground py-8">Loading messages...</p>;
            }
            if (!messages || messages.length === 0) {
              return <p className="text-center font-mono text-muted-foreground py-8">No messages yet.</p>;
            }
            return messages.map((msg) => (
              <MessageItem
                key={msg.id as string}
                msg={msg}
                isExpanded={expandedId === msg.id}
                onToggle={(id) => {
                  setExpandedId(expandedId === id ? null : id);
                  if (!msg.is_read) {markAsRead(id);}
                }}
                onDelete={(id) => setDeleteId(id)}
              />
            ));
          })()}
        </CardContent>
      </Card>

      <DeleteMessageDialog
        id={deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {await deleteMessage(deleteId);}
          setDeleteId(null);
        }}
      />
    </motion.div>
  );
}
