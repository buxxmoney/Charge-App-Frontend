// components/wallet/FeatureCard.tsx

import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from '../../constants/theme';

interface FeatureCardProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Feather.glyphMap;
  backgroundColor: string;
  iconColor?: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  subtitle,
  icon,
  backgroundColor,
  iconColor = colors.primaryLight,  // Changed to gold
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[viewStyles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={viewStyles.card}>
        {/* Icon container */}
        <View
          style={[
            viewStyles.iconContainer,
            { backgroundColor },
          ]}
        >
          <Feather
            name={icon}
            size={24}
            color={iconColor}
          />
        </View>

        {/* Text content */}
        <View style={viewStyles.textContainer}>
          <Text style={textStyles.title}>{title}</Text>
          <Text style={textStyles.subtitle}>{subtitle}</Text>
        </View>

        {/* Arrow indicator */}
        <View style={viewStyles.arrowContainer}>
          <Feather
            name="chevron-right"
            size={20}
            color={colors.primaryLight}  // Also gold
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const viewStyles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  textContainer: {
    marginBottom: spacing.md,
  },
  arrowContainer: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
  },
});

const textStyles = StyleSheet.create({
  title: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.h3.lineHeight,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.caption.lineHeight,
    color: colors.textSecondary,
  },
});

export default FeatureCard;