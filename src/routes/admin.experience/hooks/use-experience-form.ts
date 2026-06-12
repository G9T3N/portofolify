import { useState } from 'react';
import {
  WorkExperience,
  useAdminExperiences,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
  useToggleExperienceVisibilityMutation,
} from '../queries';

/**
 * Manages state and handlers for creating, editing, and submitting work experience entries in an admin UI.
 *
 * @returns An object exposing form state, controlled form data, handlers, query results, loading state, and mutation objects:
 * - `isFormOpen` — whether the form UI is open
 * - `setIsFormOpen` — setter for `isFormOpen`
 * - `editingExperience` — the experience being edited, or `null` when creating a new entry
 * - `formData` — controlled form fields for the experience (company, position, location, start/end dates, current flag, description, achievements as newline-delimited text, company logo URL, display order, visibility)
 * - `setFormData` — setter for `formData`
 * - `handleCloseForm` — closes the form and clears `editingExperience`
 * - `handleOpenForm` — opens the form; when given an experience, populates `formData` for editing, otherwise initializes defaults for creation
 * - `handleSubmit` — form submit handler that normalizes `formData` into a payload and triggers create or update mutation
 * - `experiences` — latest experiences list from the admin query
 * - `isLoading` — loading state for the experiences query
 * - `createMutation` — mutation object for creating an experience (configured to close the form on success)
 * - `updateMutation` — mutation object for updating an experience (configured to close the form on success)
 * - `deleteMutation` — mutation object for deleting an experience
 * - `toggleVisibilityMutation` — mutation object for toggling an experience's visibility
 */
export function useExperienceManager() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    achievements: '',
    company_logo_url: '',
    display_order: 0,
    is_visible: true,
  });

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingExperience(null);
  };

  const { data: experiences, isLoading } = useAdminExperiences();
  const createMutation = useCreateExperienceMutation(() => handleCloseForm());
  const updateMutation = useUpdateExperienceMutation(() => handleCloseForm());
  const deleteMutation = useDeleteExperienceMutation();
  const toggleVisibilityMutation = useToggleExperienceVisibilityMutation();

  const handleOpenForm = (experience?: WorkExperience) => {
    if (experience) {
      setEditingExperience(experience);
      setFormData({
        company: experience.company,
        position: experience.position,
        location: experience.location || '',
        start_date: experience.start_date,
        end_date: experience.end_date || '',
        is_current: experience.is_current,
        description: experience.description || '',
        achievements: experience.achievements?.join('\n') || '',
        company_logo_url: experience.company_logo_url || '',
        display_order: experience.display_order,
        is_visible: experience.is_visible,
      });
    } else {
      setEditingExperience(null);
      setFormData({
        company: '',
        position: '',
        location: '',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
        achievements: '',
        company_logo_url: '',
        display_order: (experiences?.length || 0) + 1,
        is_visible: true,
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      company: formData.company,
      position: formData.position,
      location: formData.location || null,
      start_date: formData.start_date,
      end_date: formData.is_current ? null : formData.end_date || null,
      is_current: formData.is_current,
      description: formData.description || null,
      achievements: formData.achievements ? formData.achievements.split('\n').filter(a => a.trim()) : null,
      company_logo_url: formData.company_logo_url || null,
      display_order: formData.display_order,
      is_visible: formData.is_visible,
    };

    if (editingExperience) {
      updateMutation.mutate({ id: editingExperience.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return {
    isFormOpen,
    setIsFormOpen,
    editingExperience,
    formData,
    setFormData,
    handleCloseForm,
    handleOpenForm,
    handleSubmit,
    experiences,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
    toggleVisibilityMutation,
  };
}
