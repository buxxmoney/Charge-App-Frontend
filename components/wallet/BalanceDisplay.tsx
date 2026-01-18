// components/wallet/BalanceDisplay.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { colors, typography, spacing } from '../../constants/theme';

interface BalanceDisplayProps {
  zarBalance: number;
  usdBalance: number;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  zarBalance,
  usdBalance,
}) => {
  const [showZAR, setShowZAR] = useState(true);
  const balance = showZAR ? zarBalance : usdBalance;
  const currency = showZAR ? 'ZAR' : 'USD';
  const symbol = showZAR ? 'R' : '$';

  const formatBalance = (amount: number) => {
    return amount.toFixed(2);
  };

  return (
    <View style={styles.container}>
      {/* Header with toggle */}
      <View style={styles.header}>
        <Text style={styles.label}>Total Balance</Text>
        <View style={styles.toggleContainer}>
          <Text style={styles.currencyText}>{currency}</Text>
          <Switch
            value={!showZAR}
            onValueChange={(value) => setShowZAR(!value)}
            trackColor={{ false: '#E8E8E8', true: '#E8E8E8' }}
            thumbColor={colors.primary}
            style={styles.switch}
          />
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
              { width: '100%' }, // 100% full
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
    ...typography.caption,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  currencyText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  symbol: {
    ...typography.display,
    color: colors.text,
    fontWeight: '700',
    marginRight: spacing.sm,
  },
  amount: {
    ...typography.display,
    color: colors.textTertiary,
    fontWeight: '700',
  },
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
    backgroundColor: colors.primary,
  },
  percentageText: {
    ...typography.caption,
    color: colors.textTertiary,
    fontWeight: '500',
    minWidth: 30,
    textAlign: 'right',
  },
});
