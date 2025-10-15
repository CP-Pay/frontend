# Smart Account Integration - Technical Planning & SDK Selection

## 🔧 PHASE 2: Implementation Approach Decision

### SDK Comparison & Recommendation

After analyzing the CPPay codebase and requirements, here's the comprehensive evaluation:

---

## Option A: **Permissionless.js** (RECOMMENDED ✅)

### Overview
Permissionless is a TypeScript library for building with ERC-4337 account abstraction. It's framework-agnostic, modular, and has native viem integration.

### Pros ✅
1. **Native viem integration** - CPPay already uses viem, perfect fit
2. **React Native compatible** - Works out of the box
3. **Modular design** - Can swap bundlers, paymasters, account implementations
4. **Active development** - Regular updates and bug fixes
5. **Multiple bundler support** - Pimlico, Alchemy, Stackup, Biconomy
6. **Type-safe** - Full TypeScript support
7. **Lightweight** - Smaller bundle size
8. **Free to use** - Open source, no vendor lock-in

### Cons ⚠️
1. Requires manual bundler setup (not a complete infrastructure)
2. Need separate paymaster service for gas sponsorship
3. Documentation can be sparse for React Native specifics

### Integration Complexity: **MEDIUM**

### Installation
```bash
npm install permissionless viem
```

### Basic Implementation Example

```typescript
import { createSmartAccountClient } from "permissionless"
import { signerToSimpleSmartAccount } from "permissionless/accounts"
import { createPimlicoBundlerClient, createPimlicoPaymasterClient } from "permissionless/clients/pimlico"
import { createPublicClient, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { mainnet } from "viem/chains"

// 1. Setup clients
const publicClient = createPublicClient({
  transport: http("https://eth.llamarpc.com"),
  chain: mainnet
})

const bundlerClient = createPimlicoBundlerClient({
  transport: http("https://api.pimlico.io/v2/mainnet/rpc?apikey=YOUR_API_KEY"),
  entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
})

const paymasterClient = createPimlicoPaymasterClient({
  transport: http("https://api.pimlico.io/v2/mainnet/rpc?apikey=YOUR_API_KEY"),
  entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
})

// 2. Create EOA signer from existing wallet
const signer = privateKeyToAccount("0x..." as `0x${string}`)

// 3. Create smart account
const smartAccount = await signerToSimpleSmartAccount(publicClient, {
  signer,
  factoryAddress: "0x9406Cc6185a346906296840746125a0E44976454", // SimpleAccountFactory
  entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
})

console.log("Smart Account Address:", smartAccount.address)

// 4. Create smart account client
const smartAccountClient = createSmartAccountClient({
  account: smartAccount,
  chain: mainnet,
  bundlerTransport: http("https://api.pimlico.io/v2/mainnet/rpc?apikey=YOUR_API_KEY"),
  middleware: {
    gasPrice: async () => (await bundlerClient.getUserOperationGasPrice()).fast,
    sponsorUserOperation: paymasterClient.sponsorUserOperation
  }
})

// 5. Send transaction
const txHash = await smartAccountClient.sendTransaction({
  to: "0x...",
  value: parseEther("0.01"),
  data: "0x"
})

console.log("Transaction Hash:", txHash)
```

### Cost Estimate
- **Bundler:** Pimlico free tier (500 UserOps/month), then $0.02 per UserOp
- **Paymaster:** Pimlico free tier (100 sponsored ops/month), then pay-as-you-go
- **Total monthly (1000 users, 10 tx/user):** ~$200-400/month

---

## Option B: **Alchemy AA SDK** (@alchemy/aa-sdk)

### Overview
Complete infrastructure solution from Alchemy with bundler, paymaster, and smart account implementations.

### Pros ✅
1. **All-in-one solution** - Bundler + Paymaster + SDK
2. **Good documentation** - Extensive guides and examples
3. **Free tier** - Generous free tier for gas sponsorship
4. **Dashboard** - Visual dashboard for monitoring
5. **Enterprise support** - Available if needed
6. **Multi-chain** - Supports Ethereum, Polygon, Arbitrum, Optimism, Base

