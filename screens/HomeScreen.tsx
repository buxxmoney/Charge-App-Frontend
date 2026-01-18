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
import { Button } from '../components/ui/Button';
import { BalanceDisplay } from '../components/wallet/BalanceDisplay';
import { FeatureCard } from '../components/wallet/FeatureCard';
import { colors, spacing, typography } from '../constants/theme';
import { useWallet } from '../hooks/useWallet';

export const HomeScreen: React.FC = () => {
  const { balance, loading, user, refreshBalance } = useWallet();

  useEffect(() => {
    if (user?.id) {
      refreshBalance();
    }
  }, [user?.id]);

  const zarBalance = balance?.zarBalance || 0;
  const usdBalance = balance?.usdBalance || 0;
  const hasBalance = zarBalance > 0 || usdBalance > 0;

  const features = [
    {
      title: 'Cash',
      subtitle: 'Send and receive',
      icon: 'dollar-sign' as const,
      backgroundColor: colors.cashBlue,
      onPress: () => {},
    },
    {
      title: 'Investments',
      subtitle: 'Trade crypto',
      icon: 'grid' as const,
      backgroundColor: colors.investmentsOrange,
      onPress: () => {},
    },
    {
      title: 'Earn',
      subtitle: 'Up to 5.62% APY',
      icon: 'trending-up' as const,
      backgroundColor: colors.earnPurple,
      onPress: () => {},
    },
    {
      title: 'Fuse Card',
      subtitle: 'Get your free card',
      icon: 'credit-card' as const,
      backgroundColor: colors.cardGray,
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={viewStyles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <ScrollView
        style={viewStyles.scrollView}
        contentContainerStyle={viewStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={viewStyles.header}>
          <Text style={textStyles.headerTitle}>Wallet</Text>
          <Feather name="settings" size={24} color={colors.text} />
        </View>

        {loading ? (
          <View style={viewStyles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            <BalanceDisplay zarBalance={zarBalance} usdBalance={usdBalance} />

            {!hasBalance ? (
              <View style={viewStyles.emptyStateContainer}>
                <Text style={textStyles.emptyStateTitle}>There is nothing here yet</Text>
                <Text style={textStyles.emptyStateSubtitle}>
                  Deposit tokens to your address to start{'\n'}using Fuse wallet
                </Text>
                <View style={viewStyles.receiveButtonContainer}>
                  <Button
                    title="Receive"
                    variant="primary"
                    size="lg"
                    icon={<Feather name="arrow-down" size={20} color={colors.background} />}
                    onPress={() => {}}
                  />
                </View>
              </View>
            ) : (
              <View style={viewStyles.actionsContainer}>
                <Button
                  title="Send"
                  variant="primary"
                  onPress={() => {}}
                  icon={<Feather name="send" size={18} color={colors.background} />}
                />
                <Button
                  title="Receive"
                  variant="secondary"
                  onPress={() => {}}
                  icon={<Feather name="arrow-down" size={18} color={colors.text} />}
                />
              </View>
            )}

            <View style={viewStyles.featuresSection}>
              <View style={viewStyles.featuresGrid}>
                {features.map((feature) => (
                  <FeatureCard
                    key={feature.title}
                    title={feature.title}
                    subtitle={feature.subtitle}
                    icon={feature.icon}
                    backgroundColor={feature.backgroundColor}
                    iconColor={colors.background}
                    onPress={feature.onPress}
                  />
                ))}
              </View>
            </View>
          </>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  receiveButtonContainer: {
    width: '100%',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginVertical: spacing.lg,
  },
  featuresSection: {
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.xl,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});
