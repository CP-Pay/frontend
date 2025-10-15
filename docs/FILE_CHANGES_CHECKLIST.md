# Smart Account Integration - File Modification Checklist

## 🎨 Color Scheme Reference (MUST MAINTAIN)

### Primary Colors
```typescript
// Light Theme
primary: "#00C2FF"        // Vibrant cyan - USE THIS for all primary actions
primaryDark: "#0077D9"    // Darker cyan
primaryLight: "#BEEFFF"   // Light cyan - backgrounds/tints

// Dark Theme  
primary: "#00A3FF"        // Deep cyan
primaryDark: "#0080CC"    // Darker
primaryLight: "#77D1FF"   // Light cyan
```

### Background Colors
```typescript
// Light
background: "#FAFBFF"         // Main background
cardBackground: "#FFFFFF"     // Card backgrounds
modalBackground: "#FFFFFF"

// Dark
background: "#071225"
cardBackground: "#081427"
modalBackground: "#081827"
```

### Text Colors
```typescript
// Light
textPrimary: "#0B2545"        // Headings, important text
textSecondary: "#4B627A"      // Secondary text
textTertiary: "#7B93A8"       // Tertiary/disabled text

// Dark
textPrimary: "#E6F0FF"
textSecondary: "#A8C1DB"
textTertiary: "#6F8EA6"
```

### Status Colors (Same for both themes)
```typescript
success: "#16C784"        // Green
positive: "#16C784"       // Same as success
negative: "#FF6B6B"       // Red
error: "#FF4D4F"          // Red
warning: "#FFB020"        // Orange/Yellow
info: "#00C2FF"           // Primary cyan
```

### UI Elements
```typescript
// Light
border: "#E6EEF8"
divider: "#E9F2FB"
shadow: "rgba(11, 37, 69, 0.08)"
overlay: "rgba(11, 37, 69, 0.6)"

// Dark
border: "#0D2A3E"
divider: "#0B2336"
shadow: "rgba(0, 0, 0, 0.6)"
overlay: "rgba(2, 6, 23, 0.7)"
```

---

## 📂 Files to CREATE

### 1. Smart Account Service Layer

#### `/services/smartAccount/SmartAccountService.ts`
**Purpose:** Core smart account logic - account creation, UserOp building, transaction execution
**Estimated Lines:** 400-500
**Dependencies:** permissionless, viem
**Key Functions:**
```typescript
- createSmartAccount(signer: PrivateKeyAccount): Promise<SmartAccount>
- getSmartAccountAddress(signer: PrivateKeyAccount): Promise<string>
- isAccountDeployed(address: string): Promise<boolean>
- sendUserOperation(userOp: UserOperation): Promise<string>
- sendTransaction(to: string, value: bigint, data: string): Promise<string>
- sendBatchTransactions(txs: Transaction[]): Promise<string>
- getBalance(): Promise<bigint>
- getTokenBalances(tokens: string[]): Promise<TokenBalance[]>
```

#### `/services/smartAccount/BundlerService.ts`
**Purpose:** Bundler API integration (Pimlico/Alchemy/Stackup)
**Estimated Lines:** 150-200
**Key Functions:**
```typescript
- sendUserOperationToBundler(userOp: UserOperation): Promise<string>
- getUserOperationReceipt(userOpHash: string): Promise<Receipt>
- estimateUserOperationGas(userOp: UserOperation): Promise<GasEstimate>
- getSupportedEntryPoints(): Promise<string[]>
```

#### `/services/smartAccount/PaymasterService.ts`
**Purpose:** Gas sponsorship logic and paymaster integration
**Estimated Lines:** 100-150
**Key Functions:**
```typescript
- isEligibleForSponsorship(amount: number): Promise<boolean>
- getPaymasterAndData(userOp: UserOperation): Promise<string>
- getSponsorshipPolicy(): Promise<GasSponsorshipPolicy>
- trackGasUsage(walletAddress: string, gasUsed: bigint): Promise<void>
```

#### `/services/smartAccount/UserOperationBuilder.ts`
**Purpose:** Build and sign UserOperations
**Estimated Lines:** 200-250
**Key Functions:**
```typescript
- buildUserOperation(params: UserOpParams): Promise<UserOperation>
- signUserOperation(userOp: UserOperation, signer: Signer): Promise<string>
- estimateGas(userOp: UserOperation): Promise<GasEstimate>
- getNonce(smartAccountAddress: string): Promise<bigint>
```

#### `/services/smartAccount/types.ts`
**Purpose:** TypeScript types for smart accounts
**Estimated Lines:** 100-150
**Types:**
```typescript
- UserOperation
- SmartAccount
- GasEstimate
- BundlerConfig
- PaymasterConfig
- SmartAccountState
```

