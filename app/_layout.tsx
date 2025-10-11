// IMPORTANT: Import polyfills for crypto operations FIRST
import 'react-native-get-random-values';
import { Buffer } from 'buffer';

// Set up global polyfills
global.Buffer = Buffer;

// Polyfill for crypto.getRandomValues
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    // @ts-ignore
    getRandomValues: (array: Uint8Array) => {
      const crypto = require('react-native-get-random-values');
      return crypto.getRandomValues(array);
    },
  };
}

import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';

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
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="transactions" options={{ headerShown: false }} />
        <Stack.Screen name="transaction-details" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
