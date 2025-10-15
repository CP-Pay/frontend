# CPPay - Mobile Banking App

A complete React Native Expo mobile banking/fintech application with baby blue (#8FD9FB) branding. This is a full-featured financial services app for money transfers, bill payments, airtime/data purchase, and savings management.

## Features

- **Home Screen**: Balance card, recent transactions, quick actions grid, special offers
- **Transactions**: Full transaction history with filtering and analysis
- **Transaction Details**: Detailed view of individual transactions
- **Notifications**: Categorized notifications (Transactions, Services, Activities)
- **Profile (Me)**: User profile and account information
- **Finance**: Savings management, OWealth, SafeBox, and Fixed Savings
- **Rewards**: Coming soon
- **Cards**: Coming soon

## Color Scheme

- Primary Brand Color: `#8FD9FB` (baby blue)
- Success Color: `#8FD9FB`
- Text Primary: `#1A1A1A`
- Text Secondary: `#666666`
- Background: `#F5F5F5`
- Card Background: `#FFFFFF`

## Tech Stack

- React Native
- Expo Router (File-based navigation)
- TypeScript
- Expo Linear Gradient
- Expo Clipboard
- @expo/vector-icons (MaterialCommunityIcons)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Scan the QR code with Expo Go app (Android) or Camera app (iOS)

### Development Commands

- `npm start` - Start the development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

## Project Structure

```
CPPay/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx        # Tab navigation
│   │   ├── index.tsx           # Home screen
│   │   ├── rewards.tsx         # Rewards screen
│   │   ├── finance.tsx         # Finance/Savings screen
│   │   ├── cards.tsx           # Cards screen
│   │   └── me.tsx              # Profile screen
│   ├── _layout.tsx             # Root layout
│   ├── transactions.tsx        # Transactions list
│   ├── transaction-details.tsx # Transaction details
│   └── notifications.tsx       # Notifications
├── components/
│   ├── BalanceCard.tsx        # Balance display card
│   ├── TransactionItem.tsx    # Transaction list item
│   ├── QuickActionButton.tsx  # Quick action button
│   ├── Header.tsx             # Screen header
│   └── Badge.tsx              # Status badge
├── constants/
│   ├── Colors.ts              # Color palette
│   └── Typography.ts          # Typography & spacing
├── data/
│   ├── transactions.ts        # Mock transaction data
│   ├── notifications.ts       # Mock notification data
│   └── user.ts                # Mock user data
└── utils/
    └── formatters.ts          # Formatting utilities
```

## Key Screens

### Home Screen
- User greeting with upgrade prompt
- Balance card with transaction history link
- Recent transactions (2 items)
- Quick actions grid (11 items)
- Special bonus card
- Hot deal card

### Transactions Screen
- Filter by category and status
- Monthly summary with in/out totals
- Full transaction list
- Analysis feature

### Transaction Details
- Large transaction icon
- Amount display
- Status indicator
- Transaction metadata
- Copy transaction number

### Finance Screen
- Total balance card (purple gradient)
- Wallet and OWealth balances
- Features: OWealth, Target, SafeBox, Fixed, Spend & Save
- Feature cards with descriptions

### Profile Screen
- Avatar with camera icon
- Account number (with copy)
- Account tier with upgrade option
- Personal information
- Contact details

## Mock Data

The app uses mock data for demonstration:
- User: SOBIL (BILAL OYELEKE SOLIU)
- Account: 8121997368
- Balance: ₦100,017.30
- Sample transactions and notifications included

## Navigation

Bottom tab navigation with 5 tabs:
1. **Home** - Main dashboard
2. **Rewards** - Rewards and offers
3. **Finance** - Savings and investments
4. **Cards** - Virtual and physical cards
5. **Me** - User profile

Stack navigation for:
- Transaction list
- Transaction details
- Notifications

## Customization

To customize the branding:
1. Update colors in `constants/Colors.ts`
2. Modify user data in `data/user.ts`
3. Add/edit transactions in `data/transactions.ts`
4. Customize typography in `constants/Typography.ts`

## License

This project is for educational and demonstration purposes.
