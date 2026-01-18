// types/index.ts

export interface User {
    id: string;
    email: string;
    name: string;
    phoneNumber: string;
    chargeId: string;
    createdAt: string;
  }
  
  export interface Balance {
    zarBalance: number;    // South African Rand (ZARP stablecoin)
    usdBalance: number;    // US Dollar (USDC stablecoin)
    currency: 'ZAR' | 'USD';
  }
  
  export interface Transaction {
    id: string;
    from: string;
    to: string;
    amount: number;
    currency: 'ZAR' | 'USD';
    timestamp: string;
    status: 'pending' | 'completed' | 'failed';
    notes?: string;
  }
  
  export interface Contact {
    id: string;
    name: string;
    chargeId: string;
    phoneNumber?: string;
    lastTransactionDate?: string;
  }
  
  export interface TransactionRequest {
    recipient: string;
    amount: number;
    currency: 'ZAR' | 'USD';
    notes?: string;
  }
  
  export interface FeatureCard {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    backgroundColor: string;
    onPress: () => void;
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
  }
  
  export interface WalletState {
    balance: Balance;
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
  }