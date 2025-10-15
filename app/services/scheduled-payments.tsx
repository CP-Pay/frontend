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
import { spacing, borderRadius } from "@/constants/Typography";
import { ThemeColors } from "@/constants/Colors";
import ThemedInput from "@/components/ThemedInput";
import SelectInput from "@/components/SelectInput";

const FREQUENCIES = ["daily", "weekly", "monthly"];
const CATEGORIES = ["Rent", "Utilities", "Subscriptions", "Savings", "Other"];

export default function ScheduledPaymentsScreen() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const mockScheduled = [
    {
      id: "1",
      recipient: "Landlord",
      amount: 150000,
      frequency: "monthly",
      nextPayment: "2024-02-01",
      category: "Rent",
    },
    {
      id: "2",
      recipient: "Netflix",
      amount: 5000,
      frequency: "monthly",
      nextPayment: "2024-01-15",
      category: "Subscriptions",
    },
  ];

  const handleCreate = () => {
    if (!recipient || !amount || !startDate) {
      Alert.alert("Missing Information", "Please fill in all required fields");
      return;
    }
    Alert.alert(
      "Coming Soon",
      "Scheduled payment will be created via TransactionService.scheduleRecurringPayment()"
    );
    setShowForm(false);
  };
  const { colors } = useTheme();
  const styles = createStyles(colors);

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
        <StatusBar
          barStyle={colors.textPrimary ? "light-content" : "dark-content"}
          backgroundColor={colors.cardBackground}
        />

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scheduled Payments</Text>
          <TouchableOpacity
            onPress={() => setShowForm(!showForm)}
            style={styles.addButton}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {showForm ? (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>New Scheduled Payment</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Recipient</Text>
                <ThemedInput
                  placeholder="Name or address"
                  value={recipient}
                  onChangeText={setRecipient}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Amount (₦)</Text>
                <ThemedInput
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Frequency</Text>
                <View style={styles.frequencyRow}>
                  {FREQUENCIES.map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      style={[
                        styles.frequencyChip,
                        frequency === freq && styles.frequencyChipActive,
                      ]}
                      onPress={() => setFrequency(freq)}
                    >
                      <Text
                        style={[
                          styles.frequencyText,
                          frequency === freq && styles.frequencyTextActive,
                        ]}
                      >
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <SelectInput
                  options={CATEGORIES.map((c, i) => ({
                    key: String(i),
                    label: c,
                  }))}
                  value={category}
                  onSelect={(o) => setCategory(o.label)}
                  placeholder="Select category"
                  label="Category"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Start Date</Text>
                <ThemedInput
                  placeholder="YYYY-MM-DD"
                  value={startDate}
                  onChangeText={setStartDate}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>End Date (Optional)</Text>
                <ThemedInput
                  placeholder="YYYY-MM-DD or leave empty for no end"
                  value={endDate}
                  onChangeText={setEndDate}
                />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setShowForm(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.createButton]}
                  onPress={handleCreate}
                >
                  <Text style={styles.createButtonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              {/* Info Card */}
              <View style={styles.infoCard}>
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={24}
                  color={colors.primary}
                />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoTitle}>Automate Your Payments</Text>
                  <Text style={styles.infoText}>
                    Set up recurring payments for rent, bills, subscriptions,
                    and more
                  </Text>
                </View>
              </View>

              {/* Scheduled Payments List */}
              <Text style={styles.sectionTitle}>
                Active Schedules ({mockScheduled.length})
              </Text>

              {mockScheduled.map((payment) => (
                <View key={payment.id} style={styles.paymentCard}>
                  <View style={styles.paymentHeader}>
                    <View style={styles.paymentInfo}>
                      <Text style={styles.paymentRecipient}>
                        {payment.recipient}
                      </Text>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>
                          {payment.category}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity>
                      <MaterialCommunityIcons
                        name="dots-vertical"
                        size={24}
                        color={colors.textPrimary}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.paymentDetails}>
                    <View style={styles.detailRow}>
                      <MaterialCommunityIcons
                        name="cash"
                        size={16}
                        color={colors.textSecondary}
                      />
                      <Text style={styles.detailText}>
                        ₦{payment.amount.toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MaterialCommunityIcons
                        name="repeat"
                        size={16}
                        color={colors.textSecondary}
                      />
                      <Text style={styles.detailText}>
                        {payment.frequency.charAt(0).toUpperCase() +
                          payment.frequency.slice(1)}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MaterialCommunityIcons
                        name="calendar-outline"
                        size={16}
                        color={colors.textSecondary}
                      />
                      <Text style={styles.detailText}>
                        Next: {payment.nextPayment}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.paymentActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Text style={styles.actionButtonText}>Pause</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.actionButtonPrimary]}
                    >
                      <Text style={styles.actionButtonTextPrimary}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          )}
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
      backgroundColor: colors.cardBackground,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.textPrimary,
    },
    addButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    content: { flex: 1, paddingHorizontal: spacing.lg },
    infoCard: {
      backgroundColor: `${colors.success}10`,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      flexDirection: "row",
      gap: spacing.md,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: `${colors.success}30`,
    },
    infoTextContainer: { flex: 1 },
    infoTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    infoText: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    paymentCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    paymentHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: spacing.sm,
    },
    paymentInfo: { flex: 1 },
    paymentRecipient: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    categoryBadge: {
      backgroundColor: `${colors.success}20`,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.sm,
      alignSelf: "flex-start",
    },
    categoryText: { fontSize: 12, color: colors.primary },
    paymentDetails: {
      flexDirection: "row",
      gap: spacing.md,
      marginBottom: spacing.md,
    },
    detailRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
    detailText: { fontSize: 12, color: colors.textSecondary },
    paymentActions: { flexDirection: "row", gap: spacing.sm },
    actionButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      backgroundColor: colors.cardBackground,
      alignItems: "center",
    },
    actionButtonPrimary: { backgroundColor: colors.primary },
    actionButtonText: { fontSize: 14, color: colors.textPrimary },
    actionButtonTextPrimary: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    formCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    formTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: spacing.lg,
    },
    inputGroup: { marginBottom: spacing.md },
    label: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    input: {
      backgroundColor: colors.cardBackground,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: 14,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    text: { color: colors.textPrimary },
    placeholder: { color: colors.textSecondary },
    frequencyRow: { flexDirection: "row", gap: spacing.sm },
    frequencyChip: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
    },
    frequencyChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    frequencyText: { fontSize: 14, color: colors.textSecondary },
    frequencyTextActive: { color: colors.textPrimary, fontWeight: "600" },
    buttonRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
    button: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: "center",
    },
    cancelButton: { backgroundColor: colors.cardBackground },
    createButton: { backgroundColor: colors.primary },
    cancelButtonText: { fontSize: 16, color: colors.textPrimary },
    createButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.textPrimary,
    },
  });
