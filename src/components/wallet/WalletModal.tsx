'use client';

import React from 'react';
import { X, ExternalLink, CheckCircle, ShieldCheck } from 'lucide-react';
import { WalletOption, WalletProviderId } from '../../types/stellar';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallets: WalletOption[];
  onSelectWallet: (id: WalletProviderId) => void;
  activeWalletId: WalletProviderId | null;
  isConnecting: boolean;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  wallets,
  onSelectWallet,
  activeWalletId,
  isConnecting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-stone-900 border border-amber-900/40 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div>
            <h3 className="text-xl font-serif font-bold text-amber-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              Connect Stellar Wallet
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Select your preferred wallet for Stellar Testnet
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mt-4">
          {wallets.map((wallet) => {
            const isSelected = activeWalletId === wallet.id;
            return (
              <div
                key={wallet.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-stone-800 bg-stone-950/60 hover:border-amber-500/40 hover:bg-stone-800/40'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectWallet(wallet.id)}
                  disabled={isConnecting}
                  className="flex-1 flex items-center gap-3 text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-stone-800 flex items-center justify-center font-bold text-amber-300 border border-stone-700">
                    {wallet.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-stone-200">{wallet.name}</span>
                      {wallet.isAvailable && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                          Detected
                        </span>
                      )}
                      {wallet.type === 'web' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800">
                          Web
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 line-clamp-1">{wallet.description}</p>
                  </div>
                </button>

                <div className="flex items-center gap-2 pl-2">
                  {isSelected ? (
                    <CheckCircle className="w-5 h-5 text-amber-400" />
                  ) : !wallet.isAvailable && wallet.type === 'extension' ? (
                    <a
                      href={wallet.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-stone-400 hover:text-amber-400 transition"
                      title="Install extension"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 p-3 rounded-xl bg-stone-950 border border-stone-800 text-[11px] text-stone-400 text-center">
          Private keys never leave your device. All actions require wallet confirmation.
        </div>
      </div>
    </div>
  );
};
