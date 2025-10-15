import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useWalletStore } from "@/store/walletStore";
import { formatCurrency, formatCryptoAmount } from "@/utils/formatters";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeColors } from "@/constants/Colors";

const NETWORK_OPTIONS = [
  { id: "mtn", name: "MTN", color: "#FFCC00" },
  { id: "airtel", name: "Airtel", color: "#FF0000" },
  { id: "glo", name: "Glo", color: "#00A859" },
  { id: "9mobile", name: "9Mobile", color: "#00A651" },
];

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export default function AirtimeScreen() {
  const router = useRouter();
  const { balances, prices } = useWalletStore();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [selectedNetwork, setSelectedNetwork] = useState("mtn");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("ETH");
  const [cryptoNeeded, setCryptoNeeded] = useState(0);
  const [loading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!amount || isNaN(Number(amount))) {
        setCryptoNeeded(0);
        return;
      }

      try {
        const amountNGN = Number(amount);
        const price = (prices as any)[selectedCrypto];
        if (price && price.ngn > 0) {
          const needed = amountNGN / price.ngn;
          setCryptoNeeded(needed);
        }
      } catch (error) {
        console.error("Failed to calculate crypto:", error);
      }
    })();
  }, [amount, selectedCrypto, prices]);

  const handlePurchase = () => {
    if (!phoneNumber || phoneNumber.length < 11) {
      Alert.alert("Invalid Phone", "Please enter a valid phone number");
      return;
    }

    if (!amount || Number(amount) < 50) {
      Alert.alert("Invalid Amount", "Minimum amount is ₦50");
      return;
    }

    // Check if user has enough balance
    const userToken = balances.tokens.find((t) => t.symbol === selectedCrypto);
    const userBalance = userToken ? parseFloat(userToken.balance) : 0;
    if (!userToken || userBalance < cryptoNeeded) {
      Alert.alert(
        "Insufficient Balance",
        `You need ${formatCryptoAmount(
          cryptoNeeded
        )} ${selectedCrypto} but only have ${formatCryptoAmount(
          userBalance
        )} ${selectedCrypto}`
      );
      return;
    }

    // Navigate to review screen
    router.push({
      pathname: "/services/airtime-review" as any,
      params: {
        network: selectedNetwork,
        phoneNumber,
        amountNGN: amount,
        cryptoSymbol: selectedCrypto,
        cryptoAmount: cryptoNeeded.toString(),
      },
    } as any);
  };

  return (
    <LinearGradient
      colors={[
        colors.backgroundGradient1,
        colors.backgroundGradient2,
        colors.backgroundGradient3,
      ]}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Buy Airtime</Text>
          <Text style={styles.subtitle}>
            Purchase airtime with crypto instantly
          </Text>
        </View>

        {/* Network Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Select Network</Text>
          <View style={styles.networkGrid}>
            {NETWORK_OPTIONS.map((network) => (
              <TouchableOpacity
                key={network.id}
                style={[
                  styles.networkCard,
                  selectedNetwork === network.id && styles.networkCardActive,
                ]}
                onPress={() => setSelectedNetwork(network.id)}
              >
                <View
                  style={[
                    styles.networkDot,
                    { backgroundColor: network.color },
                  ]}
                />
                <Text style={styles.networkName}>{network.name}</Text>
                {selectedNetwork === network.id && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Phone Number */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="08012345678"
            placeholderTextColor={colors.textSecondary}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={11}
          />
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Amount (₦)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            placeholderTextColor={colors.textSecondary}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          {/* Quick Amount Buttons */}
          <View style={styles.quickAmounts}>
            {QUICK_AMOUNTS.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={styles.quickAmountButton}
                onPress={() => setAmount(quickAmount.toString())}
              >
                <Text style={styles.quickAmountText}>₦{quickAmount}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Select Crypto to Pay With */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Pay With</Text>
          <View style={styles.cryptoOptions}>
            {balances.tokens
              .filter((t) => parseFloat(t.balance) > 0)
              .map((token) => (
                <TouchableOpacity
                  key={token.symbol}
                  style={[
                    styles.cryptoOption,
                    selectedCrypto === token.symbol &&
                      styles.cryptoOptionActive,
                  ]}
                  onPress={() => setSelectedCrypto(token.symbol)}
                >
                  <Text style={styles.cryptoSymbol}>{token.symbol}</Text>
                  <Text style={styles.cryptoBalance}>
                    {formatCryptoAmount(parseFloat(token.balance))}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>

        {/* Crypto Calculation */}
        {amount && cryptoNeeded > 0 && (
          <View style={styles.calculationCard}>
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>You&apos;ll Pay:</Text>
              <Text style={styles.calculationValue}>
                {formatCryptoAmount(cryptoNeeded)} {selectedCrypto}
              </Text>
            </View>
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>
                ≈ ₦{formatCurrency(Number(amount))}
              </Text>
              <Text style={styles.calculationFee}>+ ₦0.50 fee</Text>
            </View>
          </View>
        )}

        {/* Purchase Button */}
        <TouchableOpacity
          style={[
            styles.purchaseButton,
            (!phoneNumber || !amount) && styles.purchaseButtonDisabled,
          ]}
          onPress={handlePurchase}
          disabled={!phoneNumber || !amount || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.textInverse} />
          ) : (
            <Text style={styles.purchaseButtonText}>Review Purchase</Text>
          )}
        </TouchableOpacity>

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Your crypto will be automatically converted to NGN and airtime will
            be credited instantly.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
      marginBottom: 32,
    },
    backButton: {
      marginBottom: 16,
    },
    backButtonText: {
      fontSize: 16,
      color: colors.primary,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.textInverse,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    section: {
      marginBottom: 24,
    },
    sectionLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textInverse,
      marginBottom: 12,
    },
    networkGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    networkCard: {
      width: "48%",
      backgroundColor: colors.cardBackground + "05",
      padding: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.cardBackground + "10",
      flexDirection: "row",
      alignItems: "center",
    },
    networkCardActive: {
      backgroundColor: colors.primary + "10",
      borderColor: colors.primary,
    },
    networkDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
    },
    networkName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textInverse,
      flex: 1,
    },
    checkmark: {
      fontSize: 18,
      color: colors.primary,
    },
    input: {
      backgroundColor: colors.cardBackground + "10",
      borderRadius: 12,
      padding: 16,
      fontSize: 18,
      color: colors.textInverse,
      borderWidth: 1,
      borderColor: colors.cardBackground + "20",
    },
    quickAmounts: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 12,
    },
    quickAmountButton: {
      backgroundColor: colors.cardBackground + "10",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    quickAmountText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textInverse,
    },
    cryptoOptions: {
      flexDirection: "row",
      gap: 12,
    },
    cryptoOption: {
      flex: 1,
      backgroundColor: colors.cardBackground + "05",
      padding: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.cardBackground + "10",
      alignItems: "center",
    },
    cryptoOptionActive: {
      backgroundColor: colors.primary + "10",
      borderColor: colors.primary,
    },
    cryptoSymbol: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.textInverse,
      marginBottom: 4,
    },
    cryptoBalance: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    calculationCard: {
      backgroundColor: colors.success + "10",
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.success + "30",
    },
    calculationRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    calculationLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    calculationValue: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textInverse,
    },
    calculationFee: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    purchaseButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      marginBottom: 16,
    },
    purchaseButtonDisabled: {
      backgroundColor: colors.primary + "30",
    },
    purchaseButtonText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.textInverse,
    },
    infoNote: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: colors.info + "10",
      borderLeftWidth: 4,
      borderLeftColor: colors.info,
      padding: 12,
      borderRadius: 8,
    },
    infoIcon: {
      fontSize: 20,
      marginRight: 12,
    },
    infoText: {
      flex: 1,
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });
