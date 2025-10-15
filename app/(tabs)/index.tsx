import { BalanceCard } from "@/components/BalanceCard";
import { QuickActionButton } from "@/components/QuickActionButton";
import { TransactionItem } from "@/components/TransactionItem";
import { useTheme } from "@/contexts/ThemeContext";
import { borderRadius, spacing } from "@/constants/Typography";
import { transactions } from "@/data/transactions";
import { user } from "@/data/user";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const quickActions = [
    {
      icon: "bank-transfer",
      label: "To CPPay",
      onPress: () => router.push("/services/p2p-transfer" as any),
    },
    {
      icon: "bank",
      label: "To Bank",
      onPress: () => router.push("/services/bank-transfer" as any),
    },
    {
      icon: "cash-multiple",
      label: "Withdraw",
      onPress: () => router.push("/services/withdraw" as any),
    },
    {
      icon: "phone",
      label: "Airtime",
      onPress: () => router.push("/services/airtime" as any),
    },
    {
      icon: "chart-bar",
      label: "Data",
      badge: "UP to 6%",
      badgeColor: colors.warning,
      onPress: () => router.push("/services/data" as any),
    },
    {
      icon: "dots-grid",
      label: "More",
      onPress: () => router.push("/services/more" as any),
    },
    {
      icon: "send",
      label: "Send Crypto",
      onPress: () => router.push("/services/send-crypto" as any),
    },
    {
      icon: "arrow-down",
      label: "Receive",
      onPress: () => router.push("/services/receive-crypto" as any),
    },
    {
      icon: "swap-horizontal",
      label: "Swap",
      onPress: () => router.push("/services/swap" as any),
    },
  ];

  const recentTransactions = transactions.slice(0, 2);

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.cardBackground}
      />

      {/* DEBUG: Temporary button to access debug tools */}
      <TouchableOpacity
        style={styles.debugButton}
        onPress={() => router.push("/debug" as any)}
      >
        <MaterialCommunityIcons name="bug" size={20} color="#fff" />
        <Text style={styles.debugButtonText}>Debug Tools</Text>
      </TouchableOpacity>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.nickname.charAt(0)}</Text>
              </View>
              {/* <View style={styles.upgradeBadge}>
                <Text style={styles.upgradeBadgeText}>1</Text>
              </View> */}
            </View>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>Hi, {user.nickname}</Text>
              {/* <TouchableOpacity style={styles.tierButton}>
                <MaterialCommunityIcons name="chevron-right" size={16} color={Colors.warning} />
              </TouchableOpacity> */}
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIcon}>
              <MaterialCommunityIcons
                name="headset"
                size={24}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={24}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => router.push("/notifications" as any)}
            >
              <MaterialCommunityIcons
                name="bell"
                size={24}
                color={colors.textPrimary}
              />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card */}
        <BalanceCard
          balance={user.balance}
          onTransactionHistory={() => router.push("/transactions" as any)}
          onAddMoney={() => {}}
        />

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {recentTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              icon={transaction.icon}
              title={transaction.title}
              date={transaction.date}
              amount={transaction.amount}
              status={transaction.status}
              iconColor={transaction.iconColor}
              onPress={() =>
                router.push({
                  pathname: "/transaction-details" as any,
                  params: { id: transaction.id },
                })
              }
            />
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <QuickActionButton
              key={index}
              icon={action.icon}
              label={action.label}
              badge={action.badge}
              badgeColor={action.badgeColor}
              onPress={action.onPress}
            />
          ))}
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.cardBackground,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    avatarContainer: {
      position: "relative",
      marginRight: spacing.md,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#FFF",
    },
    upgradeBadge: {
      position: "absolute",
      bottom: -2,
      right: -2,
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: colors.warning,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.cardBackground,
    },
    upgradeBadgeText: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#FFF",
    },
    greetingContainer: {
      justifyContent: "center",
    },
    greeting: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: 2,
    },
    tierButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    tierText: {
      fontSize: 12,
      color: colors.warning,
      marginRight: 2,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerIcon: {
      marginLeft: spacing.lg,
      position: "relative",
    },
    notificationDot: {
      position: "absolute",
      top: 0,
      right: 0,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.error,
    },
    section: {
      marginTop: spacing.lg,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.textPrimary,
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.md,
    },
    quickActionsContainer: {
      backgroundColor: colors.cardBackground,
      marginTop: spacing.lg,
      paddingVertical: spacing.lg,
      flexDirection: "row",
      flexWrap: "wrap",
    },
    bonusCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.cardBackground,
      marginHorizontal: spacing.lg,
      marginTop: spacing.lg,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    bonusIconContainer: {
      marginRight: spacing.md,
    },
    bonusContent: {
      flex: 1,
    },
    bonusTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    bonusSubtitle: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    goButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.xl,
    },
    goButtonText: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#FFF",
    },
    debugButton: {
      position: "absolute",
      top: 10,
      left: 10,
      backgroundColor: "#ff5252",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      zIndex: 1000,
    },
    debugButtonText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "bold",
    },
    hotDealCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: `${colors.primary}10`,
      marginHorizontal: spacing.lg,
      marginTop: spacing.lg,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
    },
    hotDealContent: {
      flex: 1,
      marginLeft: spacing.md,
    },
    hotDealTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    hotDealSubtitle: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });
