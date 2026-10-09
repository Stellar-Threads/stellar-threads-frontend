'use client';

import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  validateStellarAddress,
  validatePaymentAmount,
  validateMemoValue,
} from '../../lib/stellar/validation';
import {
  buildPaymentTransaction,
  submitSignedTransaction,
} from '../../lib/stellar/client';
import { signTransactionWithFreighter } from '../../lib/wallet/freighter';
import {
  shortenAddress,
  getTxExplorerUrl,
  STELLAR_NETWORK,
} from '../../config/stellar';
import { MemoType, SessionTransaction } from '../../types/stellar';
import { StatusBadge } from '../common/StatusBadge';

interface PaymentFormProps {
  senderAddress: string | null;
  availableBalanceXlm: string | null;
  isAccountFunded: boolean;
  onPaymentSuccess: (tx: SessionTransaction) => void;
  onRefreshBalance: () => void;
}

export function PaymentForm({
  senderAddress,
  availableBalanceXlm,
  isAccountFunded,
  onPaymentSuccess,
  onRefreshBalance,
}: PaymentFormProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memoType, setMemoType] = useState<MemoType>('none');
  const [memoValue, setMemoValue] = useState('');

  // Live validation errors
  const [errors, setErrors] = useState<{
    recipient?: string;
    amount?: string;
    memo?: string;
  }>({});

  // Submission lifecycle state
  const [submissionState, setSubmissionState] = useState<
    'idle' | 'building' | 'signing' | 'submitting' | 'confirmed' | 'failed'
  >('idle');

  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const isConnected = !!senderAddress;
  const balanceNum = availableBalanceXlm ? parseFloat(availableBalanceXlm) : 0;
  const spendable = Math.max(0, balanceNum - STELLAR_NETWORK.minAccountReserveXlm - 0.00001);

  // Memo byte calculation
  const getMemoBytes = () => {
    if (memoType !== 'text' || !memoValue) return 0;
    return new TextEncoder().encode(memoValue).length;
  };

  const handleMaxClick = () => {
    if (spendable > 0) {
      setAmount(spendable.toFixed(7));
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !senderAddress) {
      setSubmissionError('Please connect your Freighter wallet first.');
      return;
    }

    if (!isAccountFunded) {
      setSubmissionError('Your account is unfunded on Testnet. Fund it with Friendbot before sending payments.');
      return;
    }

    // 1. Full validation
    const recipientCheck = validateStellarAddress(recipient);
    const amountCheck = validatePaymentAmount(amount, availableBalanceXlm);
    const memoCheck = validateMemoValue(memoType, memoValue);

    const newErrors = {
      recipient: recipientCheck.error,
      amount: amountCheck.error,
      memo: memoCheck.error,
    };

    setErrors(newErrors);

    if (!recipientCheck.isValid || !amountCheck.isValid || !memoCheck.isValid) {
      return;
    }

    if (recipient.trim() === senderAddress.trim()) {
      setErrors((prev) => ({
        ...prev,
        recipient: 'Sender and recipient public addresses cannot be identical.',
      }));
      return;
    }

    // 2. Prepare transaction
    setSubmissionError(null);
    setSubmissionState('building');

    try {
      const { xdr } = await buildPaymentTransaction({
        fromAddress: senderAddress,
        toAddress: recipient.trim(),
        amountXlm: amount.trim(),
        memoType,
        memoValue: memoValue.trim(),
      });

      // 3. Request Freighter signature
      setSubmissionState('signing');
      const signRes = await signTransactionWithFreighter(xdr, senderAddress);

      if (!signRes.success || !signRes.signedTxXdr) {
        setSubmissionState('failed');
        setSubmissionError(signRes.error || 'User cancelled or rejected transaction signing in Freighter.');
        return;
      }

      // 4. Submit to Horizon Testnet
      setSubmissionState('submitting');
      const submitRes = await submitSignedTransaction(signRes.signedTxXdr);

      if (!submitRes.success || !submitRes.hash) {
        setSubmissionState('failed');
        setSubmissionError(submitRes.error || 'Transaction submission rejected by Stellar Testnet.');
        return;
      }

      // 5. Success confirmation
      setTransactionHash(submitRes.hash);
      setSubmissionState('confirmed');

      const sessionTx: SessionTransaction = {
        id: submitRes.hash,
        hash: submitRes.hash,
        from: senderAddress,
        to: recipient.trim(),
        amount: amount.trim(),
        memo: memoType !== 'none' ? memoValue.trim() : undefined,
        status: 'confirmed',
        timestamp: Date.now(),
        explorerUrl: getTxExplorerUrl(submitRes.hash),
      };

      onPaymentSuccess(sessionTx);
      onRefreshBalance();

      // Reset form fields
      setRecipient('');
      setAmount('');
      setMemoValue('');
      setMemoType('none');
    } catch (err: unknown) {
      setSubmissionState('failed');
      setSubmissionError(
        err instanceof Error ? err.message : 'An unexpected error occurred during transaction processing.'
      );
    }
  };

  const isSubmitting =
    submissionState === 'building' ||
    submissionState === 'signing' ||
    submissionState === 'submitting';

  return (
    <div id="payment" className="bg-gradient-to-b from-zinc-900/90 to-[#0e1017]/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-black/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#e5c158]">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-zinc-100">
              Send Testnet XLM Payment
            </h3>
            <p className="text-xs text-zinc-400">
              Transfer native XLM to another Stellar Testnet account
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-zinc-400 font-mono block">
            Sender: {senderAddress ? shortenAddress(senderAddress) : 'Not Connected'}
          </span>
          <span className="text-xs text-emerald-400 font-mono font-medium block">
            Spendable: ~{spendable.toFixed(4)} XLM
          </span>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="pt-6 space-y-6">
        {/* Recipient Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="recipient-input" className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px]">
              Recipient Stellar Public Address *
            </label>
            <span className="text-zinc-400 font-mono text-[10px]">
              Starts with &apos;G&apos; (56 characters)
            </span>
          </div>

          <div className="relative">
            <input
              id="recipient-input"
              type="text"
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value);
                if (errors.recipient) setErrors((prev) => ({ ...prev, recipient: undefined }));
              }}
              placeholder="e.g. GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN"
              disabled={isSubmitting || !isConnected}
              className={`w-full bg-zinc-950/80 border rounded-xl px-4 py-3 text-sm font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors ${
                errors.recipient
                  ? 'border-rose-500 focus:border-rose-400'
                  : 'border-zinc-800 focus:border-[#d4af37]'
              } ${!isConnected ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
          </div>

          {errors.recipient && (
            <p className="text-xs text-rose-400 flex items-center gap-1.5 pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.recipient}</span>
            </p>
          )}
        </div>

        {/* Amount Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="amount-input" className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px]">
              Payment Amount (XLM) *
            </label>
            <button
              type="button"
              onClick={handleMaxClick}
              disabled={isSubmitting || !isConnected || spendable <= 0}
              className="text-xs text-[#e5c158] hover:text-[#f7e7a9] font-medium font-mono transition-colors disabled:opacity-40 cursor-pointer"
            >
              Max Spendable (~{spendable.toFixed(4)} XLM)
            </button>
          </div>

          <div className="relative">
            <input
              id="amount-input"
              type="text"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
              }}
              placeholder="0.00"
              disabled={isSubmitting || !isConnected}
              className={`w-full bg-zinc-950/80 border rounded-xl px-4 py-3 text-sm font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors pr-16 ${
                errors.amount
                  ? 'border-rose-500 focus:border-rose-400'
                  : 'border-zinc-800 focus:border-[#d4af37]'
              } ${!isConnected ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-serif italic text-zinc-400 text-sm">
              XLM
            </span>
          </div>

          {errors.amount && (
            <p className="text-xs text-rose-400 flex items-center gap-1.5 pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.amount}</span>
            </p>
          )}
        </div>

        {/* Optional Memo Field */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px]">
              Transaction Memo (Optional)
            </label>
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              {(['none', 'text', 'id', 'hash'] as MemoType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setMemoType(type);
                    if (errors.memo) setErrors((prev) => ({ ...prev, memo: undefined }));
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] uppercase font-mono transition-colors cursor-pointer ${
                    memoType === type
                      ? 'bg-[#d4af37] text-zinc-950 font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {memoType !== 'none' && (
            <div className="space-y-1.5">
              <input
                type="text"
                value={memoValue}
                onChange={(e) => {
                  setMemoValue(e.target.value);
                  if (errors.memo) setErrors((prev) => ({ ...prev, memo: undefined }));
                }}
                placeholder={
                  memoType === 'text'
                    ? 'e.g. Atelier Order #402'
                    : memoType === 'id'
                    ? 'e.g. 102948274'
                    : 'e.g. 32-byte hex hash (64 characters)'
                }
                disabled={isSubmitting || !isConnected}
                className={`w-full bg-zinc-950/80 border rounded-xl px-4 py-2.5 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors ${
                  errors.memo
                    ? 'border-rose-500'
                    : 'border-zinc-800 focus:border-[#d4af37]'
                }`}
              />

              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                {memoType === 'text' && (
                  <span>
                    Size: {getMemoBytes()} / 28 bytes
                  </span>
                )}
                {memoType === 'id' && (
                  <span>Must be a positive 64-bit integer</span>
                )}
                {memoType === 'hash' && (
                  <span>Must be 32 bytes (64 hex characters)</span>
                )}
              </div>

              {errors.memo && (
                <p className="text-xs text-rose-400 flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.memo}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Transaction Summary & Fee Breakdown */}
        <div className="p-4 rounded-2xl bg-zinc-950/40 border border-zinc-800/60 space-y-2 text-xs">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Stellar Network Base Fee</span>
            <span className="font-mono text-zinc-300">
              {STELLAR_NETWORK.baseFeeXlm} XLM (100 stroops)
            </span>
          </div>
          <div className="flex items-center justify-between text-zinc-400">
            <span>Network Settlement Time</span>
            <span className="font-mono text-[#e5c158]">~3-5 seconds (Testnet)</span>
          </div>
          <div className="flex items-center justify-between text-zinc-400">
            <span>Authorization Mode</span>
            <span className="font-mono text-emerald-400">Freighter Non-Custodial</span>
          </div>
        </div>

        {/* Submission Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting || !isConnected || !isAccountFunded}
            className={`w-full py-4 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-[#d4af37]/10 flex items-center justify-center gap-2 cursor-pointer ${
              isSubmitting || !isConnected || !isAccountFunded
                ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-[#d4af37] via-[#f3d97c] to-[#b38e22] text-zinc-950 hover:brightness-110'
            }`}
          >
            {submissionState === 'building' && (
              <>
                <span className="animate-spin mr-2">⚙️</span>
                <span>Validating & Building Transaction XDR...</span>
              </>
            )}
            {submissionState === 'signing' && (
              <>
                <span className="animate-spin mr-2">✍️</span>
                <span>Requesting Freighter Signature...</span>
              </>
            )}
            {submissionState === 'submitting' && (
              <>
                <span className="animate-spin mr-2">🚀</span>
                <span>Submitting to Stellar Testnet Horizon...</span>
              </>
            )}
            {!isSubmitting && (
              <>
                <Send className="w-4 h-4" />
                <span>
                  {!isConnected
                    ? 'Connect Wallet to Transfer XLM'
                    : !isAccountFunded
                    ? 'Account Unfunded on Testnet'
                    : 'Sign & Submit Payment via Freighter'}
                </span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>

        {/* Feedback: Error */}
        {submissionError && (
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-900/60 text-xs text-rose-300 space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Payment Submission Failed</span>
            </div>
            <p className="text-zinc-300 leading-relaxed font-mono text-[11px] break-words">
              {submissionError}
            </p>
            <p className="text-[11px] text-zinc-400">
              You can adjust the parameters and safely retry your transaction.
            </p>
          </div>
        )}

        {/* Feedback: Confirmed Success */}
        {submissionState === 'confirmed' && transactionHash && (
          <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Payment Successfully Confirmed on Stellar Testnet!</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5 font-mono text-xs">
              <div className="text-zinc-400 text-[11px]">Transaction Hash:</div>
              <div className="text-zinc-200 break-all select-all text-[11px]">
                {transactionHash}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-zinc-400">Explorer Verification:</span>
              <a
                href={getTxExplorerUrl(transactionHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#e5c158] hover:underline font-medium"
              >
                <span>View on Stellar Expert</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
