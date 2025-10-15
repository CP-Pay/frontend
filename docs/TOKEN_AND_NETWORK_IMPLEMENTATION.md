# Token & Network Management Implementation

## Overview
Implemented a comprehensive token and network management system similar to MetaMask, with smart account integration from EOA (Externally Owned Account).

## Features Implemented

### 1. **Token Management**
- ✅ Default tokens: cNGN (default), ETH, BNB, USDT, USDC, LISK (6 tokens total)
- ✅ Token selector dropdown component
- ✅ Token modal for selection with balances
- ✅ Network-aware token filtering (only shows tokens available on current network)
- ✅ Token balance display with NGN/USD values

### 2. **Network Management**
- ✅ Multi-network support: Ethereum, BSC, Polygon, Lisk
- ✅ Testnet/Mainnet toggle (similar to MetaMask)
- ✅ Network selector modal with visual indicator
- ✅ Automatic network switching when toggling testnet/mainnet
- ✅ Network state persistence (saved to secure storage)

### 3. **Smart Account Integration**
- ✅ Smart accounts created from EOA (using ERC-4337)
- ✅ Proper integration with Permissionless.js v0.2.57
- ✅ Smart account address display on dashboard
- ✅ Network-specific smart account handling

## Files Created/Modified

### New Files:
1. **components/TokenModal.tsx** (270 lines)
   - Modal for token selection
   - Shows token balances, logos, and NGN values
   - Network badge indicator (testnet/mainnet)

2. **components/TokenSelector.tsx** (110 lines)
   - Dropdown button to select tokens
   - Opens TokenModal on click
   - Shows current selected token with logo

3. **components/NetworkSelector.tsx** (300 lines)
   - MetaMask-style network selector
   - Testnet/Mainnet toggle switch
   - Shows available networks based on mode
   - "Add Custom Network" option (UI ready)

4. **contexts/NetworkContext.tsx** (175 lines)
   - Manages current network state
   - Handles testnet/mainnet switching
   - Manages selected token
   - Persists preferences to secure storage
   - Supports custom networks

### Modified Files:
1. **constants/Tokens.ts**
   - Updated to include only 6 default tokens: cNGN, ETH, BNB, USDT, USDC, LSK
   - Added addresses for all supported networks (mainnet + testnet)
   - Removed DAI, MATIC (kept as network native currency but not as token)

2. **app/(tabs)/index.tsx**
   - Added TokenSelector component in header
   - Added NetworkIndicator button
   - Integrated with NetworkContext
   - Token balances now refresh on network change
   - Added NetworkSelector modal

3. **app/_layout.tsx**
   - Wrapped app with NetworkProvider
   - Ensures network context available throughout app

## Architecture

```
┌─────────────────────────────────────┐
│         NetworkProvider             │
│  - currentNetwork                   │
│  - selectedToken                    │
│  - isTestnet                        │
│  - availableNetworks                │
└──────────┬──────────────────────────┘
           │
           ├──> Dashboard (index.tsx)
           │    ├──> NetworkIndicator → NetworkSelector
           │    ├──> TokenSelector → TokenModal
           │    └──> TokenList (balances)
           │
           ├──> SmartAccountService
           │    └──> Creates smart account from EOA
           │
           └──> TokenBalanceService
                └──> Fetches balances for current network
```

## User Flow

### Token Selection:
1. User clicks TokenSelector dropdown
2. TokenModal opens showing available tokens for current network
3. User selects a token
4. Selected token updates globally via NetworkContext
5. Token balances refresh automatically

### Network Switching:
1. User clicks NetworkIndicator in header
2. NetworkSelector modal opens
3. User can toggle between Testnet/Mainnet
4. User selects a network
5. App automatically:
   - Updates current network
   - Switches to equivalent network (e.g., Ethereum → Sepolia)
   - Refreshes token balances
   - Updates smart account context

