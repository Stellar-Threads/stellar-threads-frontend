'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Coins,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import contractsConfig from '@/config/contracts.json';

interface Proposal {
  id: string;
  applicant: string;
  title: string;
  purpose: string;
  targetAmount: string;
  minThreshold: string;
  currentFunded: string;
  deadline: string;
  repaymentTarget: string;
  status: 'FundingActive' | 'Funded' | 'ProductionActive' | 'Repaid';
  metadataUri: string;
}

const SAMPLE_PROPOSALS: Proposal[] = [
  {
    id: 'prop-fw26-silk-run',
    applicant: 'GCCTT7IQVNIDYHAJXYGMUYGETJDYRVLCOMW2UGRWKVCUZ6I7CQY5ZWG4',
    title: 'Autumn/Winter Mulberry Silk Run',
    purpose: 'Ethical mulberry silk sourcing and artisanal hand-weaving for ready-to-wear coats.',
    targetAmount: '50,000',
    minThreshold: '25,000',
    currentFunded: '32,500',
    deadline: '2026-11-15',
    repaymentTarget: '55,000',
    status: 'FundingActive',
    metadataUri: 'ipfs://bafybeisilkmulberryrun2026',
  },
  {
    id: 'prop-organic-denim-01',
    applicant: 'GBA7VGY42OQ7H4R6Z4M64S3N673F26J5P7J6Z4O6M3V2S4K2O2L3M4N5',
    title: 'Zero-Waste Organic Indigo Denim Batch',
    purpose: 'Water-neutral denim production utilizing botanical indigo dye and recycled cotton.',
    targetAmount: '35,000',
    minThreshold: '20,000',
    currentFunded: '35,000',
    deadline: '2026-10-30',
    repaymentTarget: '38,500',
    status: 'Funded',
    metadataUri: 'ipfs://bafybeidenimzerowastebatch',
  },
];

interface ProductionFinancingSectionProps {
  walletAddress?: string | null;
  onContribute?: (proposalId: string, amount: string) => Promise<string>;
}

