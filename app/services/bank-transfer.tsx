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

const BANKS = [
  'Access Bank', 'GTBank', 'Zenith Bank', 'First Bank', 'UBA', 'Ecobank',
  'Fidelity Bank', 'Union Bank', 'Sterling Bank', 'Stanbic IBTC', 'Wema Bank',
];

export default function BankTransferScreen() {
  const router = useRouter();
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');

  const handleVerifyAccount = () => {
    if (!accountNumber || accountNumber.length !== 10) {
      Alert.alert('Invalid Account', 'Please enter a valid 10-digit account number');
      return;
    }
    // Simulate account verification
    setAccountName('John Doe');
    Alert.alert('Account Verified', 'John Doe');
  };

  const handleProceed = () => {
    if (!bankName || !accountNumber || !amount) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    Alert.alert(
      'Coming Soon',
      'Bank transfer will be processed via TransactionService.transferToBank()'
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
          <Text style={styles.headerTitle}>Bank Transfer</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.label}>Select Bank</Text>
            <TouchableOpacity style={styles.input} onPress={() => Alert.alert('Bank Selector', 'Coming soon')}>
              <Text style={bankName ? styles.inputText : styles.placeholder}>
                {bankName || 'Select bank'}
              </Text>
              <MaterialCommunityIcons name="chevron-down" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Account Number</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="0000000000"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="numeric"
                maxLength={10}
                value={accountNumber}
                onChangeText={setAccountNumber}
              />
              <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyAccount}>
                <Text style={styles.verifyButtonText}>Verify</Text>
              </TouchableOpacity>
            </View>
            {accountName && (
              <Text style={styles.accountName}>✓ {accountName}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Amount (₦)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Narration (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add a description"
              placeholderTextColor={Colors.textSecondary}
              multiline
              numberOfLines={3}
              value={narration}
              onChangeText={setNarration}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, (!bankName || !accountNumber || !amount) && styles.buttonDisabled]}
            onPress={handleProceed}
            disabled={!bankName || !accountNumber || !amount}
          >
            <Text style={styles.buttonText}>Continue</Text>
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
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    color: '#fff',
  },
  placeholder: {
    color: Colors.textSecondary,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  verifyButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  accountName: {
    fontSize: 14,
    color: Colors.success,
    marginTop: spacing.sm,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
