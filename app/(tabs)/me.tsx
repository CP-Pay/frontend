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
} from 'react-native';

export default function ProfileScreen() {
  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cardBackground} />
      
      <Header title="My Profile" />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.nickname.charAt(0)}</Text>
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <MaterialCommunityIcons name="camera" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.nickname}>{user.nickname}</Text>
        </View>

        {/* Details List */}
        <View style={styles.detailsList}>
          {/* Account Number */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>CPPay Account Number</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>{user.accountNumber}</Text>
              <TouchableOpacity onPress={() => copyToClipboard(user.accountNumber)}>
                <MaterialCommunityIcons name="content-copy" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Account Tier */}
          <TouchableOpacity style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Tier</Text>
            <View style={styles.detailValueContainer}>
              <View style={styles.tierBadge}>
                <MaterialCommunityIcons name="shield-star" size={16} color={Colors.warning} />
                <Text style={styles.tierText}>{user.accountTier}</Text>
              </View>
              <Text style={styles.upgradeText}>Upgrade</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Full Name */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Full Name</Text>
            <Text style={styles.detailValue}>{user.fullName}</Text>
          </View>

          {/* Mobile Number */}
          <TouchableOpacity style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mobile Number</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>{user.mobileNumber}</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Nickname */}
          <TouchableOpacity style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nickname</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>{user.nickname}</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Gender */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Gender</Text>
            <Text style={styles.detailValue}>{user.gender}</Text>
          </View>

          {/* Date of Birth */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date of Birth</Text>
            <Text style={styles.detailValue}>{user.dateOfBirth}</Text>
          </View>

          {/* Email */}
          <TouchableOpacity style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>{user.email}</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Address */}
          <TouchableOpacity style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>{user.address || 'Not set'}</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textSecondary} />
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
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileSection: {
    backgroundColor: Colors.cardBackground,
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
    backgroundColor: Colors.primary,
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
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nickname: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  detailsList: {
    backgroundColor: Colors.cardBackground,
    marginTop: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
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
    color: Colors.textSecondary,
    marginRight: spacing.sm,
    textAlign: 'right',
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.warning}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  tierText: {
    fontSize: 12,
    color: Colors.warning,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  upgradeText: {
    fontSize: 14,
    color: Colors.warning,
    fontWeight: '600',
    marginRight: spacing.xs,
  },
});
