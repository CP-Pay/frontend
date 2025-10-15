# Smart Account Integration - Quick Start Implementation Guide

## 🚀 START HERE - Day 1 Actions

### Prerequisites Checklist
- [ ] Node.js 16+ installed
- [ ] React Native development environment set up
- [ ] CPPay repository cloned and dependencies installed
- [ ] Access to modify code in `/home/bilal/bilal_projects/CPPay/frontend`

---

## Step 1: Setup Pimlico Account (15 minutes)

### 1.1 Create Account
1. Go to: https://dashboard.pimlico.io/
2. Click "Sign Up" → Use GitHub/Google
3. Verify email

### 1.2 Create API Key
1. Click "API Keys" in dashboard
2. Click "Create API Key"
3. Name: "CPPay Development"
4. Select chains:
   - ✅ Ethereum Mainnet
   - ✅ Polygon Mainnet
   - ✅ BSC Mainnet
5. Click "Create"
6. **SAVE THE API KEY** - You'll need it for `.env`

### 1.3 Configure Gas Sponsorship (Optional for MVP)
1. Click "Paymasters" in dashboard
2. Click "Create Policy"
3. Configure:
   ```
   Name: CPPay Gas Sponsorship
   Chains: Ethereum Mainnet
   Rules:
     - Max transaction value: $50
     - Daily limit per address: 10 transactions
     - Monthly budget: $500
   ```
4. Save policy ID for later

---

## Step 2: Install Dependencies (2 minutes)

```bash
cd /home/bilal/bilal_projects/CPPay/frontend

# Install Permissionless
npm install permissionless

# Verify installation
npm list permissionless
# Should show: permissionless@0.x.x
```

---

## Step 3: Environment Configuration (5 minutes)

### 3.1 Create `.env` file (if not exists)

```bash
touch .env
```

### 3.2 Add Environment Variables

Open `.env` and add:

```env
# Pimlico Configuration
PIMLICO_API_KEY=pim_YOUR_API_KEY_HERE
PIMLICO_RPC_URL_MAINNET=https://api.pimlico.io/v2/ethereum/rpc?apikey=pim_YOUR_API_KEY_HERE
PIMLICO_RPC_URL_POLYGON=https://api.pimlico.io/v2/polygon/rpc?apikey=pim_YOUR_API_KEY_HERE
PIMLICO_RPC_URL_BSC=https://api.pimlico.io/v2/bsc/rpc?apikey=pim_YOUR_API_KEY_HERE

# ERC-4337 Configuration
ENTRYPOINT_ADDRESS=0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789
SIMPLE_ACCOUNT_FACTORY=0x9406Cc6185a346906296840746125a0E44976454

# Network RPC URLs (Public)
ETHEREUM_RPC_URL=https://eth.llamarpc.com
POLYGON_RPC_URL=https://polygon-rpc.com
BSC_RPC_URL=https://bsc-dataseed.binance.org
```

### 3.3 Update `metro.config.js` (if needed)

Make sure `.env` is loaded:

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Add .env support
  config.resolver.sourceExts = [...config.resolver.sourceExts, 'env'];

  return config;
})();
```

---

## Step 4: Create Directory Structure (2 minutes)

```bash
# Create directories
mkdir -p services/smartAccount
mkdir -p components/smartAccount
mkdir -p hooks/smartAccount
mkdir -p types/smartAccount

# Verify structure
ls -la services/
ls -la components/
ls -la hooks/
ls -la types/
```

---

## Step 5: First File - Smart Account Types (15 minutes)

Create `/services/smartAccount/types.ts`:

```typescript
import { Hex, Address } from 'viem';

/**
 * ERC-4337 UserOperation structure
 */
export interface UserOperation {
  sender: Address;
  nonce: bigint;
  initCode: Hex;
  callData: Hex;
  callGasLimit: bigint;
  verificationGasLimit: bigint;
  preVerificationGas: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  paymasterAndData: Hex;
  signature: Hex;
}

/**
 * Smart account information
 */
export interface SmartAccountInfo {
  address: Address;
  eoaAddress: Address;
  isDeployed: boolean;
  nonce: bigint;
  balance: bigint;
}

/**
 * Bundler configuration
 */
export interface BundlerConfig {
  rpcUrl: string;
  apiKey: string;
  entryPointAddress: Address;
  chainId: number;
}

/**
 * Paymaster configuration
 */
export interface PaymasterConfig {
  enabled: boolean;
  rpcUrl: string;
  policyId?: string;
  maxSponsoredAmount: number; // in NGN
}

/**
 * Gas estimate for UserOperation
 */
export interface GasEstimate {
  callGasLimit: bigint;
  verificationGasLimit: bigint;
  preVerificationGas: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
}

/**
 * Transaction parameters for smart account
 */
export interface SmartAccountTransaction {
  to: Address;
  value: bigint;
  data: Hex;
}

