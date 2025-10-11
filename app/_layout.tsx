// IMPORTANT: Import polyfills FIRST before any other imports
import '@ethersproject/shims';
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Add any app initialization here
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appReady) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="transactions" options={{ headerShown: false }} />
      <Stack.Screen name="transaction-details" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
    </Stack>
  );
}
