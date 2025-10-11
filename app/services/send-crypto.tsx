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
import { useWalletStore } from '@/store/walletStore';

export default function SendCryptoScreen() {
  const router = useRouter();
  const { wallet } = useWalletStore();
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleScanQR = () => {
    Alert.alert('QR Scanner', 'QR code scanner will be implemented');
  };

  const handleProceed = () => {
    if (!recipient || !amount) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    Alert.alert(
      'Coming Soon',
      'Send crypto will be processed via TransactionService.sendCrypto()'
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
          <Text style={styles.headerTitle}>Send Crypto</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Token Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Select Token</Text>
            <View style={styles.tokenGrid}>
              {['USDC', 'USDT', 'DAI'].map((token) => (
                <TouchableOpacity
                  key={token}
                  style={[
                    styles.tokenChip,
                    selectedToken === token && styles.tokenChipActive,
                  ]}
                  onPress={() => setSelectedToken(token)}
                >
                  <Text
                    style={[
                      styles.tokenText,
                      selectedToken === token && styles.tokenTextActive,
                    ]}
                  >
                    {token}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recipient Address */}
          <View style={styles.section}>
            <Text style={styles.label}>Recipient Address</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="0x..."
                placeholderTextColor={Colors.textSecondary}
                value={recipient}
                onChangeText={setRecipient}
              />
              <TouchableOpacity style={styles.scanButton} onPress={handleScanQR}>
                <MaterialCommunityIcons name="qrcode-scan" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Amount */}
          <View style={styles.section}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <Text style={styles.hint}>
              Available: {wallet?.balance || 0} {selectedToken}
            </Text>
          </View>

          {/* Network Info */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Network</Text>
              <Text style={styles.infoValue}>Base</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Est. Gas Fee</Text>
              <Text style={styles.infoValue}>$0.01</Text>
            </View>
          </View>

          {/* Warning */}
          <View style={styles.warningCard}>
            <MaterialCommunityIcons name="alert-circle" size={20} color="#FFA500" />
            <Text style={styles.warningText}>
              Double-check the recipient address. Transactions cannot be reversed.
            </Text>
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
  tokenGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tokenChip: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  tokenChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tokenText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  tokenTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
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
  scanButton: {
    backgroundColor: Colors.primary,
    width: 50,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: spacing.xs,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  warningCard: {
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 0, 0.3)',
    alignItems: 'center',
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
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
