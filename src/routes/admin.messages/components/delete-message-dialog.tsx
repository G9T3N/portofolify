import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type DeleteMessageDialogProps = {
  id: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

/**
 * Renders a confirmation dialog for deleting a message.
 *
 * @param id - The identifier of the message to delete; dialog is visible when this is not `null`
 * @param onClose - Called when the dialog is dismissed without confirming deletion
 * @param onConfirm - Called when the user confirms deletion
 * @returns The rendered alert dialog element
 */
export default function DeleteMessageDialog({ id, onClose, onConfirm }: DeleteMessageDialogProps) {
  return (
    <AlertDialog open={id !== null} onOpenChange={(open) => { if (!open) {onClose();} }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-mono">Delete Message</AlertDialogTitle>
          <AlertDialogDescription className="font-mono text-muted-foreground">
            Are you sure you want to delete this message?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="font-mono">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="font-mono bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
