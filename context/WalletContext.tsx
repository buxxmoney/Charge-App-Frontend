// context/WalletContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Balance, Transaction, Contact } from '../types';
import { api } from '../services/api';
import * as SecureStore from 'expo-secure-store';

interface Keypair {
  publicKey: string;
  privateKey: string;
}

interface WalletContextType {
  balance: Balance | null;
  transactions: Transaction[];
  contacts: Contact[];
  user: any;
  keypair: Keypair | null;
  loading: boolean;
  error: string | null;
  fetchBalance: (userId: string) => Promise<void>;
  fetchTransactions: (userId: string) => Promise<void>;
  fetchContacts: (userId: string) => Promise<void>;
  setUser: (user: any) => void;
  setKeypair: (keypair: Keypair) => void;
  loadKeypair: () => Promise<Keypair | null>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const KEYPAIR_STORAGE_KEY = 'charge_wallet_keypair';

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [user, setUser] = useState<any>(null);
  const [keypair, setKeypairState] = useState<Keypair | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load keypair from secure storage on mount
  useEffect(() => {
    loadKeypair();
  }, []);

  const loadKeypair = async (): Promise<Keypair | null> => {
    try {
      const stored = await SecureStore.getItemAsync(KEYPAIR_STORAGE_KEY);
      if (stored) {
        const kp = JSON.parse(stored) as Keypair;
        setKeypairState(kp);
        return kp;
      }
    } catch (err) {
      console.error('Failed to load keypair:', err);
    }
    return null;
  };

  const setKeypair = async (kp: Keypair) => {
    try {
      await SecureStore.setItemAsync(KEYPAIR_STORAGE_KEY, JSON.stringify(kp));
      setKeypairState(kp);
    } catch (err) {
      console.error('Failed to save keypair:', err);
    }
  };

  const fetchBalance = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getBalance(userId);
      setBalance(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getTransactions(userId);
      setTransactions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getContacts(userId);
      setContacts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const value: WalletContextType = {
    balance,
    transactions,
    contacts,
    user,
    keypair,
    loading,
    error,
    fetchBalance,
    fetchTransactions,
    fetchContacts,
    setUser,
    setKeypair,
    loadKeypair,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within WalletProvider');
  }
  return context;
};