'use client';

import React, { useState } from 'react';
import {
  Tag,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Loader2,
  AlertCircle,
  Hash,
  Layers,
  Search,
} from 'lucide-react';
import {
  fetchPassportRecord,
  createPassportOnChain,
  verifyPassportIntegrityOnChain,
  DEPLOYED_CONTRACTS,
} from '../../lib/stellar/contracts';
import { ProductPassportData, WalletProviderId } from '../../types/stellar';
import { getTxExplorerUrl, shortenAddress } from '../../config/stellar';

interface ProductPassportSectionProps {
  userAddress: string | null;
  walletId: WalletProviderId | null;
  isConnected: boolean;
}

export const ProductPassportSection: React.FC<ProductPassportSectionProps> = ({
  userAddress,
  walletId,
  isConnected,
}) => {
  // Registration form
  const [productId, setProductId] = useState('ST-FW26-001');
  const [brandName, setBrandName] = useState('Atelier Stellar Threads');
  const [productName, setProductName] = useState('Celestial Silk Trench');
  const [metadataUri, setMetadataUri] = useState('ipfs://bafybeicelestialsilkcoatmetadata');
  const [integrityHash, setIntegrityHash] = useState(
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  );
  const [totalEdition, setTotalEdition] = useState(25);

  const [regStatus, setRegStatus] = useState<string | null>(null);
  const [regTxHash, setRegTxHash] = useState<string | null>(null);
  const [regError, setRegError] = useState<string | null>(null);

  // Verification & Lookup form
  const [lookupId, setLookupId] = useState('ST-GENESIS-001');
  const [verifyHashInput, setVerifyHashInput] = useState(
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  );
  const [foundPassport, setFoundPassport] = useState<ProductPassportData | null>(null);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const handleRegisterPassport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAddress) return;

    setRegError(null);
    setRegTxHash(null);
    setRegStatus('initiating');

    try {
      const hash = await createPassportOnChain(
        userAddress,
        productId,
        brandName,
        productName,
        metadataUri,
        integrityHash,
        totalEdition,
        walletId || 'freighter',
        (status) => setRegStatus(status)
      );

      setRegTxHash(hash);
      setRegStatus('successful');
    } catch (err: any) {
      setRegError(err.message || 'Passport registration failed');
      setRegStatus('failed');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupId) return;

    setIsVerifying(true);
    setLookupError(null);
    setVerificationResult(null);

    try {
      const record = await fetchPassportRecord(lookupId);
      if (!record) {
        setLookupError(`No passport found for ID "${lookupId}"`);
        setFoundPassport(null);
      } else {
        setFoundPassport(record);
        if (verifyHashInput) {
          const isMatch = await verifyPassportIntegrityOnChain(lookupId, verifyHashInput);
          setVerificationResult(isMatch);
        }
      }
    } catch (err: any) {
      setLookupError(err.message || 'Failed to verify on-chain passport');
    } finally {
      setIsVerifying(false);
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
            <Tag className="w-6 h-6 text-amber-400" />
            Digital Product Passports & Integrity Registry
          </h2>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl">
            Register tamper-evident digital product passports (DPP) containing material composition,
            origin, and cryptographic hashes on the Stellar blockchain.
          </p>
        </div>

        <div className="text-right flex items-center md:flex-col md:items-end justify-between gap-1">
          <span className="text-xs text-stone-500">Contract ID:</span>
          <a
            href={`https://stellar.expert/explorer/testnet/contract/${DEPLOYED_CONTRACTS.productPassport}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
          >
            {shortenAddress(DEPLOYED_CONTRACTS.productPassport, 6)}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left Column: Create Passport */}
        <div className="lg:col-span-6">
          <form
            onSubmit={handleRegisterPassport}
            className="p-6 rounded-xl bg-stone-950/70 border border-stone-800 space-y-4"
          >
            <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" /> Mint New Digital Passport
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Product Identifier
                </label>
                <input
                  type="text"
                  required
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  placeholder="ST-FW26-001"
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 font-mono text-xs focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Total Batch Edition
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={totalEdition}
                  onChange={(e) => setTotalEdition(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Garment Name</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">
                Metadata URI (Off-Chain IPFS Spec)
              </label>
              <input
                type="text"
                required
                value={metadataUri}
                onChange={(e) => setMetadataUri(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 font-mono text-xs focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">
                Integrity SHA-256 Hash
              </label>
              <input
                type="text"
                required
                value={integrityHash}
                onChange={(e) => setIntegrityHash(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 font-mono text-xs focus:border-amber-400"
              />
            </div>

            {regStatus && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                  regStatus === 'successful'
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                    : regStatus === 'failed'
                    ? 'bg-red-950/40 border-red-800 text-red-300'
                    : 'bg-amber-950/40 border-amber-800 text-amber-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {regStatus === 'successful' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : regStatus === 'failed' ? (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  ) : (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  )}
                  <span>Status: <strong className="uppercase">{regStatus.replace('_', ' ')}</strong></span>
                </div>

                {regTxHash && (
                  <a
                    href={getTxExplorerUrl(regTxHash)}
                    target="_blank"
                    rel="noreferrer"
                    className="underline flex items-center gap-1 font-mono text-[11px]"
                  >
                    View Explorer <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            {regError && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs">
                {regError}
              </div>
            )}

            <button
              type="submit"
              disabled={!isConnected || regStatus === 'submitting' || regStatus === 'pending_confirmation'}
              className="w-full py-3 px-4 rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-lg shadow-amber-950/30 disabled:opacity-50"
            >
              {regStatus === 'submitting' || regStatus === 'pending_confirmation' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Confirming Passport on Soroban...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Sign & Mint Passport on Stellar
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Verify on-chain */}
        <div className="lg:col-span-6 space-y-4">
          <form
            onSubmit={handleVerify}
            className="p-6 rounded-xl bg-stone-950/70 border border-stone-800 space-y-4"
          >
            <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-400" /> On-Chain Passport Verification
            </h3>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">
                Passport Product ID
              </label>
              <input
                type="text"
                required
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                placeholder="ST-GENESIS-001"
                className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 font-mono text-xs focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">
                Verification Hash (Compare against ledger)
              </label>
              <input
                type="text"
                value={verifyHashInput}
                onChange={(e) => setVerifyHashInput(e.target.value)}
                placeholder="SHA-256 integrity hash"
                className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 font-mono text-xs focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-2.5 px-4 rounded-xl font-medium text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 transition flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Verifying on Stellar Testnet...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Query Contract & Verify Integrity
                </>
              )}
            </button>

            {lookupError && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs">
                {lookupError}
              </div>
            )}

            {foundPassport && (
              <div className="mt-4 p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-amber-100 text-sm">
                    {foundPassport.productName}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Active Passport
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-stone-500">Maison Brand:</span>
                    <p className="text-stone-200 font-medium">{foundPassport.brandName}</p>
                  </div>
                  <div>
                    <span className="text-stone-500">Batch Edition:</span>
                    <p className="text-stone-200 font-medium">1 of {foundPassport.totalEdition}</p>
                  </div>
                </div>

                <div className="text-xs">
                  <span className="text-stone-500">On-Chain Hash:</span>
                  <p className="font-mono text-[11px] text-amber-400 truncate">
                    {foundPassport.integrityHash}
                  </p>
                </div>

                {verificationResult !== null && (
                  <div
                    className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                      verificationResult
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                        : 'bg-red-950/40 border-red-800 text-red-300'
                    }`}
                  >
                    {verificationResult ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Cryptographic Integrity Confirmed: Hashes match 100%</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span>Hash Mismatch: Provided data does not match on-chain record!</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Legal / Protocol Notice */}
          <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800/80 text-[11px] text-stone-400 leading-relaxed space-y-1">
            <span className="font-semibold text-amber-300 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5" /> Blockchain vs Physical Goods Assurance:
            </span>
            <p>
              An on-chain digital product passport proves that the identity specification was
              registered by an authorized creator and that its metadata hash has not been tampered
              with. Physical authenticity relies on verified supply chain attestation and trusted atelier
              authorization.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
