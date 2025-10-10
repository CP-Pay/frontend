import { Colors } from '@/constants/Colors';
import { borderRadius, spacing } from '@/constants/Typography';
import { formatAmount } from '@/utils/formatters';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TransactionItemProps {
  icon: string;
  title: string;
  date: string;
  amount: number;
  status: string;
  iconColor?: string;
  onPress?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  icon,
  title,
  date,
  amount,
  status,
  iconColor = Colors.primary,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
        <MaterialCommunityIcons name={icon as any} size={24} color={iconColor} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.bottomRow}>
          <Text style={styles.date}>{date}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: amount >= 0 ? Colors.positive : Colors.negative }]}>
          {formatAmount(amount)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  contentContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: spacing.xs,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginRight: spacing.sm,
  },
  statusBadge: {
    backgroundColor: `${Colors.success}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: 10,
    color: Colors.success,
    fontWeight: '500',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
