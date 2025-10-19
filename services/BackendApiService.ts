/**
 * Backend API Service
 * Connects React Native frontend to Django/FastAPI backend
 * 
 * Handles:
 * - Authentication (JWT)
 * - Blockchain operations
 * - Payment processing
 * - KYC verification
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

// Base URL from environment
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8000';
const API_PREFIX = '/api/v1';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class BackendApiService {
  private static client: AxiosInstance;
  private static accessToken: string | null = null;

  /**
   * Initialize API client
   */
  static initialize() {
    this.client = axios.create({
      baseURL: `${BACKEND_URL}${API_PREFIX}`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor (add auth token)
    this.client.interceptors.request.use(
      async (config) => {
        if (!this.accessToken) {
          this.accessToken = await SecureStore.getItemAsync('access_token');
        }
        
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        
        console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor (handle errors)
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.config.url} - ${response.status}`);
        return response;
      },
      async (error: AxiosError) => {
        console.error(`❌ API Error: ${error.config?.url} - ${error.response?.status}`);
        
        // Handle 401 Unauthorized (refresh token or logout)
        if (error.response?.status === 401) {
          await this.handleUnauthorized();
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Handle unauthorized access
   */
  private static async handleUnauthorized() {
    console.log('🔒 Unauthorized, clearing tokens...');
    this.accessToken = null;
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
    // TODO: Redirect to login screen
  }

  /**
   * Set authentication tokens
   */
  static async setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    await SecureStore.setItemAsync('access_token', accessToken);
    await SecureStore.setItemAsync('refresh_token', refreshToken);
    console.log('🔑 Tokens saved');
  }

  /**
   * Generic GET request
   */
  static async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(endpoint, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generic POST request
   */
  static async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generic PUT request
   */
  static async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.put<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generic DELETE request
   */
  static async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<T>(endpoint, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private static handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || 
                     error.response?.data?.message || 
                     error.message;
      return new Error(message);
    }
    return error as Error;
  }

  // ============================================================================
  // BLOCKCHAIN API ENDPOINTS
  // ============================================================================

  /**
   * Create smart account
   */
  static async createSmartAccount(ownerAddress: string) {
    return this.post('/blockchain/accounts/create', {
      owner_address: ownerAddress,
    });
  }

  /**
   * Get smart account details
   */
  static async getSmartAccount(address: string) {
    return this.get(`/blockchain/accounts/${address}`);
  }

  /**
   * Check gas sponsorship eligibility
   */
  static async checkGasSponsorship(data: {
    user_address: string;
    transaction_type: string;
    estimated_gas: number;
  }) {
    return this.post('/blockchain/sponsor/check', data);
  }

  /**
   * Submit sponsored transaction
   */
  static async submitSponsoredTransaction(data: {
    user_operation: any;
    user_address: string;
    transaction_type: string;
  }) {
    return this.post('/blockchain/sponsor/submit', data);
  }

  /**
   * Send blockchain transaction
   */
  static async sendTransaction(data: {
    from_address: string;
    to_address: string;
    token_address?: string;
    amount: string;
    network: string;
    data?: string;
  }) {
    return this.post('/blockchain/transactions/send', data);
  }

  /**
   * Get transaction status
   */
  static async getTransactionStatus(txHash: string) {
    return this.get(`/blockchain/transactions/${txHash}`);
  }

  /**
   * Get portfolio value
   */
  static async getPortfolio(address: string) {
    return this.get(`/blockchain/portfolio/${address}`);
  }

  // ============================================================================
  // PAYMENT API ENDPOINTS
  // ============================================================================

  /**
   * Get token price
   */
  static async getTokenPrice(data: {
    symbol: string;
    currency?: string;
  }) {
  return this.post('/payments/prices/token', data);
  }

  /**
   * Get batch token prices
   */
  static async getBatchPrices(symbols: string[]) {
  return this.post('/payments/prices/batch', { symbols });
  }

  /**
   * Get swap quote
   */
  static async getSwapQuote(data: {
    from_token: string;
    to_token: string;
    amount: string;
    network: string;
  }) {
  return this.post('/payments/swap/quote', data);
  }

  /**
   * Get best swap quote across DEXes
   */
  static async getBestSwapQuote(data: {
    from_token: string;
    to_token: string;
    amount: string;
    network: string;
  }) {
  return this.post('/payments/swap/best-quote', data);
  }

  /**
   * Estimate payment cost
   */
  static async estimatePayment(data: {
    payment_type: string;
    amount_ngn: number;
    from_token: string;
    network: string;
  }) {
  return this.post('/payments/estimate', data);
  }

  /**
   * Buy airtime
   */
  static async buyAirtime(data: {
    phone_number: string;
    amount_ngn: number;
    network: 'MTN' | 'GLO' | 'AIRTEL' | '9MOBILE';
    from_token: string;
    blockchain_network: string;
    transaction_hash: string;
  }) {
  return this.post('/payments/airtime/purchase', data);
  }

  /**
   * Buy data bundle
   */
  static async buyData(data: {
    phone_number: string;
    amount_ngn: number;
    data_code: string;
    network: 'MTN' | 'GLO' | 'AIRTEL' | '9MOBILE';
    from_token: string;
    blockchain_network: string;
    transaction_hash: string;
  }) {
  return this.post('/payments/data/purchase', data);
  }

  /**
   * Pay electricity bill
   */
  static async payElectricity(data: {
    meter_number: string;
    amount_ngn: number;
    disco: string;
    meter_type: 'prepaid' | 'postpaid';
    from_token: string;
    blockchain_network: string;
    transaction_hash: string;
  }) {
    return this.post('/payments/bills/electricity', data);
  }

  /**
   * Pay cable TV subscription
   */
  static async payCableTV(data: {
    smartcard_number: string;
    amount_ngn: number;
    provider: 'DSTV' | 'GOTV' | 'STARTIMES';
    bouquet: string;
    from_token: string;
    blockchain_network: string;
    transaction_hash: string;
  }) {
    return this.post('/payments/bills/cable-tv', data);
  }

  /**
   * Bank transfer
   */
  static async bankTransfer(data: {
    account_number: string;
    bank_code: string;
    amount_ngn: number;
    narration?: string;
    from_token: string;
    blockchain_network: string;
    transaction_hash: string;
  }) {
  return this.post('/payments/bank/transfer', data);
  }

  /**
   * Validate a Nigerian bank account number via the backend
   */
  static async verifyBankAccount(accountNumber: string, bankCode: string) {
    return this.post('/payments/bank/validate', {
      account_number: accountNumber,
      bank_code: bankCode,
    });
  }

  /**
   * P2P transfer to another CPPay user
   */
  static async p2pTransfer(data: {
    recipient_address: string;
    amount_ngn: number;
    from_token: string;
    blockchain_network: string;
    transaction_hash: string;
    message?: string;
  }) {
  return this.post('/payments/p2p/send', data);
  }

  /**
   * Get payment status
   */
  static async getPaymentStatus(paymentId: string) {
    return this.get(`/payments/${paymentId}`);
  }

  /**
   * Get payment history
   */
  static async getPaymentHistory(params?: {
    skip?: number;
    limit?: number;
    status?: string;
  }) {
    return this.get('/payments/history', { params });
  }

  // ============================================================================
  // KYC API ENDPOINTS
  // ============================================================================

  /**
   * Start KYC verification
   */
  static async startKYCVerification(data: {
    tier: 1 | 2 | 3;
    country?: string;
  }) {
    return this.post('/kyc/start', data);
  }

  /**
   * Upload KYC document
   */
  static async uploadKYCDocument(data: FormData) {
    return this.post('/kyc/upload-documents', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Submit KYC for verification
   */
  static async submitKYC(data: {
    verification_id: number;
    full_name: string;
    date_of_birth: string;
    nationality: string;
    id_type: string;
    id_number: string;
    bvn?: string;
    address_line1?: string;
    city?: string;
    state?: string;
  }) {
    return this.post('/kyc/submit', data);
  }

  /**
   * Get KYC status
   */
  static async getKYCStatus(verificationId: number) {
    return this.get(`/kyc/status/${verificationId}`);
  }

  /**
   * Get my KYC status
   */
  static async getMyKYCStatus() {
    return this.get('/kyc/my-status');
  }

  /**
   * Get transaction limits
   */
  static async getTransactionLimits() {
    return this.get('/kyc/limits');
  }

  // ============================================================================
  // USER API ENDPOINTS
  // ============================================================================

  /**
   * Register user
   */
  static async register(data: {
    email: string;
    password: string;
    phone_number: string;
    wallet_address: string;
  }) {
    return this.post('/users/register', data);
  }

  /**
   * Login
   */
  static async login(data: {
    email: string;
    password: string;
  }) {
    const response = await this.post<{
      access_token: string;
      refresh_token: string;
      user: any;
    }>('/users/login', data);
    
    // Save tokens
    if (response.access_token) {
      await this.setTokens(response.access_token, response.refresh_token);
    }
    
    return response;
  }

  /**
   * Get user profile
   */
  static async getProfile() {
    return this.get('/users/profile');
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: any) {
    return this.put('/users/profile', data);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Health check
   */
  static async healthCheck() {
    try {
      const response = await this.get('/health');
      console.log('✅ Backend is healthy');
      return response;
    } catch (error) {
      console.error('❌ Backend health check failed:', error);
      throw error;
    }
  }

  /**
   * Get NGN/USD rate
   */
  static async getNGNRate() {
    return this.get('/payments/prices/ngn-rate');
  }
}

// Initialize on import
BackendApiService.initialize();

export default BackendApiService;
