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

  const signInWithGoogle = async (): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Open the OAuth URL in browser
        await WebBrowser.openBrowserAsync(data.url);
        // Session will be set via onAuthStateChange listener when user returns
        return { success: true };
      }

      return { success: false, error: 'No OAuth URL returned' };
    } catch (error: any) {
      console.error('Google Sign In error:', error);
      return {
        success: false,
        error: error.message || 'Google Sign In failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const sendPhoneOTP = async (phoneNumber: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      // Generate random 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Call Supabase Edge Function to send SMS via Twilio
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/send-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_KEY}`,
          },
          body: JSON.stringify({ phoneNumber, otp }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      // Store OTP in database with 10-minute expiration
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      const { error: insertError } = await supabase
        .from('otp_codes')
        .insert([
          {
            phone_number: phoneNumber,
            code: otp,
            expires_at: expiresAt.toISOString(),
          },
        ]);

      if (insertError) {
        console.error('OTP storage error:', insertError);
        return { success: false, error: 'Failed to store OTP' };
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
    otp: string
  ): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      // Check if OTP exists and is not expired
      const { data: otpRecord, error: otpError } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('phone_number', phoneNumber)
        .eq('code', otp)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (otpError || !otpRecord) {
        return { success: false, error: 'Invalid or expired OTP' };
      }

      // Mark OTP as verified
      await supabase
        .from('otp_codes')
        .update({ verified: true })
        .eq('id', otpRecord.id);

      // Get authenticated user
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        return { success: false, error: 'No authenticated user' };
      }

      // Generate keypair and view key
      const keypair = await generateKeypair();
      const viewKey = await generateViewKey();

      // Create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authUser.id,
            first_name: authUser.user_metadata?.name?.split(' ')[0] || 'User',
            last_name: authUser.user_metadata?.name?.split(' ')[1] || '',
            phone_number: phoneNumber,
            phone_verified: true,
            public_key: keypair.publicKey,
            hault_registered: false,
          },
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        return { success: false, error: 'Failed to create profile' };
      }

      // Create on-chain record
      const { error: onChainError } = await supabase
        .from('on_chain')
        .insert([
          {
            user_id: authUser.id,
            device_public: keypair.publicKey,
            backend_public: null,
            view_key: viewKey,
            generation_index: 0,
            status: 'TX_UNSENT',
          },
        ]);

      if (onChainError) {
        console.error('On-chain setup error:', onChainError);
        return { success: false, error: 'Failed to setup on-chain account' };
      }

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
    signInWithGoogle,
    sendPhoneOTP,
    verifyPhoneOTP,
    signOut,
    checkUser,
  };
};