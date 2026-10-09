'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Building2,
  CheckCircle2,
  ExternalLink,
  Loader2,
  AlertCircle,
  FileText,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import {
  fetchDesignerRecord,
  registerDesignerOnChain,
  DEPLOYED_CONTRACTS,
} from '../../lib/stellar/contracts';
import { DesignerProfileData, WalletProviderId } from '../../types/stellar';
import { getTxExplorerUrl, shortenAddress } from '../../config/stellar';

interface DesignerRegistrySectionProps {
  userAddress: string | null;
  walletId: WalletProviderId | null;
  isConnected: boolean;
}

export const DesignerRegistrySection: React.FC<DesignerRegistrySectionProps> = ({
  userAddress,
  walletId,
  isConnected,
}) => {
  const [designer, setDesigner] = useState<DesignerProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [atelierLocation, setAtelierLocation] = useState('');
  const [metadataUri, setMetadataUri] = useState('ipfs://bafybeiatelierdemo001');

  // Transaction submission status
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadDesigner = useCallback(async () => {
    if (!userAddress) return;
    setIsLoading(true);
    try {
      const data = await fetchDesignerRecord(userAddress);
      setDesigner(data);
    } catch {
      // Ignored
    } finally {
      setIsLoading(false);
    }
  }, [userAddress]);

  useEffect(() => {
    if (userAddress) {
      loadDesigner();
    } else {
      setDesigner(null);
    }
  }, [userAddress, loadDesigner]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAddress) return;

    setErrorMsg(null);
    setTxHash(null);
    setTxStatus('initiating');

    try {
      const hash = await registerDesignerOnChain(
        userAddress,
        brandName,
        atelierLocation,
        metadataUri,
        walletId || 'freighter',
        (status) => setTxStatus(status)
      );

      setTxHash(hash);
      setTxStatus('successful');
      await loadDesigner();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration transaction failed');
      setTxStatus('failed');
    }
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
            <Building2 className="w-6 h-6 text-amber-400" />
            Designer & Atelier Sovereign Identity
          </h2>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl">
            Register your fashion label directly onto the Stellar blockchain. Establishes sovereign
            on-chain provenance and author rights for all digital product passports.
          </p>
        </div>

        <div className="text-right flex items-center md:flex-col md:items-end justify-between gap-1">
          <span className="text-xs text-stone-500">Contract ID:</span>
          <a
            href={`https://stellar.expert/explorer/testnet/contract/${DEPLOYED_CONTRACTS.designerRegistry}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
          >
            {shortenAddress(DEPLOYED_CONTRACTS.designerRegistry, 6)}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left column: Current Registry Status */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-stone-300 uppercase tracking-wider">
              On-Chain Atelier Record
            </h3>
            {userAddress && (
              <button
                onClick={loadDesigner}
                disabled={isLoading}
                className="text-xs text-stone-400 hover:text-amber-400 flex items-center gap-1 transition"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="p-8 rounded-xl bg-stone-950/60 border border-stone-800 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-amber-400 mx-auto mb-2" />
              <p className="text-xs text-stone-400">Querying Soroban contract state...</p>
            </div>
          ) : designer ? (
            <div className="p-5 rounded-xl bg-gradient-to-br from-stone-950 to-stone-900 border border-amber-900/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-emerald-400">
                    Sovereign Registered
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 font-mono">
                  Ledger #{designer.registeredAt}
                </span>
              </div>

              <div>
                <span className="text-xs text-stone-500 uppercase tracking-wider">Maison Brand</span>
                <p className="text-xl font-serif font-bold text-amber-100">{designer.brandName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-800/80">
                <div>
                  <span className="text-[11px] text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" /> Location
                  </span>
                  <p className="text-sm text-stone-300 font-medium">{designer.atelierLocation}</p>
                </div>
                <div>
                  <span className="text-[11px] text-stone-500 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-stone-400" /> Profile CID
                  </span>
                  <p className="text-sm text-amber-400 font-mono truncate">
                    {designer.metadataUri}
                  </p>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-stone-500 font-mono truncate">
                Address: {designer.designerAddress}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-stone-950/50 border border-stone-800/80 text-center">
              <Sparkles className="w-8 h-8 text-stone-600 mx-auto mb-2" />
              <p className="text-sm text-stone-300 font-medium">No Atelier Registered Yet</p>
              <p className="text-xs text-stone-500 mt-1">
                {isConnected
                  ? 'Your connected account does not have an active on-chain designer record. Complete the form to register.'
                  : 'Connect your wallet to inspect your on-chain registration status.'}
              </p>
            </div>
          )}

          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-stone-400 leading-relaxed">
            <span className="font-semibold text-amber-300">Identity Guarantee: </span>
            Registration records are cryptographically anchored. Only the private key controlling{' '}
            <code className="text-amber-300 font-mono text-[11px]">designer.require_auth()</code>{' '}
            can modify metadata references.
          </div>
        </div>

        {/* Right column: Registration form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleRegister}
            className="p-6 rounded-xl bg-stone-950/70 border border-stone-800 space-y-4"
          >
            <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wider mb-2">
              {designer ? 'Update Atelier Profile' : 'Register New Atelier'}
            </h3>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">
                Brand / Maison Name
              </label>
              <input
                type="text"
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Maison Lumina Couture"
                className="w-full px-3.5 py-2.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">
                Atelier Location / City
              </label>
              <input
                type="text"
                required
                value={atelierLocation}
                onChange={(e) => setAtelierLocation(e.target.value)}
                placeholder="e.g. Paris, France & Milan, Italy"
                className="w-full px-3.5 py-2.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">
                Profile Metadata Reference (IPFS CID / URI)
              </label>
              <input
                type="text"
                required
                value={metadataUri}
                onChange={(e) => setMetadataUri(e.target.value)}
                placeholder="ipfs://bafybei..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 font-mono text-xs placeholder-stone-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Lifecycle Status Feedback */}
            {txStatus && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                  txStatus === 'successful'
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                    : txStatus === 'failed'
                    ? 'bg-red-950/40 border-red-800 text-red-300'
                    : 'bg-amber-950/40 border-amber-800 text-amber-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {txStatus === 'successful' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : txStatus === 'failed' ? (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  ) : (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  )}
                  <span>Status: <strong className="uppercase">{txStatus.replace('_', ' ')}</strong></span>
                </div>

                {txHash && (
                  <a
                    href={getTxExplorerUrl(txHash)}
                    target="_blank"
                    rel="noreferrer"
                    className="underline flex items-center gap-1 font-mono text-[11px]"
                  >
                    View Explorer <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={!isConnected || txStatus === 'submitting' || txStatus === 'pending_confirmation'}
              className="w-full py-3 px-4 rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-lg shadow-amber-950/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {txStatus === 'submitting' || txStatus === 'pending_confirmation' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Confirming on Stellar Testnet...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {designer ? 'Update Profile on Soroban' : 'Sign & Register on Stellar Testnet'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
