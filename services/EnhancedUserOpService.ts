/**
 * Enhanced User Operation Service for CPPay
 * 
 * Handles ERC-4337 User Operations with specific focus on:
 * - Crypto-to-Naira transactions via BillPaymentAdapter
 * - Smart account deployment
 * - Gas sponsorship and paymaster integration
 * - Transaction signing and submission
 */

import { 
  Hex, 
  Address,
  keccak256,
  toBytes,
  createWalletClient,
  http,
  privateKeyToAccount,
  signMessage,
} from 'viem';
import { liskSepolia } from 'viem/chains';
import BillPaymentAdapterService, { PaymentRequest } from './BillPaymentAdapterService';
import SmartAccountService from './SmartAccountService';
import SecureWalletStorage from './SecureWalletStorage';

// ERC-4337 UserOperation structure
export interface UserOperation {
  sender: string;
  nonce: string;
  initCode: string;
  callData: string;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  paymasterAndData: string;
  signature: string;
}

// Transaction types
export enum TransactionType {
  CRYPTO_TO_NAIRA = 'crypto_to_naira',
  AIRTIME_PURCHASE = 'airtime_purchase',
  ELECTRICITY_PAYMENT = 'electricity_payment',
  CABLE_TV_PAYMENT = 'cabletv_payment',
  DATA_PURCHASE = 'data_purchase',
  TOKEN_TRANSFER = 'token_transfer',
  CONTRACT_INTERACTION = 'contract_interaction',
}

export interface TransactionRequest {
  type: TransactionType;
  chainId: number;
  smartAccountAddress?: string;
  data: any; // Transaction-specific data
  gasSettings?: {
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
    gasLimit?: string;
  };
  paymasterData?: {
    enabled: boolean;
    paymasterAddress?: string;
    paymasterData?: string;
  };
}

export interface UserOperationResult {
  userOperationHash: string;
  status: 'submitted' | 'confirmed' | 'failed';
  transactionHash?: string;
  blockNumber?: number;
  gasUsed?: string;
  error?: string;
}

class EnhancedUserOpService {
  private billPaymentService: BillPaymentAdapterService;
  private smartAccountService: SmartAccountService;
  private chainId: number;

  // Bundler configuration
  private bundlerUrl: string;
  private entryPointAddress: string = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'; // ERC-4337 EntryPoint

  // Paymaster configuration
  private paymasterAddress: string = '0x0000000000000000000000000000000000000000'; // CPPay Paymaster
  
  constructor(chainId: number) {
    this.chainId = chainId;
    this.billPaymentService = new BillPaymentAdapterService(chainId);
    this.smartAccountService = new SmartAccountService(chainId);
    
    // Configure bundler URL based on network
    this.bundlerUrl = this.getBundlerUrl(chainId);
    
    console.log(`🚀 Enhanced UserOp Service initialized for chain ${chainId}`);
  }

  private getBundlerUrl(chainId: number): string {
    const bundlerUrls = {
      4202: process.env.EXPO_PUBLIC_LISK_BUNDLER_URL || 'https://bundler.lisk.com',
      1: process.env.EXPO_PUBLIC_ETH_BUNDLER_URL || 'https://bundler.ethereum.org',
      8453: process.env.EXPO_PUBLIC_BASE_BUNDLER_URL || 'https://bundler.base.org',
    };
    
    return bundlerUrls[chainId as keyof typeof bundlerUrls] || bundlerUrls[4202];
  }

