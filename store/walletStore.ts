import { create } from 'zustand';
import {
  AppState,
  TokenBalance,
  Transaction,
  NetworkConfig,
  PriceData,
} from '@/types/wallet';
import WalletService from '@/services/WalletService';
import PriceService from '@/services/PriceService';
import SecureWalletStorage from '@/services/SecureWalletStorage';

interface WalletStore extends AppState {
  // Actions
  initialize: () => Promise<void>;
  createWallet: (mnemonic: string, passwordOrPin: string, isPin?: boolean) => Promise<void>;
  importWallet: (mnemonicOrKey: string, passwordOrPin: string, isPrivateKey?: boolean, isPin?: boolean) => Promise<void>;
  unlockWallet: (passwordOrPin: string, isPin?: boolean) => Promise<boolean>;
  lockWallet: () => void;
  deleteWallet: () => Promise<void>;
  
  // Smart Account actions
  initializeSmartAccount: (privateKey: string, chainId?: number) => Promise<void>;
  getSmartAccountInfo: () => { address: string | null; isDeployed: boolean };
  
  // Balance actions
  fetchBalances: () => Promise<void>;
  updatePrices: () => Promise<void>;
  calculateTotalBalance: () => void;
  
  // Transaction actions
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  
  // Network actions
  setActiveNetwork: (chainId: number) => void;
  toggleNetwork: (chainId: number, enabled: boolean) => void;
  
  // Preferences
  setCurrency: (currency: 'NGN' | 'USD') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setBiometric: (enabled: boolean) => Promise<void>;
  setAutoLockDuration: (duration: number) => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  // Initial state
  auth: {
    isAuthenticated: false,
    biometricEnabled: false,
    lastUnlockTime: 0,
    autoLockDuration: 5 * 60 * 1000, // 5 minutes
    hasWallet: false,
  },
  
  wallet: {
    address: null,
    mnemonic: null,
    privateKey: null,
    isLocked: true,
    networks: WalletService.DEFAULT_NETWORKS,
    activeNetwork: 1, // Ethereum mainnet
    smartAccountAddress: null,
    isSmartAccountDeployed: false,
  },
  
  balances: {
    tokens: [],
    totalNGN: 0,
    totalUSD: 0,
    lastUpdated: 0,
    loading: false,
  },
  
  transactions: [],
  
  prices: {
    rates: {},
    ngnUsdRate: 1600,
    lastUpdated: 0,
  },
  
  preferences: {
    currency: 'NGN',
    language: 'en',
    theme: 'light',
    notifications: true,
    defaultGasSpeed: 'normal',
  },

