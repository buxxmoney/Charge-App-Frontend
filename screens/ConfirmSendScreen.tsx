// screens/ConfirmSendScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextStyle,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { useWalletContext } from '../context/WalletContext';
import { api } from '../services/api';
import { signTransactionFingerprint } from '../services/crypto';

type TransactionStatus = 'idle' | 'signing' | 'submitting' | 'success' | 'error';

interface ConfirmSendScreenProps {
  navigation?: any;
  route?: {
    params: {
      recipient: {
        user_id: string;
        name: string;
        phone?: string;
      };
      amount: number;
      currency: 'ZARP' | 'USDC';
    };
  };
}

export const ConfirmSendScreen: React.FC<ConfirmSendScreenProps> = ({ navigation, route }) => {
  const { recipient, amount, currency } = route?.params || {};
  const { keypair, user } = useWalletContext();
  
  // TODO: Remove this mock keypair once registration flow stores real keypair
  const MOCK_KEYPAIR = {
    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    publicKey: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  };
  const effectiveKeypair = keypair || MOCK_KEYPAIR;
  
  const [status, setStatus] = useState<TransactionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currencySymbol = currency === 'ZARP' ? 'R' : '$';

  const handleConfirmSend = async () => {
    if (!effectiveKeypair?.privateKey) {
      Alert.alert('Error', 'No wallet keypair found. Please re-register.');
      return;
    }

    if (!recipient?.user_id || !amount || !currency) {
      Alert.alert('Error', 'Missing transaction details.');
      return;
    }

    setStatus('signing');
    setErrorMessage(null);

    try {
      // Step 1: Request transaction fingerprint from server
      const fingerprint = await api.getTransactionFingerprint({
        recipientId: recipient.user_id,
        amount,
        currency,
      });
      console.log('Transaction fingerprint:', fingerprint);

      // Step 2: Sign the fingerprint with private key using crypto service
      const signature = await signTransactionFingerprint(
        fingerprint,
        effectiveKeypair.privateKey
      );
      console.log('Signature:', signature);
      console.log('Signed with public key:', effectiveKeypair.publicKey);

      setStatus('submitting');

      // Step 3: Submit the signed transaction
      const result = await api.submitTransaction({
        fingerprint,
        signature,
        recipientId: recipient.user_id,
        amount,
        currency,
      });
      console.log('Transaction result:', result);

      if (result.success) {
        setStatus('success');
      } else {
        throw new Error(result.error || 'Transaction failed');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Transaction failed. Please try again.');
    }
  };

  const handleDone = () => {
    // Navigate back to home and reset the stack
    navigation?.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  const handleRetry = () => {
    setStatus('idle');
    setErrorMessage(null);
  };

  // Success Screen
  if (status === 'success') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.resultContainer}>
          <View style={styles.successIcon}>
            <Feather name="check" size={48} color="#fff" />
          </View>
          <Text style={styles.resultTitle}>Sent!</Text>
          <Text style={styles.resultAmount}>
            {currencySymbol}{amount?.toFixed(2)}
          </Text>
          <Text style={styles.resultSubtitle}>to {recipient?.name}</Text>
          
          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Error Screen
  if (status === 'error') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.resultContainer}>
          <View style={styles.errorIcon}>
            <Feather name="x" size={48} color="#fff" />
          </View>
          <Text style={styles.resultTitle}>Failed</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleDone}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Loading Screen
  if (status === 'signing' || status === 'submitting') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.resultContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>
            {status === 'signing' ? 'Signing transaction...' : 'Sending...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Confirm Screen (idle)
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        {/* Transaction Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>You're sending</Text>
          <Text style={styles.summaryAmount}>
            {currencySymbol}{amount?.toFixed(2)}
          </Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.toLabel}>To</Text>
          <View style={styles.recipientRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {recipient?.name?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
            <View style={styles.recipientInfo}>
              <Text style={styles.recipientName}>{recipient?.name}</Text>
              {recipient?.phone && (
                <Text style={styles.recipientPhone}>{recipient.phone}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Transaction Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.detailValue}>{currencySymbol}{amount?.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fee</Text>
            <Text style={styles.detailValue}>Free</Text>
          </View>
          <View style={[styles.detailRow, styles.detailRowTotal]}>
            <Text style={styles.detailLabelTotal}>Total</Text>
            <Text style={styles.detailValueTotal}>{currencySymbol}{amount?.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmSend}>
          <Feather name="lock" size={20} color="#fff" />
          <Text style={styles.confirmButtonText}>Confirm & Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
  },
  headerTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight as TextStyle['fontWeight'],
    color: colors.text,
  } as TextStyle,
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  summaryLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  } as TextStyle,
  summaryAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.text,
  } as TextStyle,
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.surface,
    marginVertical: spacing.lg,
  },
  toLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  } as TextStyle,
  recipientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  } as TextStyle,
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text,
  } as TextStyle,
  recipientPhone: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    marginTop: 2,
  } as TextStyle,
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  detailRowTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.surface,
    marginTop: spacing.sm,
    paddingTop: spacing.md,
  },
  detailLabel: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
  } as TextStyle,
  detailValue: {
    fontSize: typography.body.fontSize,
    color: colors.text,
  } as TextStyle,
  detailLabelTotal: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text,
  } as TextStyle,
  detailValueTotal: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text,
  } as TextStyle,
  footer: {
    padding: spacing.lg,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  } as TextStyle,
  // Result screens
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  errorIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  } as TextStyle,
  resultAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.text,
  } as TextStyle,
  resultSubtitle: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  } as TextStyle,
  errorMessage: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  } as TextStyle,
  loadingText: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    marginTop: spacing.lg,
  } as TextStyle,
  doneButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl * 2,
    borderRadius: borderRadius.lg,
    marginTop: spacing.xl * 2,
  },
  doneButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  } as TextStyle,
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl * 2,
    borderRadius: borderRadius.lg,
    marginTop: spacing.xl * 2,
  },
  retryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  } as TextStyle,
  cancelButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.textSecondary,
  } as TextStyle,
});

export default ConfirmSendScreen;