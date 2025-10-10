import { Colors } from '@/constants/Colors';
import { borderRadius, spacing } from '@/constants/Typography';
import { formatCurrency } from '@/utils/formatters';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BalanceCardProps {
  balance: number;
  label?: string;
  gradient?: boolean;
  gradientColors?: string[];
  showAddMoney?: boolean;
  showTransactionHistory?: boolean;
  onAddMoney?: () => void;
  onTransactionHistory?: () => void;
  interestToday?: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  label = 'Available Balance',
  gradient = true,
  gradientColors = [Colors.primary, Colors.primaryDark],
  showAddMoney = true,
  showTransactionHistory = true,
  onAddMoney,
  onTransactionHistory,
  interestToday,
}) => {
  const CardWrapper = gradient ? LinearGradient : View;
  const cardProps = gradient
    ? { colors: gradientColors, start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }
    : { style: { backgroundColor: Colors.primary } };

  return (
    <View style={styles.container}>
      <CardWrapper {...cardProps} style={styles.card}>
        <View style={styles.header}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>{label}</Text>
            <MaterialCommunityIcons name="information-outline" size={16} color="#FFF" style={styles.infoIcon} />
          </View>
          {showTransactionHistory && (
            <TouchableOpacity onPress={onTransactionHistory} style={styles.historyButton}>
              <Text style={styles.historyText}>Transaction History</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.amount}>{formatCurrency(balance)}</Text>

        {interestToday !== undefined && (
          <TouchableOpacity style={styles.interestContainer}>
            <Text style={styles.interestText}>
              Interest Credited Today: {formatCurrency(interestToday)}
            </Text>
            <MaterialCommunityIcons name="chevron-right" size={16} color="#FFF" />
          </TouchableOpacity>
        )}

        {showAddMoney && (
          <TouchableOpacity style={styles.addMoneyButton} onPress={onAddMoney}>
            <MaterialCommunityIcons name="plus" size={16} color={Colors.primary} />
            <Text style={styles.addMoneyText}>Add Money</Text>
          </TouchableOpacity>
        )}
      </CardWrapper>

      {showAddMoney && (
        <View style={styles.securityBadge}>
          <MaterialCommunityIcons name="shield-check" size={24} color={Colors.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    position: 'relative',
  },
  card: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  infoIcon: {
    marginLeft: spacing.xs,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyText: {
    fontSize: 14,
    color: '#FFF',
    marginRight: spacing.xs,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: spacing.lg,
  },
  interestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
  interestText: {
    fontSize: 12,
    color: '#FFF',
    opacity: 0.9,
    marginRight: spacing.xs,
  },
  addMoneyButton: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addMoneyText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: spacing.xs,
  },
  securityBadge: {
    position: 'absolute',
    bottom: -12,
    right: spacing.lg,
    backgroundColor: '#FFF',
    borderRadius: borderRadius.full,
    padding: spacing.sm,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
