import { Header } from '@/components/Header';
import { Colors } from '@/constants/Colors';
import { borderRadius, spacing } from '@/constants/Typography';
import { notifications } from '@/data/notifications';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type TabType = 'transaction' | 'service' | 'activity';

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('transaction');

  const filteredNotifications = notifications.filter((n) => n.type === activeTab);

  const getTabCount = (type: TabType) => {
    return notifications.filter((n) => n.type === type && !n.read).length;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cardBackground} />
      
      <Header title="Notifications" />

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'transaction' && styles.activeTab]}
          onPress={() => setActiveTab('transaction')}
        >
          <Text style={[styles.tabText, activeTab === 'transaction' && styles.activeTabText]}>
            Transactions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'service' && styles.activeTab]}
          onPress={() => setActiveTab('service')}
        >
          <Text style={[styles.tabText, activeTab === 'service' && styles.activeTabText]}>
            Services
          </Text>
          {getTabCount('service') > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getTabCount('service')}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'activity' && styles.activeTab]}
          onPress={() => setActiveTab('activity')}
        >
          <Text style={[styles.tabText, activeTab === 'activity' && styles.activeTabText]}>
            Activities
          </Text>
          {getTabCount('activity') > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getTabCount('activity')}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Notification List */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {filteredNotifications.map((notification) => (
          <View key={notification.id} style={styles.notificationItem}>
            <View style={[styles.iconContainer, { backgroundColor: `${Colors.primary}20` }]}>
              <MaterialCommunityIcons name={notification.icon as any} size={24} color={Colors.primary} />
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.title}>{notification.title}</Text>
              <Text style={styles.message} numberOfLines={2}>
                {notification.message}
              </Text>
              <View style={styles.footer}>
                <Text style={styles.timestamp}>{notification.timestamp}</Text>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View</Text>
                  <MaterialCommunityIcons name="chevron-right" size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {filteredNotifications.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="bell-off" size={64} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        )}

        <View style={{ height: 20 }} />
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.xl,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFF',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.error,
    borderRadius: borderRadius.full,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginRight: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textTertiary,
    marginTop: spacing.lg,
  },
});
