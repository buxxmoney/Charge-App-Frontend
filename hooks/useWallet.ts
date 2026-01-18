import { useWalletContext } from '../context/WalletContext';
import { api } from '../services/api';

export const useWallet = () => {
  const wallet = useWalletContext();

  const sendMoney = async (
    to: string,
    amount: number,
    currency: 'ZAR' | 'USD',
    notes?: string
  ) => {
    if (!wallet.user) {
      throw new Error('User not authenticated');
    }

    return api.sendTransaction(
      wallet.user.id,
      to,
      amount,
      currency,
      notes
    );
  };

  const refreshBalance = () => {
    if (wallet.user) {
      return wallet.fetchBalance(wallet.user.id);
    }
  };

  const refreshTransactions = () => {
    if (wallet.user) {
      return wallet.fetchTransactions(wallet.user.id);
    }
  };

  const refreshContacts = () => {
    if (wallet.user) {
      return wallet.fetchContacts(wallet.user.id);
    }
  };

  return {
    balance: wallet.balance,
    transactions: wallet.transactions,
    contacts: wallet.contacts,
    user: wallet.user,
    loading: wallet.loading,
    error: wallet.error,
    sendMoney,
    refreshBalance,
    refreshTransactions,
    refreshContacts,
  };
};
