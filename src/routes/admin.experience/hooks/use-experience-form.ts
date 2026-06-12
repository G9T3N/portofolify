import { useState } from 'react';
import {
  WorkExperience,
  useAdminExperiences,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
  useToggleExperienceVisibilityMutation,
} from '../queries';

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
