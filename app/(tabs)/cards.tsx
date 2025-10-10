import { Colors } from '@/constants/Colors';
import { spacing } from '@/constants/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function CardsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cardBackground} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cards</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <MaterialCommunityIcons name="credit-card" size={120} color={Colors.primary} />
        <Text style={styles.title}>No Cards Yet</Text>
        <Text style={styles.description}>
          Request a CPPay virtual or physical card to enjoy seamless payments everywhere.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
