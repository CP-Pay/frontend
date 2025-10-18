### CPPay: Seamless Fintech Mobile App with Blockchain-Powered Backend


CPPay is an innovative mobile banking and fintech application that combines a user-friendly React Native frontend with a sophisticated Ethereum-based backend using the EIP-2535 Diamond Standard and ERC-4337 Account Abstraction. Designed for effortless money transfers, bill payments, airtime/data purchases, and savings management, CPPay delivers a Web2-like experience with blockchain security. The app features a baby blue (#8FD9FB) branding theme and integrates CNGN stablecoin for gas sponsorship and multi-token payments. It supports freemium, premium, and enterprise tiers for scalable monetization.
Whether you're a user sending remittances or a developer building decentralized finance tools, CPPay bridges traditional banking with blockchain efficiency.

## Key Highlights

- **User-Centric Mobile Interface**: Intuitive screens for daily financial tasks, with mock data for quick prototyping.
- **Blockchain Backend**: Modular Diamond proxy architecture for upgradability, gas sponsorship via CNGN, social recovery, session keys, and batch operations.
- **Monetization Tiers**: Freemium for basic use, premium for advanced features like priority processing, and enterprise for custom add-ons.
- **Security-First Design**: Guardian-based recovery, timelocks, and admin controls for emergency pauses and blacklists.
- **Multi-Token Support**: Pay fees in native ETH, ERC-20 tokens, or CNGN, with Chainlink oracles for USD conversions.

## Features

### Mobile App Features
- **Dashboard (Home)**: Personalized greeting, balance overview, recent transactions, quick action grid (e.g., transfers, bills, airtime), and promotional offers.
- **Transactions**: Filterable history with monthly summaries, in/out totals, and analytical insights.
- **Transaction Details**: In-depth views with icons, status badges, metadata, and copyable references.
- **Notifications**: Tabbed categories for transactions, services, and activities.
- **Finance/Savings**: Total balance tracking, OWealth integration, SafeBox, Fixed Savings, and spend/save tools.
- **Profile**: Editable user info, account details, tier status with upgrade options, and contact management.
- **Coming Soon**: Rewards system for loyalty points and Cards for virtual/physical debit options.

### Blockchain Features
- **Account Abstraction**: Smart contract wallets with session keys for delegated, scoped actions.
- **Gas Sponsorship**: Paymaster supports CNGN and other tokens, enforcing tier-based quotas and fees.
- **Batch Processing**: Sequential or atomic multi-operations, limited by user tier.
- **Social Recovery**: Guardian approvals with 48-hour timelocks; premium users get professional assistance.
- **Subscriptions & Add-Ons**: USD-quoted plans with auto-renew, annual discounts, and extras like analytics or API access.
- **Admin Tools**: Upgrades via DiamondCut, token management, and monthly usage resets.

## Color Palette & Branding
- **Primary/Success**: #8FD9FB (Baby Blue)
- **Text (Primary/Secondary)**: #1A1A1A / #666666
- **Backgrounds**: #F5F5F5 (Main) / #FFFFFF (Cards)
- Gradients: Purple for finance screens; customizable via constants.

## Tech Stack

### Frontend (Mobile)
- React Native with Expo
- Expo Router for file-based navigation
- TypeScript for type safety
- Libraries: Expo Linear Gradient, Expo Clipboard, @expo/vector-icons (MaterialCommunityIcons)
- Mock Data: Static JSON for users, transactions, and notifications

### Backend (Smart Contracts)
- Solidity (Ethereum-compatible)
- Standards: EIP-2535 (Diamond), ERC-4337 (Account Abstraction), ERC-20 (Tokens)
- Libraries: OpenZeppelin (Ownable), Chainlink (Price Feeds)
- Facets: Account, Paymaster, Batch, Recovery, SessionKey, CutLoupe, Subscription
- Integrations: CNGN stablecoin, EntryPoint for user operations

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Expo CLI (global install: `npm install -g expo-cli`)
- For mobile testing: Expo Go app (iOS/Android)
- For blockchain: Hardhat or Foundry for deployment/testing; Ethereum testnet (e.g., Sepolia)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-repo/cppay.git
   cd cppay
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. For blockchain setup (if deploying contracts):
   - Navigate to `/contracts` (assuming structure includes a contracts folder).
   - Install deps: `npm install` (if using Hardhat).
   - Compile: `npx hardhat compile`.

### Running the App
- Start Expo dev server: `npm start`
- Android emulator: `npm run android`
- iOS simulator: `npm run ios`
- Web preview: `npm run web`
- Lint code: `npm run lint`

Scan the QR code in Expo Go for mobile testing.

### Deploying Smart Contracts
1. Configure `hardhat.config.js` with your network and keys.
2. Deploy Diamond proxy and facets:
   ```
   npx hardhat deploy --network sepolia
   ```
3. Initialize: Add supported tokens (e.g., CNGN), set price feeds, and configure tiers.

## Project Structure

```
CPPay/
├── app/                  # Expo Router screens
│   ├── (tabs)/           # Bottom tab navigation
│   │   ├── index.tsx     # Home
│   │   ├── finance.tsx   # Savings
│   │   ├── rewards.tsx   # Rewards
│   │   ├── cards.tsx     # Cards
│   │   └── me.tsx        # Profile
│   ├── transactions.tsx  # Transaction history
│   ├── transaction-details.tsx # Details view
│   └── notifications.tsx # Notifications
├── components/           # Reusable UI elements (BalanceCard, TransactionItem, etc.)
├── constants/            # Colors, Typography
├── data/                 # Mock data (transactions, notifications, user)
├── utils/                # Helpers (formatters)
├── contracts/            # Solidity source (Diamond proxy, facets)
│   ├── facets/           # AccountFacet.sol, PaymasterFacet.sol, etc.
│   ├── libraries/        # UserOperationLib.sol, BatchLib.sol
│   └── CPPayDiamond.sol  # Main proxy
└── README.md             # This file
```

## Customization
- **Branding**: Edit `constants/Colors.ts` and `Typography.ts`.
- **Mock Data**: Update `data/` files for custom users/transactions.
- **Tiers & Fees**: In SubscriptionFacet, set configs via owner functions.
- **Integrations**: Add CNGN address and Chainlink feed in PaymasterFacet.

## Security & Best Practices
- **Frontend**: Use secure storage for sensitive data; validate inputs.
- **Backend**: Audited patterns (Diamond, AA); enforce onlyOwner for upgrades; use oracles safely.
- **Testing**: Unit tests for facets; end-to-end for mobile flows.
- **Monetization Enforcement**: Automatic downgrades on expiry; keeper-resettable monthly quotas.

## Roadmap
- Integrate real backend APIs for live data.
- Launch rewards and cards features.
- Add enterprise add-ons (e.g., white-label UI).
- Mobile wallet connect for blockchain interactions.

## License
This project is open-source under the MIT License for educational and non-commercial use. For commercial deployments, contact the maintainers.

Contributions welcome! Fork, PR, or open issues for feedback.

--- 
