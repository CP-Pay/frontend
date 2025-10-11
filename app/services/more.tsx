import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { spacing, borderRadius } from '@/constants/Typography';

interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  route: string;
  badge?: string;
  category: 'bills' | 'transfers' | 'crypto' | 'finance';
}

const SERVICES: ServiceItem[] = [
  // Bill Payments
  {
    id: 'airtime',
    icon: 'phone',
    title: 'Airtime',
    description: 'Buy airtime for all networks',
    route: '/services/airtime',
    category: 'bills',
  },
  {
    id: 'data',
    icon: 'chart-bar',
    title: 'Data Bundle',
    description: 'Purchase data bundles',
    route: '/services/data',
    badge: 'Popular',
    category: 'bills',
  },
  {
    id: 'electricity',
    icon: 'lightning-bolt',
    title: 'Electricity',
    description: 'Pay electricity bills',
    route: '/services/electricity',
    category: 'bills',
  },
  {
    id: 'cable',
    icon: 'television',
    title: 'Cable TV',
    description: 'DSTV, GOtv, Startimes',
    route: '/services/cable-tv',
    category: 'bills',
  },
  {
    id: 'internet',
    icon: 'wifi',
    title: 'Internet',
    description: 'Pay internet bills',
    route: '/services/internet',
    category: 'bills',
  },
  {
    id: 'water',
    icon: 'water',
    title: 'Water',
    description: 'Pay water bills',
    route: '/services/water',
    category: 'bills',
  },
  {
    id: 'education',
    icon: 'school',
    title: 'Education',
    description: 'Pay school fees',
    route: '/services/education',
    category: 'bills',
  },

  // Transfers
  {
    id: 'p2p',
    icon: 'bank-transfer',
    title: 'To CPPay User',
    description: 'Send money to other users',
    route: '/services/p2p-transfer',
    category: 'transfers',
  },
  {
    id: 'bank',
    icon: 'bank',
    title: 'To Bank Account',
    description: 'Transfer to bank account',
    route: '/services/bank-transfer',
    category: 'transfers',
  },
  {
    id: 'send-crypto',
    icon: 'send',
    title: 'Send Crypto',
    description: 'Send cryptocurrency',
    route: '/services/send-crypto',
    category: 'crypto',
  },
  {
    id: 'receive',
    icon: 'arrow-down',
    title: 'Receive Crypto',
    description: 'Receive cryptocurrency',
    route: '/services/receive-crypto',
    category: 'crypto',
  },

  // Finance
  {
    id: 'swap',
    icon: 'swap-horizontal',
    title: 'Swap',
    description: 'Exchange cryptocurrencies',
    route: '/services/swap',
    category: 'crypto',
  },
  {
    id: 'batch',
    icon: 'checkbox-multiple-marked',
    title: 'Batch Payment',
    description: 'Pay multiple bills at once',
    route: '/services/batch-payment',
    badge: 'New',
    category: 'finance',
  },
  {
    id: 'scheduled',
    icon: 'calendar-clock',
    title: 'Scheduled Payments',
    description: 'Set up recurring payments',
    route: '/services/scheduled-payments',
    category: 'finance',
  },
  {
    id: 'withdraw',
    icon: 'cash-multiple',
    title: 'Withdraw',
    description: 'Withdraw to bank',
    route: '/services/withdraw',
    category: 'finance',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Services', icon: 'apps' },
  { id: 'bills', label: 'Bill Payments', icon: 'receipt' },
  { id: 'transfers', label: 'Transfers', icon: 'bank-transfer' },
  { id: 'crypto', label: 'Crypto', icon: 'bitcoin' },
  { id: 'finance', label: 'Finance', icon: 'wallet' },
];

export default function MoreServicesScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const filteredServices =
    selectedCategory === 'all'
      ? SERVICES
      : SERVICES.filter((s) => s.category === selectedCategory);

  const renderServiceCard = (service: ServiceItem) => (
    <TouchableOpacity
      key={service.id}
      style={styles.serviceCard}
      onPress={() => router.push(service.route as any)}
      activeOpacity={0.7}
    >
      <View style={styles.serviceIconContainer}>
        <MaterialCommunityIcons
          name={service.icon as any}
          size={28}
          color={Colors.primary}
        />
      </View>
      <View style={styles.serviceInfo}>
        <View style={styles.serviceTitleRow}>
          <Text style={styles.serviceTitle}>{service.title}</Text>
          {service.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{service.badge}</Text>
            </View>
          )}
        </View>
        <Text style={styles.serviceDescription}>{service.description}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={[Colors.backgroundGradient1, Colors.backgroundGradient2, Colors.backgroundGradient3]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>All Services</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <MaterialCommunityIcons
                name={category.icon as any}
                size={20}
                color={selectedCategory === category.id ? '#fff' : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category.id && styles.categoryChipTextActive,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Services List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.servicesGrid}>
            {filteredServices.map((service) => renderServiceCard(service))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  categoryScroll: {
    maxHeight: 60,
  },
  categoryContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  servicesGrid: {
    marginTop: spacing.md,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  serviceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  badge: {
    backgroundColor: Colors.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
});
