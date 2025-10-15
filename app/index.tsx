import { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { Redirect } from "expo-router";
import { useWalletStore } from "@/store/walletStore";
import { useTheme } from "@/contexts/ThemeContext";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const { auth, initialize } = useWalletStore();
  const { colors } = useTheme();
  useEffect(() => {
    const checkWallet = async () => {
      console.log("🔍 Checking for existing wallet...");
      await initialize();
      console.log("✅ Wallet check complete. hasWallet:", auth.hasWallet);
      setIsLoading(false);
    };

    checkWallet();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textPrimary, marginTop: 16 }}>
          Loading...
        </Text>
      </View>
    );
  }

  console.log(
    "🚀 Redirecting to:",
    auth.hasWallet ? "/(tabs)" : "/auth/welcome"
  );

  // If user has a wallet, go to tabs (home), otherwise go to welcome screen
  return <Redirect href={auth.hasWallet ? "/(tabs)" : "/auth/welcome"} />;
}
