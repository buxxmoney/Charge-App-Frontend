// screens/DepositEFTScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextStyle,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { useWalletContext } from '../context/WalletContext';

interface DepositEFTScreenProps {
  navigation?: any;
}

// Mock bank details - will come from API
const BANK_DETAILS = {
  bankName: 'First National Bank',
  accountName: 'Charge Finance (Pty) Ltd',
  accountNumber: '62792836451',
  branchCode: '250655',
  accountType: 'Current/Cheque',
};

export const DepositEFTScreen: React.FC<DepositEFTScreenProps> = ({ navigation }) => {
  const { user } = useWalletContext();
  
  // User's unique reference - in reality from API/user profile
  const userReference = user?.id?.slice(0, 8).toUpperCase() || 'REF12345';

  const copyToClipboard = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', `${label} copied to clipboard`);
  };

  const DetailRow = ({ label, value, copyable = false }: { label: string; value: string; copyable?: boolean }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <View style={styles.detailValueContainer}>
        <Text style={styles.detailValue}>{value}</Text>
        {copyable && (
          <TouchableOpacity onPress={() => copyToClipboard(value, label)}>
            <Feather name="copy" size={18} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>Deposit ZAR</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Instructions */}
      <View style={styles.instructionsSection}>
        <View style={styles.instructionIcon}>
          <Feather name="info" size={24} color={colors.primary} />
        </View>
        <Text style={styles.instructionsText}>
          Transfer funds from your bank account using the details below. Use your unique reference so we can match your deposit.
        </Text>
      </View>

      {/* Bank Details Card */}
      <View style={styles.detailsCard}>
        <Text style={styles.cardTitle}>Bank Details</Text>
        
        <DetailRow label="Bank" value={BANK_DETAILS.bankName} />
        <DetailRow label="Account Name" value={BANK_DETAILS.accountName} copyable />
        <DetailRow label="Account Number" value={BANK_DETAILS.accountNumber} copyable />
        <DetailRow label="Branch Code" value={BANK_DETAILS.branchCode} copyable />
        <DetailRow label="Account Type" value={BANK_DETAILS.accountType} />
      </View>

      {/* Reference Card */}
      <View style={styles.referenceCard}>
        <Text style={styles.referenceLabel}>Your Unique Reference</Text>
        <View style={styles.referenceValueContainer}>
          <Text style={styles.referenceValue}>{userReference}</Text>
          <TouchableOpacity 
            style={styles.copyButton}
            onPress={() => copyToClipboard(userReference, 'Reference')}
          >
            <Feather name="copy" size={20} color="#fff" />
            <Text style={styles.copyButtonText}>Copy</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.referenceWarning}>
          ⚠️ You must include this reference or your deposit cannot be matched
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Deposits are usually credited within 1-2 business days. No fees are charged for EFT deposits.
        </Text>
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
  },
  headerSpacer: {
    width: 40,
  },
  instructionsSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E6F7FF',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
  },
  instructionIcon: {
    marginTop: 2,
  },
  instructionsText: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: colors.text,
    lineHeight: 22,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  cardTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  } as TextStyle,
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  detailLabel: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailValue: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
    color: colors.text,
  } as TextStyle,
  referenceCard: {
    backgroundColor: '#FFF8E6',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#FFD666',
  },
  referenceLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  } as TextStyle,
  referenceValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  referenceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 2,
  } as TextStyle,
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  copyButtonText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: '#fff',
  } as TextStyle,
  referenceWarning: {
    fontSize: typography.caption.fontSize,
    color: '#996600',
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  footerText: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default DepositEFTScreen;