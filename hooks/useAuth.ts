import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { generateKeypair, generateViewKey } from '../services/crypto';
import * as WebBrowser from 'expo-web-browser';
import { User, Session } from '@supabase/supabase-js';

interface AuthResult {
  success: boolean;
  error?: string;
}

WebBrowser.maybeCompleteAuthSession();

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const signUpWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        return { success: true };
      }

      return { success: false, error: 'Signup failed' };
    } catch (error: any) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error.message || 'Email signup failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Email login failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const sendPhoneOTP = async (phoneNumber: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      // Call Supabase Edge Function to send OTP via Twilio Verify
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phoneNumber },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to send OTP');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to send OTP');
      }

      return { success: true };
    } catch (error: any) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send OTP',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPhoneOTP = async (
    phoneNumber: string,
    code: string
  ): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      // Verify OTP via Twilio Verify
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phoneNumber, code, action: 'verify' },
      });

      if (error) {
        console.error('Verification error:', error);
        return { success: false, error: 'Verification failed' };
      }

      if (!data?.success) {
        return { success: false, error: data?.error || 'Invalid or expired code' };
      }

      // Get authenticated user
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        return { success: false, error: 'No authenticated user' };
      }

      // Generate keypair and view key
      const keypair = await generateKeypair();
      const viewKey = await generateViewKey();

      // Convert to hex string format for Supabase bytea columns (\\x prefix)
      const toPostgresHex = (hex: string): string => {
        const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
        return '\\x' + cleanHex;
      };

      // Create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: authUser.id,
            first_name: authUser.email?.split('@')[0] || 'User',
            last_name: '',
            phone_number: phoneNumber,
            phone_verified: true,
            public_key: keypair.publicKey,
            hault_registered: false,
          },
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        return { success: false, error: 'Failed to create profile: ' + profileError.message };
      }

      // Create on-chain record
      const { error: onChainError } = await supabase
        .from('on_chain')
        .insert([
          {
            user_id: authUser.id,
            device_public: toPostgresHex(keypair.publicKey),
            backend_public: toPostgresHex(keypair.publicKey), // Placeholder
            view_key: toPostgresHex(viewKey),
            generation_index: 0,
            status: 'TX_UNSENT',
          },
        ]);

      if (onChainError) {
        console.error('On-chain setup error:', onChainError);
        console.warn('On-chain record creation failed, but profile was created');
      }

      // Refresh the session to trigger onAuthStateChange
      await supabase.auth.refreshSession();

      return { success: true };
    } catch (error: any) {
      console.error('OTP verification error:', error);
      return {
        success: false,
        error: error.message || 'OTP verification failed',
      };
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
      return {
        success: false,
        error: error.message || 'Sign out failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setUser(null);
        return null;
      }

      setUser(user);
      return user;
    } catch (error) {
      console.error('Check user error:', error);
      return null;
    }
  };

  return {
    user,
    session,
    isLoading,
    loading: isLoading,
    signUpWithEmail,
    signInWithEmail,
    sendPhoneOTP,
    verifyPhoneOTP,
    signOut,
    checkUser,
  };
};