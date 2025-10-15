# Smart Account Architecture - Visual Diagrams

## 📊 System Architecture

### High-Level Overview

```
┌──────────────────────────────────────────────────────────────┐
│                     CPPay Mobile App                         │
│                   (React Native + Expo)                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   UI Layer                             │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │   Dashboard  │  │   Airtime    │  │   P2P       │ │ │
│  │  │   (index)    │  │   Screen     │  │   Transfer  │ │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │ │
│  └─────────┼──────────────────┼─────────────────┼────────┘ │
│            │                  │                 │          │
│  ┌─────────▼──────────────────▼─────────────────▼────────┐ │
│  │              State Management (Zustand)               │ │
│  │  • walletStore                                        │ │
│  │    - address (EOA)                                    │ │
│  │    - smartAccountAddress (NEW)                       │ │
│  │    - isSmartAccountDeployed (NEW)                    │ │
│  │  • balances                                           │ │
│  │  • transactions                                       │ │
│  └─────────┬─────────────────────────────────────────────┘ │
│            │                                               │
│  ┌─────────▼─────────────────────────────────────────────┐ │
│  │              Service Layer                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │ │
│  │  │   Wallet     │  │ Transaction  │  │ Smart Acct │ │ │
│  │  │   Service    │  │   Service    │  │  Service   │ │ │
│  │  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘ │ │
│  └─────────┼──────────────────┼─────────────────┼────────┘ │
│            │                  │                 │          │
└────────────┼──────────────────┼─────────────────┼──────────┘
             │                  │                 │
             │    ┌─────────────▼─────────────────▼──────┐
             │    │      Permissionless.js SDK           │
             │    │  • createSmartAccountClient          │
             │    │  • signerToSimpleSmartAccount        │
             │    │  • sendUserOperation                 │
             │    └─────────────┬────────────────────────┘
             │                  │
             │    ┌─────────────▼────────────────────────┐
             │    │        Pimlico Bundler               │
             │    │  • Collects UserOperations           │
             │    │  • Bundles multiple UserOps          │
             │    │  • Gas sponsorship (paymaster)       │
             │    └─────────────┬────────────────────────┘
             │                  │
             ▼                  ▼
        ┌─────────┐      ┌──────────────┐
        │   EOA   │      │  EntryPoint  │
        │ (signs) │      │  (on-chain)  │
        └─────────┘      └──────┬───────┘
                                │
                         ┌──────▼───────┐
                         │Smart Account │
                         │ (your wallet)│
                         └──────────────┘
```

---

## 🔄 Transaction Flow Comparison

### OLD Flow (EOA - Current)

```
User taps "Buy Airtime"
         │
         ▼
   UI validates input
         │
         ▼
TransactionService.purchaseAirtime()
         │
         ▼
  Sign tx with private key
         │
         ▼
 Send to RPC (eth.llamarpc.com)
         │
         ▼
   Wait for confirmation
         │
         ▼
    Display success
```

**Issues:**
- ❌ User must have ETH for gas
- ❌ User must approve gas fees
- ❌ Separate tx for each action
- ❌ Can't batch operations

---

### NEW Flow (Smart Account - Target)

```
User taps "Buy Airtime"
         │
         ▼
   UI validates input
         │
         ▼
TransactionService.purchaseAirtime()
         │
         ▼
SmartAccountService.sendTransaction()
         │
         ├─────────────────────┐
         │                     │
         ▼                     ▼
  Build UserOp         Check paymaster
  • to: airtimeContract   (is gas sponsored?)
  • value: 0                    │
  • data: buyAirtime()          │
  • nonce: accountNonce         ▼
  • gas estimates           YES: Add paymaster
         │                  NO: User pays
         ▼
  Sign UserOp with EOA
         │
         ▼
  Send to Pimlico Bundler
         │
         ▼
  Bundler validates UserOp
         │
         ▼
  Bundler sends to EntryPoint
         │
         ▼
  EntryPoint.handleOps()
  • Calls SmartAccount.validateUserOp()
  • Calls SmartAccount.execute()
  • Pays gas (or paymaster pays)
         │
         ▼
  Transaction confirmed
         │
         ▼
    Display success
```

**Benefits:**
- ✅ Gas can be sponsored
- ✅ User only signs once
- ✅ Can batch multiple operations
- ✅ More flexible (upgradeable)

---

## 🏗️ Smart Account Components

### Component Hierarchy

```
SmartAccountService (Main)
     │
     ├─── BundlerService
     │      │
     │      └─── Pimlico API
     │           • eth_sendUserOperation
     │           • eth_getUserOperationReceipt
     │           • eth_estimateUserOperationGas
     │
     ├─── PaymasterService
     │      │
     │      └─── Pimlico Paymaster
     │           • pm_sponsorUserOperation
     │           • Policy: sponsor tx < $50
     │
     ├─── UserOperationBuilder
     │      │
     │      ├─── Build initCode (if not deployed)
     │      ├─── Build callData (execute call)
     │      ├─── Estimate gas
     │      ├─── Get nonce
     │      └─── Sign with EOA
     │
     └─── Permissionless.js SDK
            │
            ├─── signerToSimpleSmartAccount()
            ├─── createSmartAccountClient()
            └─── sendUserOperation()
```

---

## 🎨 UI Component Structure

### Dashboard Updates

```
app/(tabs)/index.tsx
     │
     ├─── Existing Components (NO CHANGES)
     │      ├─── Header (greeting, icons)
     │      ├─── BalanceCard
     │      ├─── QuickActions grid
     │      └─── Recent transactions
     │
     └─── NEW Components
            ├─── AddressDisplay
            │      ├─── Label: "Wallet Address"
            │      ├─── Address box
            │      │    ├─── Truncated address (0x742d...5e89)
            │      │    └─── Copy icon
            │      └─── Copy functionality
            │
            └─── TokenList
                   ├─── Header
                   │    ├─── Title: "Your Crypto Assets"
                   │    └─── Add button (+)
                   │
                   └─── TokenCard (repeated for each token)
                        ├─── Token icon
                        ├─── Token symbol (ETH, USDT)
                        ├─── Balance (0.8432 ETH)
                        ├─── NGN value (≈ ₦1,845,200)
                        └─── Chevron right (→)
```

### Color Usage Map

```
Dashboard Components:
├─── Background
│    └─── colors.background (#FAFBFF)
│
├─── AddressDisplay
│    ├─── Label: colors.textSecondary (#4B627A)
│    ├─── Box background: colors.cardBackground (#FFFFFF)
│    ├─── Box border: colors.border (#E6EEF8)
│    ├─── Address text: colors.textPrimary (#0B2545)
│    └─── Copy icon: colors.primary (#00C2FF) ← KEY COLOR
│
└─── TokenCard
     ├─── Background: colors.cardBackground (#FFFFFF)
     ├─── Border: colors.border (#E6EEF8)
     ├─── Token symbol: colors.textPrimary (#0B2545)
     ├─── Balance: colors.textSecondary (#4B627A)
     ├─── NGN value: colors.primary (#00C2FF) ← KEY COLOR
     └─── Chevron: colors.primary (#00C2FF) ← KEY COLOR
```

---

## 📊 Data Flow Diagram

### Wallet Creation Flow

```
                 ┌──────────────────┐
                 │  User creates    │
                 │  wallet          │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Generate mnemonic│
                 │ (12 words)       │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Derive EOA       │
                 │ • address        │
                 │ • privateKey     │
                 └────────┬─────────┘
                          │
                ┌─────────┴─────────┐
                │                   │
                ▼                   ▼
      ┌──────────────────┐   ┌──────────────────┐
      │ Store EOA        │   │ Create Smart     │
      │ • mnemonic       │   │ Account          │
      │ • privateKey     │   │ (counterfactual) │
      │ • address        │   │                  │
      └──────────────────┘   └────────┬─────────┘
                                      │
                                      ▼
                            ┌──────────────────┐
                            │ Store Smart Acct │
                            │ • address        │
                            │ • isDeployed=false│
                            └────────┬─────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │ Update UI        │
                            │ • Show address   │
                            │ • Show balances  │
                            └──────────────────┘
```

