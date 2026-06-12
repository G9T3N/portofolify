import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProjectFormDialog from "./components/project-form-dialog";
import ProjectTable from "./components/project-table";
import DeleteProjectDialog from "./components/delete-project-dialog";
import { useAdminProjectsState } from "./queries";

/**
 * Renders the admin "Project Manager" page which lists projects and provides controls to view, create, edit, and delete projects.
 *
 * The component displays a header with a "New Project" button, a projects table, a project form dialog for creating/editing, and a delete confirmation dialog.
 *
 * @returns The JSX element for the admin projects page.
 */
export default function AdminProjects() {
  const {
    navigate,
    projectDialogOpen,
    setProjectDialogOpen,
    editingProject,
    setEditingProject,
    deleteProject,
    setDeleteProject,
    projects,
    isLoading,
    deleteProjectFn
  } = useAdminProjectsState();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">Project Manager</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            Manage your portfolio projects
          </p>
        </div>
        <Button onClick={() => { setEditingProject(null); setProjectDialogOpen(true); }} className="gap-2">
          + New Project
        </Button>
      </div>

      <Card className="border-sidebar-border bg-sidebar/50">
        <CardContent className="p-0">
          <ProjectTable
            projects={projects}
            isLoading={isLoading}
            onView={(project) => navigate(`/project/${project.id}`)}
            onEdit={(project) => { setEditingProject(project); setProjectDialogOpen(true); }}
            onDelete={(project) => setDeleteProject(project)}
          />
        </CardContent>
      </Card>

      <ProjectFormDialog
        isOpen={projectDialogOpen}
        onClose={() => {
          setProjectDialogOpen(false);
          setEditingProject(null);
        }}
        project={editingProject || undefined}
      />

      <DeleteProjectDialog
        project={deleteProject}
        onClose={() => setDeleteProject(null)}
        onConfirm={async () => {
          if (deleteProject) {await deleteProjectFn(deleteProject.id as string);}
          setDeleteProject(null);
        }}
      />
    </motion.div>
  );
}
