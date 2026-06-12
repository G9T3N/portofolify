import { format } from "date-fns";
import { Mail, MailOpen, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type MessageItemProps = {
  msg: Record<string, unknown>;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function MessageItem({ msg, isExpanded, onToggle, onDelete }: MessageItemProps) {
  const isUnread = !(msg.is_read as boolean);

  return (
    <div
      className={`rounded-lg border transition-colors ${
        isUnread
          ? "border-primary/30 bg-primary/5"
          : "border-sidebar-border bg-sidebar"
      }`}
    >
      <button
        onClick={() => onToggle(msg.id as string)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        {isUnread ? (
          <Mail className="w-4 h-4 text-primary flex-shrink-0" />
        ) : (
          <MailOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-mono truncate ${isUnread ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
            {msg.name as string}
          </p>
          <p className="text-xs font-mono text-muted-foreground truncate">
            {msg.email as string}
          </p>
        </div>
        <span className="text-xs font-mono text-muted-foreground flex-shrink-0">
          {format(new Date(msg.created_at as string), "MMM d, yyyy")}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-sidebar-border">
          <div className="mt-3 space-y-2">
            <p className="text-sm font-mono text-muted-foreground">
              <span className="text-foreground">From:</span> {msg.name as string}
            </p>
            <p className="text-sm font-mono text-muted-foreground">
              <span className="text-foreground">Email:</span> {msg.email as string}
            </p>
            {msg.phone && (
              <p className="text-sm font-mono text-muted-foreground">
                <span className="text-foreground">Phone:</span> {msg.phone as string}
              </p>
            )}
            <p className="text-sm font-mono text-muted-foreground mt-4 p-3 rounded-lg bg-background/50">
              {msg.message as string}
            </p>
          </div>
          <div className="mt-3 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(msg.id as string)}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