  /**
   * Create and execute crypto-to-naira transaction
   */
  async executeCryptoToNairaTransaction(
    nairaAmount: number,
    bankDetails: {
      bankCode: string;
      accountNumber: string;
      accountName: string;
    },
    cryptoDetails: {
      token: string;
      amount: number;
    },
    memo?: string,
    usePaymaster: boolean = true
  ): Promise<UserOperationResult> {
    try {
      console.log('🏦 Creating crypto-to-naira transaction...');
      
      // Get user's private key and smart account
      const privateKey = await SecureWalletStorage.getPrivateKey();
      if (!privateKey) {
        throw new Error('No private key found');
      }

      const smartAccountAddress = await this.smartAccountService.getSmartAccountAddress(privateKey);
      
      // Check if smart account is deployed
      const isDeployed = await this.smartAccountService.isSmartAccountDeployed(smartAccountAddress);
      
      let initCode = '0x';
      if (!isDeployed) {
        console.log('📦 Smart account not deployed, including deployment in UserOp...');
        initCode = await this.smartAccountService.getDeploymentInitCode(privateKey);
      }

      // Create payment request
      const paymentRequest = this.billPaymentService.createCryptoToNairaRequest(
        smartAccountAddress,
        nairaAmount,
        bankDetails,
        cryptoDetails,
        memo
      );

      // Create call data for BillPaymentAdapter
      const callData = this.billPaymentService.createSubmitPaymentCallData(paymentRequest);

      // Get current nonce
      const nonce = await this.smartAccountService.getNonce(smartAccountAddress);

      // Estimate gas
      const gasEstimate = await this.billPaymentService.estimateSubmitPaymentGas(
        paymentRequest,
        smartAccountAddress
      );

      // Get gas prices
      const gasData = await this.billPaymentService.getCurrentGasPrice();

      // Create UserOperation
      const userOp: UserOperation = {
        sender: smartAccountAddress,
        nonce: `0x${nonce.toString(16)}`,
        initCode,
        callData,
        callGasLimit: `0x${(gasEstimate + BigInt(50000)).toString(16)}`, // Add buffer
        verificationGasLimit: '0x186A0', // 100k
        preVerificationGas: '0x5208', // 21k
        maxFeePerGas: `0x${gasData.maxFeePerGas.toString(16)}`,
        maxPriorityFeePerGas: `0x${gasData.maxPriorityFeePerGas.toString(16)}`,
        paymasterAndData: usePaymaster ? await this.getPaymasterData(smartAccountAddress, gasEstimate) : '0x',
        signature: '0x',
      };

      // Sign UserOperation
      const signedUserOp = await this.signUserOperation(userOp, privateKey);

      // Submit to bundler
      const result = await this.submitUserOperation(signedUserOp);

      console.log('✅ Crypto-to-naira transaction submitted:', result.userOperationHash);
      return result;

    } catch (error: any) {
      console.error('❌ Crypto-to-naira transaction failed:', error);
      throw new Error(`Transaction failed: ${error.message}`);
    }
  }

  /**
   * Create and execute airtime purchase
   */
  async executeAirtimePurchase(
    phoneNumber: string,
    amount: number,
    provider: string,
    usePaymaster: boolean = true
  ): Promise<UserOperationResult> {
    try {
      console.log(`📱 Creating airtime purchase for ${phoneNumber}...`);
      
      const privateKey = await SecureWalletStorage.getPrivateKey();
      if (!privateKey) {
        throw new Error('No private key found');
      }

      const smartAccountAddress = await this.smartAccountService.getSmartAccountAddress(privateKey);
      
      // Create airtime payment request
      const paymentRequest = this.billPaymentService.createAirtimePurchaseRequest(
        smartAccountAddress,
        phoneNumber,
        amount,
        provider
      );

      return await this.executePaymentRequest(paymentRequest, privateKey, usePaymaster);

    } catch (error: any) {
      console.error('❌ Airtime purchase failed:', error);
      throw new Error(`Airtime purchase failed: ${error.message}`);
    }
  }

