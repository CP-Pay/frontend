/**
 * Token and Network Configuration
 * Defines default tokens and supported networks for CPPay
 */

export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  logoUrl: string;
  isNative: boolean;
  addresses: {
    [chainId: number]: string;
  };
}

export interface Network {
  chainId: number;
  name: string;
  shortName: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    symbol: string;
    name: string;
    decimals: number;
  };
  isTestnet: boolean;
  isCustom: boolean;
  logoUrl?: string;
}

// Default Networks
export const DEFAULT_NETWORKS: Network[] = [
  // Mainnets
  {
    chainId: 1,
    name: 'Ethereum Mainnet',
    shortName: 'Ethereum',
    rpcUrl: 'https://eth.llamarpc.com',
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
    isTestnet: false,
    isCustom: false,
    logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  },
  {
    chainId: 56,
    name: 'BNB Smart Chain',
    shortName: 'BSC',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorer: 'https://bscscan.com',
    nativeCurrency: { symbol: 'BNB', name: 'BNB', decimals: 18 },
    isTestnet: false,
    isCustom: false,
    logoUrl: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
  },
  {
    chainId: 137,
    name: 'Polygon',
    shortName: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: { symbol: 'MATIC', name: 'Polygon', decimals: 18 },
    isTestnet: false,
    isCustom: false,
    logoUrl: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
  },
  {
    chainId: 1135,
    name: 'Lisk',
    shortName: 'Lisk',
    rpcUrl: 'https://rpc.api.lisk.com',
    blockExplorer: 'https://blockscout.lisk.com',
    nativeCurrency: { symbol: 'LSK', name: 'Lisk', decimals: 18 },
    isTestnet: false,
    isCustom: false,
    logoUrl: 'https://assets.coingecko.com/coins/images/385/small/Lisk_Symbol.png',
  },
  
  // Testnets
  {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    shortName: 'Sepolia',
    rpcUrl: 'https://rpc.sepolia.org',
    blockExplorer: 'https://sepolia.etherscan.io',
    nativeCurrency: { symbol: 'ETH', name: 'Sepolia Ether', decimals: 18 },
    isTestnet: true,
    isCustom: false,
    logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  },
  {
    chainId: 97,
    name: 'BNB Testnet',
    shortName: 'BSC Testnet',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    blockExplorer: 'https://testnet.bscscan.com',
    nativeCurrency: { symbol: 'tBNB', name: 'Test BNB', decimals: 18 },
    isTestnet: true,
    isCustom: false,
    logoUrl: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
  },
  {
    chainId: 80002,
    name: 'Polygon Amoy Testnet',
    shortName: 'Amoy',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    blockExplorer: 'https://amoy.polygonscan.com',
    nativeCurrency: { symbol: 'MATIC', name: 'Polygon', decimals: 18 },
    isTestnet: true,
    isCustom: false,
    logoUrl: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
  },
  {
    chainId: 4202,
    name: 'Lisk Sepolia Testnet',
    shortName: 'Lisk Sepolia',
    rpcUrl: 'https://rpc.sepolia-api.lisk.com',
    blockExplorer: 'https://sepolia-blockscout.lisk.com',
    nativeCurrency: { symbol: 'LSK', name: 'Lisk', decimals: 18 },
    isTestnet: true,
    isCustom: false,
    logoUrl: 'https://assets.coingecko.com/coins/images/385/small/Lisk_Symbol.png',
  },
];

// Default Tokens - 6 Essential Tokens (cNGN, ETH, BNB, USDT, USDC, LSK)
export const DEFAULT_TOKENS: Token[] = [
  // cNGN - Nigerian Stablecoin (Default)
  {
    symbol: 'cNGN',
    name: 'cNGN Stablecoin',
    decimals: 18,
    logoUrl: 'https://assets.coingecko.com/coins/images/31968/small/cNGN_logo.png',
    isNative: false,
    addresses: {
      1: '0x3f5594C191F78BfFd6E5AeC3EF8b99e10E2E5A9C', // Ethereum
      56: '0x3f5594C191F78BfFd6E5AeC3EF8b99e10E2E5A9C', // BSC
      137: '0x3f5594C191F78BfFd6E5AeC3EF8b99e10E2E5A9C', // Polygon
      1135: '0x3f5594C191F78BfFd6E5AeC3EF8b99e10E2E5A9C', // Lisk
      11155111: '0x3f5594C191F78BfFd6E5AeC3EF8b99e10E2E5A9C', // Sepolia
      97: '0x3f5594C191F78BfFd6E5AeC3EF8b99e10E2E5A9C', // BSC Testnet
      80002: '0x3f5594C191F78BfFd6E5AeC3EF8b99e10E2E5A9C', // Polygon Amoy
      4202: '0x3f5594C191F78BfFd6E5AeC3EF8b99e10E2E5A9C', // Lisk Testnet
    },
  },
  
  // Native Tokens
  {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    isNative: true,
    addresses: {
      1: '0x0000000000000000000000000000000000000000', // Ethereum Mainnet
      11155111: '0x0000000000000000000000000000000000000000', // Sepolia Testnet
    },
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    decimals: 18,
    logoUrl: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    isNative: true,
    addresses: {
      56: '0x0000000000000000000000000000000000000000', // BSC Mainnet
      97: '0x0000000000000000000000000000000000000000', // BSC Testnet
    },
  },
  {
    symbol: 'LSK',
    name: 'Lisk',
    decimals: 18,
    logoUrl: 'https://assets.coingecko.com/coins/images/385/small/Lisk_Symbol.png',
    isNative: true,
    addresses: {
      1135: '0x0000000000000000000000000000000000000000', // Lisk Mainnet
      4202: '0x0000000000000000000000000000000000000000', // Lisk Testnet
    },
  },
  
  // Stablecoins
  {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    isNative: false,
    addresses: {
      1: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // Ethereum
      56: '0x55d398326f99059fF775485246999027B3197955', // BSC
      137: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // Polygon
      1135: '0x55d398326f99059fF775485246999027B3197955', // Lisk (example)
      11155111: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06', // Sepolia
      97: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd', // BSC Testnet
      80002: '0x3813e82e6f7098b9583FC0F33a962D02018B6803', // Polygon Amoy
      4202: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06', // Lisk Testnet
    },
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoUrl: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    isNative: false,
    addresses: {
      1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // Ethereum
      56: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', // BSC
      137: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', // Polygon
      1135: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', // Lisk (example)
      11155111: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Sepolia
      97: '0x64544969ed7EBf5f083679233325356EbE738930', // BSC Testnet
      80002: '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582', // Polygon Amoy
      4202: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Lisk Testnet
    },
  },
];

/**
 * Get tokens available on a specific network
 */
export function getTokensForNetwork(chainId: number): Token[] {
  return DEFAULT_TOKENS.filter(token => 
    token.addresses[chainId] !== undefined
  );
}

/**
 * Get native token for a network
 */
export function getNativeToken(chainId: number): Token | undefined {
  return DEFAULT_TOKENS.find(token => 
    token.isNative && token.addresses[chainId] !== undefined
  );
}

/**
 * Get network by chain ID
 */
export function getNetworkByChainId(chainId: number): Network | undefined {
  return DEFAULT_NETWORKS.find(network => network.chainId === chainId);
}

/**
 * Get all mainnet networks
 */
export function getMainnetNetworks(): Network[] {
  return DEFAULT_NETWORKS.filter(network => !network.isTestnet && !network.isCustom);
}

/**
 * Get all testnet networks
 */
export function getTestnetNetworks(): Network[] {
  return DEFAULT_NETWORKS.filter(network => network.isTestnet && !network.isCustom);
}
