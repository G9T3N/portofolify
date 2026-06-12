import { useState } from 'react';
import {
  Certificate,
  useAdminCertificates,
  useCreateCertificateMutation,
  useUpdateCertificateMutation,
  useDeleteCertificateMutation,
  useToggleCertificateVisibilityMutation,
} from '../queries';

export function useCertificatesManager() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    credential_url: '',
    logo_url: '',
    is_visible: true,
  });

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCert(null);
  };

  const { data: certificates, isLoading } = useAdminCertificates();
  const createMutation = useCreateCertificateMutation(() => handleCloseForm());
  const updateMutation = useUpdateCertificateMutation(() => handleCloseForm());
  const deleteMutation = useDeleteCertificateMutation();
  const toggleVisibilityMutation = useToggleCertificateVisibilityMutation();

  const handleOpenForm = (cert?: Certificate) => {
    if (cert) {
      setEditingCert(cert);
      setFormData({
        title: cert.title,
        issuer: cert.issuer,
        issue_date: cert.issue_date,
        expiry_date: cert.expiry_date || '',
        credential_id: cert.credential_id || '',
        credential_url: cert.credential_url || '',
        logo_url: cert.logo_url || '',
        is_visible: cert.is_visible,
      });
    } else {
      setEditingCert(null);
      setFormData({
        title: '',
        issuer: '',
        issue_date: '',
        expiry_date: '',
        credential_id: '',
        credential_url: '',
        logo_url: '',
        is_visible: true,
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCert) {
      updateMutation.mutate({ id: editingCert.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return {
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
    createMutation,
    updateMutation,
    deleteMutation,
    toggleVisibilityMutation,
  };
}
