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
