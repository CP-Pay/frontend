# Smart Account Integration - Phase 1 Analysis

## 📚 ERC-4337 Account Abstraction Overview

### What is ERC-4337?
ERC-4337 is a standard that enables "Account Abstraction" without requiring changes to the Ethereum protocol. It allows smart contracts (not just EOAs) to initiate transactions, enabling features like:
- Gasless transactions (gas sponsorship)
- Social recovery
- Multi-signature wallets
- Session keys for limited-permission operations
- Batch transactions in one signature

### Key Difference: EOA vs Smart Account

**Externally Owned Account (EOA)** - Current Implementation:
- Controlled by private key only
- User must pay gas for every transaction
- Cannot be upgraded or modified
- Simple address (0x123...)
- Direct transaction signing

**Smart Contract Account (ERC-4337)** - Target Implementation:
- Smart contract that OWNS the EOA as a signer
- Can have multiple signers or recovery mechanisms
- Gas can be sponsored by paymaster
- Upgradeable logic
- Transactions go through bundler → EntryPoint → Smart Account

### UserOperation Lifecycle

```
1. User Action (Buy Airtime)
   ↓
2. Create UserOperation {
     sender: smartAccountAddress,
     nonce: accountNonce,
     initCode: (if first transaction),
     callData: executeCall(to, value, data),
     callGasLimit: estimated,
     verificationGasLimit: estimated,
     preVerificationGas: estimated,
     maxFeePerGas: current,
     maxPriorityFeePerGas: current,
     paymasterAndData: (if gas sponsored),
     signature: signedByEOA
   }
   ↓
3. Sign with EOA Private Key
   ↓
4. Send to Bundler (e.g., Alchemy, Pimlico)
   ↓
5. Bundler validates and sends to EntryPoint
   ↓
6. EntryPoint calls SmartAccount.validateUserOp()
   ↓
7. EntryPoint executes SmartAccount.execute()
   ↓
8. Transaction confirmed on blockchain
```

### Core Components

#### 1. **EntryPoint Contract** (0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789)
- Global singleton contract
- Validates UserOperations
- Executes transactions
- Handles gas payments

#### 2. **Smart Account Factory**
- Deploys new smart account contracts
- Uses CREATE2 for deterministic addresses
- Allows counterfactual deployment (address known before deployment)

#### 3. **Bundler**
- Off-chain service that collects UserOperations
- Bundles multiple UserOps into one transaction
- Sends to EntryPoint
- Options: Alchemy, Pimlico, Stackup, Biconomy

#### 4. **Paymaster** (Optional)
- Sponsors gas fees for users
- Can implement custom policies (e.g., sponsor transactions under $50)
- Verification logic executed on-chain

## 🔍 Current CPPay Architecture Analysis

### Wallet Implementation

**Current Flow (EOA):**
```typescript
// 1. Wallet Creation (services/WalletService.ts)
generateMnemonic() → createWalletFromMnemonic()
  ↓
Returns: { address, privateKey, mnemonic }
  ↓
// 2. Storage (services/SecureWalletStorage.ts)
storeMnemonic(encrypted)
storePrivateKey(encrypted)
storeAddress(plain)
  ↓
// 3. State Management (store/walletStore.ts)
auth: { isAuthenticated, biometricEnabled, hasWallet }
wallet: { address, mnemonic, privateKey, isLocked }
balances: { tokens[], totalNGN, totalUSD }
```

**Files Involved:**
- `services/WalletService.ts` - Core wallet operations (viem-based)
- `services/SecureWalletStorage.ts` - Encrypted storage (Expo SecureStore)
- `store/walletStore.ts` - Global state (Zustand)
- `app/auth/create-wallet.tsx` - UI for wallet creation
- `app/auth/import-wallet.tsx` - UI for wallet import
- `app/auth/create-pin.tsx` - PIN setup
- `app/auth/confirm-pin.tsx` - PIN confirmation

### Transaction Flow

**Current Flow:**
```typescript
// 1. User Action (e.g., Buy Airtime)
app/services/airtime.tsx → handlePurchase()
  ↓
// 2. Service Call
services/TransactionService.ts → purchaseAirtime()
  ↓
// 3. TODO: Execute UserOperation (Currently mock)
executeUserOperation() {
  // Placeholder - returns mock hash
  return mockHash;
}
```

**Key Observation:** Transaction execution is stubbed! The `executeUserOperation()` method in `TransactionService.ts` (line 853) is a placeholder that needs implementation.

