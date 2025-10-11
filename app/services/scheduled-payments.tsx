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

const FREQUENCIES = ['daily', 'weekly', 'monthly'];
const CATEGORIES = ['Rent', 'Utilities', 'Subscriptions', 'Savings', 'Other'];

export default function ScheduledPaymentsScreen() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const mockScheduled = [
    {
      id: '1',
      recipient: 'Landlord',
      amount: 150000,
      frequency: 'monthly',
      nextPayment: '2024-02-01',
      category: 'Rent',
    },
    {
      id: '2',
      recipient: 'Netflix',
      amount: 5000,
      frequency: 'monthly',
      nextPayment: '2024-01-15',
      category: 'Subscriptions',
    },
  ];

  const handleCreate = () => {
    if (!recipient || !amount || !startDate) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    Alert.alert(
      'Coming Soon',
      'Scheduled payment will be created via TransactionService.scheduleRecurringPayment()'
    );
    setShowForm(false);
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
          <Text style={styles.headerTitle}>Scheduled Payments</Text>
          <TouchableOpacity onPress={() => setShowForm(!showForm)} style={styles.addButton}>
            <MaterialCommunityIcons name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {showForm ? (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>New Scheduled Payment</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Recipient</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Name or address"
                  placeholderTextColor={Colors.textSecondary}
                  value={recipient}
                  onChangeText={setRecipient}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Amount (₦)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Frequency</Text>
                <View style={styles.frequencyRow}>
                  {FREQUENCIES.map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      style={[
                        styles.frequencyChip,
                        frequency === freq && styles.frequencyChipActive,
                      ]}
                      onPress={() => setFrequency(freq)}
                    >
                      <Text
                        style={[
                          styles.frequencyText,
                          frequency === freq && styles.frequencyTextActive,
                        ]}
                      >
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Category</Text>
                <TouchableOpacity style={styles.input}>
                  <Text style={category ? styles.text : styles.placeholder}>
                    {category || 'Select category'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Start Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Colors.textSecondary}
                  value={startDate}
                  onChangeText={setStartDate}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>End Date (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD or leave empty for no end"
                  placeholderTextColor={Colors.textSecondary}
                  value={endDate}
                  onChangeText={setEndDate}
                />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setShowForm(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.createButton]} onPress={handleCreate}>
                  <Text style={styles.createButtonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              {/* Info Card */}
              <View style={styles.infoCard}>
                <MaterialCommunityIcons name="calendar-clock" size={24} color={Colors.primary} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoTitle}>Automate Your Payments</Text>
                  <Text style={styles.infoText}>
                    Set up recurring payments for rent, bills, subscriptions, and more
                  </Text>
                </View>
              </View>

              {/* Scheduled Payments List */}
              <Text style={styles.sectionTitle}>Active Schedules ({mockScheduled.length})</Text>

              {mockScheduled.map((payment) => (
                <View key={payment.id} style={styles.paymentCard}>
                  <View style={styles.paymentHeader}>
                    <View style={styles.paymentInfo}>
                      <Text style={styles.paymentRecipient}>{payment.recipient}</Text>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{payment.category}</Text>
                      </View>
                    </View>
                    <TouchableOpacity>
                      <MaterialCommunityIcons name="dots-vertical" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.paymentDetails}>
                    <View style={styles.detailRow}>
                      <MaterialCommunityIcons name="cash" size={16} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>₦{payment.amount.toLocaleString()}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MaterialCommunityIcons name="repeat" size={16} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>
                        {payment.frequency.charAt(0).toUpperCase() + payment.frequency.slice(1)}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MaterialCommunityIcons
                        name="calendar-outline"
                        size={16}
                        color={Colors.textSecondary}
                      />
                      <Text style={styles.detailText}>Next: {payment.nextPayment}</Text>
                    </View>
                  </View>

                  <View style={styles.paymentActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Text style={styles.actionButtonText}>Pause</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.actionButtonPrimary]}>
                      <Text style={styles.actionButtonTextPrimary}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          )}
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  infoCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: spacing.md,
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
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentRecipient: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: spacing.xs,
  },
  categoryBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    color: Colors.primary,
  },
  paymentDetails: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  paymentActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: Colors.primary,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#fff',
  },
  actionButtonTextPrimary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.md,
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
  text: { color: '#fff' },
  placeholder: { color: Colors.textSecondary },
  frequencyRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  frequencyChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  frequencyChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  frequencyText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  frequencyTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  createButton: {
    backgroundColor: Colors.primary,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
