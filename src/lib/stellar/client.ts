import {
  Horizon,
  TransactionBuilder,
  Operation,
  Asset,
  Memo,
  } from '@stellar/stellar-sdk';
import { STELLAR_NETWORK } from '../../config/stellar';
import { MemoType, OnChainPayment } from '../../types/stellar';

let horizonServerInstance: Horizon.Server | null = null;

export function getHorizonServer(): Horizon.Server {
  if (!horizonServerInstance) {
    horizonServerInstance = new Horizon.Server(STELLAR_NETWORK.horizonUrl);
  }
  return horizonServerInstance;
}

export interface AccountFetchResult {
  exists: boolean;
  nativeBalance: string | null;
  otherBalances: {
    assetCode: string;
    assetIssuer?: string;
    balance: string;
  }[];
  sequence?: string;
  raw?: unknown;
  error?: string;
}

/**
 * Loads account details and balances from Stellar Testnet Horizon.
 * Gracefully handles 404 (unfunded testnet account).
 */
export async function fetchAccountDetails(publicKey: string): Promise<AccountFetchResult> {
  const server = getHorizonServer();

  try {
    const account = await server.loadAccount(publicKey);

    let nativeBalance: string | null = null;
    const otherBalances: { assetCode: string; assetIssuer?: string; balance: string }[] = [];

    for (const balance of account.balances) {
      if (balance.asset_type === 'native') {
        nativeBalance = balance.balance;
      } else {
        const anyBal = balance as unknown as { asset_code?: string; asset_issuer?: string; balance: string };
        otherBalances.push({
          assetCode: anyBal.asset_code || 'UNKNOWN',
          assetIssuer: anyBal.asset_issuer,
          balance: anyBal.balance,
        });
      }
    }

    return {
      exists: true,
      nativeBalance: nativeBalance || '0.0000000',
      otherBalances,
      sequence: account.sequence,
      raw: account,
    };
  } catch (err: unknown) {
    // Check if Horizon returned 404 Not Found (account does not exist on Testnet yet)
    const errorObj = err as { response?: { status?: number }; message?: string };
    if (errorObj?.response?.status === 404) {
      return {
        exists: false,
        nativeBalance: null,
        otherBalances: [],
        error: 'Account not funded on Stellar Testnet',
      };
    }

    const message = err instanceof Error ? err.message : 'Failed to reach Stellar Horizon network';
    return {
      exists: false,
      nativeBalance: null,
      otherBalances: [],
      error: message,
    };
  }
}

/**
 * Funds an unfunded testnet account using the official SDF Friendbot.
 */
export async function fundWithFriendbot(publicKey: string): Promise<{ success: boolean; message: string }> {
  try {
    const url = `${STELLAR_NETWORK.friendbotUrl}?addr=${encodeURIComponent(publicKey)}`;
    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text();
      return {
        success: false,
        message: `Friendbot returned HTTP ${res.status}: ${errText.slice(0, 100)}`,
      };
    }
    return {
      success: true,
      message: 'Account successfully funded with 10,000 Testnet XLM via Friendbot!',
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Network error reaching Friendbot',
    };
  }
}

/**
 * Fetches recent payment operations for an account from Horizon Testnet.
 */
export async function fetchAccountPayments(publicKey: string, limit = 10): Promise<OnChainPayment[]> {
  const server = getHorizonServer();

  try {
    const page = await server
      .payments()
      .forAccount(publicKey)
      .order('desc')
      .limit(limit)
      .call();

    return page.records.map((rec) => {
      const anyRec = rec as unknown as {
        id: string;
        transaction_hash: string;
        from?: string;
        to?: string;
        amount?: string;
        asset_type?: string;
        asset_code?: string;
        created_at: string;
        type: string;
        transaction_successful?: boolean;
      };

      return {
        id: anyRec.id,
        hash: anyRec.transaction_hash,
        from: anyRec.from || publicKey,
        to: anyRec.to || publicKey,
        amount: anyRec.amount || '0',
        asset: anyRec.asset_type === 'native' ? 'XLM' : anyRec.asset_code || 'ASSET',
        createdAt: anyRec.created_at,
        type: anyRec.type,
        transactionSuccessful: anyRec.transaction_successful !== false,
      };
    });
  } catch (err) {
    console.warn('Failed to fetch account payments from Horizon:', err);
    return [];
  }
}

export interface BuildPaymentParams {
  fromAddress: string;
  toAddress: string;
  amountXlm: string;
  memoType?: MemoType;
  memoValue?: string;
}

/**
 * Builds an unsigned Stellar payment transaction targeting Testnet.
 */
export async function buildPaymentTransaction(params: BuildPaymentParams): Promise<{
  transaction: Horizon.ServerApi.AccountRecord | unknown;
  xdr: string;
}> {
  const server = getHorizonServer();

  // Load latest account sequence number from Testnet
  const sourceAccount = await server.loadAccount(params.fromAddress);

  const builder = new TransactionBuilder(sourceAccount, {
    fee: STELLAR_NETWORK.baseFeeStroops,
    networkPassphrase: STELLAR_NETWORK.passphrase,
  });

  // Attach native XLM payment operation
  builder.addOperation(
    Operation.payment({
      destination: params.toAddress.trim(),
      asset: Asset.native(),
      amount: params.amountXlm.trim(),
    })
  );

  // Attach optional memo
  if (params.memoType && params.memoType !== 'none' && params.memoValue?.trim()) {
    const val = params.memoValue.trim();
    if (params.memoType === 'text') {
      builder.addMemo(Memo.text(val));
    } else if (params.memoType === 'id') {
      builder.addMemo(Memo.id(val));
    } else if (params.memoType === 'hash') {
      builder.addMemo(Memo.hash(val));
    }
  }

  // 30 seconds transaction timeout
  builder.setTimeout(30);

  const transaction = builder.build();
  const xdr = transaction.toXDR();

  return { transaction, xdr };
}

/**
 * Submits a wallet-signed transaction XDR to Stellar Testnet Horizon.
 */
export async function submitSignedTransaction(signedTxXdr: string): Promise<{
  success: boolean;
  hash: string;
  ledger?: number;
  error?: string;
}> {
  const server = getHorizonServer();

  try {
    const tx = TransactionBuilder.fromXDR(signedTxXdr, STELLAR_NETWORK.passphrase);
    const result = await server.submitTransaction(tx);

    return {
      success: true,
      hash: result.hash,
      ledger: result.ledger,
    };
  } catch (err: unknown) {
    const errorObj = err as {
      response?: {
        data?: {
          extras?: {
            result_codes?: {
              transaction?: string;
              operations?: string[];
            };
          };
          title?: string;
          detail?: string;
        };
      };
      message?: string;
    };

    const extras = errorObj?.response?.data?.extras?.result_codes;
    let detail = errorObj?.response?.data?.detail || errorObj?.message || 'Transaction submission rejected by network';

    if (extras) {
      detail = `${detail} (Result codes: tx="${extras.transaction}", op="${extras.operations?.join(', ')}")`;
    }

    return {
      success: false,
      hash: '',
      error: detail,
    };
  }
}
