import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeColors } from "@/constants/Colors";
import { spacing, borderRadius } from "@/constants/Typography";
import ThemedInput from "@/components/ThemedInput";

interface Payment {
  id: string;
  recipient: string;
  amount: string;
  note: string;
}

export default function BatchPaymentScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);
  const [payments, setPayments] = useState<Payment[]>([
    { id: "1", recipient: "", amount: "", note: "" },
  ]);

  const addPayment = () => {
    setPayments([
      ...payments,
      { id: Date.now().toString(), recipient: "", amount: "", note: "" },
    ]);
  };

  const removePayment = (id: string) => {
    if (payments.length > 1) {
      setPayments(payments.filter((p) => p.id !== id));
    }
  };

  const updatePayment = (id: string, field: keyof Payment, value: string) => {
    setPayments(
      payments.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const getTotalAmount = () => {
    return payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  };

  const handleProceed = () => {
    const validPayments = payments.filter((p) => p.recipient && p.amount);
    if (validPayments.length === 0) {
      Alert.alert(
        "No Valid Payments",
        "Add at least one payment with recipient and amount"
      );
      return;
    }
    Alert.alert(
      "Coming Soon",
      `Batch payment of ${validPayments.length} transactions will be processed via TransactionService.executeBatchTransaction()`
    );
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
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Batch Payment</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Info Card */}
          <View style={styles.infoCard}>
            <MaterialCommunityIcons
              name="information"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.infoText}>
              Send money to multiple recipients in one transaction. Save on gas
              fees!
            </Text>
          </View>

          {/* Payment Items */}
          {payments.map((payment, index) => (
            <View key={payment.id} style={styles.paymentCard}>
              <View style={styles.paymentHeader}>
                <Text style={styles.paymentTitle}>Payment {index + 1}</Text>
                {payments.length > 1 && (
                  <TouchableOpacity onPress={() => removePayment(payment.id)}>
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={24}
                      color={colors.negative}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Recipient (Username or Address)
                </Text>
                <ThemedInput
                  placeholder="@username or 0x..."
                  value={payment.recipient}
                  onChangeText={(value) =>
                    updatePayment(payment.id, "recipient", value)
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Amount (₦)</Text>
                <ThemedInput
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={payment.amount}
                  onChangeText={(value) =>
                    updatePayment(payment.id, "amount", value)
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Note (Optional)</Text>
                <ThemedInput
                  placeholder="Add a note"
                  value={payment.note}
                  onChangeText={(value) =>
                    updatePayment(payment.id, "note", value)
                  }
                />
              </View>
            </View>
          ))}

          {/* Add Payment Button */}
          <TouchableOpacity style={styles.addButton} onPress={addPayment}>
            <MaterialCommunityIcons
              name="plus-circle"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.addButtonText}>Add Another Payment</Text>
          </TouchableOpacity>

          {/* Summary */}
          {getTotalAmount() > 0 && (
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Recipients</Text>
                <Text style={styles.summaryValue}>
                  {payments.filter((p) => p.recipient && p.amount).length}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Amount</Text>
                <Text style={styles.summaryValue}>
                  ₦{getTotalAmount().toLocaleString()}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Est. Gas Fee</Text>
                <Text style={styles.summaryValue}>₦50</Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text style={styles.summaryTotalLabel}>Total Cost</Text>
                <Text style={styles.summaryTotalValue}>
                  ₦{(getTotalAmount() + 50).toLocaleString()}
                </Text>
              </View>
            </View>
          )}

          {/* Proceed Button */}
          <TouchableOpacity
            style={styles.proceedButton}
            onPress={handleProceed}
          >
            <Text style={styles.proceedButtonText}>Review & Send</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.overlay,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.textPrimary,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
    infoCard: {
      backgroundColor: colors.success + "10",
      borderRadius: borderRadius.md,
      padding: spacing.md,
      flexDirection: "row",
      gap: spacing.sm,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: colors.success + "30",
      alignItems: "center",
    },
    infoText: {
      flex: 1,
      fontSize: 12,
      color: colors.textSecondary,
    },
    paymentCard: {
      backgroundColor: colors.cardBackground + "08",
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.divider + "20",
    },
    paymentHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    paymentTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    inputGroup: {
      marginBottom: spacing.sm,
    },
    label: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    input: {
      backgroundColor: colors.cardBackground + "12",
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: 14,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.divider + "30",
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      borderWidth: 2,
      borderColor: colors.primary,
      borderStyle: "dashed",
      marginBottom: spacing.lg,
    },
    addButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
    },
    summaryCard: {
      backgroundColor: colors.cardBackground + "08",
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: colors.divider + "20",
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: spacing.xs,
    },
    summaryLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    summaryValue: {
      fontSize: 14,
      color: colors.textPrimary,
      fontWeight: "500",
    },
    summaryTotal: {
      borderTopWidth: 1,
      borderTopColor: colors.divider + "20",
      marginTop: spacing.sm,
      paddingTop: spacing.sm,
    },
    summaryTotalLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.textPrimary,
    },
    summaryTotalValue: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.primary,
    },
    proceedButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      alignItems: "center",
      marginBottom: spacing.xl,
    },
    proceedButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.textPrimary,
    },
  });
