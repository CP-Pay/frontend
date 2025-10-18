import { Header } from '@/components/Header';
import { Colors } from '@/constants/Colors';
import { borderRadius, spacing } from '@/constants/Typography';
import { transactions } from '@/data/transactions';
import { formatCurrency } from '@/utils/formatters';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function TransactionDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const transaction = transactions.find((t) => t.id === id);

  if (!transaction) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Transaction Details" />
        <View style={styles.container}>
          <Text style={styles.errorText}>Transaction not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cardBackground} />
      
      <Header
        title="Transaction Details"
        rightComponent={
          <TouchableOpacity>
            <MaterialCommunityIcons name="headset" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={[styles.iconContainer, { backgroundColor: `${transaction.iconColor}20` }]}>
            <MaterialCommunityIcons
              name={transaction.icon as any}
              size={64}
              color={transaction.iconColor}
            />
          </View>

          <Text style={styles.title}>{transaction.title}</Text>

          <Text style={[styles.amount, { color: transaction.amount >= 0 ? Colors.positive : Colors.negative }]}>
            {transaction.amount >= 0 ? '+' : '-'}
            {formatCurrency(Math.abs(transaction.amount))}
          </Text>

          <View style={styles.statusContainer}>
            <View style={styles.checkmark}>
              <MaterialCommunityIcons name="check" size={20} color="#FFF" />
            </View>
            <Text style={styles.statusText}>{transaction.status}</Text>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Transaction Details</Text>

          {transaction.creditedTo && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Credited to</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>{transaction.creditedTo}</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textSecondary} />
              </View>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction No</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue} numberOfLines={1}>
                {transaction.transactionNo}
              </Text>
              <TouchableOpacity onPress={() => copyToClipboard(transaction.transactionNo || '')}>
                <MaterialCommunityIcons name="content-copy" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction Date</Text>
            <Text style={styles.detailValue}>{transaction.date}</Text>
          </View>

          {transaction.creditedTo && (
            <TouchableOpacity style={styles.viewDetailsButton}>
              <Text style={styles.viewDetailsText}>View Cashback Details</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.primary} />
            </TouchableOpacity>
          )}
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
  summaryCard: {
    backgroundColor: Colors.cardBackground,
    margin: spacing.lg,
    padding: spacing.xxl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  statusText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '600',
  },
  detailsSection: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
  },
  detailValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginRight: spacing.sm,
    textAlign: 'right',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  viewDetailsText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginRight: spacing.xs,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});
