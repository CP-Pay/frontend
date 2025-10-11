import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import WalletService from '@/services/WalletService';

export default function CreateWallet() {
  const router = useRouter();
  const { pin } = useLocalSearchParams<{ pin: string }>();
  const [mnemonic, setMnemonic] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateWallet = () => {
    setLoading(true);
    try {
      const newMnemonic = WalletService.generateMnemonic();
      setMnemonic(newMnemonic);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    generateWallet();
  }, []);

  const handleContinue = () => {
    router.push({
      pathname: '/auth/verify-phrase',
      params: { mnemonic, pin }
    });
  };

  const words = mnemonic.split(' ');

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
          <Text style={styles.title}>Your Secret Recovery Phrase</Text>
          <Text style={styles.subtitle}>
            Write down these 12 words in order and keep them safe. You'll need them to recover your wallet.
          </Text>
        </View>

        {/* Warning */}
        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <View style={styles.warningTextContainer}>
            <Text style={styles.warningTitle}>Never share your recovery phrase!</Text>
            <Text style={styles.warningText}>
              Anyone with this phrase can access your funds. CPPay will never ask for it.
            </Text>
          </View>
        </View>

        {/* Seed Phrase Grid */}
        <View style={styles.phraseContainer}>
          {words.map((word, index) => (
            <View key={index} style={styles.wordItem}>
              <Text style={styles.wordNumber}>{index + 1}</Text>
              <Text style={styles.wordText}>{word}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.regenerateButton}
            onPress={generateWallet}
            disabled={loading}
          >
            <Text style={styles.regenerateButtonText}>🔄 Generate New Phrase</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>I've Written It Down</Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Security Tips:</Text>
          <Text style={styles.tipText}>• Write it on paper, don't screenshot</Text>
          <Text style={styles.tipText}>• Store in multiple safe locations</Text>
          <Text style={styles.tipText}>• Never enter it on suspicious websites</Text>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4CAF50',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 24,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9800',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  phraseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  wordItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  wordNumber: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginRight: 12,
    width: 20,
  },
  wordText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    flex: 1,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  regenerateButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  regenerateButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  tipsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
});
