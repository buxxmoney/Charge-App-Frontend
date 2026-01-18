// constants/theme.ts

export const colors = {
  // Primary
  background: '#FFFFFF',
  surface: '#F5F5F5',
  
  // Text
  text: '#000000',
  textSecondary: '#999999',
  textTertiary: '#CCCCCC',
  
  // Accent colors
  primary: '#0066FF',      // Blue for primary actions
  secondary: '#FF6B6B',    // Red/coral for earn
  success: '#00C994',      // Green
  warning: '#FFA500',      // Orange for investments
  
  // Feature card backgrounds
  cashBlue: '#0066FF',
  investmentsOrange: '#FF9966',
  earnPurple: '#7C3AED',
  cardGray: '#333333',
  
  // Borders & dividers
  border: '#E8E8E8',
  divider: '#F0F0F0',
  
  // Status bar
  statusBar: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const typography = {
  display: {
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 56,
  },
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Colors object for theme-aware components (used by Expo Router tabs and themed components)
export const Colors = {
  light: {
    text: colors.text,
    background: colors.background,
    tint: colors.primary,
    icon: colors.text,
    tabIconDefault: colors.textSecondary,
    tabIconSelected: colors.primary,
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    tint: colors.primary,
    icon: '#FFFFFF',
    tabIconDefault: '#999999',
    tabIconSelected: colors.primary,
  },
};