### Cons ⚠️
1. **Vendor lock-in** - Tied to Alchemy ecosystem
2. **React Native issues** - Some compatibility problems reported
3. **Heavier bundle** - Larger package size
4. **Less flexible** - Can't easily swap bundlers
5. **Requires Alchemy API key** - One more dependency

### Integration Complexity: **LOW-MEDIUM**

### Installation
```bash
npm install @alchemy/aa-sdk @alchemy/aa-accounts viem
```

### Basic Implementation Example

```typescript
import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy"
import { LocalAccountSigner } from "@alchemy/aa-core"
import { sepolia } from "viem/chains"

// 1. Create signer from existing wallet
const signer = LocalAccountSigner.privateKeyToAccountSigner("0x...")

// 2. Create smart account client (auto-creates smart account)
const client = await createModularAccountAlchemyClient({
  apiKey: "YOUR_ALCHEMY_API_KEY",
  chain: sepolia,
  signer,
  gasManagerConfig: {
    policyId: "YOUR_GAS_POLICY_ID" // For sponsored gas
  }
})

console.log("Smart Account Address:", client.getAddress())

// 3. Send transaction
const { hash } = await client.sendUserOperation({
  uo: {
    target: "0x...",
    value: 0n,
    data: "0x"
  }
})

console.log("Transaction Hash:", hash)
```

### Cost Estimate
- **Free tier:** 5M+ monthly requests (more than enough for most apps)
- **Gas sponsorship:** Free tier includes sponsored gas
- **Total monthly:** FREE (within limits)

---

## Option C: **ZeroDev SDK** (@zerodev/sdk)

### Overview
Developer-focused AA platform with advanced features like session keys, recovery, and plugins.

### Pros ✅
1. **Advanced features** - Session keys, social recovery, plugins
2. **Developer-friendly** - Great DX, clear documentation
3. **Gasless transactions** - Built-in paymaster
4. **Multi-chain** - Good multi-chain support
5. **Kernel account** - More advanced than SimpleAccount

### Cons ⚠️
1. **Paid service** - No free tier for production
2. **React Native untested** - Limited RN documentation
3. **Smaller community** - Less community support
4. **Vendor lock-in** - Similar to Alchemy

### Integration Complexity: **MEDIUM**

### Installation
```bash
npm install @zerodev/sdk viem
```

### Cost Estimate
- **Pricing:** $99/month starter plan
- **Not recommended** for CPPay at this stage

---

## Option D: **Biconomy SDK** (@biconomy/account)

### Overview
Enterprise AA solution with strong focus on gasless transactions.

### Pros ✅
1. **Enterprise-grade** - Used by major dApps
2. **Gasless focus** - Best paymaster implementation
3. **Multi-chain** - Extensive chain support
4. **Dashboard** - Analytics and monitoring

### Cons ⚠️
1. **Complex setup** - Steep learning curve
2. **React Native issues** - Known compatibility problems
3. **Heavy package** - Large bundle size
4. **Paid tiers** - Expensive for scale

### Integration Complexity: **HIGH**

### Cost Estimate
- **Pricing:** Contact for pricing (typically $500+/month)
- **Not recommended** for CPPay

---

## Option E: **Custom Implementation** (Direct EntryPoint Integration)

### Overview
Build everything from scratch using EntryPoint contract directly.

### Pros ✅
1. **Full control** - Complete customization
2. **No vendor lock-in** - Own infrastructure
3. **Cost-effective** - No third-party fees (except gas)

### Cons ⚠️
1. **Extremely complex** - 2-3 months development time
2. **Security risks** - Need security audits
3. **Maintenance burden** - Must maintain bundler infrastructure
4. **Not recommended** - Unless you're building an AA platform

### Integration Complexity: **VERY HIGH**

---

## 🎯 FINAL RECOMMENDATION

## ✅ **Permissionless.js** (Option A)

### Why Permissionless?

1. **Perfect fit for CPPay:**
   - Already using viem ✅
   - React Native compatible ✅
   - Modular and flexible ✅
   - Free and open source ✅

2. **Best balance:**
   - Not too complex (vs Custom)
   - Not too restrictive (vs Alchemy/ZeroDev)
   - Good community support
   - Active development

