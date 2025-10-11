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
  // Primary Colors - Baby Blue
  primary: '#8FD9FB',
  primaryDark: '#5FC4F5',
  primaryLight: '#B8E7FC',
  
  // Backgrounds
  background: '#F5F5F5',
  cardBackground: '#FFFFFF',
  modalBackground: '#FFFFFF',
  
  // Text Colors
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#FFFFFF',
  
  // Status Colors
  success: '#8FD9FB',
  error: '#FF4444',
  warning: '#FF6B35',
  info: '#5FC4F5',
  
  // UI Elements
  border: '#E5E5E5',
  divider: '#E0E0E0',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Special
  purple: '#7C3AED',
  purpleLight: '#A78BFA',
  
  // Gradients (not used in light mode, but defined for consistency)
  backgroundGradient1: '#F5F5F5',
  backgroundGradient2: '#EEEEEE',
  backgroundGradient3: '#E8E8E8',
};

export const DarkTheme: ThemeColors = {
  // Primary Colors - Baby Blue
  primary: '#8FD9FB',
  primaryDark: '#5FC4F5',
  primaryLight: '#B8E7FC',
  
  // Backgrounds
  background: '#0f0f0f',
  cardBackground: '#1a1a1a',
  modalBackground: '#1f1f1f',
  
  // Text Colors
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#808080',
  textInverse: '#1A1A1A',
  
  // Status Colors
  success: '#8FD9FB',
  error: '#FF6B6B',
  warning: '#FFB84D',
  info: '#5FC4F5',
  
  // UI Elements
  border: '#333333',
  divider: '#2a2a2a',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Special
  purple: '#9D6CFF',
  purpleLight: '#B794F6',
  
  // Gradients (for transaction screens)
  backgroundGradient1: '#1a1a2e',
  backgroundGradient2: '#16213e',
  backgroundGradient3: '#0f3460',
};

// Legacy export for backward compatibility
// This will be replaced by the theme context
export const Colors = LightTheme;
