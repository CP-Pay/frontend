import { Colors } from '@/constants/Colors';
import { borderRadius, spacing } from '@/constants/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QuickActionButtonProps {
  icon: string;
  label: string;
  badge?: string;
  badgeColor?: string;
  onPress: () => void;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon,
  label,
  badge,
  badgeColor = Colors.error,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon as any} size={35} color={Colors.primary} />
        {badge && (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    width: '33.33%',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFF',
  },
  label: {
    fontSize: 12,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 16,
  },
});
