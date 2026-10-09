'use client';

import React, { useState } from 'react';
import { Wallet, ExternalLink, Menu, X, Sparkles, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { CopyButton } from '../common/CopyButton';
import { shortenAddress, getAccountExplorerUrl } from '../../config/stellar';

interface NavbarProps {
  walletAddress: string | null;
  walletStatus: string;
  walletName?: string | null;
  isConnecting: boolean;
  onOpenWalletModal?: () => void;
  onConnect?: () => void;
  onDisconnect: () => void;
}

export function Navbar({
  walletAddress,
  walletStatus,
  walletName = 'Wallet',
  isConnecting,
  onOpenWalletModal,
  onConnect,
  onDisconnect,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleOpenConnect = onOpenWalletModal || onConnect || (() => {});

  const isConnected = walletStatus === 'connected' && !!walletAddress;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#090a0f]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-4">
            <a href="#overview" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] via-[#c59e2b] to-[#997718] p-0.5 shadow-lg shadow-[#d4af37]/10 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-[#0b0c10] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#e5c158]" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-serif tracking-widest text-lg font-bold text-zinc-100 uppercase group-hover:text-[#e5c158] transition-colors">
                    Stellar Threads
                  </span>
                </div>
                <span className="text-[10px] tracking-wider text-zinc-400 uppercase font-mono">
                  Fashion Finance Protocol
                </span>
              </div>
            </a>

            <div className="hidden lg:flex items-center ml-2">
              <StatusBadge label="Stellar Testnet" variant="gold" pulse />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium tracking-wide">
            <a href="#overview" className="text-zinc-400 hover:text-zinc-100 transition-colors">
              Overview
            </a>
            <a href="#designers" className="text-zinc-400 hover:text-[#e5c158] transition-colors">
              Atelier Registry
            </a>
            <a href="#passports" className="text-zinc-400 hover:text-[#e5c158] transition-colors">
              Product Passports
            </a>
            <a href="#escrow" className="text-zinc-400 hover:text-[#e5c158] transition-colors">
              Fashion Escrow
            </a>
            <a href="#events" className="text-zinc-400 hover:text-[#e5c158] transition-colors">
              Live Events
            </a>
            <a href="#payment" className="text-zinc-400 hover:text-zinc-100 transition-colors">
              Direct XLM
            </a>
          </nav>

          {/* Wallet Actions (Desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            {isConnected ? (
              <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 rounded-xl px-3 py-1.5 shadow-sm">
                <div className="flex flex-col items-start pr-2 border-r border-zinc-800">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-mono font-medium text-zinc-200">
                      {shortenAddress(walletAddress!)}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-400/90 font-mono">
                    {walletName || 'Stellar Wallet'}
                  </span>
                </div>

                <CopyButton text={walletAddress!} />

                <a
                  href={getAccountExplorerUrl(walletAddress!)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                  title="View on Stellar Expert"
                  aria-label="View on Stellar Expert"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={onDisconnect}
                  className="ml-2 text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1 rounded hover:bg-rose-950/40 transition-colors cursor-pointer"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleOpenConnect}
                disabled={isConnecting}
                className="relative group overflow-hidden rounded-xl p-px font-semibold text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-[#d4af37]/5 cursor-pointer"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#d4af37] via-[#f3d97c] to-[#b38e22] group-hover:opacity-90 transition-opacity" />
                <span className="relative flex items-center gap-2 px-4 py-2.5 rounded-[11px] bg-[#0d0e14] text-[#f7e7a9] group-hover:bg-[#12131a] transition-colors">
                  <Wallet className="w-4 h-4 text-[#e5c158]" />
                  <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                </span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-zinc-800 bg-[#090a0f] px-4 pt-2 pb-6 space-y-3">
          <div className="py-2">
            <StatusBadge label="Stellar Testnet" variant="gold" pulse />
          </div>

          <nav className="flex flex-col space-y-2 text-sm font-medium">
            <a
              href="#overview"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-zinc-100 py-1"
            >
              Overview
            </a>
            <a
              href="#designers"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-[#e5c158] py-1"
            >
              Atelier Registry
            </a>
            <a
              href="#passports"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-[#e5c158] py-1"
            >
              Product Passports
            </a>
            <a
              href="#escrow"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-[#e5c158] py-1"
            >
              Fashion Escrow
            </a>
            <a
              href="#events"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-[#e5c158] py-1"
            >
              Live Events
            </a>
            <a
              href="#payment"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-zinc-100 py-1"
            >
              Send XLM Payment
            </a>
          </nav>

          <div className="pt-4 border-t border-zinc-800">
            {isConnected ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>Connected ({walletName}):</span>
                  <span>{shortenAddress(walletAddress!)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onDisconnect();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs font-semibold uppercase text-rose-400 bg-rose-950/30 rounded-lg border border-rose-900/50"
                >
                  Disconnect Wallet
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  handleOpenConnect();
                  setMobileMenuOpen(false);
                }}
                disabled={isConnecting}
                className="w-full py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-[#f7e7a9] bg-gradient-to-r from-[#d4af37] to-[#b38e22] rounded-xl text-black"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
