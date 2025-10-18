/**
 * CPPay Theme System
 * Supports Light and Dark modes with Baby Blue as primary color
 */

export type Theme = 'light' | 'dark';

export interface ThemeColors {
  // Primary Colors
  primary: string;
  primaryDark: string;
  primaryLight: string;
  
  // Backgrounds
  background: string;
  cardBackground: string;
  modalBackground: string;
  
  // Text Colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  
  // Status Colors
  success: string;
  error: string;
  warning: string;
  info: string;
  
  // UI Elements
  border: string;
  divider: string;
  shadow: string;
  overlay: string;
  
  // Special
  purple: string;
  purpleLight: string;
  
  // Gradients (for dark theme screens)
  backgroundGradient1: string;
  backgroundGradient2: string;
  backgroundGradient3: string;
}

export const LightTheme: ThemeColors = {
  // Primary Colors (use your palette)
  primary: '#4D1B64',
  primaryDark: '#4D1B64',
  primaryLight: '#4D1B64',

  // Backgrounds
  background: '#FFFFFF',
  cardBackground: '#FFFFFF',
  modalBackground: '#FFFFFF',

  // Text Colors
  textPrimary: '#000000',
  textSecondary: '#000000',
  textTertiary: '#000000',
  textInverse: '#FFFFFF',

  // Status Colors
  success: '#4D1B64',
  error: '#55000F',
  warning: '#55000F',
  info: '#4D1B64',

  // UI Elements
  border: '#000000',
  divider: '#000000',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Special
  purple: '#4D1B64',
  purpleLight: '#4D1B64',

  // Gradients (aligned to palette)
  backgroundGradient1: '#FFFFFF',
  backgroundGradient2: '#4D1B64',
  backgroundGradient3: '#55000F',
};

export const DarkTheme: ThemeColors = {
  // Primary Colors (use your palette)
  primary: '#4D1B64',
  primaryDark: '#4D1B64',
  primaryLight: '#4D1B64',

  // Backgrounds
  background: '#000000',
  cardBackground: '#000000',
  modalBackground: '#000000',

  // Text Colors
  textPrimary: '#FFFFFF',
  textSecondary: '#FFFFFF',
  textTertiary: '#FFFFFF',
  textInverse: '#000000',

  // Status Colors
  success: '#4D1B64',
  error: '#55000F',
  warning: '#55000F',
  info: '#4D1B64',

  // UI Elements
  border: '#000000',
  divider: '#000000',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.7)',

  // Special
  purple: '#4D1B64',
  purpleLight: '#4D1B64',

  // Gradients (aligned to palette)
  backgroundGradient1: '#4D1B64',
  backgroundGradient2: '#55000F',
  backgroundGradient3: '#000000',
};

// Legacy export for backward compatibility
// This will be replaced by the theme context
export const Colors = LightTheme;
