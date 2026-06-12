import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import {
  SkillCategory,
  Skill,
  useSkillCategories,
  useSkills,
  useSkillMutation,
  useDeleteSkillMutation,
  useToggleSkillVisibilityMutation,
  useCategoryMutation,
  useDeleteCategoryMutation,
} from '../queries';

/**
 * Manages UI state, controlled form data, and mutation-backed handlers for skill categories and skills in the admin "stacks" interface.
 *
 * Exposes state (active category, open/closed form flags, current editing targets), controlled form values and setters, edit/close/submit handlers, fetched lists and loading flags for categories and skills, and mutation objects for creating, updating, deleting, and toggling visibility of skills and categories.
 *
 * @returns An object containing:
 * - current selections and setters: `activeCategory`, `setActiveCategory`
 * - form open flags and setters: `isSkillFormOpen`, `setIsSkillFormOpen`, `isCategoryFormOpen`, `setIsCategoryFormOpen`
 * - current edit targets: `editingSkill`, `editingCategory`
 * - form values and setters: `skillForm`, `setSkillForm`, `categoryForm`, `setCategoryForm`
 * - UI handlers: `handleCloseSkillForm`, `handleCloseCategoryForm`, `handleEditSkill`, `handleEditCategory`, `handleSubmitSkill`, `handleSubmitCategory`
 * - fetched data and loading flags: `categories`, `categoriesLoading`, `skills`, `skillsLoading`
 * - mutation objects: `skillMutation`, `deleteSkillMutation`, `toggleVisibilityMutation`, `deleteCategoryMutation`
 */
export function useStacksManager() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isSkillFormOpen, setIsSkillFormOpen] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);

  // Form states
  const [skillForm, setSkillForm] = useState({
    name: '',
    logo_url: '',
    proficiency: 'intermediate' as Skill['proficiency'],
    display_order: 0,
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    display_order: 0,
  });

  const handleCloseSkillForm = () => {
    setIsSkillFormOpen(false);
    setEditingSkill(null);
    setSkillForm({ name: '', logo_url: '', proficiency: 'intermediate', display_order: 0 });
  };

  const handleCloseCategoryForm = () => {
    setIsCategoryFormOpen(false);
    setEditingCategory(null);
    setCategoryForm({ name: '', display_order: 0 });
  };

  const { data: categories, isLoading: categoriesLoading } = useSkillCategories();
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const skillMutation = useSkillMutation(() => handleCloseSkillForm());
  const deleteSkillMutation = useDeleteSkillMutation();
  const toggleVisibilityMutation = useToggleSkillVisibilityMutation();
  const categoryMutation = useCategoryMutation(() => handleCloseCategoryForm());
  const deleteCategoryMutation = useDeleteCategoryMutation(() => setActiveCategory(null));

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillForm({
      name: skill.name,
      logo_url: skill.logo_url || '',
      proficiency: skill.proficiency,
      display_order: skill.display_order,
    });
    setIsSkillFormOpen(true);
  };

  const handleEditCategory = (category: SkillCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      display_order: category.display_order,
    });
    setIsCategoryFormOpen(true);
  };

  const handleSubmitSkill = () => {
    if (!skillForm.name) {
      toast({ title: 'Please enter a skill name', variant: 'destructive' });
      return;
    }
    skillMutation.mutate({
      skill: skillForm,
      isEdit: !!editingSkill,
      skillId: editingSkill?.id,
      categoryId: activeCategory || undefined,
    });
  };

  const handleSubmitCategory = () => {
    if (!categoryForm.name) {
      toast({ title: 'Please enter a category name', variant: 'destructive' });
      return;
    }
    categoryMutation.mutate({
      category: categoryForm,
      isEdit: !!editingCategory,
      categoryId: editingCategory?.id,
    });
  };

  return {
    activeCategory,
    setActiveCategory,
    isSkillFormOpen,
    setIsSkillFormOpen,
    isCategoryFormOpen,
    setIsCategoryFormOpen,
    editingSkill,
    editingCategory,
    skillForm,
    setSkillForm,
    categoryForm,
    setCategoryForm,
    handleCloseSkillForm,
    handleCloseCategoryForm,
    handleEditSkill,
    handleEditCategory,
    handleSubmitSkill,
    handleSubmitCategory,
    categories,
    categoriesLoading,
    skills,
    skillsLoading,
    skillMutation,
    deleteSkillMutation,
    toggleVisibilityMutation,
    deleteCategoryMutation
  };
}