**Files That Need Updates:**
- `services/TransactionService.ts` - All transaction methods
- `app/services/airtime.tsx`
- `app/services/bank-transfer.tsx`
- `app/services/electricity.tsx`
- `app/services/data.tsx`
- `app/services/cable-tv.tsx`
- `app/services/internet.tsx`
- `app/services/water.tsx`
- `app/services/education.tsx`
- `app/services/p2p-transfer.tsx`
- `app/services/send-crypto.tsx`

### UI Components & Color Scheme

**Current Color Palette (constants/Colors.ts):**
```typescript
LightTheme {
  primary: "#00C2FF"      // Vibrant cyan (NOT baby blue!)
  primaryDark: "#0077D9"
  primaryLight: "#BEEFFF"  // ← Selected line, light cyan
  
  background: "#FAFBFF"
  cardBackground: "#FFFFFF"
  
  textPrimary: "#0B2545"
  textSecondary: "#4B627A"
  textTertiary: "#7B93A8"
  
  success: "#16C784"
  error: "#FF4D4F"
  warning: "#FFB020"
}

DarkTheme {
  primary: "#00A3FF"
  primaryDark: "#0080CC"
  primaryLight: "#77D1FF"
  
  background: "#071225"
  cardBackground: "#081427"
  
  textPrimary: "#E6F0FF"
  textSecondary: "#A8C1DB"
}
```

