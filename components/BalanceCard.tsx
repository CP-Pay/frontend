import { useTheme } from "@/contexts/ThemeContext";
import { borderRadius, spacing } from "@/constants/Typography";
import { formatCurrency } from "@/utils/formatters";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BalanceCardProps {
  balance: number;
  label?: string;
  gradient?: boolean;
  gradientColors?: string[];
  showAddMoney?: boolean;
  showTransactionHistory?: boolean;
  onAddMoney?: () => void;
  onTransactionHistory?: () => void;
  interestToday?: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  label = "Available Balance",
  gradient = true,
  gradientColors,
  showAddMoney = true,
  showTransactionHistory = true,
  onAddMoney,
  onTransactionHistory,
  interestToday,
}) => {
  const { colors } = useTheme();

  const effectiveGradient =
    gradientColors && gradientColors.length >= 2
      ? gradientColors
      : [colors.primary, colors.primaryDark];

  return (
    <View style={styles.container}>
      {gradient ? (
        <LinearGradient
          colors={effectiveGradient as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { borderRadius: borderRadius.xl }]}
        >
          <View>
            <View style={styles.header}>
              <View style={styles.labelContainer}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>
                  {label}
                </Text>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={16}
                  color={colors.textPrimary}
                  style={styles.infoIcon}
                />
              </View>
              {showTransactionHistory && (
                <TouchableOpacity
                  onPress={onTransactionHistory}
                  style={styles.historyButton}
                >
                  <Text
                    style={[styles.historyText, { color: colors.textPrimary }]}
                  >
                    Transaction History
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={colors.textPrimary}
                  />
                </TouchableOpacity>
              )}
            </View>

            <Text style={[styles.amount, { color: colors.textPrimary }]}>
              {formatCurrency(balance)}
            </Text>

            {interestToday !== undefined && (
              <TouchableOpacity style={styles.interestContainer}>
                <Text
                  style={[styles.interestText, { color: colors.textPrimary }]}
                >
                  Interest Credited Today: {formatCurrency(interestToday)}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={16}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
            )}

            {showAddMoney && (
              <TouchableOpacity
                style={[
                  styles.addMoneyButton,
                  { backgroundColor: colors.cardBackground },
                ]}
                onPress={onAddMoney}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={16}
                  color={colors.primary}
                />
                <Text style={[styles.addMoneyText, { color: colors.primary }]}>
                  Add Money
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.primaryLight,
              borderRadius: borderRadius.xl,
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.labelContainer}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                {label}
              </Text>
              <MaterialCommunityIcons
                name="information-outline"
                size={16}
                color={colors.textPrimary}
                style={styles.infoIcon}
              />
            </View>
            {showTransactionHistory && (
              <TouchableOpacity
                onPress={onTransactionHistory}
                style={styles.historyButton}
              >
                <Text
                  style={[styles.historyText, { color: colors.textPrimary }]}
                >
                  Transaction History
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
            )}
          </View>

          <Text style={[styles.amount, { color: colors.textPrimary }]}>
            {formatCurrency(balance)}
          </Text>

          {interestToday !== undefined && (
            <TouchableOpacity style={styles.interestContainer}>
              <Text
                style={[styles.interestText, { color: colors.textPrimary }]}
              >
                Interest Credited Today: {formatCurrency(interestToday)}
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={16}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
          )}

          {showAddMoney && (
            <TouchableOpacity
              style={[
                styles.addMoneyButton,
                { backgroundColor: colors.cardBackground },
              ]}
              onPress={onAddMoney}
            >
              <MaterialCommunityIcons
                name="plus"
                size={16}
                color={colors.primary}
              />
              <Text style={[styles.addMoneyText, { color: colors.primary }]}>
                Add Money
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {showAddMoney && (
        <View
          style={[
            styles.securityBadge,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <MaterialCommunityIcons
            name="shield-check"
            size={24}
            color={colors.primary}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    position: "relative",
  },
  card: {
    padding: spacing.xl,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    opacity: 0.95,
  },
  infoIcon: {
    marginLeft: spacing.xs,
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  historyText: {
    fontSize: 14,
    color: "#FFF",
    marginRight: spacing.xs,
  },
  amount: {
    fontSize: 34,
    fontWeight: "800",
    marginBottom: spacing.lg,
  },
  interestContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: spacing.sm,
  },
  interestText: {
    fontSize: 12,
    color: "#FFF",
    opacity: 0.9,
    marginRight: spacing.xs,
  },
  addMoneyButton: {
    position: "absolute",
    bottom: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    elevation: 4,
  },
  addMoneyText: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: spacing.xs,
  },
  securityBadge: {
    position: "absolute",
    bottom: -12,
    right: spacing.lg,
    backgroundColor: "#FFF",
    borderRadius: borderRadius.full,
    padding: spacing.sm,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
