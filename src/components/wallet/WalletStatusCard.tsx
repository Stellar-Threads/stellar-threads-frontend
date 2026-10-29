'use client';

import React from 'react';
import {
  Wallet,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { CopyButton } from '../common/CopyButton';
import { StatusBadge } from '../common/StatusBadge';
import {
  getAccountExplorerUrl,
  STELLAR_NETWORK,
} from '../../config/stellar';

interface WalletStatusCardProps {
  status: string;
  address: string | null;
  network: string | null;
  isFreighterInstalled: boolean;
  error: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WalletStatusCard({
  status,
  address,
  network: _network,
  isFreighterInstalled,
  error,
  onConnect,
  onDisconnect,
}: WalletStatusCardProps) {
  const isConnected = status === 'connected' && !!address;
  const isConnecting = status === 'connecting';
  const isUnsupported = status === 'unsupported_network';

  return (
    <div className="bg-gradient-to-b from-zinc-900/90 to-[#0e1017]/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-black/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-[#e5c158]">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-zinc-100">
              Stellar Wallet Integration
            </h3>
            <p className="text-xs text-zinc-400">
              Direct Freighter browser extension connectivity
            </p>
          </div>
        </div>

        <div>
          {isConnected ? (
            <StatusBadge label="Wallet Active" variant="success" pulse />
          ) : isUnsupported ? (
            <StatusBadge label="Unsupported Network" variant="warning" />
          ) : isConnecting ? (
            <StatusBadge label="Connecting..." variant="info" pulse />
          ) : (
            <StatusBadge label="Disconnected" variant="neutral" />
          )}
        </div>
      </div>

      {/* Main Wallet Content */}
      <div className="pt-6 space-y-6">
        {isConnected ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-medium uppercase tracking-wider text-[11px]">
                  Connected Public Address
                </span>
                <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Ed25519
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/90 p-3 rounded-xl border border-zinc-800/80">
                <span className="font-mono text-sm text-zinc-200 break-all select-all">
                  {address}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <CopyButton text={address!} label="Copy" />
                  <a
                    href={getAccountExplorerUrl(address!)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
                    title="View Account on Stellar Expert"
                  >
                    <span>Explorer</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/60 flex items-center justify-between">
                <span className="text-zinc-400">Target Network</span>
                <span className="font-mono text-[#e5c158] font-medium">Stellar Testnet</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/60 flex items-center justify-between">
                <span className="text-zinc-400">Passphrase</span>
                <span className="font-mono text-zinc-300 truncate max-w-[150px]" title={STELLAR_NETWORK.passphrase}>
                  {STELLAR_NETWORK.passphrase}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onDisconnect}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-rose-400 hover:text-rose-300 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/50 rounded-xl transition-colors cursor-pointer"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {!isFreighterInstalled ? (
              <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-900/50 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-amber-200">
                      Freighter Wallet Not Detected
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Stellar Threads uses Freighter for non-custodial transaction authorization. To proceed with genuine Testnet payments, install the official extension for your browser.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href="https://www.freighter.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-[#d4af37] text-zinc-950 hover:bg-[#e5c158] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Install Freighter</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-zinc-700 bg-zinc-900/80 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reload After Installing</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <p className="text-sm text-zinc-300 max-w-md mx-auto">
                  Connect your Freighter, xBull, Albedo, or compatible Stellar wallet to query live Testnet balances and authorize Soroban contract interactions.
                </p>

                <button
                  type="button"
                  onClick={onConnect}
                  disabled={isConnecting}
                  className="px-8 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider bg-gradient-to-r from-[#d4af37] via-[#f3d97c] to-[#b38e22] text-zinc-950 hover:brightness-110 shadow-lg shadow-[#d4af37]/20 transition-all cursor-pointer"
                >
                  {isConnecting
                    ? 'Requesting Authorization...'
                    : isFreighterInstalled
                    ? 'Connect Freighter Wallet'
                    : 'Connect Stellar Wallet'}
                </button>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/50 text-xs text-rose-300">
                <span className="font-semibold">Connection Error: </span>
                <span>{error}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