**⚠️ CORRECTION:** The prompt mentions "baby blue #8FD9FB" but the actual theme uses **cyan/electric blue (#00C2FF)**. We'll maintain the ACTUAL color scheme (#00C2FF, #BEEFFF).

**Dashboard Structure (app/(tabs)/index.tsx):**
```
┌──────────────────────────────────────┐
│ 👤 Hi, SOBIL    🎧 📷 🔔            │
│                                      │
│ ┌──────────────────────────────┐    │
│ │ 💼 Total Balance             │    │
│ │    ₦ 2,458,372.50            │    │
│ │    [Transaction History]     │    │
│ └──────────────────────────────┘    │
│                                      │
│ [Quick Actions Grid]                 │
│ To CPPay | To Bank | Withdraw...    │
│                                      │
│ Recent Transactions                  │
│ ├─ Transaction 1                     │
│ └─ Transaction 2                     │
└──────────────────────────────────────┘
```

**Where to Add Smart Account Info:**
- **Location 1:** Below greeting, above balance card
- **Location 2:** New section below balance card for token list

### State Management

**Zustand Store (store/walletStore.ts):**
```typescript
interface WalletStore {
  auth: AuthState
  wallet: WalletState
  balances: BalanceState
  transactions: Transaction[]
  prices: PriceState
  preferences: PreferencesState
}
```

**No Context API detected** - Pure Zustand for state management.

## 🎯 Required Changes Summary

### 1. Files to Create (New)
```
services/
  smartAccount/
    ├── SmartAccountService.ts      # Core AA logic
    ├── BundlerService.ts           # Bundler integration
    ├── PaymasterService.ts         # Gas sponsorship
    ├── UserOperationBuilder.ts     # UserOp creation
    └── types.ts                    # AA-specific types

contexts/
  └── SmartAccountContext.tsx       # Smart account provider (optional)

hooks/
  └── useSmartAccount.ts            # Hook for components

components/
  ├── AddressDisplay.tsx            # Copy address component
  ├── TokenCard.tsx                 # Token list item
  └── TokenList.tsx                 # Token list container

types/
  └── smartAccount.ts               # TypeScript interfaces
```

### 2. Files to Modify
```
services/
  ├── WalletService.ts              # Add smart account creation
  ├── TransactionService.ts         # Implement executeUserOperation()
  └── SecureWalletStorage.ts        # Store smart account address

store/
  └── walletStore.ts                # Add smart account state

app/
  ├── auth/create-wallet.tsx        # Deploy smart account
  ├── auth/import-wallet.tsx        # Link smart account
  └── (tabs)/index.tsx              # Add address & token display

app/services/
  ├── airtime.tsx                   # Use smart account (already calls TransactionService)
  ├── bank-transfer.tsx
  ├── electricity.tsx
  └── [all other service screens]
```

### 3. Dependencies to Install
```bash
# Account Abstraction SDK (choose one)
npm install permissionless viem

# Or Alchemy's SDK
npm install @alchemy/aa-sdk @alchemy/aa-accounts

# Or ZeroDev
npm install @zerodev/sdk

# Already installed:
# - viem ✅
# - axios ✅
# - expo-clipboard ✅ (for copy address)
```

### 4. Key Metrics
- **Lines of code to add:** ~2,000
- **Files to create:** 12
- **Files to modify:** 15
- **Estimated time:** 10-14 days
- **Complexity:** Medium-High

## 📊 Current vs Target State

| Aspect | Current (EOA) | Target (Smart Account) |
|--------|---------------|------------------------|
| **Wallet Type** | Externally Owned Account | Smart Contract Account |
| **Address** | 0x742d...5e89 (EOA) | 0x8c3f...2b91 (Smart Account) |
| **Signer** | Private key directly | EOA signs for Smart Account |
| **Gas Payment** | User pays always | Paymaster can sponsor |
| **Transaction** | Direct tx signing | UserOperation through bundler |
| **Recovery** | Mnemonic only | Smart contract recovery |
| **Multi-tx** | Multiple signatures | Batch in one signature |

## 🚀 Recommended Implementation Approach

### Option A: Permissionless.js (RECOMMENDED) ✅
**Why:**
- Built specifically for React Native
- Native viem integration (already using viem)
- Modular design
- Active development
- Supports multiple bundlers and paymasters

**Installation:**
```bash
npm install permissionless
```

**Basic Usage:**
```typescript
import { createSmartAccountClient } from "permissionless"
import { signerToSimpleSmartAccount } from "permissionless/accounts"
import { createPimlicoBundlerClient } from "permissionless/clients/pimlico"

// Create smart account from existing EOA signer
const smartAccount = await signerToSimpleSmartAccount(publicClient, {
  signer: eoaSigner,
  factoryAddress: "0x...",
  entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
})

// Create client
const smartAccountClient = createSmartAccountClient({
  account: smartAccount,
  chain: mainnet,
  bundlerTransport: http("https://api.pimlico.io/v1/...")
})

// Send transaction
const txHash = await smartAccountClient.sendTransaction({
  to: "0x...",
  value: parseEther("0.01"),
  data: "0x"
})
```

### Option B: Alchemy AA SDK
**Pros:**
- Complete infrastructure (bundler + paymaster)
- Good documentation
- Free tier available

**Cons:**
- Locked into Alchemy ecosystem
- May have React Native compatibility issues

### Option C: Custom Implementation
**Not recommended** - Too complex and time-consuming.

## 📝 Next Steps (Phase 2)

1. **Decision:** Choose SDK (Permissionless.js recommended)
2. **Setup:**
   - Get bundler API key (Pimlico/Alchemy)
   - Get paymaster API key (optional)
   - Choose smart account implementation (SimpleAccount/Kernel)
3. **Architecture:**
   - Design smart account state structure
   - Plan migration path for existing users
   - Define paymaster sponsorship rules

## ⚠️ Critical Considerations

### Security
- Smart account address is **different** from EOA address
- Users need to fund smart account, not EOA
- Private key still needs secure storage (signs UserOps)
- Smart account can be upgraded (security risk if not careful)

### User Experience
- First transaction deploys account (higher gas, ~$5-10)
- Address changes (users need to update saved addresses)
- Existing balances on EOA need migration
- Transaction confirmation may take longer (bundler delay)

### Gas Optimization
- Batch transactions when possible
- Use session keys for multi-step flows
- Implement smart paymaster policies
- Consider account deployment timing

### Backwards Compatibility
- Support both EOA and Smart Account modes
- Allow users to opt-in to upgrade
- Provide clear migration instructions
- Keep EOA accessible for recovery

---

## 📚 Reference Implementation

**SimpleAccount Contract Interface:**
```solidity
interface IAccount {
    function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 missingAccountFunds
    ) external returns (uint256 validationData);
    
    function execute(
        address dest,
        uint256 value,
        bytes calldata func
    ) external;
    
    function executeBatch(
        address[] calldata dest,
        bytes[] calldata func
    ) external;
}
```

**UserOperation Structure:**
```typescript
interface UserOperation {
  sender: string;                    // Smart account address
  nonce: bigint;                     // Anti-replay
  initCode: string;                  // Factory call (if not deployed)
  callData: string;                  // execute() call
  callGasLimit: bigint;              // Gas for execution
  verificationGasLimit: bigint;      // Gas for validation
  preVerificationGas: bigint;        // Gas for bundler overhead
  maxFeePerGas: bigint;              // EIP-1559
  maxPriorityFeePerGas: bigint;      // EIP-1559
  paymasterAndData: string;          // Paymaster info
  signature: string;                 // EOA signature
}
```

---

**Document Status:** ✅ Complete
**Date:** 2025-10-15
**Next Phase:** Technical Planning & SDK Selection
