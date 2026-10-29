import React from 'react';
import { Coins, Globe2, Layers, ShieldCheck, Sparkles } from 'lucide-react';


interface HeroSectionProps {
  onConnectClick: () => void;
  isConnected: boolean;
}

export function HeroSection({ onConnectClick, isConnected }: HeroSectionProps) {
  return (
    <section id="overview" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-[#d4af37]/10 via-[#d4af37]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#f5db89] text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#e5c158]" />
          <span>Decentralized Fashion Commerce Protocol</span>
        </div>

        {/* Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-100 leading-[1.08]">
            From design to ownership, <br />
            <span className="bg-gradient-to-r from-[#d4af37] via-[#f7e49e] to-[#b88c1b] bg-clip-text text-transparent italic font-normal">
              powered by Stellar.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed pt-2">
            Stellar Threads establishes an open financial and trade infrastructure for the global fashion industry. Connecting independent ateliers, sustainable mills, manufacturers, and patrons through trustless Stellar settlements.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {!isConnected ? (
            <button
              type="button"
              onClick={onConnectClick}
              className="px-6 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider bg-gradient-to-r from-[#d4af37] via-[#f3d97c] to-[#b38e22] text-zinc-950 hover:brightness-110 shadow-lg shadow-[#d4af37]/20 transition-all cursor-pointer"
            >
              Connect Freighter Wallet
            </button>
          ) : (
            <a
              href="#dashboard"
              className="px-6 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider bg-gradient-to-r from-[#d4af37] via-[#f3d97c] to-[#b38e22] text-zinc-950 hover:brightness-110 shadow-lg shadow-[#d4af37]/20 transition-all"
            >
              Manage Treasury & XLM
            </a>
          )}

          <a
            href="#roadmap"
            className="px-6 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider border border-zinc-700 hover:border-zinc-500 bg-zinc-900/60 text-zinc-300 hover:text-zinc-100 transition-all"
          >
            Explore Protocol Roadmap
          </a>
        </div>

        {/* Key Protocol Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-14 max-w-5xl mx-auto">
          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm text-left hover:border-[#d4af37]/30 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37]/15 flex items-center justify-center mb-3">
              <Coins className="w-4 h-4 text-[#e5c158]" />
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Low-Cost Payments
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Testnet XLM transactions at ~0.00001 XLM base fee per transfer.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm text-left hover:border-[#d4af37]/30 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Non-Custodial
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Users sign transactions directly via Freighter; private keys never leave the wallet.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm text-left hover:border-[#d4af37]/30 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center mb-3">
              <Globe2 className="w-4 h-4 text-sky-400" />
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Borderless Trade
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Built for cross-border textile commerce and international fashion supply chains.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm text-left hover:border-[#d4af37]/30 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center mb-3">
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Soroban-Ready
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Engineered to support smart contract escrows and digital garment passports.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
