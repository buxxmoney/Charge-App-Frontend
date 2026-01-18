import React, { createContext, useContext, useState, useEffect } from 'react';
import { Balance, Transaction, Contact } from '../types';
import { api } from '../services/api';

interface WalletContextType {
  balance: Balance | null;
  transactions: Transaction[];
  contacts: Contact[];
  user: any;
  loading: boolean;
  error: string | null;
  fetchBalance: (userId: string) => Promise<void>;
  fetchTransactions: (userId: string) => Promise<void>;
  fetchContacts: (userId: string) => Promise<void>;
  setUser: (user: any) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    loading,
    error,
    fetchBalance,
    fetchTransactions,
    fetchContacts,
    setUser,
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
