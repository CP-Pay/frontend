import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { spacing, borderRadius } from '@/constants/Typography';

interface Payment {
  id: string;
  recipient: string;
  amount: string;
  note: string;
}

export default function BatchPaymentScreen() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([
    { id: '1', recipient: '', amount: '', note: '' },
  ]);

  const addPayment = () => {
    setPayments([
      ...payments,
      { id: Date.now().toString(), recipient: '', amount: '', note: '' },
    ]);
  };

  const removePayment = (id: string) => {
    if (payments.length > 1) {
      setPayments(payments.filter((p) => p.id !== id));
    }
  };

  const updatePayment = (id: string, field: keyof Payment, value: string) => {
    setPayments(
      payments.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const getTotalAmount = () => {
    return payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  };

  const handleProceed = () => {
    const validPayments = payments.filter((p) => p.recipient && p.amount);
    if (validPayments.length === 0) {
      Alert.alert('No Valid Payments', 'Add at least one payment with recipient and amount');
      return;
    }
    Alert.alert(
      'Coming Soon',
      `Batch payment of ${validPayments.length} transactions will be processed via TransactionService.executeBatchTransaction()`
    );
  };

  return (
    <LinearGradient
      colors={[Colors.backgroundGradient1, Colors.backgroundGradient2, Colors.backgroundGradient3]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Batch Payment</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Info Card */}
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="information" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>
              Send money to multiple recipients in one transaction. Save on gas fees!
            </Text>
          </View>

          {/* Payment Items */}
          {payments.map((payment, index) => (
            <View key={payment.id} style={styles.paymentCard}>
              <View style={styles.paymentHeader}>
                <Text style={styles.paymentTitle}>Payment {index + 1}</Text>
                {payments.length > 1 && (
                  <TouchableOpacity onPress={() => removePayment(payment.id)}>
                    <MaterialCommunityIcons name="close-circle" size={24} color="#FF6B6B" />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Recipient (Username or Address)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="@username or 0x..."
                  placeholderTextColor={Colors.textSecondary}
                  value={payment.recipient}
                  onChangeText={(value) => updatePayment(payment.id, 'recipient', value)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Amount (₦)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType="numeric"
                  value={payment.amount}
                  onChangeText={(value) => updatePayment(payment.id, 'amount', value)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Note (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Add a note"
                  placeholderTextColor={Colors.textSecondary}
                  value={payment.note}
                  onChangeText={(value) => updatePayment(payment.id, 'note', value)}
                />
              </View>
            </View>
          ))}

          {/* Add Payment Button */}
          <TouchableOpacity style={styles.addButton} onPress={addPayment}>
            <MaterialCommunityIcons name="plus-circle" size={24} color={Colors.primary} />
            <Text style={styles.addButtonText}>Add Another Payment</Text>
          </TouchableOpacity>

          {/* Summary */}
          {getTotalAmount() > 0 && (
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Recipients</Text>
                <Text style={styles.summaryValue}>{payments.filter(p => p.recipient && p.amount).length}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Amount</Text>
                <Text style={styles.summaryValue}>₦{getTotalAmount().toLocaleString()}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Est. Gas Fee</Text>
                <Text style={styles.summaryValue}>₦50</Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text style={styles.summaryTotalLabel}>Total Cost</Text>
                <Text style={styles.summaryTotalValue}>
                  ₦{(getTotalAmount() + 50).toLocaleString()}
                </Text>
              </View>
            </View>
          )}

          {/* Proceed Button */}
          <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
            <Text style={styles.proceedButtonText}>Review & Send</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  infoCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  paymentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  inputGroup: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    marginBottom: spacing.lg,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  proceedButton: {
    backgroundColor: Colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
