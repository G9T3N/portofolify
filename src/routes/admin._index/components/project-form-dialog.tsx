import { Upload, Loader2, Plus } from 'lucide-react';
import { AnimatedDialog } from '@/components/common/animated-dialog';
import { useImageUpload } from '@/utils/hooks/use-image-upload';
import { useProjectForm } from '../hooks/use-project-form';



interface ProjectFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Record<string, unknown>;
}

const ProjectFormDialog = ({ isOpen, onClose, project }: ProjectFormDialogProps) => {
  const {
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
  } = useProjectForm(project, onClose);

  const { uploadImage, isUploading } = useImageUpload('project-images');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {return;}
    const url = await uploadImage(file);
    if (url) {
      setThumbnailUrl(url);
    }
  };

  return (
    <AnimatedDialog
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Edit Project' : 'Add New Project'}
    >
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-2">
                Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-muted/30 border border-border/50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="Project title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-2">
                Short Description <span className="text-destructive">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 rounded-lg bg-muted/30 border border-border/50 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="Brief project description"
              />
            </div>

            {/* Full Content */}
            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-2">
                Full Content
              </label>
              <textarea
                name="full_content"
                value={formData.full_content}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-muted/30 border border-border/50 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="Detailed project description..."
              />
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-muted/30 border border-border/50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="web">Web App</option>
                  <option value="mobile">Mobile App</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-muted/30 border border-border/50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="live">Live</option>
                </select>
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-2">
                Thumbnail
              </label>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {formData.thumbnail_url && (
                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-muted/30">
                    <img
                      src={formData.thumbnail_url}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <label className="flex items-center gap-2 px-4 py-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-mono text-muted-foreground">Upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">Or paste URL below</p>
                  <input
                    type="url"
                    name="thumbnail_url"
                    value={formData.thumbnail_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-2 rounded-lg bg-muted/30 border border-border/50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2">
                  Live Demo URL
                </label>
                <input
                  type="url"
                  name="live_url"
                  value={formData.live_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-muted/30 border border-border/50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2">
                  Source Code URL
                </label>
                <input
                  type="url"
                  name="code_url"
                  value={formData.code_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-muted/30 border border-border/50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            {/* Embed URL */}
            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-2">
                Embed Preview URL
              </label>
              <input
                type="url"
                name="embed_url"
                value={formData.embed_url}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-muted/30 border border-border/50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="URL for iframe embed preview"
              />
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-2">
                Tech Stack
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleTechKeyDown}
                  className="flex-1 px-4 py-3 rounded-lg bg-muted/30 border border-border/50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="Add technology..."
                />
                <button
                  type="button"
                  onClick={addTech}
                  className="px-4 py-3 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono bg-primary/10 text-primary border border-primary/30"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTech(tech)}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-2">
                Display Order
              </label>
              <input
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleChange}
                className="w-24 px-4 py-3 rounded-lg bg-muted/30 border border-border/50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-border/50">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-lg font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="w-full sm:w-auto cyber-button flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {(isSubmitting || isUploading) && <Loader2 className="w-4 h-4 animate-spin" />}
                {project ? 'Save Changes' : 'Create Project'}
              </button>
            </div>
          </form>
    </AnimatedDialog>
  );
};

export default ProjectFormDialog;
