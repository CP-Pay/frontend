import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Welcome() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo/Icon Area */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>₿</Text>
          </View>
          <Text style={styles.appName}>CPPay</Text>
          <Text style={styles.tagline}>Hybrid Crypto-Fiat Wallet</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <FeatureItem 
            icon="🔐" 
            text="Secure Self-Custodial Wallet"
          />
          <FeatureItem 
            icon="💰" 
            text="Spend Crypto for Everyday Bills"
          />
          <FeatureItem 
            icon="⚡" 
            text="Instant Crypto-to-Fiat Conversion"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/auth/create-pin')}
          >
            <Text style={styles.primaryButtonText}>Create New Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/auth/import-wallet')}
          >
            <Text style={styles.secondaryButtonText}>Import Existing Wallet</Text>
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <Text style={styles.termsText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </LinearGradient>
  );
}

const FeatureItem = ({ icon, text }: { icon: string; text: string }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoText: {
    fontSize: 48,
    color: '#fff',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  buttonContainer: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 20,
  },
});
