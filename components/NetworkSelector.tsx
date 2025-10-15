import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Switch,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useNetwork } from '@/contexts/NetworkContext';
import type { ThemeColors } from '@/constants/Colors';
import type { Network } from '@/constants/Tokens';

interface NetworkSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export default function NetworkSelector({ visible, onClose }: NetworkSelectorProps) {
  const { colors } = useTheme();
  const {
    currentNetwork,
    setCurrentNetwork,
    isTestnet,
    toggleTestnet,
    availableNetworks,
  } = useNetwork();
  const styles = createStyles(colors, isTestnet);

  const handleSelectNetwork = (network: Network) => {
    setCurrentNetwork(network);
    onClose();
  };

  const renderNetworkItem = ({ item }: { item: Network }) => {
    const isSelected = item.chainId === currentNetwork.chainId;

    return (
      <TouchableOpacity
        style={[
          styles.networkItem,
          isSelected && styles.networkItemSelected,
        ]}
        onPress={() => handleSelectNetwork(item)}
        activeOpacity={0.7}
      >
        <View style={styles.networkInfo}>
          {/* Network Logo */}
          <View style={styles.networkIconContainer}>
            {item.logoUrl ? (
              <Image source={{ uri: item.logoUrl }} style={styles.networkIcon} />
            ) : (
              <MaterialCommunityIcons
                name="web"
                size={24}
                color={colors.primary}
              />
            )}
          </View>

          {/* Network Details */}
          <View style={styles.networkDetails}>
            <Text style={styles.networkName}>{item.name}</Text>
            <Text style={styles.networkSymbol}>
              {item.nativeCurrency.symbol} • Chain ID: {item.chainId}
            </Text>
          </View>
        </View>

        {/* Selected Indicator */}
        {isSelected && (
          <MaterialCommunityIcons
            name="check-circle"
            size={24}
            color={colors.success}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Network</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Testnet Toggle */}
          <View style={styles.testnetToggle}>
            <View style={styles.testnetToggleLeft}>
              <MaterialCommunityIcons
                name={isTestnet ? 'flask' : 'check-decagram'}
                size={20}
                color={isTestnet ? colors.warning : colors.success}
              />
              <Text style={styles.testnetToggleText}>
                {isTestnet ? 'Testnet Mode' : 'Mainnet Mode'}
              </Text>
            </View>
            <Switch
              value={isTestnet}
              onValueChange={toggleTestnet}
              trackColor={{ false: colors.border, true: colors.warning }}
              thumbColor={isTestnet ? colors.warning : colors.success}
            />
          </View>

          {/* Network List */}
          <FlatList
            data={availableNetworks}
            renderItem={renderNetworkItem}
            keyExtractor={(item) => item.chainId.toString()}
            contentContainerStyle={styles.networkList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="web-off"
                  size={48}
                  color={colors.textSecondary}
                />
                <Text style={styles.emptyText}>
                  No {isTestnet ? 'testnet' : 'mainnet'} networks available
                </Text>
              </View>
            }
          />

          {/* Add Custom Network Button */}
          <TouchableOpacity style={styles.addNetworkButton}>
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.addNetworkText}>Add Custom Network</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors, isTestnet: boolean) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: '80%',
      paddingTop: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    closeButton: {
      padding: 8,
    },
    testnetToggle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: isTestnet ? colors.warning + '10' : colors.success + '10',
      marginHorizontal: 20,
      marginTop: 16,
      borderRadius: 12,
    },
    testnetToggleLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    testnetToggleText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    networkList: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
    },
    networkItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    networkItemSelected: {
      borderColor: colors.success,
      backgroundColor: colors.success + '10',
    },
    networkInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    networkIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    networkIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    networkDetails: {
      flex: 1,
    },
    networkName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    networkSymbol: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    emptyState: {
      padding: 32,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 12,
    },
    addNetworkButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      borderStyle: 'dashed',
    },
    addNetworkText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
    },
  });
