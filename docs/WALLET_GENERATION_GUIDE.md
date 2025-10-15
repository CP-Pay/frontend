# Wallet Generation & Smart Account Implementation

## Overview
CPPay implements wallet generation the same way MetaMask does: **Create a normal EOA (Externally Owned Account) first, then derive a smart account from it using ERC-4337 Account Abstraction**.

## How MetaMask Creates Smart Accounts

MetaMask follows this process:
1. Generate a 12/24-word BIP39 mnemonic phrase
2. Derive an EOA (private key + address) from the mnemonic
3. Use the EOA as the "owner/signer" to create a smart contract wallet
4. The smart account address is deterministic (same EOA → same smart account)
5. Smart account is deployed on-chain when first transaction is sent

## CPPay Implementation

### Architecture Flow

```
User Action → Mnemonic Generation → EOA Creation → Smart Account Derivation → Storage
```

### Detailed Process:

#### 1. **Mnemonic Generation** (12 words - BIP39 standard)
```typescript
// In WalletService.ts
static generateMnemonic(): string {
  const mnemonic = bip39.generateMnemonic(128); // 128 bits = 12 words
  return mnemonic;
}
```

**Example Output:**
```
abandon ability able about above absent absorb abstract absurd abuse access accident
```

#### 2. **EOA Creation from Mnemonic**
```typescript
// In WalletService.ts
static createWalletFromMnemonic(mnemonic: string) {
  const account = mnemonicToAccount(mnemonic); // viem function
  const hdKey = account.getHdKey();
  
  return {
    address: account.address,          // EOA address: 0x1234...
    privateKey: hdKey.privateKey,      // EOA private key
    mnemonic: mnemonic                 // Original phrase
  };
}
```

