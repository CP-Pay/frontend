/**
 * Balance Store - Persistent balance management with smart caching
 * 
 * Features:
 * - Shows 0 initially instead of loading states
 * - Persists balances across app refreshes
 * - Background updates without blocking UI
 * - Smart caching with expiration
 * - Rate limiting to prevent excessive API calls
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTokenBalances, type TokenBalance } from '@/services/TokenBalanceService';

interface NetworkBalances {
  [address: string]: {
    balances: TokenBalance[];
    lastUpdated: number;
    isUpdating: boolean;
  };
}

interface BalanceState {
  // Nested structure: [chainId][address] = balance data
  networkBalances: { [chainId: number]: NetworkBalances };
  
  // Cache settings
  cacheExpiration: number; // 5 minutes in milliseconds
  minUpdateInterval: number; // 30 seconds minimum between updates
  
  // Actions
  getBalances: (chainId: number, address: string) => TokenBalance[];
  isBalanceStale: (chainId: number, address: string) => boolean;
  isUpdating: (chainId: number, address: string) => boolean;
  updateBalances: (chainId: number, address: string, force?: boolean) => Promise<void>;
  setBalances: (chainId: number, address: string, balances: TokenBalance[]) => void;
  clearCache: () => void;
  
  // Utility functions
  getTotalPortfolioValue: (chainId: number, address: string, currency: 'USD' | 'NGN') => number;
}

export const useBalanceStore = create<BalanceState>()(
  persist(
    (set, get) => ({
      networkBalances: {},
      cacheExpiration: 5 * 60 * 1000, // 5 minutes
      minUpdateInterval: 30 * 1000, // 30 seconds
      
      /**
       * Get balances for address - returns cached or empty array (never loading state)
       */
      getBalances: (chainId: number, address: string): TokenBalance[] => {
        const state = get();
        const networkData = state.networkBalances[chainId];
        const addressData = networkData?.[address];
        
        return addressData?.balances || [];
      },
      
      /**
       * Check if balance data is stale and needs update
       */
      isBalanceStale: (chainId: number, address: string): boolean => {
        const state = get();
        const networkData = state.networkBalances[chainId];
        const addressData = networkData?.[address];
        
        if (!addressData || !addressData.lastUpdated) return true;
        
        const now = Date.now();
        return (now - addressData.lastUpdated) > state.cacheExpiration;
      },
      
      /**
       * Check if balance is currently being updated
       */
      isUpdating: (chainId: number, address: string): boolean => {
        const state = get();
        const networkData = state.networkBalances[chainId];
        const addressData = networkData?.[address];
        
        return addressData?.isUpdating || false;
      },
      
      /**
       * Update balances in background (non-blocking)
       */
      updateBalances: async (chainId: number, address: string, force: boolean = false): Promise<void> => {
        const state = get();
        
        // Skip if already updating
        if (state.isUpdating(chainId, address)) {
          return;
        }
        
        // Skip if recently updated (rate limiting)
        const networkData = state.networkBalances[chainId];
        const addressData = networkData?.[address];
        if (!force && addressData?.lastUpdated) {
          const timeSinceUpdate = Date.now() - addressData.lastUpdated;
          if (timeSinceUpdate < state.minUpdateInterval) {
            console.log(`⏱️ Skipping balance update - too recent (${Math.round(timeSinceUpdate / 1000)}s ago)`);
            return;
          }
        }
        
        // Set updating flag
        set((state) => ({
          networkBalances: {
            ...state.networkBalances,
            [chainId]: {
              ...state.networkBalances[chainId],
              [address]: {
                ...state.networkBalances[chainId]?.[address],
                balances: state.networkBalances[chainId]?.[address]?.balances || [],
                lastUpdated: state.networkBalances[chainId]?.[address]?.lastUpdated || 0,
                isUpdating: true,
              },
            },
          },
        }));
        
        try {
          console.log(`🔄 Updating balances for ${address} on chain ${chainId}`);
          
          // Fetch new balances
          const newBalances = await fetchTokenBalances(address, chainId);
          
          // Update store
          set((state) => ({
            networkBalances: {
              ...state.networkBalances,
              [chainId]: {
                ...state.networkBalances[chainId],
                [address]: {
                  balances: newBalances,
                  lastUpdated: Date.now(),
                  isUpdating: false,
                },
              },
            },
          }));
          
          console.log(`✅ Updated balances for ${address} on chain ${chainId}`);
          
        } catch (error) {
          console.error(`❌ Failed to update balances for ${address}:`, error);
          
          // Clear updating flag on error
          set((state) => ({
            networkBalances: {
              ...state.networkBalances,
              [chainId]: {
                ...state.networkBalances[chainId],
                [address]: {
                  ...state.networkBalances[chainId]?.[address],
                  balances: state.networkBalances[chainId]?.[address]?.balances || [],
                  lastUpdated: state.networkBalances[chainId]?.[address]?.lastUpdated || 0,
                  isUpdating: false,
                },
              },
            },
          }));
        }
      },
      
      /**
       * Manually set balances (for initial data or external updates)
       */
      setBalances: (chainId: number, address: string, balances: TokenBalance[]): void => {
        set((state) => ({
          networkBalances: {
            ...state.networkBalances,
            [chainId]: {
              ...state.networkBalances[chainId],
              [address]: {
                balances,
                lastUpdated: Date.now(),
                isUpdating: false,
              },
            },
          },
        }));
      },
      
      /**
       * Clear all cached balances
       */
      clearCache: (): void => {
        set({ networkBalances: {} });
      },
      
      /**
       * Calculate total portfolio value
       */
      getTotalPortfolioValue: (chainId: number, address: string, currency: 'USD' | 'NGN'): number => {
        const balances = get().getBalances(chainId, address);
        
        return balances.reduce((total, balance) => {
          return total + (currency === 'USD' ? balance.balanceUSD : balance.balanceNGN);
        }, 0);
      },
    }),
    {
      name: 'balance-store',
      storage: {
        getItem: async (name: string) => {
          try {
            const value = await AsyncStorage.getItem(name);
            if (!value) return null;
            
            // Custom deserialization to restore BigInt
            return JSON.parse(value, (key, val) => {
              // Restore balanceRaw as BigInt
              if (key === 'balanceRaw' && typeof val === 'string') {
                return BigInt(val);
              }
              return val;
            });
          } catch {
            return null;
          }
        },
        setItem: async (name: string, value: any) => {
          try {
            // Custom serialization to handle BigInt
            const serializedValue = JSON.stringify(value, (key, val) => {
              if (typeof val === 'bigint') {
                return val.toString();
              }
              return val;
            });
            await AsyncStorage.setItem(name, serializedValue);
          } catch (error) {
            console.error('Failed to persist balance store:', error);
          }
        },
        removeItem: async (name: string) => {
          try {
            await AsyncStorage.removeItem(name);
          } catch {
            // Ignore errors
          }
        },
      },
      // Only persist the balances, not loading states
      partialize: (state) => ({
        networkBalances: Object.fromEntries(
          Object.entries(state.networkBalances).map(([chainId, networkData]) => [
            chainId,
            Object.fromEntries(
              Object.entries(networkData).map(([address, data]) => [
                address,
                {
                  balances: data.balances,
                  lastUpdated: data.lastUpdated,
                  isUpdating: false, // Don't persist updating state
                },
              ])
            ),
          ])
        ),
      }),
    }
  )
);