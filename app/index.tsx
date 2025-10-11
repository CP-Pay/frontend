import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { useWalletStore } from '@/store/walletStore';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const { auth, initialize } = useWalletStore();

  useEffect(() => {
    const checkWallet = async () => {
      console.log('🔍 Checking for existing wallet...');
      await initialize();
      console.log('✅ Wallet check complete. hasWallet:', auth.hasWallet);
      setIsLoading(false);
    };

    checkWallet();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ color: '#fff', marginTop: 16 }}>Loading...</Text>
      </View>
    );
  }

  console.log('🚀 Redirecting to:', auth.hasWallet ? '/(tabs)' : '/auth/welcome');
  
  // If user has a wallet, go to tabs (home), otherwise go to welcome screen
  return <Redirect href={auth.hasWallet ? "/(tabs)" : "/auth/welcome"} />;
}

