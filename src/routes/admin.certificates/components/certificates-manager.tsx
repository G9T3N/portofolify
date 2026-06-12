import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, Award, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useCertificatesManager } from '../hooks/use-certificates-form';

const CertificatesManager = () => {
  const {
    isFormOpen,
    setIsFormOpen,
    editingCert,
    formData,
    setFormData,
    handleCloseForm,
    handleOpenForm,
    handleSubmit,
    certificates,
    isLoading,
    toggleVisibilityMutation,
    deleteMutation
  } = useCertificatesManager();



  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-mono font-bold">Certificates</h2>
        </div>
        <button onClick={() => handleOpenForm()} className="cyber-button flex items-center justify-center gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          Add Certificate
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : (certificates && certificates.length > 0 ? (
        <div className="space-y-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className={`glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                cert.is_visible ? '' : 'opacity-60'
              }`}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0 w-full">
                {cert.logo_url ? (
                  <div className="w-10 h-10 rounded-lg bg-muted/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src={cert.logo_url} alt={cert.issuer} className="w-6 h-6 object-contain" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-mono font-medium text-foreground truncate">{cert.title}</p>
                  <p className="text-sm text-muted-foreground">{cert.issuer} • {new Date(cert.issue_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0">
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-muted/30 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => toggleVisibilityMutation.mutate({ id: cert.id, is_visible: cert.is_visible })}
                  className="p-2 rounded-lg hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {cert.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleOpenForm(cert)}
                  className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this certificate?')) {
                      deleteMutation.mutate(cert.id);
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
          <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-mono mb-4">No certificates yet</p>
          <button onClick={() => handleOpenForm()} className="cyber-button-outline">
            Add your first certificate
          </button>
        </div>
      ))}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-mono">
              {editingCert ? 'Edit Certificate' : 'Add Certificate'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Certificate Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="AWS Solutions Architect"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issuer">Issuing Organization *</Label>
              <Input
                id="issuer"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                placeholder="Amazon Web Services"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issue_date">Issue Date *</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry_date">Expiry Date</Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="credential_id">Credential ID</Label>
              <Input
                id="credential_id"
                value={formData.credential_id}
                onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
                placeholder="ABC123XYZ"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credential_url">Credential URL</Label>
              <Input
                id="credential_url"
                type="url"
                value={formData.credential_url}
                onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                placeholder="https://verify.example.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input
                id="logo_url"
                type="url"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_visible">Visible on portfolio</Label>
              <Switch
                id="is_visible"
                checked={formData.is_visible}
                onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
              />
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <button type="button" onClick={handleCloseForm} className="flex-1 cyber-button-outline w-full sm:w-auto">
                Cancel
              </button>
              <button type="submit" className="flex-1 cyber-button w-full sm:w-auto">
                {editingCert ? 'Update' : 'Add'} Certificate
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CertificatesManager;
