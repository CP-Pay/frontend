import { Colors } from '@/constants/Colors';
import { borderRadius, spacing } from '@/constants/Typography';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BadgeProps {
  text: string;
  color?: string;
  backgroundColor?: string;
  size?: 'small' | 'medium' | 'large';
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  color = Colors.primary,
  backgroundColor = `${Colors.primary}20`,
  size = 'small',
}) => {
  const sizeStyles = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  };

  return (
    <View style={[styles.container, { backgroundColor }, sizeStyles[size]]}>
      <Text style={[styles.text, { color }, sizeStyles[`${size}Text`]]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  smallText: {
    fontSize: 10,
  },
  medium: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  mediumText: {
    fontSize: 12,
  },
  large: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  largeText: {
    fontSize: 14,
  },
});
