/**
 * CPPay Hybrid Wallet - Practical Usage Examples
 * 
 * This file demonstrates how to use the wallet services
 * in your React Native components
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useWalletStore } from '@/store/walletStore';
import WalletService from '@/services/WalletService';
import PriceService from '@/services/PriceService';
import SecureWalletStorage from '@/services/SecureWalletStorage';

// ============================================================================
// EXAMPLE 1: Create New Wallet Flow
// ============================================================================

export function CreateWalletExample() {
  const { createWallet } = useWalletStore();
  const [mnemonic, setMnemonic] = useState('');
  const [step, setStep] = useState<'generate' | 'verify' | 'password'>('generate');

  const handleGenerateMnemonic = () => {
    const newMnemonic = WalletService.generateMnemonic();
    setMnemonic(newMnemonic);
    setStep('verify');
    console.log('Generated mnemonic:', newMnemonic);
  };

  const handleCreateWallet = async (password: string) => {
    try {
      await createWallet(mnemonic, password);
      Alert.alert('Success', 'Wallet created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create wallet');
      console.error(error);
    }
  };

  return (
    <View>
      {step === 'generate' && (
        <Button title="Generate New Wallet" onPress={handleGenerateMnemonic} />
      )}
      
      {step === 'verify' && (
        <View>
          <Text>Your Secret Recovery Phrase:</Text>
          <Text>{mnemonic}</Text>
          <Button 
            title="I've Written It Down" 
            onPress={() => setStep('password')} 
          />
        </View>
      )}
      
      {step === 'password' && (
        <View>
          <Text>Create a password for your wallet</Text>
          <Button 
            title="Complete Setup" 
            onPress={() => handleCreateWallet('your-password')} 
          />
        </View>
      )}
    </View>
  );
}

// ============================================================================
// EXAMPLE 2: Import Existing Wallet
// ============================================================================

export function ImportWalletExample() {
  const { importWallet } = useWalletStore();

  const handleImportFromMnemonic = async () => {
    const mnemonic = 'abandon ability able about above absent absorb abstract absurd abuse access accident';
    const password = 'secure-password-123';

    try {
      // Validate mnemonic first
      if (!WalletService.validateMnemonic(mnemonic)) {
        Alert.alert('Error', 'Invalid recovery phrase');
        return;
      }

      await importWallet(mnemonic, password, false);
      Alert.alert('Success', 'Wallet imported successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to import wallet');
      console.error(error);
    }
  };

  const handleImportFromPrivateKey = async () => {
    const privateKey = '0x1234567890abcdef...'; // User's private key
    const password = 'secure-password-123';

    try {
      await importWallet(privateKey, password, true);
      Alert.alert('Success', 'Wallet imported from private key!');
    } catch (error) {
      Alert.alert('Error', 'Invalid private key');
      console.error(error);
    }
  };

  return (
    <View>
      <Button 
        title="Import from Recovery Phrase" 
        onPress={handleImportFromMnemonic} 
      />
      <Button 
        title="Import from Private Key" 
        onPress={handleImportFromPrivateKey} 
      />
    </View>
  );
}

// ============================================================================
// EXAMPLE 3: Display Wallet Balances
// ============================================================================

export function WalletBalanceExample() {
  const { balances, fetchBalances, wallet } = useWalletStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Fetch balances on mount
    if (wallet.address && !wallet.isLocked) {
      fetchBalances();
    }
  }, [wallet.address, wallet.isLocked]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBalances();
    setRefreshing(false);
  };

  return (
    <View>
      <Text>Total Balance</Text>
      <Text style={{ fontSize: 32, fontWeight: 'bold' }}>
        ₦ {balances.totalNGN.toLocaleString()}
      </Text>
      <Text style={{ color: '#666' }}>
        ${balances.totalUSD.toFixed(2)}
      </Text>

      <Text style={{ marginTop: 20 }}>Your Tokens:</Text>
      {balances.tokens.map((token) => (
        <View key={token.symbol} style={{ padding: 10 }}>
          <Text>{token.symbol}: {token.balance}</Text>
          <Text>≈ ₦{(parseFloat(token.balance) * token.priceNgn).toLocaleString()}</Text>
        </View>
      ))}

      <Button 
        title={refreshing ? 'Refreshing...' : 'Refresh Balances'} 
        onPress={handleRefresh}
        disabled={refreshing}
      />
    </View>
  );
}

// ============================================================================
// EXAMPLE 4: Real-Time Price Display
// ============================================================================

export function LivePriceExample() {
  const [prices, setPrices] = useState<any>({});

  useEffect(() => {
    // Start real-time price updates
    const cleanup = PriceService.startPriceUpdates(
      ['ETH', 'BTC', 'BNB', 'USDT'],
      (updatedPrices) => {
        setPrices(updatedPrices);
        console.log('Prices updated:', updatedPrices);
      }
    );

    // Cleanup on unmount
    return cleanup;
  }, []);

  return (
    <View>
      <Text>Live Cryptocurrency Prices</Text>
      {Object.entries(prices).map(([symbol, data]: [string, any]) => (
        <View key={symbol} style={{ padding: 10 }}>
          <Text>{symbol}</Text>
          <Text>₦{data.ngn.toLocaleString()}</Text>
          <Text style={{ color: data.change24h > 0 ? 'green' : 'red' }}>
            {data.change24h > 0 ? '▲' : '▼'} {Math.abs(data.change24h).toFixed(2)}%
          </Text>
        </View>
      ))}
    </View>
  );
}

// ============================================================================
// EXAMPLE 5: Calculate Crypto for NGN Amount
// ============================================================================

export function CryptoCalculatorExample() {
  const [ngnAmount, setNgnAmount] = useState(5000);
  const [cryptoNeeded, setCryptoNeeded] = useState<any>({});

  const calculateAmounts = async () => {
    try {
      const ethNeeded = await PriceService.calculateCryptoNeeded(ngnAmount, 'ETH');
      const btcNeeded = await PriceService.calculateCryptoNeeded(ngnAmount, 'BTC');
      const bnbNeeded = await PriceService.calculateCryptoNeeded(ngnAmount, 'BNB');
      const usdtNeeded = await PriceService.calculateCryptoNeeded(ngnAmount, 'USDT');

      setCryptoNeeded({
        ETH: ethNeeded,
        BTC: btcNeeded,
        BNB: bnbNeeded,
        USDT: usdtNeeded,
      });
    } catch (error) {
      console.error('Failed to calculate:', error);
    }
  };

  useEffect(() => {
    calculateAmounts();
  }, [ngnAmount]);

  return (
    <View>
      <Text>To spend ₦{ngnAmount.toLocaleString()}, you need:</Text>
      {Object.entries(cryptoNeeded).map(([symbol, amount]: [string, any]) => (
        <Text key={symbol}>
          {amount.toFixed(6)} {symbol}
        </Text>
      ))}
      <Button 
        title="Recalculate" 
        onPress={calculateAmounts} 
      />
    </View>
  );
}

// ============================================================================
// EXAMPLE 6: Send Transaction
// ============================================================================

export function SendTransactionExample() {
  const { wallet, addTransaction } = useWalletStore();
  const [sending, setSending] = useState(false);

  const handleSendETH = async () => {
    if (!wallet.address || wallet.isLocked) {
      Alert.alert('Error', 'Wallet is locked');
      return;
    }

    setSending(true);

    try {
      // Get active network
      const network = wallet.networks.find(n => n.chainId === wallet.activeNetwork);
      if (!network) throw new Error('Network not found');

      // Get wallet instance (you'll need to pass password in real implementation)
      const password = 'user-password'; // Get from secure input
      const walletInstance = await WalletService.getWallet(password, network);
      if (!walletInstance) throw new Error('Failed to get wallet');

      // Get gas prices
      const gasPrices = await WalletService.getGasPrices(network);

      // Send transaction
      const toAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f89c5e';
      const amount = '0.001'; // ETH

      const txHash = await WalletService.sendNativeToken(
        walletInstance,
        toAddress,
        amount,
        gasPrices.normal
      );

      // Add to transaction history
      addTransaction({
        id: txHash,
        type: 'send',
        status: 'completed',
        timestamp: Date.now(),
        cryptoAmount: parseFloat(amount),
        cryptoSymbol: 'ETH',
        to: toAddress,
        hash: txHash,
      });

      Alert.alert('Success', `Transaction sent! Hash: ${txHash}`);
    } catch (error) {
      Alert.alert('Error', 'Transaction failed');
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <View>
      <Button 
        title={sending ? 'Sending...' : 'Send 0.001 ETH'} 
        onPress={handleSendETH}
        disabled={sending}
      />
    </View>
  );
}

// ============================================================================
// EXAMPLE 7: Unlock/Lock Wallet
// ============================================================================

export function WalletLockExample() {
  const { unlockWallet, lockWallet, wallet, auth } = useWalletStore();
  const [password, setPassword] = useState('');

  const handleUnlock = async () => {
    const success = await unlockWallet(password);
    if (success) {
      Alert.alert('Success', 'Wallet unlocked!');
    } else {
      Alert.alert('Error', 'Invalid password');
    }
  };

  const handleLock = () => {
    lockWallet();
    Alert.alert('Info', 'Wallet locked');
  };

  return (
    <View>
      {wallet.isLocked ? (
        <View>
          <Text>Wallet is locked</Text>
          <Button title="Unlock Wallet" onPress={handleUnlock} />
        </View>
      ) : (
        <View>
          <Text>Wallet is unlocked</Text>
          <Text>Address: {WalletService.formatAddress(wallet.address || '')}</Text>
          <Button title="Lock Wallet" onPress={handleLock} />
        </View>
      )}
    </View>
  );
}

// ============================================================================
// EXAMPLE 8: Multi-Network Support
// ============================================================================

export function NetworkSwitcherExample() {
  const { wallet, setActiveNetwork, fetchBalances } = useWalletStore();

  const handleSwitchNetwork = async (chainId: number) => {
    setActiveNetwork(chainId);
    await fetchBalances(); // Refresh balances for new network
    Alert.alert('Success', `Switched to chain ${chainId}`);
  };

  return (
    <View>
      <Text>Active Network: {wallet.activeNetwork}</Text>
      {wallet.networks
        .filter(n => n.enabled)
        .map((network) => (
          <Button
            key={network.chainId}
            title={network.name}
            onPress={() => handleSwitchNetwork(network.chainId)}
            disabled={network.chainId === wallet.activeNetwork}
          />
        ))}
    </View>
  );
}

// ============================================================================
// EXAMPLE 9: Biometric Authentication
// ============================================================================

import * as LocalAuthentication from 'expo-local-authentication';

export function BiometricExample() {
  const { setBiometric, auth } = useWalletStore();

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    
    if (!compatible) {
      Alert.alert('Not Supported', 'Biometric authentication is not available');
      return false;
    }
    
    if (!enrolled) {
      Alert.alert('Not Enrolled', 'No biometric credentials enrolled');
      return false;
    }
    
    return true;
  };

  const enableBiometric = async () => {
    const supported = await checkBiometricSupport();
    if (!supported) return;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Enable biometric authentication',
      fallbackLabel: 'Use password',
    });

    if (result.success) {
      await setBiometric(true);
      Alert.alert('Success', 'Biometric authentication enabled');
    }
  };

  const authenticateWithBiometric = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to unlock wallet',
    });

    if (result.success) {
      // Unlock wallet
      console.log('Biometric authentication successful');
    }
  };

  return (
    <View>
      <Text>Biometric: {auth.biometricEnabled ? 'Enabled' : 'Disabled'}</Text>
      <Button 
        title="Enable Biometric" 
        onPress={enableBiometric}
        disabled={auth.biometricEnabled}
      />
      {auth.biometricEnabled && (
        <Button 
          title="Authenticate" 
          onPress={authenticateWithBiometric}
        />
      )}
    </View>
  );
}

// ============================================================================
// EXAMPLE 10: Complete Airtime Purchase Flow (Simplified)
// ============================================================================

export function AirtimePurchaseExample() {
  const { wallet, balances } = useWalletStore();
  const [amount, setAmount] = useState(500); // NGN
  const [network, setNetwork] = useState<'MTN' | 'GLO' | 'AIRTEL' | '9MOBILE'>('MTN');
  const [selectedToken, setSelectedToken] = useState('USDT');
  const [processing, setProcessing] = useState(false);

  const calculateCryptoNeeded = async () => {
    try {
      const needed = await PriceService.calculateCryptoNeeded(amount, selectedToken, true);
      return needed;
    } catch (error) {
      console.error('Failed to calculate:', error);
      return 0;
    }
  };

  const handlePurchase = async () => {
    setProcessing(true);

    try {
      // Step 1: Calculate crypto needed
      const cryptoNeeded = await calculateCryptoNeeded();
      
      console.log(`Need ${cryptoNeeded} ${selectedToken} for ₦${amount} airtime`);

      // Step 2: Check if user has enough balance
      const tokenBalance = balances.tokens.find(t => t.symbol === selectedToken);
      if (!tokenBalance || parseFloat(tokenBalance.balance) < cryptoNeeded) {
        Alert.alert('Insufficient Balance', 'Not enough crypto');
        return;
      }

      // Step 3: (Future) Swap crypto to stablecoin if needed
      // await SwapService.executeSwap(...)

      // Step 4: (Future) Convert to NGN and purchase airtime
      // await FiatPaymentService.buyAirtime(phone, network, amount)

      Alert.alert(
        'Success', 
        `Purchased ₦${amount} ${network} airtime using ${cryptoNeeded.toFixed(4)} ${selectedToken}`
      );
    } catch (error) {
      Alert.alert('Error', 'Transaction failed');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View>
      <Text>Buy Airtime</Text>
      <Text>Amount: ₦{amount}</Text>
      <Text>Network: {network}</Text>
      <Text>Pay with: {selectedToken}</Text>
      
      <Button 
        title={processing ? 'Processing...' : 'Buy Airtime'} 
        onPress={handlePurchase}
        disabled={processing}
      />
    </View>
  );
}

// ============================================================================
// INTEGRATION NOTES
// ============================================================================

/**
 * To use these examples in your app:
 * 
 * 1. Import the desired component:
 *    import { WalletBalanceExample } from './examples/WalletUsageExamples';
 * 
 * 2. Use in your screen:
 *    <WalletBalanceExample />
 * 
 * 3. Customize the UI to match your design system
 * 
 * 4. Add proper error handling and loading states
 * 
 * 5. Implement proper password input with secure text entry
 * 
 * 6. Add navigation between screens
 */

export default {
  CreateWalletExample,
  ImportWalletExample,
  WalletBalanceExample,
  LivePriceExample,
  CryptoCalculatorExample,
  SendTransactionExample,
  WalletLockExample,
  NetworkSwitcherExample,
  BiometricExample,
  AirtimePurchaseExample,
};