**What happens:**
- Mnemonic → Seed (via PBKDF2)
- Seed → Master Key (via HMAC-SHA512)
- Master Key → Derived Keys (via BIP32/BIP44 path: m/44'/60'/0'/0/0)
- Derived Key → EOA Address (via Keccak-256 hash of public key)

#### 3. **Smart Account Derivation from EOA**
```typescript
// In SmartAccountService.ts
static async createSmartAccount(eoaPrivateKey: Hex, chainId: number) {
  // 1. Create EOA signer from private key
  const eoaSigner = privateKeyToAccount(eoaPrivateKey);
  
  // 2. Create smart account using EOA as owner
  const smartAccount = await toSimpleSmartAccount({
    client: publicClient,
    owner: eoaSigner,              // EOA controls the smart account
    factoryAddress: FACTORY_ADDRESS, // ERC-4337 factory
    entryPoint: ENTRYPOINT_ADDRESS   // ERC-4337 entrypoint
  });
  
  // 3. Get counterfactual address (deterministic)
  const smartAccountAddress = smartAccount.address; // 0xABCD...
  
  // 4. Check if already deployed on-chain
  const code = await publicClient.getBytecode({ address: smartAccountAddress });
  const isDeployed = code !== undefined && code !== '0x';
  
  return {
    address: smartAccountAddress,
    eoaAddress: eoaSigner.address,
    isDeployed
  };
}
```

**Key Points:**
- Smart account address is **counterfactual** (exists before deployment)
- Address is **deterministic** (same EOA + factory + entryPoint → same address)
- Smart account is **not deployed** until first transaction
- EOA is the **owner** and controls the smart account

#### 4. **Storage** (Secure)
```typescript
// In walletStore.ts - createWallet function
async createWallet(mnemonic: string, pin: string) {
  // 1. Create EOA from mnemonic
  const walletData = WalletService.createWalletFromMnemonic(mnemonic);
  
  // 2. Store EOA data securely
  await SecureWalletStorage.storeMnemonic(mnemonic, pin);
  await SecureWalletStorage.storePrivateKey(walletData.privateKey, pin);
  await SecureWalletStorage.storeAddress(walletData.address);
  
  // 3. Derive and store smart account
  await initializeSmartAccount(walletData.privateKey);
  
  // 4. Store smart account data
  await SecureWalletStorage.storeSmartAccountAddress(smartAccountAddress);
  await SecureWalletStorage.setSmartAccountDeployed(isDeployed);
}
```

## Import Wallet Flow

### Import from Mnemonic Phrase:
```typescript
// User inputs 12 or 24 words
const mnemonic = "word1 word2 word3...";

// 1. Validate mnemonic (BIP39)
const isValid = bip39.validateMnemonic(mnemonic);

// 2. Create EOA from mnemonic
const walletData = WalletService.createWalletFromMnemonic(mnemonic);

// 3. Derive smart account from EOA
const smartAccount = await SmartAccountService.createSmartAccount(
  walletData.privateKey,
  chainId
);

// 4. Store everything securely
// ... same as create wallet
```

### Import from Private Key:
```typescript
// User inputs private key
const privateKey = "0x1234...";

// 1. Create EOA from private key
const walletData = WalletService.importWalletFromPrivateKey(privateKey);

// 2. Derive smart account from EOA
const smartAccount = await SmartAccountService.createSmartAccount(
  walletData.privateKey,
  chainId
);

// 3. Store (no mnemonic in this case)
await SecureWalletStorage.storePrivateKey(privateKey, pin);
await SecureWalletStorage.storeAddress(walletData.address);
```

## Crypto Polyfill Setup

### Problem:
React Native doesn't have native `crypto.getRandomValues` needed for `bip39.generateMnemonic()`.

### Solution:
```typescript
// In utils/crypto-polyfill.ts
import 'react-native-get-random-values';
import { Buffer } from 'buffer';

// Setup global polyfills
global.Buffer = Buffer;

global.crypto.getRandomValues = <T extends ArrayBufferView>(array: T): T => {
  // react-native-get-random-values handles the actual randomness
  return array;
};
```

**Important:** Must be imported **FIRST** in `app/_layout.tsx`:
```typescript
import '@/utils/crypto-polyfill'; // MUST BE FIRST!
import { Stack } from "expo-router";
// ... rest of imports
```

## Comparison with MetaMask

| Feature | MetaMask | CPPay |
|---------|----------|-------|
| Mnemonic Generation | 12 words (BIP39) | ✅ 12 words (BIP39) |
| EOA Derivation | BIP32/BIP44 (m/44'/60'/0'/0/0) | ✅ Same path |
| Smart Account | ERC-4337 (optional) | ✅ ERC-4337 (automatic) |
| Owner Control | EOA signs for smart account | ✅ Same |
| Counterfactual Address | Yes (deterministic) | ✅ Yes |
| Deployment | On first transaction | ✅ On first transaction |
| Multi-Network | Same EOA across chains | ✅ Same EOA across chains |
| Import Options | Mnemonic or Private Key | ✅ Both supported |

## Security Features

### 1. **Secure Storage**
- Mnemonic encrypted with PIN/Password
- Private key encrypted with PIN/Password
- Addresses stored separately (not encrypted)
- Smart account data persisted

### 2. **PIN Protection**
- 6-digit PIN requirement
- PIN confirmation during setup
- PIN used to encrypt/decrypt sensitive data

### 3. **Biometric Authentication** (Optional)
- Face ID / Fingerprint
- Faster unlock without typing PIN
- Falls back to PIN if biometric fails

### 4. **Auto-Lock**
- Wallet locks after 5 minutes of inactivity
- User must re-authenticate to access funds
- Prevents unauthorized access if phone is lost

## Smart Account Benefits

### Why Smart Accounts over Regular EOA?

1. **Gas Sponsorship** - Paymasters can pay gas fees for users
2. **Batch Transactions** - Execute multiple operations in one transaction
3. **Social Recovery** - Recover wallet without seed phrase (via guardians)
4. **Custom Logic** - Spending limits, time locks, multi-sig
5. **Session Keys** - Temporary permissions for dApps
6. **Account Abstraction** - Better UX (no need to hold ETH for gas)

## User Experience Flow

### Create Wallet:
```
1. Welcome Screen
   ↓
2. Create PIN (6 digits)
   ↓
3. Confirm PIN
   ↓
4. Generate Mnemonic (12 words displayed)
   ↓
5. User writes down phrase
   ↓
6. Verify Phrase (select 3 random words)
   ↓
7. Setup Biometric (optional)
   ↓
8. Wallet Created ✅
   - EOA created from mnemonic
   - Smart account derived from EOA
   - Both addresses displayed
```

### Import Wallet:
```
1. Welcome Screen
   ↓
2. Choose Import Method
   - Mnemonic Phrase (12/24 words)
   - Private Key
   ↓
3. Enter Mnemonic/Private Key
   ↓
4. Validate Input
   ↓
5. Create PIN
   ↓
6. Setup Biometric (optional)
   ↓
7. Wallet Imported ✅
   - EOA restored from mnemonic/key
   - Smart account re-derived
   - Same addresses as original
```

## Technical Details

### ERC-4337 Components:

1. **EntryPoint Contract** (`0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789`)
   - Single global contract for all AA operations
   - Validates and executes UserOperations
   - Same address on all EVM chains

2. **Factory Contract** (`0x9406Cc6185a346906296840746125a0E44976454`)
   - Creates new smart account instances
   - Uses CREATE2 for deterministic addresses
   - Owned by the EntryPoint

3. **Smart Account Contract**
   - Deployed per user (counterfactually)
   - Stores user's assets and state
   - Validates signatures from owner (EOA)

4. **Bundler** (Pimlico)
   - Off-chain service that bundles UserOperations
   - Submits to EntryPoint contract
   - Handles gas payment and execution

### Address Generation:

**EOA Address:**
```
Mnemonic → Seed → Private Key → Public Key → Keccak-256 → EOA Address
```

**Smart Account Address:**
```
CREATE2(
  factory_address,
  salt (derived from EOA),
  init_code_hash
) → Smart Account Address (deterministic)
```

## Troubleshooting

### Issue: "crypto.getRandomValues must be defined"
**Solution:** Ensure `@/utils/crypto-polyfill` is imported first in `app/_layout.tsx`

### Issue: "Invalid mnemonic phrase"
**Solution:** Verify the phrase has exactly 12 or 24 words and uses BIP39 wordlist

### Issue: "Smart account address changes"
**Solution:** Smart account address is deterministic - check if using same EOA and chain

### Issue: "Wallet not persisting"
**Solution:** Check SecureStore permissions and ensure PIN is correctly stored

## Next Steps

1. **Deploy Smart Account** - Send first transaction to deploy on-chain
2. **Add Paymaster** - Enable gasless transactions
3. **Social Recovery** - Add guardians for wallet recovery
4. **Session Keys** - Allow dApps temporary access
5. **Multi-Chain** - Derive smart accounts on other chains

## References

- [ERC-4337 Specification](https://eips.ethereum.org/EIPS/eip-4337)
- [BIP39 - Mnemonic Phrases](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
- [BIP32 - Hierarchical Deterministic Wallets](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
- [BIP44 - Multi-Account Hierarchy](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)
- [Viem Documentation](https://viem.sh)
- [Permissionless.js](https://docs.pimlico.io/permissionless)
