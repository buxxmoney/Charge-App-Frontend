import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';

export const OnboardingScreen: React.FC = () => {
    const { signInWithGoogle, sendPhoneOTP, verifyPhoneOTP, isLoading, session } = useAuth();

  useEffect(() => {
    if (session && step === 'google') {
      setStep('phone');
    }
  }, [session]);

  const [step, setStep] = useState<'google' | 'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        setStep('phone');
      } else {
        Alert.alert('Error', result.error || 'Google Sign In failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Google');
      console.error(error);
    }
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    if (!/^\+?[\d\s\-\(\)]{10,}$/.test(phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    try {
      // Send real OTP via Twilio
      const result = await sendPhoneOTP(phoneNumber);
      if (result.success) {
        setStep('otp');
        Alert.alert('Success', 'OTP sent to your phone!');
      } else {
        Alert.alert('Error', result.error || 'Failed to send OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP');
      console.error(error);
    }
  };

  const handleOTPSubmit = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter OTP');
      return;
    }

    if (otp.length !== 6) {
      Alert.alert('Error', 'OTP must be 6 digits');
      return;
    }

    try {
      const result = await verifyPhoneOTP(phoneNumber, otp);
      if (result.success) {
        Alert.alert('Success', 'Welcome to Fuse Wallet!');
        // App will automatically redirect to home screen via session state
      } else {
        Alert.alert('Error', result.error || 'OTP verification failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify OTP');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Feather name="credit-card" size={48} color={colors.primary} />
          <Text style={styles.title}>CHARGE Wallet</Text>
          <Text style={styles.subtitle}>Send money, instantly.</Text>
        </View>

        {/* Google Sign In Step */}
        {step === 'google' && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Get Started</Text>
            <Text style={styles.stepDescription}>
              Sign up with Google to create your wallet
            </Text>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <>
                  <Feather name="mail" size={20} color={colors.background} />
                  <Text style={styles.googleButtonText}>
                    Sign Up with Google
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.line} />
            </View>

            <Text style={styles.privacyText}>
              We never store your Google password. Your account is secured with
              Supabase.
            </Text>
          </View>
        )}

        {/* Phone Number Step */}
        {step === 'phone' && (
          <View style={styles.stepContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep('google')}
            >
              <Feather name="arrow-left" size={20} color={colors.primary} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.stepTitle}>Verify Phone Number</Text>
            <Text style={styles.stepDescription}>
              We'll send you an OTP to verify your phone
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="+1 (555) 123-4567"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                editable={!isLoading}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                isLoading && styles.submitButtonDisabled,
              ]}
              onPress={handlePhoneSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={styles.submitButtonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <View style={styles.stepContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep('phone')}
            >
              <Feather name="arrow-left" size={20} color={colors.primary} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.stepTitle}>Enter OTP</Text>
            <Text style={styles.stepDescription}>
              We sent a code to {phoneNumber}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Verification Code</Text>
              <TextInput
                style={styles.input}
                placeholder="000000"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                editable={!isLoading}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                isLoading && styles.submitButtonDisabled,
              ]}
              onPress={handleOTPSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={styles.submitButtonText}>Verify & Continue</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setStep('phone')}>
              <Text style={styles.resendText}>Didn't receive code? Resend</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl * 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.text,
    marginTop: spacing.lg,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  stepContainer: {
    marginBottom: spacing.xl,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: spacing.md,
  },
  stepDescription: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.background,
    marginLeft: spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
  },
  privacyText: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: 16,
  },
  submitButton: {
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.background,
  },
  resendText: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});