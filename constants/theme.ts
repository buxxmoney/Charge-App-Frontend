// constants/theme.ts

export const colors = {
  // Primary
  background: '#000000',
  surface: '#1A1A1A',
  surfaceLight: '#2A2A2A',
  
  // Text
  text: '#FFFFFF',
  textSecondary: '#999999',
  textTertiary: '#666666',
  
  // Gold accents
  primary: '#C9A227',        // Main gold
  primaryLight: '#FFD700',   // Bright gold
  primaryDark: '#9A7B0A',    // Deep gold
  
  // Status colors
  success: '#C9A227',        // Gold for success
  warning: '#FF9500',        // Orange for warnings
  error: '#FF3B30',          // Red for errors
  
  // Feature card backgrounds - subtle dark variations
  cardCash: '#1A1A1A',
  cardInvestments: '#1A1A1A',
  cardEarn: '#1A1A1A',
  cardDefault: '#1A1A1A',
  
  // Borders & dividers
  border: '#333333',
  divider: '#222222',
  
  // Status bar
  statusBar: '#000000',
  
  // Special
  gold: '#C9A227',
  goldLight: '#FFD700',
  goldDark: '#9A7B0A',
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
    shadowColor: '#C9A227',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#C9A227',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#C9A227',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const Colors = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    tint: '#C9A227',
    icon: '#000000',
    tabIconDefault: '#999999',
    tabIconSelected: '#C9A227',
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    tint: '#C9A227',
    icon: '#FFFFFF',
    tabIconDefault: '#666666',
    tabIconSelected: '#C9A227',
  },
};