### 2. React Components

#### `/components/AddressDisplay.tsx`
**Purpose:** Display smart account address with copy functionality
**Estimated Lines:** 80-100
**Styling:** Use colors.textSecondary, colors.primary, colors.cardBackground
**Features:**
- Truncated address display (0x742d...5e89)
- Copy to clipboard
- Toast notification on copy
- Optional QR code icon

#### `/components/TokenCard.tsx`
**Purpose:** Individual token balance card
**Estimated Lines:** 100-120
**Styling:** Use colors.cardBackground, colors.textPrimary, colors.textSecondary, colors.primary
**Props:**
```typescript
{
  symbol: string
  name: string
  balance: string
  balanceUSD: number
  balanceNGN: number
  icon: string
  onPress: () => void
}
```

#### `/components/TokenList.tsx`
**Purpose:** Container for token list
**Estimated Lines:** 150-180
**Features:**
- Fetches token balances
- Loading states
- Pull to refresh
- Empty state

### 3. Context (Optional)

#### `/contexts/SmartAccountContext.tsx`
**Purpose:** Provider for smart account state (if not using Zustand)
**Estimated Lines:** 200-250
**State:**
```typescript
{
  smartAccount: SmartAccount | null
  smartAccountAddress: string | null
  isDeployed: boolean
  balances: TokenBalance[]
  loading: boolean
  error: string | null
}
```

### 4. Hooks

#### `/hooks/useSmartAccount.ts`
**Purpose:** Hook to access smart account from components
**Estimated Lines:** 50-80
**Returns:**
```typescript
{
  smartAccount: SmartAccount | null
  address: string | null
  isDeployed: boolean
  sendTransaction: (to, value, data) => Promise<string>
  getBalance: () => Promise<bigint>
}
```

### 5. Types

#### `/types/smartAccount.ts`
**Purpose:** Smart account TypeScript interfaces
**Estimated Lines:** 150-200
**Interfaces:**
```typescript
- SmartAccountInfo
- UserOperation
- BundlerResponse
- PaymasterData
- GasEstimate
- SmartAccountTransaction
```

---

## 📝 Files to MODIFY

### 1. Core Services

#### `/services/WalletService.ts`
**Lines to add:** ~100
**Changes:**
- Add `createSmartAccountFromSigner()` method
- Add `getSmartAccountFactory()` helper
- Import smart account service
**New Methods:**
```typescript
static async createSmartAccountFromSigner(
  signer: PrivateKeyAccount
): Promise<{ address: string; isDeployed: boolean }>

static async deploySmartAccount(
  signer: PrivateKeyAccount
): Promise<string>
```

#### `/services/TransactionService.ts`
**Lines to modify:** ~50
**Changes:**
- **CRITICAL:** Implement `executeUserOperation()` (currently line 853-869 is stub)
- Replace mock hash with actual bundler integration
- Add gas estimation
- Add paymaster integration
**Before (line 853):**
```typescript
private static async executeUserOperation(
  walletAddress: string,
  privateKey: string,
  transaction: Transaction,
  sessionKeyId?: string
): Promise<string> {
  // TODO: Build and send UserOperation to bundler
  const mockHash = `0x${Date.now().toString(16)}...`;
  return mockHash;
}
```
**After:**
```typescript
private static async executeUserOperation(
  walletAddress: string,
  privateKey: string,
  transaction: Transaction,
  sessionKeyId?: string
): Promise<string> {
  const signer = privateKeyToAccount(privateKey as `0x${string}`);
  const smartAccount = await SmartAccountService.getSmartAccount(signer);
  
  // Build callData based on transaction type
  const callData = this.buildCallData(transaction);
  
  // Send via smart account
  const userOpHash = await smartAccount.sendTransaction({
    to: transaction.details.recipientAddress,
    value: BigInt(transaction.tokenAmount),
    data: callData
  });
  
  return userOpHash;
}
```

#### `/services/SecureWalletStorage.ts`
**Lines to add:** ~30
**Changes:**
- Add storage keys for smart account
- Add methods to store/retrieve smart account address
**New Keys:**
```typescript
private static readonly SMART_ACCOUNT_ADDRESS_KEY = 'smart_account_address';
private static readonly SMART_ACCOUNT_DEPLOYED_KEY = 'smart_account_deployed';
```
**New Methods:**
```typescript
static async storeSmartAccountAddress(address: string): Promise<void>
static async getSmartAccountAddress(): Promise<string | null>
static async setSmartAccountDeployed(deployed: boolean): Promise<void>
static async isSmartAccountDeployed(): Promise<boolean>
```

