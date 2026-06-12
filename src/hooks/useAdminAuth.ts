import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AdminAuthState {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
}

export const useAdminAuth = () => {
  const [authState, setAuthState] = useState<AdminAuthState>({
    user: null,
    isAdmin: false,
    isLoading: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state change listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setAuthState({ user: null, isAdmin: false, isLoading: false });
          navigate('/admin/login', { replace: true });
        } else if (session?.user) {
          // Check admin role
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .eq('role', 'admin')
            .single();

          const isAdmin = !!roles;
          
          if (!isAdmin) {
            await supabase.auth.signOut();
            setAuthState({ user: null, isAdmin: false, isLoading: false });
            navigate('/admin/login', { replace: true });
          } else {
            setAuthState({ user: session.user, isAdmin: true, isLoading: false });
          }
        }
      }
    );

    // Check existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setAuthState({ user: null, isAdmin: false, isLoading: false });
        navigate('/admin/login', { replace: true });
        return;
      }

      // Check if user has admin role
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .single();

      const isAdmin = !!roles;

      if (!isAdmin) {
        await supabase.auth.signOut();
        setAuthState({ user: null, isAdmin: false, isLoading: false });
        navigate('/admin/login', { replace: true });
      } else {
        setAuthState({ user: session.user, isAdmin: true, isLoading: false });
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    ...authState,
    signOut,
  };
};
