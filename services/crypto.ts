// services/crypto.ts

import { ethers } from 'ethers';

/**
 * Generates a keypair for on-chain transactions
 * Uses ethers.js for proper Ethereum-compatible keys
 */
export const generateKeypair = async () => {
  try {
    // Generate a random wallet with proper ECDSA keypair
    const wallet = ethers.Wallet.createRandom();
    
    return {
      privateKey: wallet.privateKey,
      publicKey: wallet.address, // Ethereum address derived from public key
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating keypair:', error);
    throw error;
  }
};

/**
 * Signs a transaction fingerprint with the private key
 * @param fingerprint - The transaction hash/fingerprint from the server
 * @param privateKey - The user's private key
 * @returns The signature
 */
export const signTransactionFingerprint = async (
  fingerprint: string,
  privateKey: string
): Promise<string> => {
  try {
    const wallet = new ethers.Wallet(privateKey);
    // Sign the raw bytes of the fingerprint
    const signature = await wallet.signMessage(ethers.getBytes(fingerprint));
    return signature;
  } catch (error) {
    console.error('Error signing transaction:', error);
    throw error;
  }
};

/**
 * Verifies a signature (for testing/debugging)
 */
export const verifySignature = (
  fingerprint: string,
  signature: string,
  expectedAddress: string
): boolean => {
  try {
    const recoveredAddress = ethers.verifyMessage(
      ethers.getBytes(fingerprint),
      signature
    );
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
};

/**
 * Hashes a message using keccak256 (Ethereum's hash function)
 */
export const hashMessage = (message: string): string => {
  return ethers.keccak256(ethers.toUtf8Bytes(message));
};

/**
 * Generates view key for encrypting/decrypting balances
 */
export const generateViewKey = (): string => {
  const randomBytes = ethers.randomBytes(32);
  return ethers.hexlify(randomBytes);
};