import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function VerifyPhrase() {
  const router = useRouter();
  const { mnemonic, pin } = useLocalSearchParams<{ mnemonic: string; pin: string }>();
  
  const words = useMemo(() => mnemonic?.split(' ') || [], [mnemonic]);
  
  // Random positions to verify (e.g., 3rd, 7th, and 11th word)
  const verifyPositions = useMemo(() => [2, 6, 10], []);
  
  const [selectedWords, setSelectedWords] = useState<{ [key: number]: string }>({});
  
  // Shuffle all words for selection
  const shuffledWords = useMemo(() => {
    return [...words].sort(() => Math.random() - 0.5);
  }, [words]);

  const handleWordSelect = (position: number, word: string) => {
    setSelectedWords(prev => ({
      ...prev,
      [position]: word
    }));
  };

  const handleVerify = () => {
    const isCorrect = verifyPositions.every(
      pos => selectedWords[pos] === words[pos]
    );

    if (isCorrect) {
      router.push({
        pathname: '/auth/setup-biometric',
        params: { mnemonic, pin }
      });
    } else {
      Alert.alert(
        'Incorrect Words',
        'The words you selected don\'t match. Please try again.',
        [{ text: 'OK' }]
      );
      setSelectedWords({});
    }
  };

  const isComplete = verifyPositions.every(pos => selectedWords[pos]);

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Verify Your Phrase</Text>
          <Text style={styles.subtitle}>
            Select the correct words to verify you've saved your recovery phrase.
          </Text>
        </View>

        {/* Verification Slots */}
        <View style={styles.slotsContainer}>
          {verifyPositions.map(position => (
            <View key={position} style={styles.slotItem}>
              <Text style={styles.slotLabel}>Word #{position + 1}</Text>
              <TouchableOpacity 
                style={[
                  styles.slotBox,
                  selectedWords[position] && styles.slotBoxFilled
                ]}
              >
                <Text style={styles.slotText}>
                  {selectedWords[position] || 'Select word'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Word Selection */}
        <Text style={styles.selectLabel}>Select from these words:</Text>
        <View style={styles.wordsContainer}>
          {shuffledWords.map((word, index) => {
            const isSelected = Object.values(selectedWords).includes(word);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.wordButton,
                  isSelected && styles.wordButtonDisabled
                ]}
                onPress={() => {
                  if (!isSelected) {
                    const nextEmptySlot = verifyPositions.find(
                      pos => !selectedWords[pos]
                    );
                    if (nextEmptySlot !== undefined) {
                      handleWordSelect(nextEmptySlot, word);
                    }
                  }
                }}
                disabled={isSelected}
              >
                <Text style={[
                  styles.wordButtonText,
                  isSelected && styles.wordButtonTextDisabled
                ]}>
                  {word}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => setSelectedWords({})}
          >
            <Text style={styles.clearButtonText}>Clear Selection</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.verifyButton,
              !isComplete && styles.verifyButtonDisabled
            ]}
            onPress={handleVerify}
            disabled={!isComplete}
          >
            <Text style={styles.verifyButtonText}>Verify & Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
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
  slotsContainer: {
    marginBottom: 32,
  },
  slotItem: {
    marginBottom: 16,
  },
  slotLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  slotBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  slotBoxFilled: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: '#4CAF50',
  },
  slotText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  selectLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 16,
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 32,
  },
  wordButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  wordButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  wordButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  wordButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  actionsContainer: {
    gap: 12,
  },
  clearButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  verifyButtonDisabled: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
