// screens/SendAmountScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TextStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { useWalletContext } from '../context/WalletContext';

type Currency = 'ZARP' | 'USDC';

interface SendAmountScreenProps {
  navigation?: any;
  route?: {
    params: {
      recipient: {
        user_id: string;
        name: string;
        phone?: string;
      };
    };
  };
}

export const SendAmountScreen: React.FC<SendAmountScreenProps> = ({ navigation, route }) => {
  const recipient = route?.params?.recipient;
  const { balance } = useWalletContext();
  
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('ZARP');

  const zarBalance = balance?.zarBalance ?? 100;
  const usdBalance = balance?.usdBalance ?? 0;
  const availableBalance = currency === 'ZARP' ? zarBalance : usdBalance;
  const currencySymbol = currency === 'ZARP' ? 'R' : '$';

  const numericAmount = parseFloat(amount) || 0;
  const isValidAmount = numericAmount > 0 && numericAmount <= availableBalance;
  const hasInsufficientFunds = numericAmount > availableBalance;

  const handleAmountChange = (text: string) => {
    // Only allow numbers and one decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) return; // More than one decimal
    if (parts[1]?.length > 2) return; // More than 2 decimal places
    setAmount(cleaned);
  };

  const handleSetMax = () => {
    setAmount(availableBalance.toFixed(2));
  };

  const handleContinue = () => {
    if (!isValidAmount) return;
    
    navigation?.navigate('ConfirmSend', {
      recipient,
      amount: numericAmount,
      currency,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Send</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Recipient Info */}
        <View style={styles.recipientSection}>
          <Text style={styles.recipientLabel}>To</Text>
          <View style={styles.recipientCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {recipient?.name?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
            <View style={styles.recipientInfo}>
              <Text style={styles.recipientName}>{recipient?.name || 'Unknown'}</Text>
              {recipient?.phone && (
                <Text style={styles.recipientPhone}>{recipient.phone}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.amountSection}>
          {/* Currency Toggle */}
          <View style={styles.currencyToggle}>
            <TouchableOpacity
              style={[
                styles.currencyButton,
                currency === 'ZARP' && styles.currencyButtonActive,
              ]}
              onPress={() => setCurrency('ZARP')}
            >
              <Text
                style={[
                  styles.currencyButtonText,
                  currency === 'ZARP' && styles.currencyButtonTextActive,
                ]}
              >
                ZAR
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.currencyButton,
                currency === 'USDC' && styles.currencyButtonActive,
              ]}
              onPress={() => setCurrency('USDC')}
            >
              <Text
                style={[
                  styles.currencyButtonText,
                  currency === 'USDC' && styles.currencyButtonTextActive,
                ]}
              >
                USD
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amount Display */}
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>{currencySymbol}</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
              keyboardType="decimal-pad"
              autoFocus
            />
          </View>

          {/* Balance & Max */}
          <View style={styles.balanceRow}>
            <Text style={styles.balanceText}>
              Available: {currencySymbol}{availableBalance.toFixed(2)}
            </Text>
            <TouchableOpacity onPress={handleSetMax}>
              <Text style={styles.maxButton}>MAX</Text>
            </TouchableOpacity>
          </View>

          {/* Error Message */}
          {hasInsufficientFunds && (
            <View style={styles.errorContainer}>
              <Feather name="alert-circle" size={16} color="#D00" />
              <Text style={styles.errorText}>Insufficient funds</Text>
            </View>
          )}
        </View>

        {/* Continue Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !isValidAmount && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!isValidAmount}
          >
            <Text
              style={[
                styles.continueButtonText,
                !isValidAmount && styles.continueButtonTextDisabled,
              ]}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
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
  recipientSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  recipientLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  } as TextStyle,
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
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
  amountSection: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  currencyToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: 4,
    marginBottom: spacing.xl,
  },
  currencyButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md - 2,
  },
  currencyButtonActive: {
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  currencyButtonText: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
    color: colors.textSecondary,
  } as TextStyle,
  currencyButtonTextActive: {
    color: colors.text,
    fontWeight: '600',
  } as TextStyle,
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  currencySymbol: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text,
    marginRight: spacing.xs,
  } as TextStyle,
  amountInput: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text,
    minWidth: 100,
    textAlign: 'left',
  } as TextStyle,
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  balanceText: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
  } as TextStyle,
  maxButton: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
  } as TextStyle,
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: '#FFE5E5',
    borderRadius: borderRadius.md,
  },
  errorText: {
    fontSize: typography.body.fontSize,
    color: '#D00',
  } as TextStyle,
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: colors.surface,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  } as TextStyle,
  continueButtonTextDisabled: {
    color: colors.textTertiary,
  } as TextStyle,
});

export default SendAmountScreen;