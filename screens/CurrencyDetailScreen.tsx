// screens/CurrencyDetailScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { useWalletContext } from '../context/WalletContext';

interface CurrencyDetailScreenProps {
  navigation?: any;
  route?: {
    params: {
      currency: 'ZAR' | 'USD';
    };
  };
}

export const CurrencyDetailScreen: React.FC<CurrencyDetailScreenProps> = ({ navigation, route }) => {
  const currency = route?.params?.currency || 'ZAR';
  const { balance } = useWalletContext();

  const isZar = currency === 'ZAR';
  const currentBalance = isZar ? (balance?.zarBalance ?? 0) : (balance?.usdBalance ?? 0);
  const symbol = isZar ? 'R' : '$';
  const currencyName = isZar ? 'South African Rand' : 'US Dollar';
  const flag = isZar ? '🇿🇦' : '🇺🇸';

  const handleDeposit = () => {
    if (isZar) {
      navigation?.navigate('DepositEFT');
    } else {
      navigation?.navigate('Receive'); // Crypto deposit
    }
  };

  const handleSend = () => {
    navigation?.navigate('SelectRecipient', { defaultCurrency: currency });
  };

  const handleReceive = () => {
    navigation?.navigate('Receive', { currency: isZar ? 'ZARP' : 'USDC' });
  };

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
        <View style={styles.headerCenter}>
          <Text style={styles.headerFlag}>{flag}</Text>
          <Text style={styles.headerTitle}>{currency}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Balance */}
      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>Balance</Text>
        <Text style={styles.balanceAmount}>
          {symbol}{currentBalance.toLocaleString(isZar ? 'en-ZA' : 'en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}
        </Text>
        <Text style={styles.currencyFullName}>{currencyName}</Text>
      </View>

      {/* Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Actions</Text>

        {/* Deposit */}
        <TouchableOpacity style={styles.actionCard} onPress={handleDeposit}>
          <View style={[styles.actionIcon, { backgroundColor: '#FFF0E6' }]}>
            <Feather name="plus" size={24} color="#FF9500" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Deposit</Text>
            <Text style={styles.actionSubtitle}>
              {isZar ? 'Add funds via bank EFT' : 'Add funds via crypto'}
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Send */}
        <TouchableOpacity style={styles.actionCard} onPress={handleSend}>
          <View style={[styles.actionIcon, { backgroundColor: '#F0E6FF' }]}>
            <Feather name="send" size={24} color="#8B5CF6" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Send</Text>
            <Text style={styles.actionSubtitle}>Send to another Charge user</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Receive */}
        <TouchableOpacity style={styles.actionCard} onPress={handleReceive}>
          <View style={[styles.actionIcon, { backgroundColor: '#E6F7FF' }]}>
            <Feather name="arrow-down" size={24} color="#0066FF" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Receive</Text>
            <Text style={styles.actionSubtitle}>
              {isZar ? 'Share your details to receive' : 'Receive via wallet address'}
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Withdraw - only for ZAR */}
        {isZar && (
          <TouchableOpacity style={styles.actionCard} onPress={() => console.log('Withdraw')}>
            <View style={[styles.actionIcon, { backgroundColor: '#FFEBEE' }]}>
              <Feather name="arrow-up" size={24} color="#F44336" />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Withdraw</Text>
              <Text style={styles.actionSubtitle}>Withdraw to your bank account</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
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
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerFlag: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight as TextStyle['fontWeight'],
    color: colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  balanceSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text,
  } as TextStyle,
  currencyFullName: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  actionsSection: {
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  } as TextStyle,
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text,
  } as TextStyle,
  actionSubtitle: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    marginTop: 2,
  } as TextStyle,
});

export default CurrencyDetailScreen;