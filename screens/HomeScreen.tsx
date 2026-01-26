// screens/HomeScreen.tsx

import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BalanceDisplay } from '../components/wallet/BalanceDisplay';
import { FeatureCard } from '../components/wallet/FeatureCard';
import { colors, spacing, typography } from '../constants/theme';
import { useWalletContext } from '../context/WalletContext';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { balance, user, loading, error, fetchBalance } = useWalletContext();

  useEffect(() => {
    if (user?.id) {
      fetchBalance(user.id);
    }
  }, [user?.id]);

  const onRefresh = async () => {
    if (user?.id) {
      await fetchBalance(user.id);
    }
  };

  const zarBalance = balance?.zarBalance ?? 0;
  const usdBalance = balance?.usdBalance ?? 0;
  const hasBalance = zarBalance > 0 || usdBalance > 0;

  return (
    <SafeAreaView style={viewStyles.container} edges={['top']}>
      <ScrollView
        style={viewStyles.scrollView}
        contentContainerStyle={viewStyles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={viewStyles.header}>
          <Text style={textStyles.headerTitle}>Wallet</Text>
          <TouchableOpacity
            style={viewStyles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Feather name="settings" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Balance Display */}
        <BalanceDisplay zarBalance={zarBalance} usdBalance={usdBalance} />

        {/* Empty State or Content */}
        {!hasBalance ? (
          <View style={viewStyles.emptyState}>
            <Text style={textStyles.emptyTitle}>There is nothing here yet</Text>
            <Text style={textStyles.emptySubtitle}>
              Deposit tokens to your address to start{'\n'}using Charge wallet
            </Text>

            <TouchableOpacity
              style={viewStyles.receiveButton}
              onPress={() => navigation.navigate('Receive')}
            >
              <Feather name="arrow-down" size={20} color="#fff" />
              <Text style={textStyles.receiveButtonText}>Receive</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Feature Cards */}
        <View style={viewStyles.featureGrid}>
          <FeatureCard
            title="Cash"
            subtitle="Send and receive"
            icon="dollar-sign"
            backgroundColor={colors.primary}
            onPress={() => navigation.navigate('SelectRecipient')}
          />
          <FeatureCard
            title="Investments"
            subtitle="Trade crypto"
            icon="grid"
            backgroundColor="#FF9500"
            onPress={() => {}}
          />
          <FeatureCard
            title="Earn"
            subtitle="Earn interest"
            icon="trending-up"
            backgroundColor="#AF52DE"
            onPress={() => {}}
          />
          <FeatureCard
            title="Card"
            subtitle="Coming soon"
            icon="credit-card"
            backgroundColor="#2C2C2E"
            onPress={() => {}}
          />
        </View>

        {/* Error display */}
        {error && (
          <View style={viewStyles.errorContainer}>
            <Text style={textStyles.errorText}>{error}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const viewStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  settingsButton: {
    padding: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  receiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 14,
    marginTop: spacing.xl,
    width: '100%',
    gap: spacing.sm,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  errorContainer: {
    margin: spacing.lg,
    padding: spacing.md,
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
  },
});

const textStyles = StyleSheet.create({
  headerTitle: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.h1.lineHeight,
    color: colors.text,
  },
  emptyTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.h2.lineHeight,
    color: colors.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight as TextStyle['fontWeight'],
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  receiveButtonText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: typography.body.lineHeight,
    color: '#fff',
  },
  errorText: {
    color: '#D00',
    textAlign: 'center',
  },
});

export default HomeScreen;