---

## 🔐 Security Model

### Key Storage & Access

```
┌─────────────────────────────────────────────────────────┐
│                Expo SecureStore                         │
│                (Device-level encryption)                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  wallet_mnemonic            = [encrypted 12 words]     │
│  wallet_private_key         = [encrypted 0x...]        │
│  wallet_address             = 0x1234... (EOA)          │
│  smart_account_address      = 0x5678... (NEW)          │
│  smart_account_deployed     = false (NEW)              │
│  password_hash              = [hashed PIN/password]    │
│  biometric_enabled          = true/false               │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Access requires:
                          │ • PIN/password OR
                          │ • Biometric auth
                          │
                          ▼
              ┌───────────────────────┐
              │   Application Code    │
              │  (can decrypt keys)   │
              └───────────┬───────────┘
                          │
          ┌───────────────┴───────────────┐
          │                               │
          ▼                               ▼
   ┌────────────┐                 ┌─────────────┐
   │ EOA Signer │                 │Smart Account│
   │ (signs     │────Signs────────▶│(executes tx)│
   │ UserOps)   │                 │             │
   └────────────┘                 └─────────────┘
```

### Signature Flow

```
1. User initiates transaction
         │
         ▼
2. Build UserOperation
   • sender: smartAccountAddress
   • callData: execute(to, value, data)
   • nonce, gas, etc.
         │
         ▼
3. Hash UserOperation
   userOpHash = keccak256(userOp)
         │
         ▼
4. Sign with EOA private key
   signature = EOA.sign(userOpHash)
         │
         ▼
5. Add signature to UserOp
   userOp.signature = signature
         │
         ▼
6. Send to bundler
         │
         ▼
7. EntryPoint verifies signature
   SmartAccount.validateUserOp()
   • Recovers signer from signature
   • Checks if signer == owner
   • Returns 0 if valid
         │
         ▼
8. Execute if valid
   SmartAccount.execute(to, value, data)
```

---

## 💰 Cost Structure

### Transaction Cost Breakdown

```
Traditional EOA Transaction:
┌─────────────────────────────────┐
│ Gas Cost                        │
│ ├─ Base Fee: ~$0.50            │
│ ├─ Priority Fee: ~$0.10        │
│ └─ Total: ~$0.60               │
│                                 │
│ Paid by: USER                   │
└─────────────────────────────────┘


Smart Account Transaction (Sponsored):
┌─────────────────────────────────┐
│ Gas Cost                        │
│ ├─ Base Fee: ~$0.70 (higher)   │
│ ├─ Priority Fee: ~$0.10        │
│ ├─ Bundler Fee: ~$0.02         │
│ └─ Total: ~$0.82               │
│                                 │
│ Paid by: PAYMASTER (CPPay)     │
└─────────────────────────────────┘


Smart Account Transaction (User Pays):
┌─────────────────────────────────┐
│ Gas Cost                        │
│ ├─ Base Fee: ~$0.70            │
│ ├─ Priority Fee: ~$0.10        │
│ ├─ Bundler Fee: ~$0.02         │
│ └─ Total: ~$0.82               │
│                                 │
│ Paid by: USER (from balance)   │
└─────────────────────────────────┘
```

### Monthly Cost Projection

```
Scenario: 1,000 active users, 10 tx/user/month = 10,000 tx/month

┌──────────────────────────────────────────────────────────┐
│ Cost Component              │ Calculation     │ Cost     │
├──────────────────────────────────────────────────────────┤
│ Bundler Fees                │ 10,000 × $0.02 │ $200     │
│ Sponsored Gas (50% of tx)   │ 5,000 × $0.70  │ $350     │
│ Infrastructure (servers)     │ Fixed          │ $50      │
├──────────────────────────────────────────────────────────┤
│ TOTAL MONTHLY COST          │                │ $600     │
└──────────────────────────────────────────────────────────┘

Cost per user: $0.60/month
Cost per transaction: $0.06

Compared to: Traditional payment processing (2-3% per tx)
```

