// screens/HistoryScreen.tsx

import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import { borderRadius, colors, spacing, typography } from '../constants/theme';
import { useWalletContext } from '../context/WalletContext';

export const HistoryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { transactions, loading, user, fetchTransactions } = useWalletContext();

  useEffect(() => {
    if (user?.id) {
      fetchTransactions(user.id);
    }
  }, [user?.id]);

  const handleTransactionPress = (tx: any) => {
    // If user sent this transaction, offer to send again
    if (tx.from === user?.id) {
      navigation.navigate('SendAmount', {
        recipient: {
          user_id: tx.to,
          name: tx.recipientName || 'Unknown',
          phone: tx.recipientPhone,
        },
      });
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-ZA', { 
      day: 'numeric', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

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
            {transactions.map((tx: any) => {
              const isSent = tx.from === user?.id;
              return (
                <TouchableOpacity 
                  key={tx.id} 
                  style={viewStyles.transactionItem}
                  onPress={() => handleTransactionPress(tx)}
                  activeOpacity={isSent ? 0.7 : 1}
                >
                  <View style={viewStyles.transactionLeft}>
                    <View style={[
                      viewStyles.transactionIcon,
                      { backgroundColor: isSent ? colors.primary : '#34C759' }
                    ]}>
                      <Feather
                        name={isSent ? 'arrow-up-right' : 'arrow-down-left'}
                        size={16}
                        color="#fff"
                      />
                    </View>
                    <View style={viewStyles.transactionInfo}>
                      <Text style={textStyles.transactionType}>
                        {isSent ? 'Sent' : 'Received'}
                      </Text>
                      <Text style={textStyles.transactionName}>
                        {isSent ? (tx.recipientName || 'Unknown') : (tx.senderName || 'Unknown')}
                      </Text>
                      <Text style={textStyles.transactionTime}>{formatDate(tx.timestamp)}</Text>
                    </View>
                  </View>
                  <View style={viewStyles.transactionRight}>
                    <Text style={[
                      textStyles.transactionAmount, 
                      { color: isSent ? colors.text : '#34C759' }
                    ]}>
                      {isSent ? '-' : '+'}{tx.currency === 'ZARP' ? 'R' : '$'}{tx.amount.toFixed(2)}
                    </Text>
                    {isSent && (
                      <Text style={textStyles.sendAgain}>Send again</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
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
    paddingBottom: 120,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionRight: {
    alignItems: 'flex-end',
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
  transactionName: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight as TextStyle['fontWeight'],
    color: colors.textSecondary,
    marginTop: 2,
  },
  transactionTime: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.caption.lineHeight,
    color: colors.textTertiary,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: typography.body.fontSize,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: typography.body.lineHeight,
  },
  sendAgain: {
    fontSize: typography.caption.fontSize,
    color: colors.primary,
    marginTop: 4,
  },
});

export default HistoryScreen;