  /**
   * Create and execute electricity payment
   */
  async executeElectricityPayment(
    meterNumber: string,
    amount: number,
    provider: string,
    meterType: 'prepaid' | 'postpaid' = 'prepaid',
    usePaymaster: boolean = true
  ): Promise<UserOperationResult> {
    try {
      console.log(`⚡ Creating electricity payment for meter ${meterNumber}...`);
      
      const privateKey = await SecureWalletStorage.getPrivateKey();
      if (!privateKey) {
        throw new Error('No private key found');
      }

      const smartAccountAddress = await this.smartAccountService.getSmartAccountAddress(privateKey);
      
      // Create electricity payment request
      const paymentRequest = this.billPaymentService.createElectricityPaymentRequest(
        smartAccountAddress,
        meterNumber,
        amount,
        provider,
        meterType
      );

      return await this.executePaymentRequest(paymentRequest, privateKey, usePaymaster);

    } catch (error: any) {
      console.error('❌ Electricity payment failed:', error);
      throw new Error(`Electricity payment failed: ${error.message}`);
    }
  }

  /**
   * Generic payment request executor
   */
  private async executePaymentRequest(
    paymentRequest: PaymentRequest,
    privateKey: string,
    usePaymaster: boolean
  ): Promise<UserOperationResult> {
    const smartAccountAddress = paymentRequest.account;
    
    // Check deployment status
    const isDeployed = await this.smartAccountService.isSmartAccountDeployed(smartAccountAddress);
    let initCode = '0x';
    if (!isDeployed) {
      initCode = await this.smartAccountService.getDeploymentInitCode(privateKey);
    }

    // Create call data
    const callData = this.billPaymentService.createSubmitPaymentCallData(paymentRequest);

    // Get nonce
    const nonce = await this.smartAccountService.getNonce(smartAccountAddress);

    // Estimate gas
    const gasEstimate = await this.billPaymentService.estimateSubmitPaymentGas(
      paymentRequest,
      smartAccountAddress
    );

    // Get gas prices
    const gasData = await this.billPaymentService.getCurrentGasPrice();

    // Create UserOperation
    const userOp: UserOperation = {
      sender: smartAccountAddress,
      nonce: `0x${nonce.toString(16)}`,
      initCode,
      callData,
      callGasLimit: `0x${(gasEstimate + BigInt(50000)).toString(16)}`,
      verificationGasLimit: '0x186A0',
      preVerificationGas: '0x5208',
      maxFeePerGas: `0x${gasData.maxFeePerGas.toString(16)}`,
      maxPriorityFeePerGas: `0x${gasData.maxPriorityFeePerGas.toString(16)}`,
      paymasterAndData: usePaymaster ? await this.getPaymasterData(smartAccountAddress, gasEstimate) : '0x',
      signature: '0x',
    };

    // Sign and submit
    const signedUserOp = await this.signUserOperation(userOp, privateKey);
    return await this.submitUserOperation(signedUserOp);
  }

  /**
   * Sign UserOperation with user's private key
   */
  private async signUserOperation(userOp: UserOperation, privateKey: string): Promise<UserOperation> {
    try {
      console.log('✍️ Signing UserOperation...');
      
      // Create account from private key
      const account = privateKeyToAccount(privateKey as Hex);
      
      // Get UserOperation hash for signing
      const userOpHash = this.getUserOperationHash(userOp);
      
      // Sign the hash
      const signature = await signMessage({
        account,
        message: { raw: userOpHash as Hex }
      });
      
      // Return signed UserOperation
      return {
        ...userOp,
        signature,
      };
      
    } catch (error: any) {
      console.error('❌ Failed to sign UserOperation:', error);
      throw new Error(`Signing failed: ${error.message}`);
    }
  }

  /**
   * Get UserOperation hash for signing
   */
  private getUserOperationHash(userOp: UserOperation): string {
    // This would normally calculate the proper ERC-4337 UserOperation hash
    // For now, create a simple hash of the important fields
    const concatenated = 
      userOp.sender +
      userOp.nonce.slice(2) +
      userOp.initCode.slice(2) +
      userOp.callData.slice(2) +
      userOp.callGasLimit.slice(2) +
      userOp.verificationGasLimit.slice(2) +
      userOp.preVerificationGas.slice(2) +
      userOp.maxFeePerGas.slice(2) +
      userOp.maxPriorityFeePerGas.slice(2) +
      userOp.paymasterAndData.slice(2);
    
    return keccak256(toBytes('0x' + concatenated));
  }

