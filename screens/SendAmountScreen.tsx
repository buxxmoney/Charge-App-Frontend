// screens/SendAmountScreen.tsx
// Placeholder - will build properly in Segment B

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '../constants/theme';

interface SendAmountScreenProps {
  navigation?: any;
  route?: {
    params: {
      recipient: {
        user_id: string;
        name: string;
        phone?: string;
      };
    };
  };
}

export const SendAmountScreen: React.FC<SendAmountScreenProps> = ({ navigation, route }) => {
  const recipient = route?.params?.recipient;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Sending to:</Text>
        <Text style={styles.recipientName}>{recipient?.name || 'Unknown'}</Text>
        {recipient?.phone && (
          <Text style={styles.recipientPhone}>{recipient.phone}</Text>
        )}
        
        <View style={styles.placeholder}>
          <Feather name="dollar-sign" size={48} color={colors.textTertiary} />
          <Text style={styles.placeholderText}>
            Amount entry coming in Segment B
          </Text>
        </View>
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
    ...typography.h2,
    color: colors.text,
  } as TextStyle,
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  } as TextStyle,
  recipientName: {
    ...typography.h2,
    color: colors.text,
  } as TextStyle,
  recipientPhone: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  } as TextStyle,
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  placeholderText: {
    ...typography.body,
    color: colors.textTertiary,
  } as TextStyle,
});

export default SendAmountScreen;