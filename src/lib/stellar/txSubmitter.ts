import { Horizon, Transaction } from '@stellar/stellar-sdk';
import { getHorizonServer } from './client';

export interface SubmitTxResult {
  successful: boolean;
  hash?: string;
  ledger?: number;
  errorMessage?: string;
}

export async function submitStellarTransaction(tx: Transaction): Promise<SubmitTxResult> {
  const server = getHorizonServer();

  try {
    const res = await server.submitTransaction(tx);
    return {
      successful: res.successful,
      hash: res.hash,
      ledger: res.ledger,
    };
  } catch (err: any) {
    const detail = err?.response?.data?.extras?.result_codes?.transaction || err.message;
    return {
      successful: false,
      errorMessage: detail,
    };
  }
}
