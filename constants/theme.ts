// constants/theme.ts

export const colors = {
  // Primary
  background: '#FFFFFF',
  surface: '#F8F8FA',
  surfaceLight: '#F0F0F5',
  
  // Text
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  
  // Purple accents
  primary: '#7C3AED',        // Main purple
  primaryLight: '#A78BFA',   // Light purple
  primaryDark: '#5B21B6',    // Deep purple
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  
  // Card backgrounds
  cardCash: '#F8F8FA',
  cardInvestments: '#F8F8FA',
  cardEarn: '#F8F8FA',
  cardDefault: '#F8F8FA',
  
  // Borders & dividers
  border: '#E5E7EB',
  divider: '#F3F4F6',
  
  // Status bar
  statusBar: '#FFFFFF',
  
  // Special
  purple: '#7C3AED',
  purpleLight: '#A78BFA',
  purpleDark: '#5B21B6',
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const Colors = {
  light: {
    text: '#1A1A2E',
    background: '#FFFFFF',
    tint: '#7C3AED',
    icon: '#1A1A2E',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#7C3AED',
  },
  dark: {
    text: '#FFFFFF',
    background: '#1A1A2E',
    tint: '#A78BFA',
    icon: '#FFFFFF',
    tabIconDefault: '#6B7280',
    tabIconSelected: '#A78BFA',
  },
};