import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, FolderPlus } from 'lucide-react';
import { AnimatedDialog } from '@/components/common/animated-dialog';
import { useStacksManager } from '../hooks/use-stacks-manager';
import { Skill } from '../queries';

const proficiencyColors = {
  beginner: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  intermediate: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  advanced: 'bg-green-500/20 text-green-400 border-green-500/30',
  expert: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const StacksManager = () => {
  const {
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
  } = useStacksManager();

  const filteredSkills = activeCategory
    ? skills?.filter((s) => s.category_id === activeCategory)
    : [];

  const activeCategoryData = categories?.find((c) => c.id === activeCategory);

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-mono font-bold">Skills & Stacks</h1>
        <button
          onClick={() => setIsCategoryFormOpen(true)}
          className="cyber-button flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <FolderPlus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories?.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-mono text-sm transition-all flex items-center gap-2 ${
              activeCategory === category.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
            }`}
          >
            {category.name}
            <span className="text-xs opacity-70">
              ({skills?.filter((s) => s.category_id === category.id).length || 0})
            </span>
          </button>
        ))}
      </div>

      {/* Selected Category Content */}
      {activeCategory ? (
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg font-mono font-bold break-all">{activeCategoryData?.name}</h2>
              <button
                onClick={() => handleEditCategory(activeCategoryData!)}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete category "${activeCategoryData?.name}" and all its skills?`)) {
                    deleteCategoryMutation.mutate(activeCategory);
                  }
                }}
                className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={() => setIsSkillFormOpen(true)}
              className="cyber-button-outline flex items-center justify-center gap-2 text-sm py-2 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              Add Skill
            </button>
          </div>

          {skillsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : (filteredSkills && filteredSkills.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSkills.map((skill) => (
                <div
                  key={skill.id}
                  className={`glass-card p-4 transition-all ${
                    skill.is_visible ? '' : 'opacity-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {skill.logo_url ? (
                        <img
                          src={skill.logo_url}
                          alt={skill.name}
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://cdn.simpleicons.org/javascript/666666';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-muted/30 flex items-center justify-center text-muted-foreground">
                          📦
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-mono font-medium text-foreground truncate">{skill.name}</p>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-mono border ${
                            proficiencyColors[skill.proficiency]
                          }`}
                        >
                          {skill.proficiency}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-2">
                    <button
                      onClick={() =>
                        toggleVisibilityMutation.mutate({ id: skill.id, isVisible: skill.is_visible })
                      }
                      className="p-2 rounded-lg hover:bg-muted/30 text-muted-foreground transition-colors"
                    >
                      {skill.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleEditSkill(skill)}
                      className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete skill "${skill.name}"?`)) {
                          deleteSkillMutation.mutate(skill.id);
                        }
                      }}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <p className="text-muted-foreground font-mono mb-4">No skills in this category yet</p>
              <button onClick={() => setIsSkillFormOpen(true)} className="cyber-button-outline">
                Add your first skill
              </button>
            </div>
          ))}
        </motion.div>
      ) : (
        <div className="glass-card p-12 text-center">
          <p className="text-muted-foreground font-mono">Select a category to manage skills</p>
        </div>
      )}

      {/* Skill Form Modal */}
      <AnimatedDialog
        isOpen={isSkillFormOpen}
        onClose={handleCloseSkillForm}
        title={editingSkill ? 'Edit Skill' : 'Add Skill'}
        className="max-w-md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2">
              Skill Name *
            </label>
            <input
              type="text"
              value={skillForm.name}
              onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-muted/30 border border-border/50 focus:border-primary/50 focus:outline-none font-mono"
              placeholder="e.g., React, Django, Docker"
            />
          </div>

          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2">
              Logo URL
            </label>
            <input
              type="text"
              value={skillForm.logo_url}
              onChange={(e) => setSkillForm({ ...skillForm, logo_url: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-muted/30 border border-border/50 focus:border-primary/50 focus:outline-none font-mono text-sm"
              placeholder="https://cdn.simpleicons.org/react/61DAFB"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use simpleicons.org: https://cdn.simpleicons.org/[icon]/[color]
            </p>
          </div>

          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2">
              Proficiency
            </label>
            <select
              value={skillForm.proficiency}
              onChange={(e) =>
                setSkillForm({ ...skillForm, proficiency: e.target.value as Skill['proficiency'] })
              }
              className="w-full px-4 py-3 rounded-lg bg-muted/30 border border-border/50 focus:border-primary/50 focus:outline-none font-mono"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={skillForm.display_order}
              onChange={(e) =>
                setSkillForm({ ...skillForm, display_order: Number.parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-3 rounded-lg bg-muted/30 border border-border/50 focus:border-primary/50 focus:outline-none font-mono"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <button
              onClick={handleCloseSkillForm}
              className="flex-1 px-4 py-3 rounded-lg border border-border/50 text-muted-foreground hover:bg-muted/30 font-mono w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitSkill}
              disabled={skillMutation.isPending}
              className="flex-1 cyber-button flex items-center justify-center gap-2"
            >
              {skillMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingSkill ? 'Update' : 'Add'} Skill
            </button>
          </div>
        </div>
      </AnimatedDialog>

      {/* Category Form Modal */}
      <AnimatedDialog
        isOpen={isCategoryFormOpen}
        onClose={handleCloseCategoryForm}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        className="max-w-md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2">
              Category Name *
            </label>
            <input
              type="text"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-muted/30 border border-border/50 focus:border-primary/50 focus:outline-none font-mono"
              placeholder="e.g., Frontend, Backend, DevOps"
            />
          </div>

          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={categoryForm.display_order}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, display_order: Number.parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-3 rounded-lg bg-muted/30 border border-border/50 focus:border-primary/50 focus:outline-none font-mono"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <button
              onClick={handleCloseCategoryForm}
              className="flex-1 px-4 py-3 rounded-lg border border-border/50 text-muted-foreground hover:bg-muted/30 font-mono w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitCategory}
              disabled={categoryMutation.isPending}
              className="flex-1 cyber-button flex items-center justify-center gap-2"
            >
              {categoryMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingCategory ? 'Update' : 'Add'} Category
            </button>
          </div>
        </div>
      </AnimatedDialog>
    </div>
  );
};

export default StacksManager;
