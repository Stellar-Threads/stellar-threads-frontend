'use client';

import React, { useState } from 'react';
import {
  History,
  ExternalLink,
  RefreshCw,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Sparkles,
} from 'lucide-react';
import { SessionTransaction, OnChainPayment } from '../../types/stellar';
import { shortenAddress, shortenHash } from '../../config/stellar';
import { StatusBadge } from '../common/StatusBadge';
import { CopyButton } from '../common/CopyButton';

interface TransactionActivityProps {
  sessionTransactions: SessionTransaction[];
  onChainPayments: OnChainPayment[];
  isLoadingOnChain: boolean;
  onRefresh: () => void;
  onClearSession: () => void;
}

export function TransactionActivity({
  sessionTransactions,
  onChainPayments,
  isLoadingOnChain,
  onRefresh,
  onClearSession,
}: TransactionActivityProps) {
  const [activeTab, setActiveTab] = useState<'session' | 'onchain'>('session');

  const formatTimestamp = (ts: number | string) => {
    try {
      const d = typeof ts === 'number' ? new Date(ts) : new Date(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
        ' · ' +
        d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return String(ts);
    }
  };

  return (
    <div id="activity" className="bg-gradient-to-b from-zinc-900/90 to-[#0e1017]/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-black/40">
      {/* Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-[#e5c158]">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-zinc-100">
              Transaction Activity
            </h3>
            <p className="text-xs text-zinc-400">
              Session submissions and live Stellar Testnet ledger history
            </p>
          </div>
        </div>

        {/* Tab Controls & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setActiveTab('session')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'session'
                  ? 'bg-[#d4af37] text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Session Submissions ({sessionTransactions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('onchain')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'onchain'
                  ? 'bg-[#d4af37] text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              On-Chain Ledger ({onChainPayments.length})
            </button>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoadingOnChain}
            className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Refresh on-chain history"
            aria-label="Refresh on-chain history"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingOnChain ? 'animate-spin text-[#e5c158]' : ''}`} />
          </button>

          {activeTab === 'session' && sessionTransactions.length > 0 && (
            <button
              type="button"
              onClick={onClearSession}
              className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
              title="Clear session history"
              aria-label="Clear session history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="pt-6">
        {activeTab === 'session' ? (
          /* Session Transactions Tab */
          sessionTransactions.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-800/60 mx-auto flex items-center justify-center text-zinc-400">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-base text-zinc-200">
                No Transactions Submitted This Session
              </h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Transactions initiated and confirmed through the payment form above will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-850 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-zinc-400 border-b border-zinc-800 uppercase font-mono tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Recipient</th>
                    <th className="pb-3 font-semibold">Memo</th>
                    <th className="pb-3 font-semibold">Tx Hash</th>
                    <th className="pb-3 font-semibold">Time</th>
                    <th className="pb-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {sessionTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3.5 flex items-center gap-1.5 font-medium text-zinc-300">
                        <ArrowUpRight className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Payment</span>
                      </td>
                      <td className="py-3.5 font-mono font-semibold text-zinc-100">
                        {tx.amount} <span className="text-[#e5c158] font-serif">XLM</span>
                      </td>
                      <td className="py-3.5 font-mono text-zinc-300">
                        <div className="flex items-center gap-1.5">
                          <span>{shortenAddress(tx.to)}</span>
                          <CopyButton text={tx.to} />
                        </div>
                      </td>
                      <td className="py-3.5 text-zinc-400 italic">
                        {tx.memo || '—'}
                      </td>
                      <td className="py-3.5 font-mono text-zinc-300">
                        <div className="flex items-center gap-1.5">
                          <span>{shortenHash(tx.hash)}</span>
                          <CopyButton text={tx.hash} />
                          <a
                            href={tx.explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#e5c158] hover:text-[#f7e7a9] transition-colors"
                            title="Verify on Stellar Expert"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                      <td className="py-3.5 font-mono text-zinc-400 text-[11px]">
                        {formatTimestamp(tx.timestamp)}
                      </td>
                      <td className="py-3.5 text-right">
                        <StatusBadge
                          label={tx.status}
                          variant={tx.status === 'confirmed' ? 'success' : 'error'}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* On-Chain Ledger Tab */
          isLoadingOnChain ? (
            <div className="py-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 mx-auto text-[#e5c158] animate-spin opacity-80" />
              <p className="text-xs text-zinc-400 font-mono">
                Querying on-chain payments from Stellar Testnet Horizon...
              </p>
            </div>
          ) : onChainPayments.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-800/60 mx-auto flex items-center justify-center text-zinc-400">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-base text-zinc-200">
                No On-Chain Payments Found
              </h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                No payment operations were recorded on Stellar Testnet for this connected account yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-850 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-zinc-400 border-b border-zinc-800 uppercase font-mono tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Direction</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Counterparty</th>
                    <th className="pb-3 font-semibold">Tx Hash</th>
                    <th className="pb-3 font-semibold">Timestamp</th>
                    <th className="pb-3 font-semibold text-right">Ledger Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {onChainPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3.5 font-medium text-zinc-300">
                        <span className="flex items-center gap-1.5">
                          <ArrowDownLeft className="w-4 h-4 text-sky-400 shrink-0" />
                          <span>On-Chain Operation</span>
                        </span>
                      </td>
                      <td className="py-3.5 font-mono font-semibold text-zinc-100">
                        {p.amount} <span className="text-[#e5c158] font-serif">{p.asset}</span>
                      </td>
                      <td className="py-3.5 font-mono text-zinc-300">
                        <div className="flex items-center gap-1.5">
                          <span>{shortenAddress(p.to || p.from)}</span>
                          <CopyButton text={p.to || p.from} />
                        </div>
                      </td>
                      <td className="py-3.5 font-mono text-zinc-300">
                        <div className="flex items-center gap-1.5">
                          <span>{shortenHash(p.hash)}</span>
                          <CopyButton text={p.hash} />
                          <a
                            href={`https://stellar.expert/explorer/testnet/tx/${p.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#e5c158] hover:text-[#f7e7a9] transition-colors"
                            title="Verify on Stellar Expert"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                      <td className="py-3.5 font-mono text-zinc-400 text-[11px]">
                        {formatTimestamp(p.createdAt)}
                      </td>
                      <td className="py-3.5 text-right">
                        <StatusBadge
                          label={p.transactionSuccessful ? 'Confirmed' : 'Failed'}
                          variant={p.transactionSuccessful ? 'success' : 'error'}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}
