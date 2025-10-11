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

const TOKENS = [
  { symbol: 'USDC', name: 'USD Coin', balance: '1,250.00' },
  { symbol: 'USDT', name: 'Tether', balance: '500.00' },
  { symbol: 'DAI', name: 'Dai Stablecoin', balance: '0.00' },
];

export default function SwapScreen() {
  const router = useRouter();
  const [fromToken, setFromToken] = useState('USDC');
  const [toToken, setToToken] = useState('USDT');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleProceed = () => {
    if (!fromAmount || Number(fromAmount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    Alert.alert(
      'Coming Soon',
      'Token swap will be processed via TransactionService.swapTokens()'
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
          <Text style={styles.headerTitle}>Swap Tokens</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* From Token */}
          <View style={styles.section}>
            <Text style={styles.label}>From</Text>
            <View style={styles.swapCard}>
              <TouchableOpacity style={styles.tokenSelector}>
                <Text style={styles.tokenSymbol}>{fromToken}</Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color="#fff" />
              </TouchableOpacity>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="numeric"
                value={fromAmount}
                onChangeText={(value) => {
                  setFromAmount(value);
                  // Simulate exchange rate calculation
                  setToAmount((Number(value) * 1.001).toFixed(2));
                }}
              />
            </View>
            <Text style={styles.balance}>
              Balance: {TOKENS.find(t => t.symbol === fromToken)?.balance || '0.00'}
            </Text>
          </View>

          {/* Swap Button */}
          <View style={styles.swapButtonContainer}>
            <TouchableOpacity style={styles.swapIconButton} onPress={handleSwapTokens}>
              <MaterialCommunityIcons name="swap-vertical" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* To Token */}
          <View style={styles.section}>
            <Text style={styles.label}>To</Text>
            <View style={styles.swapCard}>
              <TouchableOpacity style={styles.tokenSelector}>
                <Text style={styles.tokenSymbol}>{toToken}</Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color="#fff" />
              </TouchableOpacity>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="numeric"
                value={toAmount}
                editable={false}
              />
            </View>
            <Text style={styles.balance}>
              Balance: {TOKENS.find(t => t.symbol === toToken)?.balance || '0.00'}
            </Text>
          </View>

          {/* Exchange Rate Info */}
          {fromAmount && toAmount && (
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Exchange Rate</Text>
                <Text style={styles.infoValue}>1 {fromToken} = 1.001 {toToken}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Price Impact</Text>
                <Text style={[styles.infoValue, { color: Colors.success }]}>{'<'}0.1%</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Est. Gas Fee</Text>
                <Text style={styles.infoValue}>$0.05</Text>
              </View>
              <View style={[styles.infoRow, styles.infoTotal]}>
                <Text style={styles.infoTotalLabel}>You'll Receive</Text>
                <Text style={styles.infoTotalValue}>{toAmount} {toToken}</Text>
              </View>
            </View>
          )}

          {/* Warning */}
          <View style={styles.warningCard}>
            <MaterialCommunityIcons name="information" size={20} color={Colors.primary} />
            <Text style={styles.warningText}>
              Swaps are executed via Uniswap V3 on Base network
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, (!fromAmount || Number(fromAmount) <= 0) && styles.buttonDisabled]}
            onPress={handleProceed}
            disabled={!fromAmount || Number(fromAmount) <= 0}
          >
            <Text style={styles.buttonText}>Swap Tokens</Text>
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
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: spacing.sm,
  },
  swapCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tokenSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  tokenSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  amountInput: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    padding: 0,
  },
  balance: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: spacing.xs,
  },
  swapButtonContainer: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  swapIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
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
  infoTotal: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
  },
  infoTotalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  infoTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  warningCard: {
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
