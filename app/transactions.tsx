import { Header } from '@/components/Header';
import { TransactionItem } from '@/components/TransactionItem';
import { Colors } from '@/constants/Colors';
import { borderRadius, spacing } from '@/constants/Typography';
import { transactions } from '@/data/transactions';
import { formatCurrency } from '@/utils/formatters';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function TransactionsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  // Calculate totals
  const totalIn = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalOut = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cardBackground} />
      
      <Header title="Transactions" rightText="Download" onRightPress={() => {}} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Filters */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>{selectedCategory}</Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>{selectedStatus}</Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Month Summary */}
        <View style={styles.monthSummaryCard}>
          <View style={styles.monthHeader}>
            <TouchableOpacity style={styles.monthSelector}>
              <Text style={styles.monthText}>Oct 2025</Text>
              <MaterialCommunityIcons name="chevron-down" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.analysisButton}>
              <Text style={styles.analysisButtonText}>Analysis</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>In:</Text>
              <Text style={styles.summaryAmount}>{formatCurrency(totalIn)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Out:</Text>
              <Text style={styles.summaryAmount}>{formatCurrency(totalOut)}</Text>
            </View>
          </View>
        </View>

        {/* Transaction List */}
        <View style={styles.transactionList}>
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              icon={transaction.icon}
              title={transaction.title}
              date={transaction.date}
              amount={transaction.amount}
              status={transaction.status}
              iconColor={transaction.iconColor}
              onPress={() =>
                router.push({
                  pathname: '/transaction-details' as any,
                  params: { id: transaction.id },
                })
              }
            />
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.sm,
  },
  filterText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  monthSummaryCard: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginRight: spacing.xs,
  },
  analysisButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
  },
  analysisButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: spacing.sm,
  },
  summaryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  transactionList: {
    backgroundColor: Colors.cardBackground,
  },
});
