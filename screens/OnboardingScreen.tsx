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
  const { signUpWithEmail, signInWithEmail, sendPhoneOTP, verifyPhoneOTP, isLoading, session, user } = useAuth();

  const [step, setStep] = useState<'login' | 'signup' | 'confirm-email' | 'phone' | 'otp'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');

  // Determine initial step based on session state
  useEffect(() => {
    if (session && user) {
      // User has a valid session, check if they need phone verification
      // This will be handled by App.tsx checking hasProfile
      // If they're here with a session, they need to complete phone verification
      if (step === 'login' || step === 'signup' || step === 'confirm-email') {
        setStep('phone');
      }
    }
  }, [session, user]);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    try {
      const result = await signInWithEmail(email, password);
      if (result.success) {
        // App.tsx will handle routing based on profile status
      } else {
        Alert.alert('Error', result.error || 'Login failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to log in');
      console.error(error);
    }
  };

  const handleSignUp = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    try {
      const result = await signUpWithEmail(email, password);
      if (result.success) {
        // Move to email confirmation step (or phone if email confirmation is disabled)
        setStep('confirm-email');
      } else {
        Alert.alert('Error', result.error || 'Signup failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign up');
      console.error(error);
    }
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    if (!/^\+?[\d\s\-\(\)]{10,}$/.test(phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid phone number with country code (e.g., +1234567890)');
      return;
    }

    try {
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
        Alert.alert('Success', 'Welcome to Charge Wallet!');
        // App will automatically redirect to home screen via profile state check
      } else {
        Alert.alert('Error', result.error || 'OTP verification failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify OTP');
      console.error(error);
    }
  };

  const handleResendOTP = async () => {
    try {
      const result = await sendPhoneOTP(phoneNumber);
      if (result.success) {
        Alert.alert('Success', 'New OTP sent to your phone!');
        setOtp('');
      } else {
        Alert.alert('Error', result.error || 'Failed to resend OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Feather name="credit-card" size={48} color={colors.primary} />
          <Text style={styles.title}>CHARGE Wallet</Text>
          <Text style={styles.subtitle}>Send money, instantly.</Text>
        </View>

        {/* Login Step */}
        {step === 'login' && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Welcome Back</Text>
            <Text style={styles.stepDescription}>
              Log in to your account
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                isLoading && styles.submitButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={styles.submitButtonText}>Log In</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchAuthButton}
              onPress={() => {
                setStep('signup');
                setEmail('');
                setPassword('');
              }}
            >
              <Text style={styles.switchAuthText}>
                Don't have an account? <Text style={styles.switchAuthLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Sign Up Step */}
        {step === 'signup' && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Create Account</Text>
            <Text style={styles.stepDescription}>
              Sign up to create your wallet
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="At least 6 characters"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                isLoading && styles.submitButtonDisabled,
              ]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={styles.submitButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchAuthButton}
              onPress={() => {
                setStep('login');
                setEmail('');
                setPassword('');
              }}
            >
              <Text style={styles.switchAuthText}>
                Already have an account? <Text style={styles.switchAuthLink}>Log In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Email Confirmation Step */}
        {step === 'confirm-email' && (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Feather name="mail" size={48} color={colors.primary} />
            </View>

            <Text style={styles.stepTitle}>Check Your Email</Text>
            <Text style={styles.stepDescription}>
              We've sent a confirmation link to:
            </Text>
            <Text style={styles.emailText}>{email}</Text>
            <Text style={styles.stepDescription}>
              Click the link in the email to verify your account, then return to the app.
            </Text>

            <View style={styles.waitingContainer}>
              <ActivityIndicator color={colors.primary} size="small" />
              <Text style={styles.waitingText}>Waiting for confirmation...</Text>
            </View>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                setStep('signup');
                setEmail('');
                setPassword('');
              }}
            >
              <Text style={styles.secondaryButtonText}>Use a different email</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Phone Number Step */}
        {step === 'phone' && (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Feather name="smartphone" size={48} color={colors.primary} />
            </View>

            <Text style={styles.stepTitle}>Verify Phone Number</Text>
            <Text style={styles.stepDescription}>
              We need to verify your phone number to complete setup
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="+27 82 123 4567"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                editable={!isLoading}
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={styles.inputHint}>Include your country code (e.g., +27 for South Africa)</Text>
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
                style={[styles.input, styles.otpInput]}
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

            <TouchableOpacity 
              onPress={handleResendOTP}
              disabled={isLoading}
            >
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
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  waitingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xl,
  },
  waitingText: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
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
  inputHint: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    marginTop: spacing.xs,
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
  otpInput: {
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 8,
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
  secondaryButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  switchAuthButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  switchAuthText: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  switchAuthLink: {
    color: colors.primary,
    fontWeight: '600' as const,
  },
  privacyText: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  resendText: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});