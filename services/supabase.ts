import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Linking from 'expo-linking'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Handle deep link URL for auth callback
export const handleAuthDeepLink = async (url: string) => {
  if (url) {
    // Check if URL contains auth tokens (either in fragment or query params)
    let accessToken: string | null = null;
    let refreshToken: string | null = null;

    // Try fragment first (after #)
    if (url.includes('#')) {
      const fragment = url.split('#')[1];
      if (fragment) {
        const params = new URLSearchParams(fragment);
        accessToken = params.get('access_token');
        refreshToken = params.get('refresh_token');
      }
    }

    // Try query params if not found in fragment
    if (!accessToken && url.includes('?')) {
      const query = url.split('?')[1]?.split('#')[0];
      if (query) {
        const params = new URLSearchParams(query);
        accessToken = params.get('access_token');
        refreshToken = params.get('refresh_token');
      }
    }

    if (accessToken && refreshToken) {
      try {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('Error setting session from deep link:', error);
          return null;
        }

        console.log('Session set from deep link successfully');
        return data.session;
      } catch (error) {
        console.error('Error processing deep link:', error);
        return null;
      }
    }
  }
  return null;
};

// Get the redirect URL for auth
export const getAuthRedirectUrl = () => {
  return Linking.createURL('/');
};