export const ProductionFinancingSection: React.FC<ProductionFinancingSectionProps> = ({
  walletAddress,
  onContribute,
}) => {
  const [proposals, setProposals] = useState<Proposal[]>(SAMPLE_PROPOSALS);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [contribAmount, setContribAmount] = useState<string>('500');
  const [isContributing, setIsContributing] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New proposal form states
  const [newTitle, setNewTitle] = useState<string>('');
  const [newPurpose, setNewPurpose] = useState<string>('');
  const [newTarget, setNewTarget] = useState<string>('25000');
  const [newThreshold, setNewThreshold] = useState<string>('15000');

  const financingContract = (contractsConfig.contracts as any)?.production_financing;

  const handleContributeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProposal || !walletAddress) return;

    try {
      setIsContributing(true);
      setErrorMessage(null);
      setTxHash(null);

      if (onContribute) {
        const hash = await onContribute(selectedProposal.id, contribAmount);
        setTxHash(hash);
      } else {
        // Simulated contract interaction delay
        await new Promise((r) => setTimeout(r, 1500));
        setTxHash('31b9591468c37af24b16c5bc3280c95e2844db4e9a45ec8db18c543988c02263');
      }

      // Update local state
      setProposals((prev) =>
        prev.map((p) => {
          if (p.id === selectedProposal.id) {
            const funded = parseFloat(p.currentFunded.replace(/,/g, '')) + parseFloat(contribAmount);
            return {
              ...p,
              currentFunded: funded.toLocaleString(),
              status: funded >= parseFloat(p.targetAmount.replace(/,/g, '')) ? 'Funded' : 'FundingActive',
            };
          }
          return p;
        })
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Contribution transaction failed');
    } finally {
      setIsContributing(false);
    }
  };

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) return;

    const newProp: Proposal = {
      id: `prop-${Date.now().toString().slice(-6)}`,
      applicant: walletAddress,
      title: newTitle,
      purpose: newPurpose,
      targetAmount: parseFloat(newTarget).toLocaleString(),
      minThreshold: parseFloat(newThreshold).toLocaleString(),
      currentFunded: '0',
      deadline: '2026-12-31',
      repaymentTarget: (parseFloat(newTarget) * 1.1).toLocaleString(),
      status: 'FundingActive',
      metadataUri: `ipfs://bafybei${Date.now()}`,
    };

    setProposals([newProp, ...proposals]);
    setNewTitle('');
    setNewPurpose('');
  };

  return (
    <section className="bg-stone-900/70 border border-stone-800 rounded-2xl p-6 lg:p-8 backdrop-blur-md shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Soroban Protocol Module
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
              Live Contract
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-100 mt-1 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-amber-400" />
            Fashion Production Financing & Capital Pools
          </h2>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl">
            Contract-enforced capital pooling for textile procurement, seasonal production runs, and ethical garment manufacturing.
            Funds are released only when minimum thresholds are satisfied.
          </p>
        </div>

        {financingContract && (
          <div className="text-right flex items-center md:flex-col md:items-end justify-between gap-1">
            <span className="text-xs text-stone-500">Contract ID:</span>
            <a
              href={financingContract.explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
            >
              {financingContract.address.slice(0, 7)}...{financingContract.address.slice(-6)}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Campaign Listings */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" /> Active Production Campaigns
          </h3>

          <div className="space-y-4">
            {proposals.map((proposal) => {
              const current = parseFloat(proposal.currentFunded.replace(/,/g, ''));
              const target = parseFloat(proposal.targetAmount.replace(/,/g, ''));
              const pct = Math.min(100, Math.round((current / target) * 100));

              return (
                <div
                  key={proposal.id}
                  className={`p-5 rounded-xl border transition-all ${
                    selectedProposal?.id === proposal.id
                      ? 'bg-stone-900 border-amber-500/80 shadow-md shadow-amber-950/20'
                      : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-amber-400">{proposal.id}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            proposal.status === 'Funded'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : proposal.status === 'ProductionActive'
                              ? 'bg-blue-950 text-blue-400 border border-blue-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {proposal.status}
                        </span>
                      </div>
                      <h4 className="text-base font-serif font-bold text-stone-100 mt-1">
                        {proposal.title}
                      </h4>
                      <p className="text-xs text-stone-400 mt-1">{proposal.purpose}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedProposal(proposal)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-400 text-stone-950 transition flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      Fund <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs text-stone-400">
                      <span>
                        Funded: <strong className="text-stone-200">{proposal.currentFunded} XLM</strong> ({pct}%)
                      </span>
                      <span>Target: {proposal.targetAmount} XLM</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-stone-500 pt-0.5">
                      <span>Min Threshold: {proposal.minThreshold} XLM</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" /> Deadline: {proposal.deadline}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contribution or Proposal Form */}
        <div className="lg:col-span-5 space-y-6">
          {selectedProposal ? (
            <form
              onSubmit={handleContributeSubmit}
              className="p-6 rounded-xl bg-stone-950/80 border border-amber-500/30 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Coins className="w-4 h-4" /> Contribute to {selectedProposal.id}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedProposal(null)}
                  className="text-xs text-stone-500 hover:text-stone-300"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Contribution Amount (XLM)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={contribAmount}
                  onChange={(e) => setContribAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 font-mono text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="e.g. 1000"
                />
              </div>

              <div className="p-3 rounded-lg bg-stone-900/60 border border-stone-800 text-xs text-stone-400 space-y-1">
                <div className="flex justify-between">
                  <span>Repayment Premium:</span>
                  <span className="text-amber-300 font-mono">+10% upon production completion</span>
                </div>
                <div className="flex justify-between">
                  <span>Refund Guarantee:</span>
                  <span className="text-stone-300">100% claimable if min threshold is unmet</span>
                </div>
              </div>

              {txHash && (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>
                    Contribution confirmed! Tx:{' '}
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="underline font-mono"
                    >
                      {txHash.slice(0, 8)}...
                    </a>
                  </span>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isContributing || !walletAddress}
                className="w-full py-3 px-4 rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-lg shadow-amber-950/30 disabled:opacity-50 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                {isContributing
                  ? 'Authorizing with Wallet...'
                  : walletAddress
                  ? `Contribute ${contribAmount} XLM on Soroban`
                  : 'Connect Wallet to Contribute'}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleCreateProposal}
              className="p-6 rounded-xl bg-stone-950/70 border border-stone-800 space-y-4"
            >
              <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Request Production Capital
              </h3>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Collection / Campaign Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Spring/Summer Cashmere Capsule"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Production Purpose & Material Breakdown
                </label>
                <textarea
                  required
                  rows={2}
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  placeholder="Fabric procurement, manufacturing run, or bespoke tailoring..."
                  className="w-full px-3.5 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Target (XLM)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    required
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Min Threshold (XLM)
                  </label>
                  <input
                    type="number"
                    min="500"
                    required
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!walletAddress}
                className="w-full py-2.5 px-4 rounded-xl font-medium text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {walletAddress ? 'Submit Proposal to Soroban' : 'Connect Wallet to Create Proposal'}
              </button>
            </form>
          )}

          <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800/80 text-xs text-stone-400 leading-relaxed">
            <span className="font-semibold text-amber-300">Financial Transparency: </span>
            All capital pooling and repayment shares are governed by deterministic Soroban smart contract logic.
            Contributors receive proportional repayments when manufacturing runs are delivered.
          </div>
        </div>
      </div>
    </section>
  );
};