  // Initialize app state
  initialize: async () => {
    try {
      console.log('🔄 Starting wallet store initialization...');
      
      // Check if wallet exists
      const hasWallet = await SecureWalletStorage.hasWallet();
      console.log('📱 Has wallet:', hasWallet);
      
      const biometricEnabled = await SecureWalletStorage.isBiometricEnabled();
      console.log('👆 Biometric enabled:', biometricEnabled);
      
      const address = await SecureWalletStorage.getAddress();
      console.log('📍 Wallet address:', address || 'none');

      // Load smart account data
      const smartAccountAddress = await SecureWalletStorage.getSmartAccountAddress();
      const isSmartAccountDeployed = await SecureWalletStorage.isSmartAccountDeployed();
      console.log('🔧 Smart account address:', smartAccountAddress || 'none');
      console.log('✅ Smart account deployed:', isSmartAccountDeployed);

      set((state) => ({
        auth: {
          ...state.auth,
          hasWallet,
          biometricEnabled,
        },
        wallet: {
          ...state.wallet,
          address,
          isLocked: hasWallet,
          smartAccountAddress,
          isSmartAccountDeployed,
        },
      }));

      console.log('✅ Wallet store initialized successfully');

      // Fetch prices if wallet exists
      if (hasWallet) {
        console.log('💰 Fetching prices...');
        await get().updatePrices();
      }
    } catch (error) {
      console.error('❌ Failed to initialize wallet store:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      
      // Set default state even if initialization fails
      set((state) => ({
        auth: {
          ...state.auth,
          hasWallet: false,
          biometricEnabled: false,
        },
        wallet: {
          ...state.wallet,
          address: null,
          isLocked: false,
          smartAccountAddress: null,
          isSmartAccountDeployed: false,
        },
      }));
    }
  },

  // Create new wallet
  createWallet: async (mnemonic: string, passwordOrPin: string, isPin = false) => {
    try {
      const walletData = WalletService.createWalletFromMnemonic(mnemonic);

      // Store wallet data securely
      await SecureWalletStorage.storeMnemonic(mnemonic, passwordOrPin);
      await SecureWalletStorage.storePrivateKey(walletData.privateKey, passwordOrPin);
      await SecureWalletStorage.storeAddress(walletData.address);
      
      // Store authentication method
      if (isPin) {
        await SecureWalletStorage.storePasswordHash(passwordOrPin); // Store PIN hash
      } else {
        await SecureWalletStorage.storePasswordHash(passwordOrPin);
      }

      set((state) => ({
        auth: {
          ...state.auth,
          isAuthenticated: true,
          hasWallet: true,
          lastUnlockTime: Date.now(),
        },
        wallet: {
          ...state.wallet,
          address: walletData.address,
          isLocked: false,
        },
      }));

      // Create smart account automatically
      await get().initializeSmartAccount(walletData.privateKey);

      // Fetch initial balances
      await get().fetchBalances();
    } catch (error) {
      console.error('Failed to create wallet:', error);
      throw error;
    }
  },

  // Initialize smart account from EOA
  initializeSmartAccount: async (privateKey: string, chainId = 1) => {
    try {
      console.log('🔧 Initializing smart account...');
      
      const smartAccountData = await WalletService.createSmartAccountFromSigner(
        privateKey,
        chainId
      );

      set((state) => ({
        wallet: {
          ...state.wallet,
          smartAccountAddress: smartAccountData.smartAccountAddress,
          isSmartAccountDeployed: smartAccountData.isDeployed,
        },
      }));

      console.log('✅ Smart account initialized:', smartAccountData.smartAccountAddress);
    } catch (error) {
      console.error('❌ Failed to initialize smart account:', error);
      throw error;
    }
  },

  // Get smart account info
  getSmartAccountInfo: () => {
    const state = get();
    return {
      address: state.wallet.smartAccountAddress,
      isDeployed: state.wallet.isSmartAccountDeployed,
    };
  },

  // Import existing wallet
  importWallet: async (mnemonicOrKey: string, passwordOrPin: string, isPrivateKey = false, isPin = false) => {
    try {
      let walletData: { address: string; privateKey: string; mnemonic?: string };

      if (isPrivateKey) {
        walletData = WalletService.importWalletFromPrivateKey(mnemonicOrKey);
        await SecureWalletStorage.storePrivateKey(walletData.privateKey, passwordOrPin);
      } else {
        walletData = WalletService.createWalletFromMnemonic(mnemonicOrKey);
        await SecureWalletStorage.storeMnemonic(mnemonicOrKey, passwordOrPin);
        await SecureWalletStorage.storePrivateKey(walletData.privateKey, passwordOrPin);
      }

      await SecureWalletStorage.storeAddress(walletData.address);
      
      // Store authentication method
      if (isPin) {
        await SecureWalletStorage.storePasswordHash(passwordOrPin); // Store PIN hash
      } else {
        await SecureWalletStorage.storePasswordHash(passwordOrPin);
      }

      set((state) => ({
        auth: {
          ...state.auth,
          isAuthenticated: true,
          hasWallet: true,
          lastUnlockTime: Date.now(),
        },
        wallet: {
          ...state.wallet,
          address: walletData.address,
          isLocked: false,
        },
      }));

      // Create smart account automatically
      await get().initializeSmartAccount(walletData.privateKey);

      // Fetch initial balances
      await get().fetchBalances();
    } catch (error) {
      console.error('Failed to import wallet:', error);
      throw error;
    }
  },

  // Unlock wallet with password or PIN
  unlockWallet: async (passwordOrPin: string, isPin = false) => {
    try {
      const isValid = await SecureWalletStorage.verifyPassword(passwordOrPin);
      
      if (!isValid) {
        return false;
      }

      set((state) => ({
        auth: {
          ...state.auth,
          isAuthenticated: true,
          lastUnlockTime: Date.now(),
        },
        wallet: {
          ...state.wallet,
          isLocked: false,
        },
      }));

      // Fetch latest balances
      await get().fetchBalances();
      
      return true;
    } catch (error) {
      console.error('Failed to unlock wallet:', error);
      return false;
    }
  },

  // Lock wallet
  lockWallet: () => {
    set((state) => ({
      auth: {
        ...state.auth,
        isAuthenticated: false,
      },
      wallet: {
        ...state.wallet,
        isLocked: true,
      },
    }));
  },

  // Delete wallet (dangerous!)
  deleteWallet: async () => {
    try {
      await SecureWalletStorage.deleteWallet();
      
      // Reset to initial state
      set({
        auth: {
          isAuthenticated: false,
          biometricEnabled: false,
          lastUnlockTime: 0,
          autoLockDuration: 5 * 60 * 1000,
          hasWallet: false,
        },
        wallet: {
          address: null,
          mnemonic: null,
          privateKey: null,
          isLocked: true,
          networks: WalletService.DEFAULT_NETWORKS,
          activeNetwork: 1,
          smartAccountAddress: null,
          isSmartAccountDeployed: false,
        },
        balances: {
          tokens: [],
          totalNGN: 0,
          totalUSD: 0,
          lastUpdated: 0,
          loading: false,
        },
        transactions: [],
        prices: {
          rates: {},
          ngnUsdRate: 1600,
          lastUpdated: 0,
        },
        preferences: {
          currency: 'NGN',
          language: 'en',
          theme: 'light',
          notifications: true,
          defaultGasSpeed: 'normal',
        },
      });
    } catch (error) {
      console.error('Failed to delete wallet:', error);
      throw error;
    }
  },

  // Fetch token balances
  fetchBalances: async () => {
    const state = get();
    const { address } = state.wallet;
    
    if (!address) return;

    set((state) => ({
      balances: { ...state.balances, loading: true },
    }));

    try {
      // Fetch prices first
      await get().updatePrices();

      // Create prices map
      const pricesMap: { [symbol: string]: { usd: number; ngn: number } } = {};
      Object.entries(state.prices.rates).forEach(([symbol, data]) => {
        pricesMap[symbol] = { usd: data.usd, ngn: data.ngn };
      });

      // Fetch balances across all networks
      const balances = await WalletService.fetchAllBalances(
        address,
        state.wallet.networks,
        pricesMap
      );

      set((state) => ({
        balances: {
          ...state.balances,
          tokens: balances,
          loading: false,
          lastUpdated: Date.now(),
        },
      }));

      // Calculate total balance
      get().calculateTotalBalance();
    } catch (error) {
      console.error('Failed to fetch balances:', error);
      set((state) => ({
        balances: { ...state.balances, loading: false },
      }));
    }
  },

  // Update cryptocurrency prices
  updatePrices: async () => {
    try {
      const symbols = ['ETH', 'BTC', 'BNB', 'USDT', 'USDC', 'MATIC'];
      const prices = await PriceService.fetchMultiplePrices(symbols);
      const ngnRate = await PriceService.fetchNGNRate();

      const rates: { [symbol: string]: PriceData } = {};
      Object.entries(prices).forEach(([symbol, data]) => {
        rates[symbol] = data;
      });

      set((state) => ({
        prices: {
          rates,
          ngnUsdRate: ngnRate,
          lastUpdated: Date.now(),
        },
      }));
    } catch (error) {
      console.error('Failed to update prices:', error);
    }
  },

  // Calculate total portfolio balance
  calculateTotalBalance: () => {
    const state = get();
    let totalNGN = 0;
    let totalUSD = 0;

    state.balances.tokens.forEach((token) => {
      const balance = parseFloat(token.balance);
      totalNGN += balance * token.priceNgn;
      totalUSD += balance * token.priceUsd;
    });

    set((state) => ({
      balances: {
        ...state.balances,
        totalNGN,
        totalUSD,
      },
    }));
  },

  // Add transaction to history
  addTransaction: (transaction: Transaction) => {
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    }));
  },

  // Update existing transaction
  updateTransaction: (id: string, updates: Partial<Transaction>) => {
    set((state) => ({
      transactions: state.transactions.map((tx) =>
        tx.id === id ? { ...tx, ...updates } : tx
      ),
    }));
  },

  // Set active network
  setActiveNetwork: (chainId: number) => {
    set((state) => ({
      wallet: {
        ...state.wallet,
        activeNetwork: chainId,
      },
    }));
  },

  // Toggle network enabled/disabled
  toggleNetwork: (chainId: number, enabled: boolean) => {
    set((state) => ({
      wallet: {
        ...state.wallet,
        networks: state.wallet.networks.map((network) =>
          network.chainId === chainId ? { ...network, enabled } : network
        ),
      },
    }));
  },

  // Set display currency
  setCurrency: (currency: 'NGN' | 'USD') => {
    set((state) => ({
      preferences: {
        ...state.preferences,
        currency,
      },
    }));
  },

  // Set theme
  setTheme: (theme: 'light' | 'dark') => {
    set((state) => ({
      preferences: {
        ...state.preferences,
        theme,
      },
    }));
  },

  // Enable/disable biometric authentication
  setBiometric: async (enabled: boolean) => {
    try {
      await SecureWalletStorage.setBiometricEnabled(enabled);
      set((state) => ({
        auth: {
          ...state.auth,
          biometricEnabled: enabled,
        },
      }));
    } catch (error) {
      console.error('Failed to set biometric:', error);
      throw error;
    }
  },

  // Set auto-lock duration
  setAutoLockDuration: (duration: number) => {
    set((state) => ({
      auth: {
        ...state.auth,
        autoLockDuration: duration,
      },
    }));
  },
}));
