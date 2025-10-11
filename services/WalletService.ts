import { ethers } from 'ethers';
import * as bip39 from 'bip39';
import { NetworkConfig, TokenBalance } from '@/types/wallet';
import SecureWalletStorage from './SecureWalletStorage';

/**
 * WalletService - Core cryptocurrency wallet functionality
 * Handles wallet creation, import, and blockchain interactions
 */
class WalletService {
  // Default networks configuration
  static readonly DEFAULT_NETWORKS: NetworkConfig[] = [
    {
      chainId: 1,
      name: 'Ethereum Mainnet',
      symbol: 'ETH',
      rpcUrl: 'https://eth.llamarpc.com',
      blockExplorer: 'https://etherscan.io',
      iconUrl: 'eth-icon.png',
      enabled: true,
    },
    {
      chainId: 56,
      name: 'BNB Smart Chain',
      symbol: 'BNB',
      rpcUrl: 'https://bsc-dataseed.binance.org',
      blockExplorer: 'https://bscscan.com',
      iconUrl: 'bnb-icon.png',
      enabled: true,
    },
    {
      chainId: 137,
      name: 'Polygon',
      symbol: 'MATIC',
      rpcUrl: 'https://polygon-rpc.com',
      blockExplorer: 'https://polygonscan.com',
      iconUrl: 'matic-icon.png',
      enabled: true,
    },
  ];

  /**
   * Generate new BIP39 mnemonic (12 words)
   */
  static generateMnemonic(): string {
    return bip39.generateMnemonic(128); // 128 bits = 12 words
  }

  /**
   * Validate BIP39 mnemonic
   */
  static validateMnemonic(mnemonic: string): boolean {
    return bip39.validateMnemonic(mnemonic);
  }

