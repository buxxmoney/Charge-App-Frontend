import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { RootNavigator } from './navigation/RootNavigator';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { WalletProvider } from './context/WalletContext';
import { supabase, handleAuthDeepLink } from './services/supabase';
import { colors } from './constants/theme';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  // Check if user has completed profile setup
  const checkProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_id, phone_verified')
        .eq('user_id', userId)
        .single();

      if (error || !profile) {
        return false;
      }

      return profile.phone_verified === true;
    } catch (error) {
      console.error('Error checking profile:', error);
      return false;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeApp = async () => {
      try {
        // Sign out on app start - requires fresh login each time (like a financial app)
        await supabase.auth.signOut();
        
        if (isMounted) {
          setSession(null);
          setHasProfile(false);
        }
      } catch (error) {
        console.error('Error during initialization:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeApp();

    // Listen for auth state changes (for login/signup)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (isMounted) {
          setSession(session);

          if (session?.user) {
            const profileComplete = await checkProfile(session.user.id);
            setHasProfile(profileComplete);
          } else {
            setHasProfile(false);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Handle deep links for auth callback
  useEffect(() => {
    const handleInitialUrl = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          console.log('Initial URL:', initialUrl);
          await handleAuthDeepLink(initialUrl);
        }
      } catch (error) {
        console.error('Error handling initial URL:', error);
      }
    };

    handleInitialUrl();

    const subscription = Linking.addEventListener('url', async (event) => {
      console.log('Deep link received:', event.url);
      await handleAuthDeepLink(event.url);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Show onboarding/login if no session OR if session exists but profile is incomplete
  if (!session || !hasProfile) {
    return <OnboardingScreen />;
  }

  // Show authenticated app
  return (
    <SafeAreaView style={styles.container}>
      <WalletProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </WalletProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});