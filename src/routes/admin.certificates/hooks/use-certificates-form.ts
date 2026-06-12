import { useState } from 'react';
import {
  Certificate,
  useAdminCertificates,
  useCreateCertificateMutation,
  useUpdateCertificateMutation,
  useDeleteCertificateMutation,
  useToggleCertificateVisibilityMutation,
} from '../queries';

/**
 * Manages state and handlers for creating, editing, deleting, and toggling visibility of certificates in an admin UI.
 *
 * @returns An object exposing form UI state, form data and setters, handlers for opening/closing/submitting the form, fetched certificate data and loading state, and mutation objects for create, update, delete, and toggle-visibility operations:
 * - `isFormOpen` — whether the certificate form is open
 * - `setIsFormOpen` — setter for `isFormOpen`
 * - `editingCert` — the certificate currently being edited, or `null` for create mode
 * - `formData` — current certificate form fields
 * - `setFormData` — setter for `formData`
 * - `handleCloseForm` — closes the form and clears `editingCert`
 * - `handleOpenForm` — opens the form; when passed a `Certificate` pre-populates `formData` for editing, otherwise resets to defaults
 * - `handleSubmit` — form submit handler that dispatches a create or update mutation based on `editingCert`
 * - `certificates` — fetched list of certificates (from `useAdminCertificates`)
 * - `isLoading` — loading state for the certificates query
 * - `createMutation` — mutation object for creating a certificate (configured to close the form on success)
 * - `updateMutation` — mutation object for updating a certificate (configured to close the form on success)
 * - `deleteMutation` — mutation object for deleting a certificate
 * - `toggleVisibilityMutation` — mutation object for toggling a certificate's visibility
 */
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
