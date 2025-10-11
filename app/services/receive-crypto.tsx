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
  Share,
  Clipboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { spacing, borderRadius } from '@/constants/Typography';
import { useWalletStore } from '@/store/walletStore';
import QRCode from 'react-native-qrcode-svg';

export default function ReceiveCryptoScreen() {
  const router = useRouter();
  const { wallet } = useWalletStore();
  const [selectedToken, setSelectedToken] = useState('USDC');

  const handleCopyAddress = () => {
    if (wallet?.address) {
      Clipboard.setString(wallet.address);
      Alert.alert('Copied!', 'Wallet address copied to clipboard');
    }
  };

  const handleShare = async () => {
    if (wallet?.address) {
      try {
        await Share.share({
          message: `Send ${selectedToken} to this address: ${wallet.address}`,
        });
      } catch (error) {
        console.error(error);
      }
    }
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
          <Text style={styles.headerTitle}>Receive Crypto</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
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

          {/* QR Code */}
          <View style={styles.qrContainer}>
            <View style={styles.qrWrapper}>
              {wallet?.address ? (
                <QRCode
                  value={wallet.address}
                  size={200}
                  backgroundColor="white"
                  color="black"
                />
              ) : (
                <View style={styles.qrPlaceholder}>
                  <MaterialCommunityIcons name="qrcode" size={100} color={Colors.textSecondary} />
                </View>
              )}
            </View>
          </View>

          {/* Address */}
          <View style={styles.section}>
            <Text style={styles.label}>Your Wallet Address</Text>
            <View style={styles.addressCard}>
              <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">
                {wallet?.address || 'No wallet connected'}
              </Text>
              <TouchableOpacity onPress={handleCopyAddress} style={styles.iconButton}>
                <MaterialCommunityIcons name="content-copy" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Warning */}
          <View style={styles.warningCard}>
            <MaterialCommunityIcons name="alert-circle" size={24} color="#FFA500" />
            <View style={styles.warningTextContainer}>
              <Text style={styles.warningTitle}>Important</Text>
              <Text style={styles.warningText}>
                Only send {selectedToken} on the Base network to this address. Sending other tokens or using other networks may result in permanent loss.
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <MaterialCommunityIcons name="share-variant" size={20} color="#fff" />
            <Text style={styles.shareButtonText}>Share Address</Text>
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
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
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
  qrContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  qrWrapper: {
    backgroundColor: 'white',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    fontFamily: 'monospace',
  },
  iconButton: {
    padding: spacing.xs,
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
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFA500',
    marginBottom: spacing.xs,
  },
  warningText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  shareButton: {
    backgroundColor: Colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