3. **Cost-effective:**
   - Free SDK
   - Pay-as-you-go bundler (Pimlico)
   - Reasonable pricing for scale

4. **Future-proof:**
   - Can swap bundlers if needed
   - Can swap paymasters if needed
   - No vendor lock-in

### Implementation Plan with Permissionless

#### Step 1: Setup Pimlico Account
1. Go to https://dashboard.pimlico.io/
2. Create free account
3. Get API key for Ethereum Mainnet, BSC, Polygon
4. Configure gas sponsorship rules (under $50 transactions)

#### Step 2: Install Dependencies
```bash
npm install permissionless
```

#### Step 3: Environment Configuration
Create `.env` file:
```env
PIMLICO_API_KEY_MAINNET=pim_xxx
PIMLICO_API_KEY_BSC=pim_xxx
PIMLICO_API_KEY_POLYGON=pim_xxx

# EntryPoint address (v0.6)
ENTRYPOINT_ADDRESS=0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789

# SimpleAccountFactory addresses
FACTORY_ADDRESS_MAINNET=0x9406Cc6185a346906296840746125a0E44976454
FACTORY_ADDRESS_BSC=0x9406Cc6185a346906296840746125a0E44976454
FACTORY_ADDRESS_POLYGON=0x9406Cc6185a346906296840746125a0E44976454
```

#### Step 4: Architecture Design

```
┌─────────────────────────────────────────────┐
│         CPPay React Native App              │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │      UI Layer (React Native)         │  │
│  │  - HomeScreen                        │  │
│  │  - AirtimeScreen                     │  │
│  │  - TransactionScreen                 │  │
│  └──────────────┬───────────────────────┘  │
│                 │                           │
│  ┌──────────────▼───────────────────────┐  │
│  │   State Management (Zustand)         │  │
│  │  - walletStore                       │  │
│  │    + smartAccountAddress             │  │
│  │    + isSmartAccountDeployed          │  │
│  └──────────────┬───────────────────────┘  │
│                 │                           │
│  ┌──────────────▼───────────────────────┐  │
│  │   Service Layer                      │  │
│  │  - SmartAccountService ←────────────┐│  │
│  │  - TransactionService                ││  │
│  │  - WalletService                     ││  │
│  └──────────────┬───────────────────────┘│  │
│                 │                         │  │
│  ┌──────────────▼────────────────────┐   │  │
│  │   Permissionless.js SDK           │   │  │
│  │  - createSmartAccountClient       │   │  │
│  │  - signerToSimpleSmartAccount     │   │  │
│  └──────────────┬────────────────────┘   │  │
│                 │                         │  │
└─────────────────┼─────────────────────────┘  
                  │                            
        ┌─────────▼──────────┐                 
        │   Pimlico Bundler  │                 
        │  - UserOp bundling │                 
        │  - Gas sponsorship │                 
        └─────────┬──────────┘                 
                  │                            
        ┌─────────▼──────────┐                 
        │   EntryPoint       │                 
        │   (On-chain)       │                 
        └─────────┬──────────┘                 
                  │                            
        ┌─────────▼──────────┐                 
        │  Smart Account     │                 
        │   (Your Wallet)    │                 
        └────────────────────┘                 
```

---

## 📊 Comparison Matrix

| Feature | Permissionless | Alchemy | ZeroDev | Biconomy | Custom |
|---------|----------------|---------|---------|----------|--------|
| **Viem Integration** | ✅ Native | ⚠️ Wrapper | ⚠️ Wrapper | ❌ Own | ✅ Native |
| **React Native** | ✅ Yes | ⚠️ Limited | ⚠️ Limited | ❌ No | ✅ Yes |
| **Bundle Size** | 🟢 Small | 🟡 Medium | 🟡 Medium | 🔴 Large | 🟢 Small |
| **Cost (1K users)** | 🟢 $200/mo | 🟢 Free | 🔴 $99/mo | 🔴 $500+/mo | 🟢 Gas only |
| **Setup Time** | 🟡 2-3 days | 🟢 1 day | 🟡 2-3 days | 🔴 1 week | 🔴 2-3 months |
| **Flexibility** | ✅ High | ⚠️ Medium | ⚠️ Medium | ⚠️ Medium | ✅ Very High |
| **Vendor Lock-in** | ✅ None | ❌ Alchemy | ❌ ZeroDev | ❌ Biconomy | ✅ None |
| **Documentation** | 🟡 Good | 🟢 Excellent | 🟢 Excellent | 🟡 Good | ⚠️ DIY |
| **Community** | 🟢 Active | 🟢 Active | 🟡 Growing | 🟢 Active | 🟡 General |
| **Gas Sponsorship** | ✅ Via Pimlico | ✅ Built-in | ✅ Built-in | ✅ Built-in | ⚠️ DIY |

