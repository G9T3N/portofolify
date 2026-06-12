import { format } from "date-fns";
import { Edit3, ExternalLink, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Project = Record<string, unknown>;

type ProjectTableProps = {
  projects: Project[] | undefined;
  isLoading: boolean;
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
};

/**
 * Render a table of projects with three states: loading, empty, and populated rows with per-row actions.
 *
 * @param projects - Array of project records to display; if `undefined` or empty the component shows the empty state.
 * @param isLoading - When `true`, show the loading state instead of project rows.
 * @param onView - Called with a project when the row's View action is triggered.
 * @param onEdit - Called with a project when the row's Edit action is triggered.
 * @param onDelete - Called with a project when the row's Delete action is triggered.
 * @returns The table element representing the current state (loading, empty, or list of project rows).
 */
export default function ProjectTable({ projects, isLoading, onView, onEdit, onDelete }: ProjectTableProps) {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow className="border-sidebar-border">
            <TableHead className="font-mono text-xs text-muted-foreground">Title</TableHead>
            <TableHead className="font-mono text-xs text-muted-foreground">Category</TableHead>
            <TableHead className="font-mono text-xs text-muted-foreground">Status</TableHead>
            <TableHead className="font-mono text-xs text-muted-foreground">Date</TableHead>
            <TableHead className="font-mono text-xs text-muted-foreground text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="text-center font-mono text-muted-foreground py-8">
              Loading projects...
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow className="border-sidebar-border">
            <TableHead className="font-mono text-xs text-muted-foreground">Title</TableHead>
            <TableHead className="font-mono text-xs text-muted-foreground">Category</TableHead>
            <TableHead className="font-mono text-xs text-muted-foreground">Status</TableHead>
            <TableHead className="font-mono text-xs text-muted-foreground">Date</TableHead>
            <TableHead className="font-mono text-xs text-muted-foreground text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="text-center font-mono text-muted-foreground py-8">
              No projects yet. Create your first one!
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-sidebar-border">
          <TableHead className="font-mono text-xs text-muted-foreground">Title</TableHead>
          <TableHead className="font-mono text-xs text-muted-foreground">Category</TableHead>
          <TableHead className="font-mono text-xs text-muted-foreground">Status</TableHead>
          <TableHead className="font-mono text-xs text-muted-foreground">Date</TableHead>
          <TableHead className="font-mono text-xs text-muted-foreground text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id as string} className="border-sidebar-border hover:bg-sidebar-accent/50">
            <TableCell className="font-mono text-sm">{project.title as string}</TableCell>
            <TableCell>
              <Badge variant="outline" className="font-mono text-xs">
                {project.category as string}
              </Badge>
            </TableCell>
            <TableCell>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                project.status === "live"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}>
                {project.status as string}
              </span>
            </TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">
              {format(new Date(project.created_at as string), "MMM d, yyyy")}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="icon" onClick={() => onView(project)} title="View project">
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(project)} title="Edit project">
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(project)} title="Delete project">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
