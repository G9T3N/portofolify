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
