import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useImageUpload(bucket: string) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);

    try {
      // Validate file
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        toast({ title: 'Invalid file type', variant: 'destructive' });
        return null;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({ title: 'File size must be less than 10MB', variant: 'destructive' });
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      toast({ title: 'File uploaded successfully' });
      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Failed to upload file', variant: 'destructive' });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (url: string) => {
    try {
      const fileName = url.split('/').pop();
      if (fileName) {
        // Need to prefix with 'uploads/' if we store them in a folder
        const path = url.includes('/uploads/') ? `uploads/${fileName}` : fileName;
        await supabase.storage.from(bucket).remove([path]);
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return {
    uploadImage,
    deleteImage,
    isUploading
  };
}
