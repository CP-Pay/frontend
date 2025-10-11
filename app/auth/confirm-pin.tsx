import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useWalletStore } from '@/store/walletStore';

export default function ConfirmPinScreen() {
  const router = useRouter();
  const { pin: originalPin, mnemonic, privateKey, isImport } = useLocalSearchParams<{ 
    pin: string;
    mnemonic?: string;
    privateKey?: string;
    isImport?: string;
  }>();
  const { importWallet } = useWalletStore();
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState(false);
  const PIN_LENGTH = 6;

  useEffect(() => {
    if (confirmPin.length === PIN_LENGTH) {
      if (confirmPin === originalPin) {
        // PIN matches
        setTimeout(async () => {
          if (isImport === 'true') {
            // Handle wallet import
            try {
              const isPrivateKey = !!privateKey;
              const walletData = privateKey || mnemonic || '';
              
              await importWallet(walletData, originalPin, isPrivateKey, true);
              
              Alert.alert(
                'Success! 🎉',
                'Your wallet has been imported successfully!',
                [
                  {
                    text: 'Get Started',
                    onPress: () => router.replace('/(tabs)' as any)
                  }
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to import wallet. Please try again.');
              router.back();
            }
          } else {
            // Proceed to wallet creation
            router.push({
              pathname: '/auth/create-wallet' as any,
              params: { pin: originalPin }
            });
          }
        }, 300);
      } else {
        // PIN doesn't match
        setError(true);
        setTimeout(() => {
          setConfirmPin('');
          setError(false);
        }, 1000);
      }
    }
  }, [confirmPin]);

  const handleNumberPress = (num: string) => {
    if (confirmPin.length < PIN_LENGTH) {
      setConfirmPin(confirmPin + num);
    }
  };

  const handleBackspace = () => {
    setConfirmPin(confirmPin.slice(0, -1));
    setError(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <View style={[styles.iconCircle, error && styles.iconCircleError]}>
            <MaterialCommunityIcons 
              name={error ? "lock-alert-outline" : "lock-check-outline"} 
              size={40} 
              color={error ? Colors.error : Colors.primary} 
            />
          </View>
          <Text style={styles.title}>Confirm PIN</Text>
          <Text style={[styles.subtitle, error && styles.subtitleError]}>
            {error ? 'PIN does not match. Try again.' : 'Re-enter your 6-digit PIN'}
          </Text>
        </View>

        {/* PIN Display */}
        <View style={styles.pinContainer}>
          {Array.from({ length: PIN_LENGTH }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.pinDot,
                index < confirmPin.length && styles.pinDotFilled,
                error && index < confirmPin.length && styles.pinDotError
              ]}
            >
              {index < confirmPin.length && (
                <View style={[styles.pinDotInner, error && styles.pinDotInnerError]} />
              )}
            </View>
          ))}
        </View>

        {/* Number Pad */}
        <View style={styles.numberPad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <TouchableOpacity
              key={num}
              style={styles.numberButton}
              onPress={() => handleNumberPress(num.toString())}
              disabled={error}
            >
              <Text style={styles.numberText}>{num}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.numberButton} />
          <TouchableOpacity
            style={styles.numberButton}
            onPress={() => handleNumberPress('0')}
            disabled={error}
          >
            <Text style={styles.numberText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numberButton}
            onPress={handleBackspace}
            disabled={error}
          >
            <MaterialCommunityIcons name="backspace-outline" size={28} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${Colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircleError: {
    backgroundColor: `${Colors.error}20`,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  subtitleError: {
    color: Colors.error,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 60,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinDotFilled: {
    borderColor: Colors.primary,
  },
  pinDotError: {
    borderColor: Colors.error,
  },
  pinDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  pinDotInnerError: {
    backgroundColor: Colors.error,
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  numberButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 28,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
