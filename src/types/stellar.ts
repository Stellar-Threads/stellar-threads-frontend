export type WalletConnectionStatus = 
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'unsupported_network'
  | 'error';

export interface WalletState {
  status: WalletConnectionStatus;
  address: string | null;
  network: string | null;
  isFreighterInstalled: boolean;
  error: string | null;
}

export interface AccountBalanceState {
  nativeBalance: string | null;
  otherBalances: {
    assetCode: string;
    assetIssuer?: string;
    balance: string;
  }[];
  isAccountFunded: boolean;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
}

export type MemoType = 'none' | 'text' | 'id' | 'hash';

export interface PaymentFormValues {
  recipientAddress: string;
  amount: string;
  memoType: MemoType;
  memoValue: string;
}

export type TransactionSubmissionStatus =
  | 'idle'
  | 'validating'
  | 'awaiting_signature'
  | 'submitting'
  | 'confirmed'
  | 'failed';

export interface SessionTransaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: string;
  memo?: string;
  status: 'confirmed' | 'failed' | 'pending';
  timestamp: number;
  explorerUrl: string;
  error?: string;
}

export interface OnChainPayment {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: string;
  asset: string;
  createdAt: string;
  type: string;
  transactionSuccessful: boolean;
}
