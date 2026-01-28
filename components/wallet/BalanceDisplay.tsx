// components/wallet/BalanceDisplay.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextStyle,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

interface BalanceDisplayProps {
  zarBalance: number;
  usdBalance: number;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  zarBalance,
  usdBalance,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<'ZAR' | 'USD'>('ZAR');
  const balance = selectedCurrency === 'ZAR' ? zarBalance : usdBalance;
  const symbol = selectedCurrency === 'ZAR' ? 'R' : '$';

  const formatBalance = (amount: number) => {
    return amount.toFixed(2);
  };

  return (
    <View style={styles.container}>
      {/* Header with segmented toggle */}
      <View style={styles.header}>
        <Text style={styles.label}>Total Balance</Text>
        
        {/* Segmented Control */}
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[
              styles.segment,
              selectedCurrency === 'ZAR' && styles.segmentActive,
            ]}
            onPress={() => setSelectedCurrency('ZAR')}
          >
            <Text
              style={[
                styles.segmentText,
                selectedCurrency === 'ZAR' && styles.segmentTextActive,
              ]}
            >
              ZAR
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.segment,
              selectedCurrency === 'USD' && styles.segmentActive,
            ]}
            onPress={() => setSelectedCurrency('USD')}
          >
            <Text
              style={[
                styles.segmentText,
                selectedCurrency === 'USD' && styles.segmentTextActive,
              ]}
            >
              USD
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Balance amount */}
      <View style={styles.balanceContainer}>
        <Text style={styles.symbol}>{symbol}</Text>
        <Text style={styles.amount}>{formatBalance(balance)}</Text>
      </View>

      {/* Percentage indicator */}
      <View style={styles.percentageContainer}>
        <View style={styles.percentageBar}>
          <View
            style={[
              styles.percentageFill,
              { width: '100%' },
            ]}
          />
        </View>
        <Text style={styles.percentageText}>100%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.caption.fontSize,
    color: colors.textTertiary,
    fontWeight: '500',
  } as TextStyle,
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: 4,
  },
  segment: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md - 2,
  },
  segmentActive: {
    backgroundColor: colors.gold,
  },
  segmentText: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.textSecondary,
  } as TextStyle,
  segmentTextActive: {
    color: colors.background,
  } as TextStyle,
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  symbol: {
    fontSize: typography.display.fontSize,
    fontWeight: '700',
    color: colors.text,
    marginRight: spacing.sm,
  } as TextStyle,
  amount: {
    fontSize: typography.display.fontSize,
    fontWeight: '700',
    color: colors.textTertiary,
  } as TextStyle,
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  percentageBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  percentageFill: {
    height: '100%',
    backgroundColor: colors.gold,
  },
  percentageText: {
    fontSize: typography.caption.fontSize,
    color: colors.textTertiary,
    fontWeight: '500',
    minWidth: 30,
    textAlign: 'right',
  } as TextStyle,
});

export default BalanceDisplay;