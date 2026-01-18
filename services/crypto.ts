import * as Crypto from 'expo-crypto';

/**
 * Convert Uint8Array to hex string
 */
const bytesToHex = (bytes: Uint8Array): string => {
  return Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Generates a keypair for on-chain transactions
 * Device keypair (public + private) used for signing transactions
 */
export const generateKeypair = async () => {
  try {
    // Generate random bytes for private key
    const privateKeyBytes = await Crypto.getRandomBytes(32);
    const privateKey = bytesToHex(privateKeyBytes);
    
    // Derive public key (in production, use proper cryptography)
    // For now, we'll use a simple hash-based derivation
    const publicKeyHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      privateKey
    );
    
    return {
      privateKey: `0x${privateKey}`,
      publicKey: `0x${publicKeyHash}`,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating keypair:', error);
    throw error;
  }
};

/**
 * Generates view key for encrypting/decrypting balances
 */
export const generateViewKey = async () => {
  try {
    const viewKeyBytes = await Crypto.getRandomBytes(32);
    const viewKey = bytesToHex(viewKeyBytes);
    return `0x${viewKey}`;
  } catch (error) {
    console.error('Error generating view key:', error);
    throw error;
  }
};

/**
 * Hashes a message for signing
 */
export const hashMessage = async (message: string) => {
  try {
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      message
    );
    return `0x${hash}`;
  } catch (error) {
    console.error('Error hashing message:', error);
    throw error;
  }
};