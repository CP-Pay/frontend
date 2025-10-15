/**
 * Token Balance Service
 * Handles fetching token balances for the smart wallet
 */

import { createPublicClient, http, formatUnits, parseUnits } from 'viem';
import { mainnet, bsc, polygon } from 'viem/chains';
import type { Chain, Address } from 'viem';
import { Token, getTokensForNetwork, getNativeToken } from '@/constants/Tokens';

export interface TokenBalance {
  token: Token;
  balance: string; // Formatted balance (e.g., "1.5")
  balanceRaw: bigint; // Raw balance in wei
  balanceUSD: number;
  balanceNGN: number;
}

const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
] as const;

/**
 * Get chain configuration for viem
 */
function getChain(chainId: number): Chain {
  switch (chainId) {
    case 1:
      return mainnet;
    case 56:
      return bsc;
    case 137:
      return polygon;
    default:
      return mainnet;
  }
}

/**
 * Fetch all token balances for an address on a specific network
 */
export async function fetchTokenBalances(
  address: string,
  chainId: number,
  rpcUrl?: string
): Promise<TokenBalance[]> {
  const chain = getChain(chainId);
  const publicClient = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });

  const tokens = getTokensForNetwork(chainId);
  const balances: TokenBalance[] = [];

  for (const token of tokens) {
    try {
      const balance = await fetchTokenBalance(
        address,
        token,
        chainId,
        publicClient
      );
      balances.push(balance);
    } catch (error) {
      console.error(`Error fetching balance for ${token.symbol}:`, error);
      // Add zero balance on error
      balances.push({
        token,
        balance: '0',
        balanceRaw: 0n,
        balanceUSD: 0,
        balanceNGN: 0,
      });
    }
  }

  return balances;
}

/**
 * Fetch balance for a single token
 */
export async function fetchTokenBalance(
  address: string,
  token: Token,
  chainId: number,
  publicClient: any
): Promise<TokenBalance> {
  const tokenAddress = token.addresses[chainId];
  let balanceRaw: bigint;

  if (
    token.isNative ||
    tokenAddress === '0x0000000000000000000000000000000000000000'
  ) {
    // Native token (ETH, BNB, MATIC, etc.)
    balanceRaw = await publicClient.getBalance({
      address: address as Address,
    });
  } else {
    // ERC-20 token
    balanceRaw = await publicClient.readContract({
      address: tokenAddress as Address,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address as Address],
    });
  }

  const balance = formatUnits(balanceRaw, token.decimals);

  // Fetch prices (mock for now)
  const priceUSD = getTokenPriceUSD(token.symbol);
  const ngnRate = 450; // 1 USD = 450 NGN

  const balanceValue = parseFloat(balance);
  const balanceUSD = balanceValue * priceUSD;
  const balanceNGN = balanceUSD * ngnRate;

  return {
    token,
    balance,
    balanceRaw,
    balanceUSD,
    balanceNGN,
  };
}

/**
 * Get token price in USD (mock implementation)
 * TODO: Integrate with CoinGecko or another price API
 */
function getTokenPriceUSD(symbol: string): number {
  const mockPrices: { [key: string]: number } = {
    ETH: 2187,
    BNB: 235,
    MATIC: 0.85,
    LSK: 0.95,
    USDT: 1,
    USDC: 1,
    DAI: 1,
  };
  return mockPrices[symbol] || 0;
}

/**
 * Format balance for display
 */
export function formatBalance(balance: string, decimals: number = 4): string {
  const num = parseFloat(balance);
  if (num === 0) return '0';
  if (num < 0.0001) return '< 0.0001';
  if (num < 1) return num.toFixed(decimals);
  if (num < 1000) return num.toFixed(2);
  if (num < 1000000) return (num / 1000).toFixed(2) + 'K';
  return (num / 1000000).toFixed(2) + 'M';
}

/**
 * Format currency (NGN or USD)
 */
export function formatCurrency(
  amount: number,
  currency: 'NGN' | 'USD' = 'NGN'
): string {
  if (currency === 'NGN') {
    return `₦${amount.toLocaleString('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
