import { FileText, Upload, Trash2, Download, Loader2, ExternalLink } from 'lucide-react';
import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useCVSetting, useUpdateCVMutation } from '../queries';

const CVManager = () => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: cvSetting, isLoading } = useCVSetting();
  const updateCVMutation = useUpdateCVMutation();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {return;}

    if (file.type !== 'application/pdf') {
      toast({ title: 'Please upload a PDF file', variant: 'destructive' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'File size must be less than 10MB', variant: 'destructive' });
      return;
    }

    setIsUploading(true);

    try {
      // Delete old file if exists
      if (cvSetting?.value) {
        const oldPath = cvSetting.value.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('cv-files').remove([oldPath]);
        }
      }

      // Upload new file
      const fileName = `cv-${Date.now()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from('cv-files')
        .upload(fileName, file);

      if (uploadError) {throw uploadError;}

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('cv-files')
        .getPublicUrl(fileName);

      // Update setting
      await updateCVMutation.mutateAsync(urlData.publicUrl);
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Failed to upload CV', variant: 'destructive' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveCV = async () => {
    if (!cvSetting?.value) {return;}
    
    if (!confirm('Are you sure you want to remove the CV?')) {return;}

    try {
      const fileName = cvSetting.value.split('/').pop();
      if (fileName) {
        await supabase.storage.from('cv-files').remove([fileName]);
      }
      await updateCVMutation.mutateAsync(null);
    } catch {
      toast({ title: 'Failed to remove CV', variant: 'destructive' });
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-primary shrink-0" />
        <h2 className="text-xl font-mono font-bold break-words">CV / Resume</h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : (cvSetting?.value ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-muted/20 rounded-lg border border-border/50">
            <div className="flex items-center gap-3 w-full">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-mono font-medium text-foreground">Resume.pdf</p>
                <p className="text-sm text-muted-foreground">Currently uploaded</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <a
                href={cvSetting.value}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-muted/30 text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href={cvSetting.value}
                download
                className="p-2 rounded-lg hover:bg-muted/30 text-muted-foreground hover:text-primary transition-colors"
              >
                <Download className="w-4 h-4" />
              </a>
              <button
                onClick={handleRemoveCV}
                className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50">
            <Label htmlFor="cv-replace" className="text-sm text-muted-foreground">
              Replace with a new file
            </Label>
            <div className="mt-2">
              <Input
                id="cv-replace"
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-mono mb-4">No CV uploaded yet</p>
          <Label htmlFor="cv-upload" className="cursor-pointer">
            <div className="inline-flex items-center gap-2 cyber-button">
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {isUploading ? 'Uploading...' : 'Upload CV (PDF)'}
            </div>
            <Input
              id="cv-upload"
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </Label>
          <p className="text-xs text-muted-foreground mt-3">Maximum file size: 10MB</p>
        </div>
      ))}
    </div>
  );
};

export default CVManager;
