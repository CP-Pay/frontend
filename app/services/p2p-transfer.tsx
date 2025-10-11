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

export default function P2PTransferScreen() {
  const router = useRouter();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleProceed = () => {
    if (!recipient || !amount) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    Alert.alert(
      'Coming Soon',
      'P2P transfer will be processed via TransactionService.transferToCPPayUser()'
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
          <Text style={styles.headerTitle}>Send to CPPay User</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.label}>Recipient (Username or Phone)</Text>
            <TextInput
              style={styles.input}
              placeholder="@username or phone number"
              placeholderTextColor={Colors.textSecondary}
              value={recipient}
              onChangeText={setRecipient}
            />
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
            <Text style={styles.label}>Note (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add a note"
              placeholderTextColor={Colors.textSecondary}
              multiline
              numberOfLines={3}
              value={note}
              onChangeText={setNote}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, (!recipient || !amount) && styles.buttonDisabled]}
            onPress={handleProceed}
            disabled={!recipient || !amount}
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
