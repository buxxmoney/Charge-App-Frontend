import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthResult {
  success: boolean;
  error?: string;
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log('Auth state changed:', _event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const signUpWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      console.log('Attempting signup for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log('Signup response:', { data, error });

      if (error) throw error;

      if (data.user) {
        console.log('User created:', data.user.id);
        
        // Try to create profile, but don't fail signup if it errors
        try {
          const { error: profileError } = await supabase.from('profiles').insert([
            {
              user_id: data.user.id,
              first_name: email.split('@')[0] || 'User',
              last_name: '',
              phone_verified: true,
              hault_registered: false,
            },
          ]);
          
          if (profileError) {
            console.log('Profile creation error (non-blocking):', profileError);
          } else {
            console.log('Profile created successfully');
          }
        } catch (profileErr) {
          console.log('Profile creation exception (non-blocking):', profileErr);
        }

        setUser(data.user);
        setSession(data.session);
        return { success: true };
      }

      return { success: false, error: 'Signup failed - no user returned' };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, error: error.message || 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Login response:', { data, error });

      if (error) throw error;

      if (data.user) {
        console.log('Login successful:', data.user.id);
        setUser(data.user);
        setSession(data.session);
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message || 'Sign out failed' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    session,
    isLoading,
    loading: isLoading,
    signUpWithEmail,
    signInWithEmail,
    signOut,
  };
};