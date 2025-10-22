/**
 * Frontend Paystack Service
 * Direct integration with Paystack API for bank verification and operations
 * 
 * This service handles Paystack operations directly in the frontend to provide
 * better user experience for crypto-to-naira transactions
 */

import axios, { AxiosInstance } from 'axios';

// Paystack API Configuration
const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const PAYSTACK_SECRET_KEY = process.env.EXPO_PUBLIC_PAYSTACK_SECRET_KEY || 'sk_test_your_secret_key_here';

export interface NigerianBank {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode?: string;
  gateway?: string;
  pay_with_bank?: boolean;
  active: boolean;
  country: string;
  currency: string;
  type: string;
  is_deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AccountVerificationResult {
  account_number: string;
  account_name: string;
  bank_id: number;
  bank_name?: string;
}

export interface TransferRecipient {
  active: boolean;
  createdAt: string;
  currency: string;
  domain: string;
  id: number;
  integration: number;
  name: string;
  recipient_code: string;
  type: string;
  updatedAt: string;
  is_deleted: boolean;
  details: {
    authorization_code?: string;
    account_number: string;
    account_name?: string;
    bank_code: string;
    bank_name: string;
  };
}

export interface TransferInitiation {
  reference: string;
  integration: number;
  domain: string;
  amount: number;
  currency: string;
  source: string;
  reason: string;
  recipient: number;
  status: string;
  transfer_code: string;
  id: number;
  createdAt: string;
  updatedAt: string;
}

class PaystackService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: PAYSTACK_BASE_URL,
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Add request logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🏦 Paystack API: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response logging
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ Paystack Response: ${response.status} - ${response.data?.message || 'Success'}`);
        return response;
      },
      (error) => {
        console.error(`❌ Paystack Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get list of Nigerian banks
   * @returns Promise<NigerianBank[]>
   */
  async getBanks(): Promise<NigerianBank[]> {
    try {
      const response = await this.client.get('/bank', {
        params: {
          country: 'nigeria',
          use_cursor: false,
          perPage: 100,
        }
      });

      if (response.data.status && response.data.data) {
        return response.data.data
          .filter((bank: NigerianBank) => bank.active && bank.country === 'NG')
          .sort((a: NigerianBank, b: NigerianBank) => a.name.localeCompare(b.name));
      }

      throw new Error('Failed to fetch banks from Paystack');
    } catch (error: any) {
      console.error('Failed to fetch banks:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch banks');
    }
  }

  /**
   * Verify bank account number
   * @param accountNumber - Bank account number
   * @param bankCode - Bank code from getBanks()
   * @returns Promise<AccountVerificationResult>
   */
  async verifyBankAccount(
    accountNumber: string, 
    bankCode: string
  ): Promise<AccountVerificationResult> {
    try {
      if (!accountNumber || accountNumber.length !== 10) {
        throw new Error('Account number must be exactly 10 digits');
      }

      if (!bankCode) {
        throw new Error('Bank code is required');
      }

      const response = await this.client.get('/bank/resolve', {
        params: {
          account_number: accountNumber,
          bank_code: bankCode,
        }
      });

      if (response.data.status && response.data.data) {
        const data = response.data.data;
        return {
          account_number: data.account_number,
          account_name: data.account_name,
          bank_id: data.bank_id,
          bank_name: data.bank_name,
        };
      }

      throw new Error(response.data.message || 'Account verification failed');
    } catch (error: any) {
      console.error('Bank account verification failed:', error);
      
      if (error.response?.status === 422) {
        throw new Error('Invalid account number or bank code');
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to verify bank account'
      );
    }
  }

  /**
   * Create transfer recipient for future transfers
   * @param accountNumber - Bank account number  
   * @param bankCode - Bank code
   * @param accountName - Account holder name (optional)
   * @returns Promise<TransferRecipient>
   */
  async createTransferRecipient(
    accountNumber: string,
    bankCode: string,
    accountName?: string
  ): Promise<TransferRecipient> {
    try {
      // First verify the account to get account name if not provided
      if (!accountName) {
        const verification = await this.verifyBankAccount(accountNumber, bankCode);
        accountName = verification.account_name;
      }

      const response = await this.client.post('/transferrecipient', {
        type: 'nuban',
        name: accountName,
        account_number: accountNumber,
        bank_code: bankCode,
        currency: 'NGN',
      });

      if (response.data.status && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to create transfer recipient');
    } catch (error: any) {
      console.error('Failed to create transfer recipient:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to create transfer recipient'
      );
    }
  }

  /**
   * Initiate bank transfer
   * @param recipientCode - Recipient code from createTransferRecipient
   * @param amount - Amount in naira (will be converted to kobo)
   * @param reason - Transfer reason/memo
   * @param reference - Unique reference for the transfer
   * @returns Promise<TransferInitiation>
   */
  async initiateTransfer(
    recipientCode: string,
    amount: number,
    reason: string,
    reference: string
  ): Promise<TransferInitiation> {
    try {
      const amountInKobo = Math.round(amount * 100);

      const response = await this.client.post('/transfer', {
        source: 'balance',
        amount: amountInKobo,
        recipient: recipientCode,
        reason: reason,
        currency: 'NGN',
        reference: reference,
      });

      if (response.data.status && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to initiate transfer');
    } catch (error: any) {
      console.error('Failed to initiate transfer:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to initiate transfer'
      );
    }
  }

  /**
   * Verify transfer status
   * @param reference - Transfer reference
   * @returns Promise<any>
   */
  async verifyTransfer(reference: string): Promise<any> {
    try {
      const response = await this.client.get(`/transfer/verify/${reference}`);

      if (response.data.status) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Transfer verification failed');
    } catch (error: any) {
      console.error('Failed to verify transfer:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to verify transfer'
      );
    }
  }

  /**
   * Get transfer fees
   * @param amount - Amount in naira
   * @returns Promise<{ fee: number, currency: string }>
   */
  async getTransferFees(amount: number): Promise<{ fee: number, currency: string }> {
    try {
      const amountInKobo = Math.round(amount * 100);
      
      const response = await this.client.get('/transfer/check_balance');
      
      // Paystack typically has a flat fee structure
      // For now, we'll calculate a reasonable fee
      let fee = 0;
      
      if (amount <= 5000) {
        fee = 10; // ₦10 for amounts up to ₦5,000
      } else if (amount <= 50000) {
        fee = 25; // ₦25 for amounts up to ₦50,000
      } else {
        fee = 50; // ₦50 for amounts above ₦50,000
      }

      return {
        fee: fee,
        currency: 'NGN'
      };
    } catch (error: any) {
      console.error('Failed to get transfer fees:', error);
      // Return default fee structure if API call fails
      return {
        fee: amount > 5000 ? 25 : 10,
        currency: 'NGN'
      };
    }
  }

  /**
   * Generate a unique reference for transfers
   * @param prefix - Optional prefix for the reference
   * @returns string
   */
  generateReference(prefix: string = 'CPPAY'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Validate configuration
   * @returns boolean
   */
  isConfigured(): boolean {
    return !!PAYSTACK_SECRET_KEY && PAYSTACK_SECRET_KEY !== 'sk_test_your_secret_key_here';
  }

  /**
   * Get Paystack configuration info (for debugging)
   * @returns object
   */
  getConfigInfo() {
    return {
      hasSecretKey: !!PAYSTACK_SECRET_KEY,
      isTestMode: PAYSTACK_SECRET_KEY?.startsWith('sk_test_'),
      baseUrl: PAYSTACK_BASE_URL,
    };
  }
}

// Export singleton instance
const paystackService = new PaystackService();
export default paystackService;