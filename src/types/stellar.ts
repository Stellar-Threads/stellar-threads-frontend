export type WalletConnectionStatus = 
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'unsupported_network'
  | 'error';

export type WalletProviderId =
  | 'freighter'
  | 'xbull'
  | 'albedo'
  | 'lobstr'
  | 'rabet'
  | 'hana';

export interface WalletOption {
  id: WalletProviderId;
  name: string;
  type: 'extension' | 'web' | 'mobile';
  description: string;
  isAvailable: boolean;
  downloadUrl: string;
}

export interface WalletState {
  status: WalletConnectionStatus;
  address: string | null;
  network: string | null;
  selectedWalletId: WalletProviderId | null;
  selectedWalletName: string | null;
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

// Stage 2 Soroban Contract Domain Types
export type ContractLifecycleStatus =
  | 'prepared'
  | 'awaiting_authorization'
  | 'submitted'
  | 'pending_confirmation'
  | 'successful'
  | 'failed'
  | 'unknown';

export interface DesignerProfileData {
  designerAddress: string;
  brandName: string;
  atelierLocation: string;
  metadataUri: string;
  registeredAt: number;
  isVerified: boolean;
}

export interface ProductPassportData {
  productId: string;
  creator: string;
  owner: string;
  brandName: string;
  productName: string;
  metadataUri: string;
  integrityHash: string;
  totalEdition: number;
  status: number; // 1: Active, 2: Transferred, 3: Retired
  createdAt: number;
}

export interface EscrowOrderData {
  orderId: number;
  buyer: string;
  seller: string;
  token: string;
  amount: string;
  orderRef: string;
  state: number; // 0: Created, 1: Funded, 2: Released, 3: Refunded, 4: Cancelled
  createdAt: number;
  fundedAt: number;
  settledAt: number;
}

export interface ContractEventItem {
  id: string;
  contractId: string;
  contractName: 'designer_registry' | 'product_passport' | 'fashion_escrow';
  eventType: string;
  ledger: number;
  ledgerClosedAt: string;
  txHash: string;
  data: Record<string, unknown>;
  indexedAt: string;
}