---

## 🔄 State Transitions

### Smart Account Lifecycle

```
State 1: NO WALLET
     │
     │ User creates/imports wallet
     ▼
State 2: EOA ONLY
     │ - EOA address: 0x1234...
     │ - Smart account: null
     │ - Deployed: false
     │
     │ SmartAccountService.createSmartAccount()
     ▼
State 3: EOA + SMART ACCOUNT (Counterfactual)
     │ - EOA address: 0x1234...
     │ - Smart account: 0x5678... (calculated)
     │ - Deployed: false
     │
     │ First transaction sent
     ▼
State 4: SMART ACCOUNT DEPLOYED
     │ - EOA address: 0x1234... (signer)
     │ - Smart account: 0x5678... (deployed)
     │ - Deployed: true
     │ - Can receive funds
     │ - Can send transactions
     │
     │ Normal usage
     ▼
State 5: ACTIVE
     │ - Sending transactions
     │ - Receiving funds
     │ - Gas sponsored (if eligible)
```

---

## 📱 Screen Mockups

### Before & After Comparison

```
┌────────────────────────────────────────────────┐
│                  BEFORE                        │
├────────────────────────────────────────────────┤
│  👤 Hi, SOBIL          🎧 📷 🔔              │
│                                                │
│  ╔══════════════════════════════════════════╗ │
│  ║  💼 Total Balance                        ║ │
│  ║     ₦ 2,458,372.50                       ║ │
│  ║  [Transaction History]                   ║ │
│  ╚══════════════════════════════════════════╝ │
│                                                │
│  ┌─────┐ ┌─────┐ ┌─────┐                     │
│  │To CP│ │To   │ │With │                     │
│  │Pay  │ │Bank │ │draw │  [Quick Actions]    │
│  └─────┘ └─────┘ └─────┘                     │
│                                                │
│  Recent Transactions                           │
│  • Airtime ₦500                               │
│  • Bank Transfer ₦10,000                      │
└────────────────────────────────────────────────┘
```

```
┌────────────────────────────────────────────────┐
│                   AFTER                        │
├────────────────────────────────────────────────┤
│  👤 Hi, SOBIL          🎧 📷 🔔              │
│                                                │
│  Wallet Address                          ◄NEW │
│  ┌──────────────────────────────────────┐     │
│  │ 0x742d...5e89                 📋    │     │
│  └──────────────────────────────────────┘     │
│                                                │
│  ╔══════════════════════════════════════════╗ │
│  ║  💼 Total Balance                        ║ │
│  ║     ₦ 2,458,372.50                       ║ │
│  ║  [Transaction History]                   ║ │
│  ╚══════════════════════════════════════════╝ │
│                                                │
│  Your Crypto Assets                    +  ◄NEW│
│  ┌──────────────────────────────────────┐     │
│  │ 🟣 ETH      0.8432 ETH            → │     │
│  │             ≈ ₦1,845,200             │     │
│  └──────────────────────────────────────┘     │
│  ┌──────────────────────────────────────┐     │
│  │ 🟢 USDT     1,250.00 USDT         → │     │
│  │             ≈ ₦562,500               │     │
│  └──────────────────────────────────────┘     │
│                                                │
│  ┌─────┐ ┌─────┐ ┌─────┐                     │
│  │To CP│ │To   │ │With │                     │
│  │Pay  │ │Bank │ │draw │  [Quick Actions]    │
│  └─────┘ └─────┘ └─────┘                     │
└────────────────────────────────────────────────┘
```

---

**Document Status:** ✅ Complete
**Purpose:** Visual reference for architecture and implementation
**Use this:** Alongside other documentation for better understanding
