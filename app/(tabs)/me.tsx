import { Header } from '@/components/Header';
import { Colors } from '@/constants/Colors';
import { borderRadius, spacing } from '@/constants/Typography';
import { user } from '@/data/user';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Switch,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function ProfileScreen() {
  const { colors, theme, toggleTheme, isDark } = useTheme();
  
  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.cardBackground} />
      
      <Header title="My Profile" />

      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={[styles.profileSection, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{user.nickname.charAt(0)}</Text>
            </View>
            <TouchableOpacity style={[styles.cameraButton, { backgroundColor: colors.border }]}>
              <MaterialCommunityIcons name="camera" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.nickname, { color: colors.textPrimary }]}>{user.nickname}</Text>
        </View>

        {/* Theme Section */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Appearance</Text>
          
          {/* Theme Toggle */}
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <View style={styles.themeInfo}>
              <MaterialCommunityIcons 
                name={isDark ? "weather-night" : "white-balance-sunny"} 
                size={24} 
                color={colors.primary} 
              />
              <View style={styles.themeTextContainer}>
                <Text style={[styles.detailLabel, { color: colors.textPrimary }]}>
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </Text>
                <Text style={[styles.themeSubtext, { color: colors.textSecondary }]}>
                  {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor={colors.border}
            />
          </View>
        </View>

        {/* Details Section */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Account Information</Text>
          
          {/* Account Number */}
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.textPrimary }]}>CPPay Account Number</Text>
            <View style={styles.detailValueContainer}>
              <Text style={[styles.detailValue, { color: colors.textSecondary }]}>{user.accountNumber}</Text>
              <TouchableOpacity onPress={() => copyToClipboard(user.accountNumber)}>
                <MaterialCommunityIcons name="content-copy" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Account Tier */}
          <TouchableOpacity style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.textPrimary }]}>Account Tier</Text>
            <View style={styles.detailValueContainer}>
              <View style={[styles.tierBadge, { backgroundColor: `${colors.warning}20` }]}>
                <MaterialCommunityIcons name="shield-star" size={16} color={colors.warning} />
                <Text style={[styles.tierText, { color: colors.warning }]}>{user.accountTier}</Text>
              </View>
              <Text style={[styles.upgradeText, { color: colors.warning }]}>Upgrade</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Full Name */}
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.textPrimary }]}>Full Name</Text>
            <Text style={[styles.detailValue, { color: colors.textSecondary }]}>{user.fullName}</Text>
          </View>

          {/* Mobile Number */}
          <TouchableOpacity style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.textPrimary }]}>Mobile Number</Text>
            <View style={styles.detailValueContainer}>
              <Text style={[styles.detailValue, { color: colors.textSecondary }]}>{user.mobileNumber}</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Nickname */}
          <TouchableOpacity style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.textPrimary }]}>Nickname</Text>
            <View style={styles.detailValueContainer}>
              <Text style={[styles.detailValue, { color: colors.textSecondary }]}>{user.nickname}</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Gender */}
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.textPrimary }]}>Gender</Text>
            <Text style={[styles.detailValue, { color: colors.textSecondary }]}>{user.gender}</Text>
          </View>

          {/* Date of Birth */}
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.textPrimary }]}>Date of Birth</Text>
            <Text style={[styles.detailValue, { color: colors.textSecondary }]}>{user.dateOfBirth}</Text>
          </View>

          {/* Email */}
          <TouchableOpacity style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.textPrimary }]}>Email</Text>
            <View style={styles.detailValueContainer}>
              <Text style={[styles.detailValue, { color: colors.textSecondary }]}>{user.email}</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Address */}
          <TouchableOpacity style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.textPrimary }]}>Address</Text>
            <View style={styles.detailValueContainer}>
              <Text style={[styles.detailValue, { color: colors.textSecondary }]}>{user.address || 'Not set'}</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  profileSection: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nickname: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
  },
  detailLabel: {
    fontSize: 14,
    flex: 1,
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  detailValue: {
    fontSize: 14,
    marginRight: spacing.sm,
    textAlign: 'right',
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  tierText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  upgradeText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: spacing.xs,
  },
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeTextContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  themeSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
});
