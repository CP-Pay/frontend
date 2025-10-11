import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import WalletService from '@/services/WalletService';

export default function ImportWallet() {
  const router = useRouter();
  
  const [importType, setImportType] = useState<'mnemonic' | 'privateKey'>('mnemonic');
  const [mnemonic, setMnemonic] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [loading, setLoading] = useState(false);

  const validateMnemonic = () => {
    const words = mnemonic.trim().split(/\s+/);
    if (words.length !== 12 && words.length !== 24) {
      Alert.alert('Invalid Phrase', 'Recovery phrase must be 12 or 24 words.');
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    if (importType === 'mnemonic') {
      if (!validateMnemonic()) return;
      
      setLoading(true);
      try {
        // Validate the mnemonic first
        const wallet = WalletService.createWalletFromMnemonic(mnemonic.trim());
        if (!wallet) throw new Error('Invalid mnemonic phrase');
        
        // Navigate to PIN setup with mnemonic
        router.push({
          pathname: '/auth/create-pin',
          params: { mnemonic: mnemonic.trim(), isImport: 'true' }
        } as any);
      } catch (error) {
        Alert.alert('Invalid Phrase', 'The recovery phrase you entered is invalid.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!privateKey.trim()) {
        Alert.alert('Invalid Key', 'Please enter a valid private key.');
        return;
      }
      
      setLoading(true);
      try {
        // Validate private key
        const wallet = WalletService.importWalletFromPrivateKey(privateKey.trim());
        if (!wallet) throw new Error('Invalid private key');
        
        // Navigate to PIN setup with private key
        router.push({
          pathname: '/auth/create-pin',
          params: { privateKey: privateKey.trim(), isImport: 'true' }
        } as any);
      } catch (error) {
        Alert.alert('Invalid Key', 'The private key you entered is invalid.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Import Wallet</Text>
          <Text style={styles.subtitle}>
            Import your existing wallet using a recovery phrase or private key.
          </Text>
        </View>

        {/* Import Type Selector */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              importType === 'mnemonic' && styles.typeButtonActive
            ]}
            onPress={() => setImportType('mnemonic')}
          >
            <Text style={[
              styles.typeButtonText,
              importType === 'mnemonic' && styles.typeButtonTextActive
            ]}>
              Recovery Phrase
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.typeButton,
              importType === 'privateKey' && styles.typeButtonActive
            ]}
            onPress={() => setImportType('privateKey')}
          >
            <Text style={[
              styles.typeButtonText,
              importType === 'privateKey' && styles.typeButtonTextActive
            ]}>
              Private Key
            </Text>
          </TouchableOpacity>
        </View>

        {/* Import Input */}
        {importType === 'mnemonic' ? (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Recovery Phrase (12 or 24 words)</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter your recovery phrase separated by spaces"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              multiline
              numberOfLines={4}
              value={mnemonic}
              onChangeText={setMnemonic}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.helperText}>
              {mnemonic.trim().split(/\s+/).filter(w => w).length} words entered
            </Text>
          </View>
        ) : (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Private Key</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter your private key (with or without 0x prefix)"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              multiline
              numberOfLines={3}
              value={privateKey}
              onChangeText={setPrivateKey}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        )}

        {/* Continue Button */}
        <TouchableOpacity 
          style={[
            styles.continueButton,
            loading && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
        </TouchableOpacity>

        {/* Warning */}
        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            Never share your recovery phrase or private key with anyone. CPPay will never ask for it.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 24,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: '#4CAF50',
  },
  typeButtonText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: '#4CAF50',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    fontWeight: '600',
  },
  textArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  helperText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 8,
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 24,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  warningBox: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 152, 0, 0.3)',
  },
  warningIcon: {
    fontSize: 20,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
});