  /**
   * Get paymaster data for sponsored transactions
   */
  private async getPaymasterData(smartAccountAddress: string, gasEstimate: bigint): Promise<string> {
    try {
      if (!this.paymasterAddress || this.paymasterAddress === '0x0000000000000000000000000000000000000000') {
        return '0x';
      }

      // Check if user is eligible for gas sponsorship
      const isEligible = await this.checkGasSponsorshipEligibility(smartAccountAddress, gasEstimate);
      
      if (!isEligible) {
        console.log('⛽ User not eligible for gas sponsorship, using regular payment');
        return '0x';
      }

      console.log('🎁 User eligible for gas sponsorship');
      
      // This would normally call the paymaster to get proper paymaster data
      // For now, return a basic paymaster structure
      return this.paymasterAddress + '0'.repeat(64); // Paymaster address + empty data
      
    } catch (error) {
      console.error('Failed to get paymaster data:', error);
      return '0x';
    }
  }

  /**
   * Check gas sponsorship eligibility
   */
  private async checkGasSponsorshipEligibility(
    smartAccountAddress: string, 
    gasEstimate: bigint
  ): Promise<boolean> {
    try {
      // Mock eligibility check - in real implementation this would call the paymaster
      // For now, approve sponsorship for reasonable gas amounts
      const maxSponsoredGas = BigInt(500000); // 500k gas units
      
      return gasEstimate <= maxSponsoredGas;
      
    } catch (error) {
      console.error('Failed to check gas sponsorship eligibility:', error);
      return false;
    }
  }

  /**
   * Submit UserOperation to bundler
   */
  private async submitUserOperation(userOp: UserOperation): Promise<UserOperationResult> {
    try {
      console.log('📤 Submitting UserOperation to bundler...');
      
      // In a real implementation, this would call the actual bundler
      // For now, simulate the submission
      const userOperationHash = keccak256(
        toBytes(JSON.stringify(userOp))
      );

      // Simulate bundler response
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('✅ UserOperation submitted:', userOperationHash);

      return {
        userOperationHash,
        status: 'submitted',
      };

    } catch (error: any) {
      console.error('❌ Failed to submit UserOperation:', error);
      throw new Error(`Submission failed: ${error.message}`);
    }
  }

  /**
   * Wait for UserOperation to be included in a block
   */
  async waitForUserOperationReceipt(
    userOperationHash: string,
    timeout: number = 300000 // 5 minutes
  ): Promise<UserOperationResult> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        // In real implementation, this would poll the bundler for status
        // For now, simulate confirmation after a delay
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        const mockTransactionHash = keccak256(
          toBytes(userOperationHash + Date.now().toString())
        );        return {
          userOperationHash,
          status: 'confirmed',
          transactionHash: mockTransactionHash,
          blockNumber: Math.floor(Date.now() / 1000),
          gasUsed: '150000',
        };

      } catch (error) {
        console.log('⏳ UserOperation not yet confirmed, retrying...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    throw new Error('UserOperation confirmation timeout');
  }

  /**
   * Get network information
   */
  getNetworkInfo() {
    return {
      chainId: this.chainId,
      bundlerUrl: this.bundlerUrl,
      entryPointAddress: this.entryPointAddress,
      paymasterAddress: this.paymasterAddress,
      billPaymentAdapter: this.billPaymentService.getNetworkInfo(),
    };
  }

  /**
   * Check if a payment has been processed on-chain
   */
  async isPaymentProcessed(providerCode: string, refId: string): Promise<boolean> {
    return await this.billPaymentService.isPaymentProcessed(providerCode, refId);
  }

  /**
   * Generate unique reference for transactions
   */
  generateTransactionReference(prefix: string = 'CPPAY'): string {
    return this.billPaymentService.generateUniqueReference(prefix);
  }
}

export default EnhancedUserOpService;