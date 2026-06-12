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
