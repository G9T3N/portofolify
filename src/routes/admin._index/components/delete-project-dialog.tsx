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

type DeleteProjectDialogProps = {
  project: Record<string, unknown> | null;
  onClose: () => void;
  onConfirm: () => void;
};

/**
 * Renders a confirmation dialog to delete the given project.
 *
 * The dialog is open when `project` is non-null. When dismissed it calls `onClose`; when the
 * "Delete" action is clicked it calls `onConfirm`.
 *
 * @param project - The project to display in the confirmation message, or `null` to keep the dialog closed
 * @param onClose - Callback invoked when the dialog is dismissed or closed
 * @param onConfirm - Callback invoked when the user confirms deletion by clicking "Delete"
 * @returns The AlertDialog React element for confirming project deletion
 */
export default function DeleteProjectDialog({ project, onClose, onConfirm }: DeleteProjectDialogProps) {
  return (
    <AlertDialog open={project !== null} onOpenChange={(open) => { if (!open) {onClose();} }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-mono">Delete Project</AlertDialogTitle>
          <AlertDialogDescription className="font-mono text-muted-foreground">
            Are you sure you want to delete "{project?.title as string}"?
            This action cannot be undone.
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
