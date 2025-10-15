# Visual Component Guide

## Dashboard Layout

```
┌─────────────────────────────────────────────────────┐
│  ┌─────┐ Hi, User           [Sepolia ▼] 🎧 📷 🔔   │  ← Header
│  │  U  │ 0x1234...5678                              │
│  └─────┘                                            │
├─────────────────────────────────────────────────────┤
│  Selected Token                                     │
│  ┌──────────────────────────────┐                  │  ← Token Selector
│  │ 💎 cNGN                    ▼ │                  │    (Dropdown)
│  └──────────────────────────────┘                  │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐   │
│  │  Available Balance                          │   │  ← Balance Card
│  │  ₦25,340.50                                 │   │
│  │  [Transaction History] [Add Money]          │   │
│  └─────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│  Your Assets              [View All ▼]             │  ← Token List
│  ┌─────────────────────────────────────────────┐   │
│  │ 💎 cNGN                    1,234.56 cNGN    │   │
│  │    cNGN Stablecoin         ₦1,234.56        │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │ Ξ  ETH                     0.5 ETH          │   │
│  │    Ethereum                ₦985,432.10      │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │ ₮  USDT                    500.00 USDT      │   │
│  │    Tether USD              ₦775,000.00      │   │
│  └─────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│  Recent Transactions                                │
│  ...                                                │
└─────────────────────────────────────────────────────┘
```

## Token Modal (When Dropdown Clicked)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Select Token    [✓ Mainnet]             ✕  │   │  ← Header
│  ├─────────────────────────────────────────────┤   │
│  │                                             │   │
│  │  ┌─────────────────────────────────────┐   │   │
│  │  │ 💎 cNGN              1,234.56 cNGN  │   │   │  ← Token Item
│  │  │    cNGN Stablecoin   ₦1,234.56      │   │   │    (with balance)
│  │  └─────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────┐   │   │
│  │  │ Ξ  ETH               0.5 ETH        │   │   │
│  │  │    Ethereum          ₦985,432.10    │   │   │
│  │  └─────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────┐   │   │
│  │  │ 🦎 LSK               100.0 LSK      │   │   │
│  │  │    Lisk              ₦15,000.00     │   │   │
│  │  └─────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────┐   │   │
│  │  │ ₮  USDT              500.00 USDT    │   │   │
│  │  │    Tether USD        ₦775,000.00    │   │   │
│  │  └─────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────┐   │   │
│  │  │ ⭕ USDC              250.00 USDC    │   │   │
│  │  │    USD Coin          ₦387,500.00    │   │   │
│  │  └─────────────────────────────────────┘   │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Network Selector Modal

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Select Network                           ✕  │   │  ← Header
│  ├─────────────────────────────────────────────┤   │
│  │                                             │   │
│  │  ┌─────────────────────────────────────┐   │   │  ← Testnet Toggle
│  │  │ 🧪 Testnet Mode           [ON/OFF] │   │   │
│  │  └─────────────────────────────────────┘   │   │
│  │                                             │   │
│  │  ┌─────────────────────────────────────┐   │   │
│  │  │ Ξ  Ethereum Mainnet        ✓        │   │   │  ← Network (Selected)
│  │  │    ETH • Chain ID: 1                │   │   │
│  │  └─────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────┐   │   │
│  │  │ 🟡 BNB Smart Chain                  │   │   │  ← Network
│  │  │    BNB • Chain ID: 56               │   │   │
│  │  └─────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────┐   │   │
│  │  │ 🟣 Polygon                          │   │   │
│  │  │    MATIC • Chain ID: 137            │   │   │
│  │  └─────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────┐   │   │
│  │  │ 🦎 Lisk                             │   │   │
│  │  │    LSK • Chain ID: 1135             │   │   │
│  │  └─────────────────────────────────────┘   │   │
│  │                                             │   │
│  │  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐   │   │
│  │  │ ➕ Add Custom Network              │   │   │  ← Add Custom (Dashed)
│  │  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘   │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Network Indicator States

### Mainnet Mode:
```
┌──────────────────┐
│ 🟢 Ethereum  ▼  │  ← Green dot = Mainnet
└──────────────────┘
```

### Testnet Mode:
```
┌──────────────────┐
│ 🟠 Sepolia   ▼  │  ← Orange dot = Testnet
└──────────────────┘
```

## Component Interactions

### Token Selection Flow:
```
User clicks TokenSelector
      ↓
TokenModal opens (slides up from bottom)
      ↓
Shows all tokens available on current network
      ↓
User selects a token
      ↓
TokenModal closes
      ↓
Selected token updates in TokenSelector
      ↓
App state updates via NetworkContext
```

### Network Switching Flow:
```
User clicks Network Indicator
      ↓
NetworkSelector modal opens
      ↓
User toggles Testnet/Mainnet switch
      ↓
Available networks update automatically
(Ethereum ↔ Sepolia, BSC ↔ BSC Testnet, etc.)
      ↓
User selects a network
      ↓
Modal closes
      ↓
Network Indicator updates
      ↓
Token balances refresh for new network
      ↓
Smart account address updates (if different)
```

## Color Coding

- **Green (🟢)**: Mainnet mode, success states
- **Orange (🟠)**: Testnet mode, warning states
- **Blue**: Primary actions, interactive elements
- **Red**: Errors, notifications

## Animations

1. **Modal Entry**: Slide up from bottom (400ms ease-out)
2. **Modal Exit**: Slide down to bottom (300ms ease-in)
3. **Button Press**: Scale down to 0.95 (100ms)
4. **Network Switch**: Fade transition (200ms)
5. **Token Selection**: Highlight pulse (150ms)

## Responsive Behavior

- **Modal Height**: Max 80% of screen height
- **Scrollable Content**: FlatList for token/network lists
- **Safe Area**: Respects notch/status bar
- **Keyboard Aware**: Modal dismisses on outside tap
- **Loading States**: Skeleton/spinner during data fetch

## Accessibility Features

- **Touch Targets**: Minimum 44x44 points
- **Color Contrast**: WCAG AA compliant
- **Screen Reader**: Proper labels for all interactive elements
- **Haptic Feedback**: On selection and toggle actions
