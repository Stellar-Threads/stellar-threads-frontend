'use client';

import React from 'react';
import {
  Coins,
  RefreshCw,
  Sparkles,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { STELLAR_NETWORK } from '../../config/stellar';

interface BalanceCardProps {
  nativeBalance: string | null;
  isAccountFunded: boolean;
  isLoading: boolean;
  error: string | null;
  isFunding: boolean;
  fundingMessage: string | null;
  onRefresh: () => void;
  onRequestFriendbot: () => void;
}

export function BalanceCard({
  nativeBalance,
  isAccountFunded,
  isLoading,
  error,
  isFunding,
  fundingMessage,
  onRefresh,
  onRequestFriendbot,
}: BalanceCardProps) {
  const balanceNum = nativeBalance !== null ? parseFloat(nativeBalance) : null;
  const minReserve = STELLAR_NETWORK.minAccountReserveXlm;
  const spendable =
    balanceNum !== null ? Math.max(0, balanceNum - minReserve - 0.00001) : 0;

  return (
    <div className="bg-gradient-to-b from-zinc-900/90 to-[#0e1017]/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-black/40">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#e5c158]">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-zinc-100">
              Stellar Treasury Balance
            </h3>
            <p className="text-xs text-zinc-400">
              Native XLM asset retrieved from Testnet Horizon
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          title="Refresh account balance"
          aria-label="Refresh account balance"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#e5c158]' : ''}`} />
        </button>
      </div>

      {/* Balance Content */}
      <div className="pt-6 space-y-6">
        {isLoading && nativeBalance === null ? (
          <div className="py-10 text-center space-y-3">
            <RefreshCw className="w-8 h-8 mx-auto text-[#e5c158] animate-spin opacity-80" />
            <p className="text-xs text-zinc-400 font-mono">
              Querying Stellar Testnet Horizon RPC...
            </p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-900/50 space-y-2">
            <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Failed to fetch balance</span>
            </div>
            <p className="text-xs text-zinc-300">{error}</p>
            <button
              type="button"
              onClick={onRefresh}
              className="text-xs text-[#e5c158] hover:underline pt-1"
            >
              Retry query
            </button>
          </div>
        ) : !isAccountFunded ? (
          /* Unfunded Testnet Account State */
          <div className="p-5 rounded-2xl bg-amber-950/25 border border-amber-800/50 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-amber-200">
                  Unfunded Testnet Account
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  This public address does not have an active ledger entry on Stellar Testnet yet. Accounts require at least 1.0 XLM to activate the account sequence.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onRequestFriendbot}
                disabled={isFunding}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider bg-gradient-to-r from-[#d4af37] via-[#f3d97c] to-[#b38e22] text-zinc-950 hover:brightness-110 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isFunding
                    ? 'Requesting 10,000 XLM from Friendbot...'
                    : 'Fund Account with 10,000 Testnet XLM'}
                </span>
              </button>
            </div>

            {fundingMessage && (
              <p className="text-xs font-mono text-emerald-300 pt-1">
                {fundingMessage}
              </p>
            )}
          </div>
        ) : (
          /* Funded Balance Display */
          <div className="space-y-5">
            <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono text-[11px] uppercase tracking-wider">
                  Total Native Balance
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">
                  Horizon Testnet
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
                  {balanceNum !== null ? balanceNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 7 }) : '0.00'}
                </span>
                <span className="font-serif italic text-lg text-[#e5c158]">
                  XLM
                </span>
              </div>

              <p className="text-[11px] text-zinc-400 pt-1">
                Note: Testnet XLM is solely for protocol validation and holds no real-world monetary value.
              </p>
            </div>

            {/* Spendable Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-1">
                <div className="text-zinc-400 flex items-center justify-between">
                  <span>Spendable Capacity</span>
                  <span className="text-emerald-400 font-mono font-medium">
                    ~{spendable.toFixed(4)} XLM
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400">
                  After 1.0 XLM reserve deduction
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-1">
                <div className="text-zinc-400 flex items-center justify-between">
                  <span>Base Network Fee</span>
                  <span className="font-mono text-zinc-300">
                    {STELLAR_NETWORK.baseFeeXlm} XLM
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400">
                  100 stroops per standard operation
                </p>
              </div>
            </div>

            {/* Faucet Top-up Option */}
            <div className="pt-2 flex items-center justify-between text-xs text-zinc-400">
              <span className="text-[11px]">Need additional Testnet funds?</span>
              <button
                type="button"
                onClick={onRequestFriendbot}
                disabled={isFunding}
                className="text-xs text-[#e5c158] hover:text-[#f7e7a9] font-medium transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isFunding ? 'Funding...' : 'Request Friendbot XLM'}</span>
              </button>
            </div>

            {fundingMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/50 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{fundingMessage}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