/**
 * Batch transaction parameters
 */
export interface BatchTransaction {
  transactions: SmartAccountTransaction[];
}

/**
 * UserOperation receipt
 */
export interface UserOperationReceipt {
  userOpHash: Hex;
  sender: Address;
  nonce: bigint;
  success: boolean;
  actualGasCost: bigint;
  actualGasUsed: bigint;
  logs: any[];
  receipt: {
    transactionHash: Hex;
    blockNumber: bigint;
    blockHash: Hex;
  };
}

/**
 * Bundler response
 */
export interface BundlerResponse {
  userOpHash: Hex;
  status: 'pending' | 'included' | 'failed';
  transactionHash?: Hex;
}

/**
 * Smart account client configuration
 */
export interface SmartAccountClientConfig {
  eoaPrivateKey: Hex;
  chainId: number;
  bundlerUrl: string;
  paymasterUrl?: string;
  entryPointAddress: Address;
  factoryAddress: Address;
}

/**
 * Gas sponsorship policy
 */
export interface GasSponsorshipPolicy {
  isEligible: boolean;
  reason: string;
  maxSponsoredAmount: number;
  currentUsage: number;
  resetDate: number;
}
```

### Test the types file:

```bash
# Check for TypeScript errors
npx tsc services/smartAccount/types.ts --noEmit
```

---

## Step 6: Second File - Bundler Service (30 minutes)

Create `/services/smartAccount/BundlerService.ts`:

```typescript
import axios, { AxiosInstance } from 'axios';
import { Hex, Address } from 'viem';
import {
  UserOperation,
  BundlerConfig,
  UserOperationReceipt,
  BundlerResponse,
  GasEstimate,
} from './types';

/**
 * BundlerService - Pimlico bundler integration
 * Handles UserOperation submission and tracking
 */
class BundlerService {
  private client: AxiosInstance;
  private config: BundlerConfig;

  constructor(config: BundlerConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.rpcUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Send UserOperation to bundler
   */
  async sendUserOperation(userOp: UserOperation): Promise<Hex> {
    try {
      console.log('📤 Sending UserOperation to bundler...', userOp.sender);

      const response = await this.client.post('', {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_sendUserOperation',
        params: [
          this.formatUserOperation(userOp),
          this.config.entryPointAddress,
        ],
      });

      if (response.data.error) {
        throw new Error(`Bundler error: ${response.data.error.message}`);
      }

      const userOpHash = response.data.result as Hex;
      console.log('✅ UserOperation sent:', userOpHash);

      return userOpHash;
    } catch (error) {
      console.error('❌ Failed to send UserOperation:', error);
      throw error;
    }
  }

  /**
   * Get UserOperation receipt
   */
  async getUserOperationReceipt(
    userOpHash: Hex
  ): Promise<UserOperationReceipt | null> {
    try {
      const response = await this.client.post('', {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getUserOperationReceipt',
        params: [userOpHash],
      });

      if (response.data.error) {
        console.warn('UserOperation not found:', userOpHash);
        return null;
      }

      return response.data.result as UserOperationReceipt;
    } catch (error) {
      console.error('Failed to get receipt:', error);
      return null;
    }
  }

  /**
   * Estimate UserOperation gas
   */
  async estimateUserOperationGas(
    userOp: Partial<UserOperation>
  ): Promise<GasEstimate> {
    try {
      const response = await this.client.post('', {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_estimateUserOperationGas',
        params: [
          this.formatUserOperation(userOp as UserOperation),
          this.config.entryPointAddress,
        ],
      });

      if (response.data.error) {
        throw new Error(`Gas estimation failed: ${response.data.error.message}`);
      }

      const result = response.data.result;

      return {
        callGasLimit: BigInt(result.callGasLimit),
        verificationGasLimit: BigInt(result.verificationGasLimit),
        preVerificationGas: BigInt(result.preVerificationGas),
        maxFeePerGas: BigInt(result.maxFeePerGas || 0),
        maxPriorityFeePerGas: BigInt(result.maxPriorityFeePerGas || 0),
      };
    } catch (error) {
      console.error('Failed to estimate gas:', error);
      throw error;
    }
  }

  /**
   * Get supported EntryPoints
   */
  async getSupportedEntryPoints(): Promise<Address[]> {
    try {
      const response = await this.client.post('', {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_supportedEntryPoints',
        params: [],
      });

      return response.data.result as Address[];
    } catch (error) {
      console.error('Failed to get supported entry points:', error);
      return [];
    }
  }

  /**
   * Wait for UserOperation to be included
   */
  async waitForUserOperationReceipt(
    userOpHash: Hex,
    timeout: number = 60000,
    interval: number = 2000
  ): Promise<UserOperationReceipt> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const receipt = await this.getUserOperationReceipt(userOpHash);

      if (receipt) {
        console.log('✅ UserOperation included:', userOpHash);
        return receipt;
      }

      // Wait before next check
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error('UserOperation timeout: Not included within timeout period');
  }

