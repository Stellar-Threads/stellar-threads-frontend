import React from 'react';
import { ExternalLink, Sparkles, GitBranch, Code2 } from 'lucide-react';
import { PROTOCOL_INFO, STELLAR_NETWORK } from '../../config/stellar';

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#07080a] text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#e5c158]" />
              </div>
              <span className="font-serif text-lg font-bold tracking-widest text-zinc-100 uppercase">
                Stellar Threads
              </span>
            </div>
            <p className="font-serif italic text-base text-[#e5c158]/90 tracking-wide">
              &ldquo;{PROTOCOL_INFO.tagline}&rdquo;
            </p>
            <p className="text-xs text-zinc-400 max-w-md leading-relaxed">
              Stellar Threads connects independent ateliers, fashion brands, sustainable mills,
              and global customers through transparent, accessible commerce on Stellar.
            </p>
          </div>

          {/* Repositories & Open Source */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Protocol Repositories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={PROTOCOL_INFO.frontendRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-[#e5c158] transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>stellar-threads-frontend</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </a>
              </li>
              <li>
                <a
                  href={PROTOCOL_INFO.coreRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-[#e5c158] transition-colors"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>stellar-threads-core</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </a>
              </li>
              <li>
                <a
                  href={PROTOCOL_INFO.orgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Stellar-Threads Organization</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Stellar Infrastructure */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Stellar Network
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={STELLAR_NETWORK.explorerBaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <span>Stellar Expert Testnet Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://developers.stellar.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <span>Stellar Developer Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://soroban.stellar.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <span>Soroban Smart Contracts</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.freighter.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <span>Freighter Wallet Extension</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <div className="flex items-center gap-1">
            <span>Built under the Apache-2.0 License.</span>
            <span>Non-custodial, decentralized fashion finance.</span>
          </div>
          <div className="text-zinc-400 font-mono text-[11px]">
            Network: <span className="text-[#e5c158]">Stellar Testnet</span> (Passphrase: Test SDF Network ; September 2015)
          </div>
        </div>
      </div>
    </footer>
  );
}
