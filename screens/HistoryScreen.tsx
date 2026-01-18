import { Feather } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextStyle,
    View,
} from 'react-native';
import { borderRadius, colors, spacing, typography } from '../constants/theme';
import { useWallet } from '../hooks/useWallet';

export const HistoryScreen: React.FC = () => {
  const { transactions, loading, user, refreshTransactions } = useWallet();

  useEffect(() => {
    if (user?.id) {
      refreshTransactions();
    }
  }, [user?.id]);

  return (
    <SafeAreaView style={viewStyles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <ScrollView
        style={viewStyles.scrollView}
        contentContainerStyle={viewStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={viewStyles.header}>
          <Text style={textStyles.headerTitle}>History</Text>
        </View>

        {loading ? (
          <View style={viewStyles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : transactions.length === 0 ? (
          <View style={viewStyles.emptyStateContainer}>
            <Feather
              name="inbox"
              size={48}
              color={colors.textTertiary}
              style={viewStyles.emptyIcon}
            />
            <Text style={textStyles.emptyStateTitle}>No transactions yet</Text>
            <Text style={textStyles.emptyStateSubtitle}>
              Your transaction history will appear here
            </Text>
          </View>
        ) : (
          <View style={viewStyles.transactionList}>
            {transactions.map((tx) => (
              <View key={tx.id} style={viewStyles.transactionItem}>
                <View style={viewStyles.transactionLeft}>
                  <View style={viewStyles.transactionIcon}>
                    <Feather
                      name={tx.from === user?.id ? 'arrow-up-right' : 'arrow-down-left'}
                      size={16}
                      color={colors.background}
                    />
                  </View>
                  <View style={viewStyles.transactionInfo}>
                    <Text style={textStyles.transactionType}>
                      {tx.from === user?.id ? 'Sent' : 'Received'}
                    </Text>
                    <Text style={textStyles.transactionTime}>{tx.timestamp}</Text>
                  </View>
                </View>
                <Text style={[textStyles.transactionAmount, { color: tx.from === user?.id ? '#FF3B30' : '#00C994' }]}>
                  {tx.from === user?.id ? '-' : '+'}{tx.amount} {tx.currency}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const viewStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  emptyIcon: {
    marginBottom: spacing.lg,
  },
  transactionList: {
    paddingHorizontal: spacing.lg,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
});

const textStyles = StyleSheet.create({
  headerTitle: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.h1.lineHeight,
    color: colors.text,
  },
  emptyStateTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.h3.lineHeight,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.caption.lineHeight,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  transactionType: {
    fontSize: typography.body.fontSize,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: typography.body.lineHeight,
    color: colors.text,
  },
  transactionTime: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.caption.lineHeight,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  transactionAmount: {
    fontSize: typography.body.fontSize,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: typography.body.lineHeight,
  },
});
