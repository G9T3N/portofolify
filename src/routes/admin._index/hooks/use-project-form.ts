import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useSaveProjectMutation } from '../queries';

export interface ProjectFormData {
  title: string;
  description: string;
  full_content: string;
  category: string;
  status: string;
  thumbnail_url: string;
  live_url: string;
  code_url: string;
  embed_url: string;
  tech_stack: string[];
  display_order: number;
}

const getInitialFormData = (project?: Record<string, unknown>): ProjectFormData => ({
  title: (project?.title as string) || '',
  description: (project?.description as string) || '',
  full_content: (project?.full_content as string) || '',
  category: (project?.category as string) || 'web',
  status: (project?.status as string) || 'draft',
  thumbnail_url: (project?.thumbnail_url as string) || '',
  live_url: (project?.live_url as string) || '',
  code_url: (project?.code_url as string) || '',
  embed_url: (project?.embed_url as string) || '',
  tech_stack: (project?.tech_stack as string[]) || [],
  display_order: (project?.display_order as number) || 0,
});

/**
 * Manages state and handlers for a project edit/create form.
 *
 * Initializes form state from an optional `project`, keeps state in sync when `project` changes, and provides handlers for field updates, tech-stack editing, thumbnail updates, and form submission.
 *
 * @param project - Optional project record used to populate initial form values and to include `id` when submitting.
 * @param onSuccess - Optional callback invoked after a successful save operation.
 * @returns An object with:
 *  - `formData` — current `ProjectFormData` state.
 *  - `techInput` — current text input for adding a tech-stack entry.
 *  - `isSubmitting` — `true` while a save is in progress.
 *  - `setTechInput` — setter for `techInput`.
 *  - `handleChange` — change handler for text/select/textarea inputs that updates `formData` by `name`.
 *  - `addTech` — appends the trimmed `techInput` to `formData.tech_stack` if non-empty and not a duplicate.
 *  - `removeTech` — removes a tech string from `formData.tech_stack`.
 *  - `handleTechKeyDown` — keyboard handler that adds a tech on Enter.
 *  - `handleSubmit` — form submit handler that validates required fields and triggers the save mutation.
 *  - `setThumbnailUrl` — updates `formData.thumbnail_url`.
 */
export function useProjectForm(project?: Record<string, unknown>, onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>(getInitialFormData(project));
  const [techInput, setTechInput] = useState('');
  const [prevProject, setPrevProject] = useState(project);

  if (project !== prevProject) {
    setPrevProject(project);
    setFormData(getInitialFormData(project));
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addTech = () => {
    if (techInput.trim() && !formData.tech_stack.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tech_stack: [...prev.tech_stack, techInput.trim()],
      }));
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      tech_stack: prev.tech_stack.filter((t) => t !== tech),
    }));
  };

  const handleTechKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTech();
    }
  };

  const saveMutation = useSaveProjectMutation(
    () => {
      toast({ title: project ? 'Project updated successfully' : 'Project created successfully' });
      onSuccess?.();
    },
    (error) => {
      toast({ title: 'Failed to save project', description: String(error), variant: 'destructive' });
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({ title: 'Please fill in required fields', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    await saveMutation.mutateAsync({ ...formData, id: project?.id as string | undefined });
    setIsSubmitting(false);
  };

  const setThumbnailUrl = (url: string) => {
    setFormData((prev) => ({ ...prev, thumbnail_url: url }));
  };

  return {
    formData,
    techInput,
    isSubmitting,
    setTechInput,
    handleChange,
    addTech,
    removeTech,
    handleTechKeyDown,
    handleSubmit,
    setThumbnailUrl
  };
}
