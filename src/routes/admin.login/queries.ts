import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAdminAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .eq('role', 'admin')
            .single();

          if (roles) {
            navigate('/admin', { replace: true });
          }
        }
      }
    );

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .single();

        if (roles) {
          navigate('/admin', { replace: true });
          return;
        }
      }
      setIsCheckingSession(false);
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up new user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) { throw error; }

        if (data.user) {
          toast({
            title: 'Account created!',
            description: 'Please wait while admin privileges are being granted...',
          });
          // User created, they need to be granted admin role via database
        }
      } else {
        // Sign in existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) { throw error; }

        if (data.session) {
          const { data: roles, error: rolesError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', data.session.user.id)
            .eq('role', 'admin')
            .single();

          if (rolesError || !roles) {
            await supabase.auth.signOut();
            throw new Error('Access denied. You do not have admin privileges.');
          }

          toast({
            title: 'Welcome back!',
            description: 'Successfully logged in as admin.',
          });
          navigate('/admin', { replace: true });
        }
      }
    } catch (error) {
      const err = error as Error;
      toast({
        title: isSignUp ? 'Sign up failed' : 'Login failed',
        description: err.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    isCheckingSession,
    isSignUp,
    setIsSignUp,
    handleSubmit
  };
};
