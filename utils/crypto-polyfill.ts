/**
 * Crypto Polyfill for React Native
 * Sets up crypto.getRandomValues for bip39 and other crypto libraries
 * 
 * CRITICAL: This must be imported FIRST before any crypto libraries (bip39, ethers, etc.)
 */

console.log('🚀 Loading crypto polyfills...');

// Import Buffer first
import { Buffer } from 'buffer';

// Set Buffer on BOTH global and globalThis
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
  console.log('✅ Buffer set on global');
}

if (typeof globalThis.Buffer === 'undefined') {
  (globalThis as any).Buffer = Buffer;
  console.log('✅ Buffer set on globalThis');
}

// Ensure global.process exists (required by some crypto libraries)
if (typeof global.process === 'undefined') {
  global.process = { env: {} } as any;
  console.log('✅ process set globally');
}

// Import react-native-get-random-values AFTER Buffer is set
// This library automatically polyfills crypto.getRandomValues
console.log('📦 Importing react-native-get-random-values...');
import 'react-native-get-random-values';

// Set crypto on BOTH global and globalThis
// This is critical for @noble/hashes which checks globalThis.crypto
if (typeof globalThis.crypto === 'undefined') {
  (globalThis as any).crypto = global.crypto;
  console.log('✅ crypto copied from global to globalThis');
}

// Double-check that crypto.getRandomValues is properly defined on both
if (typeof global.crypto === 'undefined' || typeof global.crypto.getRandomValues === 'undefined') {
  console.error('❌ global.crypto.getRandomValues is undefined after importing react-native-get-random-values');
  throw new Error('crypto.getRandomValues is not defined after importing react-native-get-random-values');
}

if (typeof globalThis.crypto === 'undefined' || typeof (globalThis.crypto as any).getRandomValues === 'undefined') {
  console.error('❌ globalThis.crypto.getRandomValues is undefined');
  throw new Error('globalThis.crypto.getRandomValues is not defined');
}

console.log('✅ global.crypto.getRandomValues is defined');
console.log('✅ globalThis.crypto.getRandomValues is defined');

// Ensure crypto.subtle is defined (even if not implemented)
if (!global.crypto.subtle) {
  Object.defineProperty(global.crypto, 'subtle', {
    value: {},
    writable: true,
    configurable: true,
  });
  console.log('✅ crypto.subtle set on global');
}

if (!(globalThis.crypto as any).subtle) {
  Object.defineProperty((globalThis as any).crypto, 'subtle', {
    value: {},
    writable: true,
    configurable: true,
  });
  console.log('✅ crypto.subtle set on globalThis');
}

// Test that crypto.getRandomValues actually works
try {
  console.log('🧪 Testing crypto.getRandomValues...');
  const testArray = new Uint8Array(32);
  global.crypto.getRandomValues(testArray);
  
  // Verify it actually filled the array (all zeros would indicate failure)
  const hasRandomData = Array.from(testArray).some(byte => byte !== 0);
  if (!hasRandomData) {
    console.warn('⚠️ crypto.getRandomValues did not generate random data');
    console.warn('Test array:', Array.from(testArray).join(','));
  } else {
    console.log('✅ crypto.getRandomValues is working correctly');
    console.log('Sample random bytes:', Array.from(testArray.slice(0, 8)).join(','));
  }
} catch (error) {
  console.error('❌ crypto.getRandomValues test failed:', error);
  throw error;
}

console.log('✅ Crypto polyfills loaded successfully');
console.log('✅ global.crypto.getRandomValues type:', typeof global.crypto.getRandomValues);
console.log('✅ globalThis.crypto.getRandomValues type:', typeof (globalThis.crypto as any)?.getRandomValues);
console.log('✅ Buffer type:', typeof global.Buffer);

export {};