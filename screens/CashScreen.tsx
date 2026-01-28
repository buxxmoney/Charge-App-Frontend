// screens/CashScreen.tsx

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

interface CashScreenProps {
  navigation?: any;
}

export const CashScreen: React.FC<CashScreenProps> = ({ navigation }) => {
  const { balance } = useWalletContext();

  const zarBalance = balance?.zarBalance ?? 0;
  const usdBalance = balance?.usdBalance ?? 0;
  const totalInZar = zarBalance + (usdBalance * 18.5); // Rough USD to ZAR

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
        <Text style={styles.headerTitle}>Cash</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Total Balance */}
      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>
          R{totalInZar.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      </View>

      {/* Currency Cards */}
      <View style={styles.cardsSection}>
        <Text style={styles.sectionTitle}>Your Accounts</Text>

        {/* ZAR Card */}
        <TouchableOpacity
          style={styles.currencyCard}
          onPress={() => navigation?.navigate('CurrencyDetail', { currency: 'ZAR' })}
        >
          <View style={styles.currencyLeft}>
            <View style={[styles.currencyIcon, { backgroundColor: '#E8F5E9' }]}>
              <Text style={styles.currencyFlag}>🇿🇦</Text>
            </View>
            <View style={styles.currencyInfo}>
              <Text style={styles.currencyName}>South African Rand</Text>
              <Text style={styles.currencyCode}>ZAR</Text>
            </View>
          </View>
          <View style={styles.currencyRight}>
            <Text style={styles.currencyBalance}>
              R{zarBalance.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>

        {/* USD Card */}
        <TouchableOpacity
          style={styles.currencyCard}
          onPress={() => navigation?.navigate('CurrencyDetail', { currency: 'USD' })}
        >
          <View style={styles.currencyLeft}>
            <View style={[styles.currencyIcon, { backgroundColor: '#E3F2FD' }]}>
              <Text style={styles.currencyFlag}>🇺🇸</Text>
            </View>
            <View style={styles.currencyInfo}>
              <Text style={styles.currencyName}>US Dollar</Text>
              <Text style={styles.currencyCode}>USD</Text>
            </View>
          </View>
          <View style={styles.currencyRight}>
            <Text style={styles.currencyBalance}>
              ${usdBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </View>
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
    fontSize: 40,
    fontWeight: '700',
    color: colors.text,
  } as TextStyle,
  cardsSection: {
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
  currencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  currencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  currencyFlag: {
    fontSize: 24,
  },
  currencyInfo: {
    justifyContent: 'center',
  },
  currencyName: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text,
  } as TextStyle,
  currencyCode: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    marginTop: 2,
  } as TextStyle,
  currencyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  currencyBalance: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text,
  } as TextStyle,
});

export default CashScreen;