### Smart Account Creation:
1. User creates/imports wallet (generates EOA)
2. WalletService.createSmartAccountFromSigner() is called
3. SmartAccountService.createSmartAccount() creates counterfactual address
4. Smart account address displayed on dashboard
5. Smart account can be used for transactions on any supported network

## Key Components

### TokenModal
```tsx
<TokenModal
  visible={boolean}
  onClose={() => void}
  onSelectToken={(token) => void}
  currentChainId={number}
  tokenBalances={TokenBalance[]}
  isTestnet={boolean}
/>
```

### TokenSelector
```tsx
<TokenSelector
  selectedToken={Token}
  onSelectToken={(token) => void}
  currentChainId={number}
  tokenBalances={TokenBalance[]}
  isTestnet={boolean}
/>
```

### NetworkSelector
```tsx
<NetworkSelector
  visible={boolean}
  onClose={() => void}
/>
```

## Network Configuration

### Mainnets:
- Ethereum (Chain ID: 1)
- BSC (Chain ID: 56)
- Polygon (Chain ID: 137)
- Lisk (Chain ID: 1135)

### Testnets:
- Sepolia (Chain ID: 11155111)
- BSC Testnet (Chain ID: 97)
- Polygon Amoy (Chain ID: 80002)
- Lisk Sepolia (Chain ID: 4202)

## Token Configuration

| Symbol | Name | Decimals | Networks |
|--------|------|----------|----------|
| cNGN | cNGN Stablecoin | 18 | All networks (8 networks) |
| ETH | Ethereum | 18 | Ethereum, Sepolia |
| BNB | BNB | 18 | BSC, BSC Testnet |
| LSK | Lisk | 18 | Lisk, Lisk Sepolia |
| USDT | Tether USD | 6 | All networks (8 networks) |
| USDC | USD Coin | 6 | All networks (8 networks) |

## Smart Account Details

### How It Works:
1. **EOA Generation**: User creates wallet → generates mnemonic → derives private key
2. **Smart Account Creation**: 
   ```typescript
   const smartAccount = await toSimpleSmartAccount({
     client: publicClient,
     owner: eoaSigner, // EOA controls the smart account
     factoryAddress: FACTORY_ADDRESS,
     entryPoint: { address: ENTRYPOINT_ADDRESS, version: '0.6' },
   });
   ```
3. **Counterfactual Address**: Smart account address is deterministic (same EOA → same smart account address)
4. **Deployment**: Account is deployed on-chain when first transaction is sent
5. **Multi-Network**: Same EOA can control smart accounts on different networks

### Benefits:
- Gas sponsorship (via paymasters)
- Batch transactions
- Social recovery
- Custom validation logic
- Same address across networks (deterministic)

## Next Steps (Optional Enhancements)

1. **Custom Network Addition**
   - Implement form to add custom RPC URLs
   - Validate chain ID and RPC connectivity
   - Save custom networks to secure storage

2. **Token Import**
   - Allow users to import custom ERC-20 tokens
   - Auto-detect tokens from wallet activity
   - Token search by contract address

3. **Network Auto-Switch**
   - Detect when dApp requests different network
   - Prompt user to switch networks
   - Handle multi-network transactions

4. **Gas Estimation**
   - Show estimated gas fees in token selector
   - Display gas costs in NGN/USD
   - Warn if insufficient gas

5. **Transaction History by Network**
   - Filter transactions by network
   - Show network-specific transaction details
   - Export transaction history

## Testing Checklist

- [ ] Token selection updates globally
- [ ] Network switching refreshes balances
- [ ] Testnet/Mainnet toggle works correctly
- [ ] Smart account address persists across sessions
- [ ] Token balances display correctly for each network
- [ ] Network indicator shows correct network
- [ ] Modal animations work smoothly
- [ ] Preferences persist after app restart

## Notes

- cNGN is set as the default token (index 0 in DEFAULT_TOKENS)
- Smart accounts are created from the user's EOA (not a separate account)
- Network preferences are saved to SecureStore
- Token addresses are examples and should be verified for production
- All components use the theme system for consistent styling
