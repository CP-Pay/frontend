/**
 * Balance Store Test Utility
 * Use this to test the balance store functionality
 */

import { useBalanceStore } from '@/store/balanceStore';

export const testBalanceStore = () => {
  const store = useBalanceStore.getState();
  
  console.log('🧪 Testing Balance Store...');
  
  // Test with mock data
  const mockBalances = [
    {
      token: {
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        isNative: true,
        addresses: { 1: '0x0000000000000000000000000000000000000000' },
        logoUrl: ''
      },
      balance: '1.5',
      balanceRaw: BigInt('1500000000000000000'), // This was causing the serialization error
      balanceUSD: 2500,
      balanceNGN: 3750000,
    }
  ];
  
  const testAddress = '0x1234567890123456789012345678901234567890';
  const testChainId = 1;
  
  // Test setting balances
  console.log('📝 Setting test balances...');
  store.setBalances(testChainId, testAddress, mockBalances);
  
  // Test getting balances
  console.log('📖 Getting balances...');
  const retrievedBalances = store.getBalances(testChainId, testAddress);
  console.log('✅ Retrieved balances:', retrievedBalances);
  
  // Test total calculation
  const totalUSD = store.getTotalPortfolioValue(testChainId, testAddress, 'USD');
  const totalNGN = store.getTotalPortfolioValue(testChainId, testAddress, 'NGN');
  console.log('💰 Total USD:', totalUSD);
  console.log('💰 Total NGN:', totalNGN);
  
  // Test stale check
  const isStale = store.isBalanceStale(testChainId, testAddress);
  console.log('⏰ Is stale:', isStale);
  
  console.log('✅ Balance store test completed!');
  
  return {
    balances: retrievedBalances,
    totalUSD,
    totalNGN,
    isStale
  };
};