### 2. State Management

#### `/store/walletStore.ts`
**Lines to add:** ~80
**Changes:**
- Add smart account state to `WalletState`
- Add smart account initialization
- Add smart account actions
**State Addition:**
```typescript
wallet: {
  address: string | null;           // EOA address
  smartAccountAddress: string | null; // NEW
  isSmartAccountDeployed: boolean;   // NEW
  mnemonic: string | null;
  privateKey: string | null;
  isLocked: boolean;
  networks: NetworkConfig[];
  activeNetwork: number;
}
```
**New Actions:**
```typescript
initializeSmartAccount: () => Promise<void>
deploySmartAccount: () => Promise<string>
getSmartAccountBalance: () => Promise<bigint>
```

### 3. Auth Screens

#### `/app/auth/create-wallet.tsx`
**Lines to add:** ~40
**Location:** After wallet creation (around line 25, after `generateWallet()`)
**Changes:**
- After EOA creation, create smart account
- Store smart account address
- Show loading state during deployment
**Addition (after wallet creation):**
```typescript
// After: const wallet = WalletService.createWalletFromMnemonic(mnemonic)

// Create smart account from EOA
const signer = privateKeyToAccount(wallet.privateKey as `0x${string}`);
const smartAccountInfo = await SmartAccountService.createSmartAccount(signer);

// Store smart account address
await SecureWalletStorage.storeSmartAccountAddress(smartAccountInfo.address);
await SecureWalletStorage.setSmartAccountDeployed(smartAccountInfo.isDeployed);
```

#### `/app/auth/import-wallet.tsx`
**Lines to add:** ~40
**Location:** After wallet import (around line 30, in `handleContinue()`)
**Changes:**
- After EOA import, link to smart account
- Check if smart account already exists
- Create new if doesn't exist
**Addition:**
```typescript
// After wallet import
const signer = privateKeyToAccount(wallet.privateKey as `0x${string}`);
const smartAccountAddress = await SmartAccountService.getSmartAccountAddress(signer);
const isDeployed = await SmartAccountService.isAccountDeployed(smartAccountAddress);

await SecureWalletStorage.storeSmartAccountAddress(smartAccountAddress);
await SecureWalletStorage.setSmartAccountDeployed(isDeployed);
```

#### `/app/auth/create-pin.tsx`
**Lines to add:** 0 (No changes needed)
**Reason:** PIN setup happens AFTER wallet creation, smart account already created

#### `/app/auth/confirm-pin.tsx`
**Lines to add:** 0 (No changes needed)
**Reason:** Just confirms PIN, wallet already set up

### 4. Main Dashboard

#### `/app/(tabs)/index.tsx`
**Lines to add:** ~150
**Location 1:** After greeting (line ~115), before balance card
**Location 2:** After balance card (line ~148), before quick actions
**Changes:**

**Addition 1 - Address Display (after line 115):**
```tsx
{/* Smart Account Address */}
<View style={styles.addressContainer}>
  <Text style={styles.addressLabel}>Wallet Address</Text>
  <TouchableOpacity onPress={copyAddress} style={styles.addressBox}>
    <Text style={styles.addressText}>
      {formatAddress(smartAccountAddress)}
    </Text>
    <MaterialCommunityIcons 
      name="content-copy" 
      size={16} 
      color={colors.primary} // Use #00C2FF
    />
  </TouchableOpacity>
</View>
```

**Addition 2 - Token List (after line 148):**
```tsx
{/* Token Balances */}
<View style={styles.tokenSection}>
  <View style={styles.tokenHeader}>
    <Text style={styles.tokenTitle}>Your Crypto Assets</Text>
    <TouchableOpacity>
      <MaterialCommunityIcons name="plus" size={20} color={colors.primary} />
    </TouchableOpacity>
  </View>
  
  <TokenList 
    address={smartAccountAddress}
    onTokenPress={(token) => router.push(`/token/${token.symbol}`)}
  />
</View>
```

**Styles to Add:**
```typescript
addressContainer: {
  marginTop: spacing.sm,
  marginBottom: spacing.md,
  paddingHorizontal: spacing.lg,
},
addressLabel: {
  fontSize: 12,
  color: colors.textSecondary, // #4B627A
  marginBottom: 4,
},
addressBox: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: colors.cardBackground, // #FFFFFF
  paddingHorizontal: 12,
  paddingVertical: 10,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: colors.border, // #E6EEF8
},
addressText: {
  fontSize: 14,
  fontFamily: 'monospace',
  color: colors.textPrimary, // #0B2545
},
tokenSection: {
  marginTop: spacing.lg,
  paddingHorizontal: spacing.lg,
},
tokenHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: spacing.md,
},
tokenTitle: {
  fontSize: 18,
  fontWeight: '600',
  color: colors.textPrimary,
},
```

