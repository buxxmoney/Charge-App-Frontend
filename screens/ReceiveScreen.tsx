// screens/ReceiveScreen.tsx

import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Share,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { borderRadius, colors, spacing, typography } from '../constants/theme';
import { api } from '../services/api';

type Currency = 'USDC' | 'ZARP';

interface ReceiveScreenProps {
  navigation?: any;
}

export const ReceiveScreen: React.FC<ReceiveScreenProps> = ({ navigation }) => {
  const [copied, setCopied] = useState(false);
  const [currency, setCurrency] = useState<Currency>('ZARP');
  const [depositAddress, setDepositAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepositAddress(currency);
  }, [currency]);

  const fetchDepositAddress = async (curr: Currency) => {
    setLoading(true);
    setError(null);
    try {
      const address = await api.getDepositAddress(curr);
      setDepositAddress(address);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch deposit address');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!depositAddress) return;
    await Clipboard.setStringAsync(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!depositAddress) return;
    try {
      await Share.share({
        message: `My Charge Wallet ${currency} deposit address:\n${depositAddress}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share address');
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  return (
    <SafeAreaView style={viewStyles.container} edges={['top']}>
      {/* Header */}
      <View style={viewStyles.header}>
        <TouchableOpacity
          style={viewStyles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={textStyles.headerTitle}>Receive</Text>
        <View style={viewStyles.headerSpacer} />
      </View>

      <View style={viewStyles.content}>
        {/* Currency Toggle */}
        <View style={viewStyles.currencyToggle}>
          <TouchableOpacity
            style={[
              viewStyles.currencyButton,
              currency === 'ZARP' && viewStyles.currencyButtonActive,
            ]}
            onPress={() => setCurrency('ZARP')}
          >
            <Text
              style={[
                textStyles.currencyButtonText,
                currency === 'ZARP' && textStyles.currencyButtonTextActive,
              ]}
            >
              ZAR (Rand)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              viewStyles.currencyButton,
              currency === 'USDC' && viewStyles.currencyButtonActive,
            ]}
            onPress={() => setCurrency('USDC')}
          >
            <Text
              style={[
                textStyles.currencyButtonText,
                currency === 'USDC' && textStyles.currencyButtonTextActive,
              ]}
            >
              USDC (Dollar)
            </Text>
          </TouchableOpacity>
        </View>

        {/* QR Code Card */}
        <View style={viewStyles.qrCard}>
          {loading ? (
            <View style={viewStyles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={textStyles.loadingText}>Fetching address...</Text>
            </View>
          ) : error ? (
            <View style={viewStyles.errorContainer}>
              <Feather name="alert-circle" size={32} color="#D00" />
              <Text style={textStyles.errorText}>{error}</Text>
              <TouchableOpacity
                style={viewStyles.retryButton}
                onPress={() => fetchDepositAddress(currency)}
              >
                <Text style={textStyles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : depositAddress ? (
            <>
              <View style={viewStyles.qrContainer}>
                <QRCode
                  value={depositAddress}
                  size={200}
                  backgroundColor="#fff"
                  color='#000'
                />
              </View>

              {/* Address display */}
              <View style={viewStyles.addressContainer}>
                <Text style={textStyles.addressLabel}>{currency} Deposit Address</Text>
                <Text style={textStyles.address}>{truncateAddress(depositAddress)}</Text>
              </View>

              {/* Action buttons */}
              <View style={viewStyles.actions}>
                <TouchableOpacity
                  style={[viewStyles.actionButton, copied && viewStyles.actionButtonSuccess]}
                  onPress={handleCopy}
                >
                  <Feather
                    name={copied ? 'check' : 'copy'}
                    size={20}
                    color={copied ? '#fff' : colors.primary}
                  />
                  <Text style={[textStyles.actionText, copied && textStyles.actionTextSuccess]}>
                    {copied ? 'Copied!' : 'Copy'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={viewStyles.actionButton} onPress={handleShare}>
                  <Feather name="share" size={20} color={colors.primary} />
                  <Text style={textStyles.actionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : null}
        </View>

        {/* Info section */}
        <View style={viewStyles.infoSection}>
          <View style={viewStyles.infoRow}>
            <Feather name="info" size={16} color={colors.textSecondary} />
            <Text style={textStyles.infoText}>
              Send only {currency} to this address. Sending other tokens may result in permanent loss.
            </Text>
          </View>
          <View style={viewStyles.infoRow}>
            <Feather name="clock" size={16} color={colors.textSecondary} />
            <Text style={textStyles.infoText}>
              Deposits typically arrive within 5-10 minutes after network confirmation.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const viewStyles = StyleSheet.create({
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
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  currencyToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: 4,
    marginBottom: spacing.lg,
  },
  currencyButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
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
  qrCard: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 360,
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    gap: spacing.md,
  },
  errorContainer: {
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  retryButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
  },
  qrContainer: {
    padding: spacing.lg,
    backgroundColor: '#fff',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  addressContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  actionButtonSuccess: {
    backgroundColor: '#34C759',
  },
  infoSection: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
});

const textStyles = StyleSheet.create({
  headerTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.h2.lineHeight,
    color: colors.text,
  },
  currencyButtonText: {
    fontSize: typography.body.fontSize,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: typography.body.lineHeight,
    color: colors.textSecondary,
  },
  currencyButtonTextActive: {
    color: colors.text,
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  loadingText: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.body.lineHeight,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.body.lineHeight,
    color: '#D00',
    textAlign: 'center',
  },
  retryText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: typography.body.lineHeight,
    color: colors.primary,
  },
  addressLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.caption.lineHeight,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  address: {
    fontSize: typography.body.fontSize,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: typography.body.lineHeight,
    color: colors.text,
    fontFamily: 'monospace',
  },
  actionText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: typography.body.lineHeight,
    color: colors.primary,
  },
  actionTextSuccess: {
    color: '#fff',
  },
  infoText: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight as TextStyle['fontWeight'],
    lineHeight: 18,
    color: colors.textSecondary,
    flex: 1,
  },
});

export default ReceiveScreen;