  /**
   * Create new wallet from mnemonic
   */
  static createWalletFromMnemonic(mnemonic: string): {
    address: string;
    privateKey: string;
    mnemonic: string;
  } {
    if (!this.validateMnemonic(mnemonic)) {
      throw new Error('Invalid mnemonic phrase');
    }

    const wallet = ethers.Wallet.fromMnemonic(mnemonic);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: mnemonic,
    };
  }

  /**
   * Import wallet from private key
   */
  static importWalletFromPrivateKey(privateKey: string): {
    address: string;
    privateKey: string;
  } {
    try {
      const wallet = new ethers.Wallet(privateKey);
      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
      };
    } catch (error) {
      throw new Error('Invalid private key');
    }
  }

  /**
   * Get provider for specific network
   */
  static getProvider(network: NetworkConfig): ethers.providers.JsonRpcProvider {
    return new ethers.providers.JsonRpcProvider(network.rpcUrl);
  }

  /**
   * Get wallet instance from stored credentials
   */
  static async getWallet(
    password: string,
    network: NetworkConfig
  ): Promise<ethers.Wallet | null> {
    try {
      const mnemonic = await SecureWalletStorage.getMnemonic(password);
      if (!mnemonic) {
        const privateKey = await SecureWalletStorage.getPrivateKey(password);
        if (!privateKey) return null;

        const provider = this.getProvider(network);
        return new ethers.Wallet(privateKey, provider);
      }

      const provider = this.getProvider(network);
      return ethers.Wallet.fromMnemonic(mnemonic).connect(provider);
    } catch (error) {
      console.error('Failed to get wallet:', error);
      return null;
    }
  }

  /**
   * Get native token balance (ETH, BNB, MATIC, etc.)
   */
  static async getNativeBalance(
    address: string,
    network: NetworkConfig
  ): Promise<string> {
    try {
      const provider = this.getProvider(network);
      const balance = await provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Failed to get native balance:', error);
      return '0';
    }
  }

  /**
   * Get ERC20 token balance
   */
  static async getTokenBalance(
    address: string,
    tokenAddress: string,
    decimals: number,
    network: NetworkConfig
  ): Promise<string> {
    try {
      const provider = this.getProvider(network);
      const tokenContract = new ethers.Contract(
        tokenAddress,
        [
          'function balanceOf(address owner) view returns (uint256)',
          'function decimals() view returns (uint8)',
        ],
        provider
      );

      const balance = await tokenContract.balanceOf(address);
      return ethers.utils.formatUnits(balance, decimals);
    } catch (error) {
      console.error('Failed to get token balance:', error);
      return '0';
    }
  }

  /**
   * Fetch all token balances for an address across multiple networks
   */
  static async fetchAllBalances(
    address: string,
    networks: NetworkConfig[],
    pricesMap: { [symbol: string]: { usd: number; ngn: number } }
  ): Promise<TokenBalance[]> {
    const balances: TokenBalance[] = [];

    for (const network of networks) {
      if (!network.enabled) continue;

      try {
        // Get native token balance
        const nativeBalance = await this.getNativeBalance(address, network);
        const nativePrice = pricesMap[network.symbol] || { usd: 0, ngn: 0 };

        balances.push({
          symbol: network.symbol,
          name: network.name,
          balance: nativeBalance,
          decimals: 18,
          chain: network.name,
          logoUrl: network.iconUrl,
          priceUsd: nativePrice.usd,
          priceNgn: nativePrice.ngn,
          chainId: network.chainId,
        });

        // TODO: Add support for fetching ERC20 token balances
        // This would require a token list or user-added tokens
      } catch (error) {
        console.error(`Failed to fetch balance for ${network.name}:`, error);
      }
    }

    return balances;
  }

  /**
   * Send native token (ETH, BNB, etc.)
   */
  static async sendNativeToken(
    wallet: ethers.Wallet,
    toAddress: string,
    amount: string,
    gasPrice?: ethers.BigNumber
  ): Promise<string> {
    try {
      const tx = await wallet.sendTransaction({
        to: toAddress,
        value: ethers.utils.parseEther(amount),
        gasPrice: gasPrice,
      });

      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw error;
    }
  }

  /**
   * Send ERC20 token
   */
  static async sendToken(
    wallet: ethers.Wallet,
    tokenAddress: string,
    toAddress: string,
    amount: string,
    decimals: number
  ): Promise<string> {
    try {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ['function transfer(address to, uint256 amount) returns (bool)'],
        wallet
      );

      const tx = await tokenContract.transfer(
        toAddress,
        ethers.utils.parseUnits(amount, decimals)
      );

      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Failed to send token:', error);
      throw error;
    }
  }

  /**
   * Estimate gas for transaction
   */
  static async estimateGas(
    wallet: ethers.Wallet,
    to: string,
    value: string
  ): Promise<ethers.BigNumber> {
    try {
      return await wallet.estimateGas({
        to: to,
        value: ethers.utils.parseEther(value),
      });
    } catch (error) {
      console.error('Failed to estimate gas:', error);
      throw error;
    }
  }

  /**
   * Get current gas prices (slow, normal, fast)
   */
  static async getGasPrices(network: NetworkConfig): Promise<{
    slow: ethers.BigNumber;
    normal: ethers.BigNumber;
    fast: ethers.BigNumber;
  }> {
    try {
      const provider = this.getProvider(network);
      const feeData = await provider.getFeeData();
      const baseGasPrice = feeData.gasPrice || ethers.BigNumber.from('20000000000'); // 20 Gwei fallback

      return {
        slow: baseGasPrice.mul(80).div(100), // 80% of base
        normal: baseGasPrice,
        fast: baseGasPrice.mul(120).div(100), // 120% of base
      };
    } catch (error) {
      console.error('Failed to get gas prices:', error);
      // Return fallback values
      return {
        slow: ethers.BigNumber.from('20000000000'), // 20 Gwei
        normal: ethers.BigNumber.from('25000000000'), // 25 Gwei
        fast: ethers.BigNumber.from('30000000000'), // 30 Gwei
      };
    }
  }

  /**
   * Resolve ENS name to address
   */
  static async resolveENS(ensName: string): Promise<string | null> {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        'https://eth.llamarpc.com'
      );
      return await provider.resolveName(ensName);
    } catch (error) {
      console.error('Failed to resolve ENS:', error);
      return null;
    }
  }

  /**
   * Validate Ethereum address
   */
  static isValidAddress(address: string): boolean {
    return ethers.utils.isAddress(address);
  }

  /**
   * Format address for display (0x1234...5678)
   */
  static formatAddress(address: string, chars: number = 4): string {
    if (!address) return '';
    return `${address.substring(0, chars + 2)}...${address.substring(
      address.length - chars
    )}`;
  }
}

export default WalletService;
