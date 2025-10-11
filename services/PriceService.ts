import axios from 'axios';
import { PriceData } from '@/types/wallet';

/**
 * PriceService - Handles cryptocurrency price fetching and conversion
 * Uses CoinGecko API for real-time pricing
 */
class PriceService {
  private static readonly COINGECKO_API = 'https://api.coingecko.com/api/v3';
  private static readonly CACHE_DURATION = 60000; // 1 minute
  private static priceCache: Map<string, { data: PriceData; timestamp: number }> = new Map();

  // Symbol to CoinGecko ID mapping
  private static readonly SYMBOL_TO_ID: { [key: string]: string } = {
    'ETH': 'ethereum',
    'BTC': 'bitcoin',
    'BNB': 'binancecoin',
    'USDT': 'tether',
    'USDC': 'usd-coin',
    'DAI': 'dai',
    'MATIC': 'matic-network',
    'AVAX': 'avalanche-2',
    'ARB': 'arbitrum',
    'OP': 'optimism',
  };

  /**
   * Convert symbol to CoinGecko ID
   */
  private static symbolToId(symbol: string): string {
    return this.SYMBOL_TO_ID[symbol.toUpperCase()] || symbol.toLowerCase();
  }

  /**
   * Fetch token price in USD and NGN
   */
  static async fetchTokenPrice(symbol: string): Promise<PriceData> {
    const cacheKey = symbol.toUpperCase();
    const cached = this.priceCache.get(cacheKey);

    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const id = this.symbolToId(symbol);
      const response = await axios.get(`${this.COINGECKO_API}/simple/price`, {
        params: {
          ids: id,
          vs_currencies: 'usd,ngn',
          include_24hr_change: 'true',
        },
      });

      const data = response.data[id];
      if (!data) {
        throw new Error(`Price data not found for ${symbol}`);
      }

      const priceData: PriceData = {
        usd: data.usd || 0,
        ngn: data.ngn || 0,
        change24h: data.usd_24h_change || 0,
        lastUpdated: Date.now(),
      };

      // Cache the result
      this.priceCache.set(cacheKey, { data: priceData, timestamp: Date.now() });

      return priceData;
    } catch (error) {
      console.error(`Failed to fetch price for ${symbol}:`, error);
      
      // Return cached data if available, even if expired
      if (cached) {
        return cached.data;
      }

      // Return zero prices as fallback
      return {
        usd: 0,
        ngn: 0,
        change24h: 0,
        lastUpdated: Date.now(),
      };
    }
  }

  /**
   * Fetch multiple token prices at once
   */
  static async fetchMultiplePrices(
    symbols: string[]
  ): Promise<{ [symbol: string]: PriceData }> {
    const prices: { [symbol: string]: PriceData } = {};

    try {
      const ids = symbols.map(s => this.symbolToId(s)).join(',');
      const response = await axios.get(`${this.COINGECKO_API}/simple/price`, {
        params: {
          ids: ids,
          vs_currencies: 'usd,ngn',
          include_24hr_change: 'true',
        },
      });

      for (const symbol of symbols) {
        const id = this.symbolToId(symbol);
        const data = response.data[id];

        if (data) {
          const priceData: PriceData = {
            usd: data.usd || 0,
            ngn: data.ngn || 0,
            change24h: data.usd_24h_change || 0,
            lastUpdated: Date.now(),
          };

          prices[symbol.toUpperCase()] = priceData;
          this.priceCache.set(symbol.toUpperCase(), { 
            data: priceData, 
            timestamp: Date.now() 
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch multiple prices:', error);
    }

    return prices;
  }

  /**
   * Fetch NGN/USD exchange rate
   */
  static async fetchNGNRate(): Promise<number> {
    try {
      // Using a backup free API for exchange rates
      const response = await axios.get(
        'https://api.exchangerate-api.com/v4/latest/USD'
      );
      return response.data.rates.NGN || 1600; // Fallback to ~1600 NGN/USD
    } catch (error) {
      console.error('Failed to fetch NGN rate:', error);
      return 1600; // Fallback rate
    }
  }

  /**
   * Convert USD to NGN
   */
  static async convertUSDToNGN(usdAmount: number): Promise<number> {
    const rate = await this.fetchNGNRate();
    return usdAmount * rate;
  }

  /**
   * Convert NGN to USD
   */
  static async convertNGNToUSD(ngnAmount: number): Promise<number> {
    const rate = await this.fetchNGNRate();
    return ngnAmount / rate;
  }

  /**
   * Calculate crypto amount needed for NGN target
   */
  static async calculateCryptoNeeded(
    ngnAmount: number,
    cryptoSymbol: string,
    includeBuffer: boolean = true
  ): Promise<number> {
    try {
      const priceData = await this.fetchTokenPrice(cryptoSymbol);
      
      if (priceData.ngn === 0) {
        throw new Error('Price not available');
      }

      // Calculate base amount
      let cryptoAmount = ngnAmount / priceData.ngn;

      // Add 2% buffer for price slippage and fees if requested
      if (includeBuffer) {
        cryptoAmount *= 1.02;
      }

      return cryptoAmount;
    } catch (error) {
      console.error('Failed to calculate crypto needed:', error);
      throw error;
    }
  }

  /**
   * Calculate NGN equivalent of crypto amount
   */
  static async calculateNGNEquivalent(
    cryptoAmount: number,
    cryptoSymbol: string
  ): Promise<number> {
    try {
      const priceData = await this.fetchTokenPrice(cryptoSymbol);
      return cryptoAmount * priceData.ngn;
    } catch (error) {
      console.error('Failed to calculate NGN equivalent:', error);
      return 0;
    }
  }

  /**
   * Start real-time price updates
   */
  static startPriceUpdates(
    symbols: string[],
    callback: (prices: { [symbol: string]: PriceData }) => void
  ): () => void {
    const updatePrices = async () => {
      const prices = await this.fetchMultiplePrices(symbols);
      callback(prices);
    };

    // Initial fetch
    updatePrices();

    // Set up interval
    const interval = setInterval(updatePrices, this.CACHE_DURATION);

    // Return cleanup function
    return () => clearInterval(interval);
  }

  /**
   * Clear price cache
   */
  static clearCache(): void {
    this.priceCache.clear();
  }

  /**
   * Get cached price if available
   */
  static getCachedPrice(symbol: string): PriceData | null {
    const cached = this.priceCache.get(symbol.toUpperCase());
    return cached ? cached.data : null;
  }
}

export default PriceService;