### 5. Service Screens (NO CHANGES NEEDED)

These files already use `TransactionService` which will be updated:
- `/app/services/airtime.tsx` ✅ Already calls `TransactionService.purchaseAirtime()`
- `/app/services/bank-transfer.tsx` ✅
- `/app/services/electricity.tsx` ✅
- `/app/services/data.tsx` ✅
- `/app/services/cable-tv.tsx` ✅
- `/app/services/internet.tsx` ✅
- `/app/services/water.tsx` ✅
- `/app/services/education.tsx` ✅
- `/app/services/p2p-transfer.tsx` ✅
- `/app/services/send-crypto.tsx` ✅

**Reason:** These screens call `TransactionService.purchaseAirtime()`, `TransactionService.payElectricity()`, etc. Once we implement `executeUserOperation()` in `TransactionService.ts`, all these screens automatically use smart accounts.

---

## 📦 Dependencies to Install

```bash
# Core Account Abstraction
npm install permissionless

# Already installed (no changes needed):
# - viem ✅
# - axios ✅  
# - expo-clipboard ✅
# - bip39 ✅
# - expo-secure-store ✅
```

---

## 🎯 Implementation Order

### Phase 3.1-3.2: Core Services (Days 4-5)
1. Create `/services/smartAccount/types.ts`
2. Create `/services/smartAccount/BundlerService.ts`
3. Create `/services/smartAccount/PaymasterService.ts`
4. Create `/services/smartAccount/UserOperationBuilder.ts`
5. Create `/services/smartAccount/SmartAccountService.ts`
6. Modify `/services/SecureWalletStorage.ts`

### Phase 3.3: Wallet Integration (Days 6-7)
1. Modify `/services/WalletService.ts`
2. Modify `/store/walletStore.ts`
3. Modify `/app/auth/create-wallet.tsx`
4. Modify `/app/auth/import-wallet.tsx`

### Phase 3.4: Transaction Integration (Days 8-10)
1. Modify `/services/TransactionService.ts` - Implement `executeUserOperation()`
2. Test all service screens (they should work automatically)

### Phase 3.5-3.6: UI Components (Days 11-12)
1. Create `/components/AddressDisplay.tsx`
2. Create `/components/TokenCard.tsx`
3. Create `/components/TokenList.tsx`
4. Modify `/app/(tabs)/index.tsx`

---

## ✅ Checklist

### Files to CREATE (12 files)
- [ ] `/services/smartAccount/SmartAccountService.ts`
- [ ] `/services/smartAccount/BundlerService.ts`
- [ ] `/services/smartAccount/PaymasterService.ts`
- [ ] `/services/smartAccount/UserOperationBuilder.ts`
- [ ] `/services/smartAccount/types.ts`
- [ ] `/components/AddressDisplay.tsx`
- [ ] `/components/TokenCard.tsx`
- [ ] `/components/TokenList.tsx`
- [ ] `/hooks/useSmartAccount.ts`
- [ ] `/types/smartAccount.ts`
- [ ] `/contexts/SmartAccountContext.tsx` (optional)

### Files to MODIFY (7 files)
- [ ] `/services/WalletService.ts` (~100 lines)
- [ ] `/services/TransactionService.ts` (~50 lines - **CRITICAL**)
- [ ] `/services/SecureWalletStorage.ts` (~30 lines)
- [ ] `/store/walletStore.ts` (~80 lines)
- [ ] `/app/auth/create-wallet.tsx` (~40 lines)
- [ ] `/app/auth/import-wallet.tsx` (~40 lines)
- [ ] `/app/(tabs)/index.tsx` (~150 lines)

### Dependencies
- [ ] Install `permissionless`
- [ ] Get Pimlico API key (https://dashboard.pimlico.io/)
- [ ] Get Alchemy API key (optional, for paymaster)

### Color Scheme Verification
- [ ] All new components use `colors.primary` (#00C2FF)
- [ ] All backgrounds use `colors.cardBackground` (#FFFFFF)
- [ ] All text uses `colors.textPrimary/Secondary/Tertiary`
- [ ] No hardcoded colors (use theme context)

---

**Document Status:** ✅ Complete
**Total Estimated Changes:** ~1,500 lines of new code, ~400 lines modified
**Color Scheme:** Cyan/Electric Blue (#00C2FF, #BEEFFF) - NOT baby blue
