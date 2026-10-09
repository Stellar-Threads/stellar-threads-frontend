import React from 'react';
import {
  ShieldCheck,
  QrCode,
  FileCheck,
  TrendingUp,
  Coins,
  Lock,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export function ProtocolRoadmap() {
  const modules = [
    {
      title: 'Stellar Foundation & Multi-Wallet Payments',
      status: 'active' as const,
      statusLabel: 'Live on Testnet',
      variant: 'success' as const,
      icon: <Coins className="w-5 h-5 text-emerald-400" />,
      description:
        'Live Stellar Testnet settlement, multi-wallet connectivity (Freighter, xBull, Albedo, Rabet), real-time balance queries, and on-chain XLM payments.',
      details: [
        'Multi-wallet authorization & signature verification',
        'Direct Stellar Testnet Horizon submission',
        'Sub-second payment settlement and explorer verification',
      ],
      phase: 'Phase 1 & 2',
    },
    {
      title: 'Designer Sovereign Identity Registry',
      status: 'active' as const,
      statusLabel: 'Deployed Contract',
      variant: 'success' as const,
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
      description:
        'Soroban smart contract for sovereign fashion designer registration, metadata anchoring, and cryptographic provenance rights.',
      details: [
        'On-chain atelier public key registry and metadata reference',
        'require_auth() access-controlled profile updates',
        'Contract events emitted and indexed in real-time',
      ],
      phase: 'Phase 2 Live',
    },
    {
      title: 'Digital Product Passport Registry',
      status: 'active' as const,
      statusLabel: 'Deployed Contract',
      variant: 'success' as const,
      icon: <QrCode className="w-5 h-5 text-amber-400" />,
      description:
        'Immutable digital product passports (DPP) containing material composition, cryptographic integrity hashes, and secondary transfers.',
      details: [
        'SHA-256 integrity hash verification against on-chain record',
        'Creator-bound minting and batch edition numbering',
        'Distinction between ledger integrity and physical authentication',
      ],
      phase: 'Phase 2 Live',
    },
    {
      title: 'B2B Fashion Production Escrow',
      status: 'active' as const,
      statusLabel: 'Deployed Contract',
      variant: 'success' as const,
      icon: <FileCheck className="w-5 h-5 text-amber-400" />,
      description:
        'Soroban smart-contract escrow for brand-to-manufacturer production orders with fund, release, and refund lifecycles.',
      details: [
        'Contract-controlled escrow deposits in Stellar assets',
        'Strict buyer authorization for delivery release',
        'Seller-approved refund path and cancellation guards',
      ],
      phase: 'Phase 2 Live',
    },
    {
      title: 'Pre-Order Crowd-Financing & Patronage',
      status: 'upcoming' as const,
      statusLabel: 'Next Stage Milestone',
      variant: 'gold' as const,
      icon: <TrendingUp className="w-5 h-5 text-[#e5c158]" />,
      description:
        'Zero-waste fashion pre-order financing. Patrons fund collections directly, eliminating deadstock and predatory fast-fashion dynamics.',
      details: [
        'Direct micro-funding in XLM or Stellar stablecoins',
        'Automatic order batching and production threshold triggers',
        'Patron proof-of-support badges and early delivery rights',
      ],
      phase: 'Stage 3 Next',
    },
  ];

  return (
    <section id="roadmap" className="py-20 border-t border-zinc-800/80 bg-[#07080b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-700 bg-zinc-900/80 text-zinc-300 text-xs font-mono tracking-wider uppercase">
            <Lock className="w-3.5 h-3.5 text-[#e5c158]" />
            <span>Architecture & Feature Roadmap</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
            Protocol Evolution & Modules
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed font-light">
            Stellar Threads is engineered in modular layers. Stage 2 Soroban smart contracts, multi-wallet
            integration, and real-time event indexing are active and deployed on Stellar Testnet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between ${
                m.status === 'active'
                  ? 'bg-zinc-900/80 border-amber-900/50 shadow-lg shadow-amber-950/20 ring-1 ring-amber-500/20'
                  : 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-700/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800/80 flex items-center justify-center">
                    {m.icon}
                  </div>
                  <StatusBadge
                    label={m.statusLabel}
                    variant={m.variant}
                    pulse={m.status === 'active'}
                  />
                </div>

                <h3 className="font-serif text-lg font-bold text-zinc-100 mb-2">
                  {m.title}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  {m.description}
                </p>

                <div className="pt-3 border-t border-zinc-800/60 space-y-2">
                  <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
                    Protocol Capabilities
                  </span>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {m.details.map((item, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <span className="text-[#e5c158] leading-none mt-1">•</span>
                        <span className="leading-tight text-zinc-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-zinc-800/40 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
                <span>{m.phase}</span>
                <span className={m.status === 'active' ? 'text-amber-400 font-semibold' : 'text-zinc-400'}>
                  {m.status === 'active' ? '● Live on Testnet' : 'Upcoming'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