**Legend:**
- ✅ Excellent / Yes
- 🟢 Good / Low cost
- 🟡 Moderate / Medium cost
- ⚠️ Limited / Caution
- ❌ Poor / No
- 🔴 High cost / Difficult

---

## 🎯 Implementation Roadmap with Permissionless

### Week 1: Setup & Core Services
- **Day 1:** Setup Pimlico account, get API keys
- **Day 2:** Create `SmartAccountService.ts` with Permissionless
- **Day 3:** Create `BundlerService.ts` for Pimlico integration
- **Day 4:** Create `PaymasterService.ts` for gas sponsorship
- **Day 5:** Test smart account creation and basic transactions

### Week 2: Integration
- **Day 6:** Integrate with `WalletService.ts`
- **Day 7:** Update `TransactionService.ts` - implement `executeUserOperation()`
- **Day 8:** Update wallet creation/import flows
- **Day 9:** Update `walletStore.ts` with smart account state
- **Day 10:** Test wallet creation end-to-end

### Week 3: UI & Testing
- **Day 11:** Create address display component
- **Day 12:** Create token list components
- **Day 13:** Update dashboard with smart account info
- **Day 14:** Full integration testing

---

## 📝 Next Steps

1. **Approve this recommendation** ✅
2. **Create Pimlico account** → https://dashboard.pimlico.io/
3. **Get API keys** for:
   - Ethereum Mainnet
   - BSC Mainnet
   - Polygon Mainnet
4. **Configure gas sponsorship policy:**
   - Sponsor transactions under ₦80,000 (~$50)
   - Daily limit per wallet: 10 transactions
   - Monthly budget: Set based on expected users
5. **Install Permissionless:**
   ```bash
   npm install permissionless
   ```
6. **Begin Phase 3 implementation**

---

## ⚠️ Important Decisions Needed

### 1. Which bundler service?
**Recommendation:** Pimlico
- Free tier: 500 UserOps/month
- Pay-as-you-go after that
- Good documentation for Permissionless
- Multi-chain support

### 2. Which networks?
**Recommendation:** Start with one, expand later
- **Phase 1:** Ethereum Mainnet only
- **Phase 2:** Add BSC (lower fees)
- **Phase 3:** Add Polygon

### 3. Gas sponsorship policy?
**Recommendation:**
```typescript
{
  maxSponsoredAmount: 80000, // ₦80,000 (~$50)
  dailyLimitPerWallet: 10,
  monthlyBudget: 1000000, // ₦1M (~$625)
  sponsorCategories: [
    'AIRTIME',     // Always sponsor
    'DATA',        // Always sponsor
    'ELECTRICITY', // Sponsor if < ₦50,000
    'P2P_TRANSFER' // Don't sponsor
  ]
}
```

### 4. Should we support existing EOA wallets?
**Recommendation:** Yes, dual mode
- **New users:** Smart account by default
- **Existing users:** Prompt to upgrade, keep EOA as backup
- **Migration:** Gradual, user-initiated

### 5. What happens to existing user balances?
**Recommendation:** User-initiated migration
- Show banner: "Upgrade to Smart Account for gasless transactions"
- User clicks → Creates smart account
- User manually transfers funds from EOA to Smart Account
- Keep both addresses accessible

---

**Document Status:** ✅ Complete
**Recommendation:** Permissionless.js + Pimlico Bundler
**Estimated Total Cost:** $200-400/month (1000 active users)
**Implementation Time:** 2-3 weeks
**Next Phase:** Begin Implementation (Phase 3)