  /**
   * Format UserOperation for RPC call
   * Converts bigint to hex strings
   */
  private formatUserOperation(userOp: UserOperation): any {
    return {
      sender: userOp.sender,
      nonce: `0x${userOp.nonce.toString(16)}`,
      initCode: userOp.initCode,
      callData: userOp.callData,
      callGasLimit: `0x${userOp.callGasLimit.toString(16)}`,
      verificationGasLimit: `0x${userOp.verificationGasLimit.toString(16)}`,
      preVerificationGas: `0x${userOp.preVerificationGas.toString(16)}`,
      maxFeePerGas: `0x${userOp.maxFeePerGas.toString(16)}`,
      maxPriorityFeePerGas: `0x${userOp.maxPriorityFeePerGas.toString(16)}`,
      paymasterAndData: userOp.paymasterAndData,
      signature: userOp.signature,
    };
  }
}

export default BundlerService;
```

---

## Step 7: Test Your Setup (10 minutes)

### 7.1 Create Test File

Create `services/smartAccount/__tests__/BundlerService.test.ts`:

```typescript
import BundlerService from '../BundlerService';
import { BundlerConfig } from '../types';

// Test configuration (using Ethereum Sepolia testnet)
const testConfig: BundlerConfig = {
  rpcUrl: 'https://api.pimlico.io/v2/sepolia/rpc?apikey=YOUR_TEST_KEY',
  apiKey: 'YOUR_TEST_KEY',
  entryPointAddress: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
  chainId: 11155111, // Sepolia
};

describe('BundlerService', () => {
  let bundlerService: BundlerService;

  beforeEach(() => {
    bundlerService = new BundlerService(testConfig);
  });

  test('should get supported entry points', async () => {
    const entryPoints = await bundlerService.getSupportedEntryPoints();
    expect(entryPoints).toBeInstanceOf(Array);
    console.log('Supported EntryPoints:', entryPoints);
  });

  // Add more tests as needed
});
```

### 7.2 Run TypeScript Check

```bash
npx tsc --noEmit
```

Should show no errors if everything is set up correctly.

---

## Step 8: Commit Your Progress (5 minutes)

```bash
git add .
git commit -m "feat: Add smart account types and bundler service

- Add ERC-4337 UserOperation types
- Implement BundlerService with Pimlico integration
- Setup environment configuration for smart accounts
- Phase 3.1 complete"

git push origin ft-ui-updates
```

---

## 📋 Day 1 Checklist

- [ ] Pimlico account created
- [ ] API key obtained and saved
- [ ] Dependencies installed (`permissionless`)
- [ ] `.env` file configured
- [ ] Directory structure created
- [ ] `types.ts` file created and tested
- [ ] `BundlerService.ts` file created and tested
- [ ] TypeScript compilation successful
- [ ] Changes committed to Git

---

## 🎯 Next Steps (Day 2)

Tomorrow you'll create:

1. **PaymasterService.ts** - Gas sponsorship logic
2. **UserOperationBuilder.ts** - Build and sign UserOps
3. **SmartAccountService.ts** - Main service that ties everything together

Follow the FILE_CHANGES_CHECKLIST.md for detailed specifications of each file.

---

## 🆘 Troubleshooting

### Issue: "Cannot find module 'permissionless'"
**Solution:**
```bash
npm install --save permissionless
npm install --save-dev @types/node
```

### Issue: TypeScript errors with viem types
**Solution:**
```bash
npm install --save-dev @types/viem
```

### Issue: .env variables not loading
**Solution:**
- Install `react-native-dotenv`:
  ```bash
  npm install react-native-dotenv
  ```
- Add to `babel.config.js`:
  ```javascript
  plugins: [
    ["module:react-native-dotenv", {
      moduleName: "@env",
      path: ".env",
    }]
  ]
  ```

### Issue: Pimlico API key not working
**Solution:**
- Double-check API key in dashboard
- Make sure you selected the correct chain
- Try regenerating the API key

---

## 📞 Support Resources

- **Permissionless Docs:** https://docs.pimlico.io/permissionless
- **Pimlico Dashboard:** https://dashboard.pimlico.io/
- **Pimlico Discord:** https://discord.gg/pimlico
- **ERC-4337 Docs:** https://docs.alchemy.com/docs/account-abstraction-overview

---

## 🎉 Congratulations!

You've completed Day 1 of the smart account integration! You now have:
- ✅ Pimlico account set up
- ✅ Dependencies installed
- ✅ Type definitions created
- ✅ Bundler service implemented

**Tomorrow:** Continue with PaymasterService and UserOperationBuilder.

**Ready to continue? Check FILE_CHANGES_CHECKLIST.md for Day 2 tasks!** 🚀
