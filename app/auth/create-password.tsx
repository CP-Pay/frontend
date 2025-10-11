import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useWalletStore } from '@/store/walletStore';
import * as LocalAuthentication from 'expo-local-authentication';

export default function CreatePassword() {
  const router = useRouter();
  const { mnemonic } = useLocalSearchParams<{ mnemonic: string }>();
  const { createWallet } = useWalletStore();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [useBiometric, setUseBiometric] = useState(false);
  const [loading, setLoading] = useState(false);

  const [biometricAvailable, setBiometricAvailable] = useState(false);

  React.useEffect(() => {
    checkBiometric();
  }, []);

  const checkBiometric = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometricAvailable(compatible && enrolled);
  };

  const validatePassword = () => {
    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters long.');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleCreateWallet = async () => {
    if (!validatePassword()) return;

    setLoading(true);
    try {
      await createWallet(mnemonic, password);
      
      Alert.alert(
        'Success! 🎉',
        'Your wallet has been created successfully!',
        [
          {
            text: 'Get Started',
            onPress: () => router.replace('/(tabs)')
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          <Text style={styles.title}>Create Password</Text>
          <Text style={styles.subtitle}>
            This password will be used to unlock your wallet and authorize transactions.
          </Text>
        </View>

        {/* Password Inputs */}
        <View style={styles.inputsContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
            />
          </View>

          {/* Password Requirements */}
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Password must contain:</Text>
            <PasswordRequirement 
              met={password.length >= 8} 
              text="At least 8 characters"
            />
            <PasswordRequirement 
              met={password === confirmPassword && password.length > 0} 
              text="Passwords match"
            />
          </View>

          {/* Biometric Option */}
          {biometricAvailable && (
            <TouchableOpacity 
              style={styles.biometricOption}
              onPress={() => setUseBiometric(!useBiometric)}
            >
              <View style={styles.checkbox}>
                {useBiometric && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.biometricText}>
                Enable biometric unlock (Face ID / Fingerprint)
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Create Button */}
        <TouchableOpacity 
          style={[
            styles.createButton,
            loading && styles.createButtonDisabled
          ]}
          onPress={handleCreateWallet}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>Create Wallet</Text>
          )}
        </TouchableOpacity>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Text style={styles.securityIcon}>🔒</Text>
          <Text style={styles.securityText}>
            Your password is encrypted and stored locally. We cannot recover it if you forget it.
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
  <View style={styles.requirementItem}>
    <Text style={[styles.requirementIcon, met && styles.requirementIconMet]}>
      {met ? '✓' : '○'}
    </Text>
    <Text style={[styles.requirementText, met && styles.requirementTextMet]}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
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
  inputsContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  eyeIcon: {
    fontSize: 20,
  },
  requirementsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  requirementsTitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementIcon: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.4)',
    marginRight: 8,
    width: 20,
  },
  requirementIconMet: {
    color: '#4CAF50',
  },
  requirementText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  requirementTextMet: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  biometricOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 2,
    backgroundColor: '#4CAF50',
  },
  biometricText: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  createButtonDisabled: {
    backgroundColor: 'rgba(76, 175, 80, 0.5)',
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
  },
  securityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  securityText: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 18,
  },
});
