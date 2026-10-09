'use client';

import React, { useState } from 'react';
import {
  Coins,
  CheckCircle2,
  ExternalLink,
  Loader2,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Send,
  RotateCcw,
  Search,
} from 'lucide-react';
import {
  fetchEscrowOrder,
  createEscrowOrderOnChain,
  fundEscrowOrderOnChain,
  releaseEscrowOrderOnChain,
  refundEscrowOrderOnChain,
  DEPLOYED_CONTRACTS,
} from '../../lib/stellar/contracts';
import { EscrowOrderData, WalletProviderId } from '../../types/stellar';
import { getTxExplorerUrl, shortenAddress } from '../../config/stellar';

interface FashionEscrowSectionProps {
  userAddress: string | null;
  walletId: WalletProviderId | null;
  isConnected: boolean;
}

export const FashionEscrowSection: React.FC<FashionEscrowSectionProps> = ({
  userAddress,
  walletId,
  isConnected,
}) => {
  // Create order state
  const [orderId, setOrderId] = useState<number>(101);
  const [sellerAddress, setSellerAddress] = useState(
    'GCCTT7IQVNIDYHAJXYGMUYGETJDYRVLCOMW2UGRWKVCUZ6I7CQY5ZWG4'
  );
  // Default to native SAC token or XLM contract
  const [tokenAddress, setTokenAddress] = useState(
    'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC' // Testnet Native SAC Token
  );
  const [amount, setAmount] = useState('10000000'); // 1 XLM (10,000,000 stroops)
  const [orderRef, setOrderRef] = useState('ORD-LUXURY-FW26');

  // Lookup state
  const [lookupOrderId, setLookupOrderId] = useState<number>(orderId);
  const [currentOrder, setCurrentOrder] = useState<EscrowOrderData | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  // Transaction feedback
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  const handleLookup = async (idToQuery = lookupOrderId) => {
    setIsLookingUp(true);
    setTxError(null);
    try {
      const order = await fetchEscrowOrder(idToQuery);
      setCurrentOrder(order);
      if (!order) {
        setTxError(`Escrow order #${idToQuery} not found on-chain.`);
      }
    } catch (err: any) {
      setTxError(err.message || 'Failed to query escrow order');
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAddress) return;

    setTxError(null);
    setTxHash(null);
    setTxStatus('initiating');

    try {
      const hash = await createEscrowOrderOnChain(
        userAddress,
        orderId,
        sellerAddress,
        tokenAddress,
        amount,
        orderRef,
        walletId || 'freighter',
        (status) => setTxStatus(status)
      );

      setTxHash(hash);
      setTxStatus('successful');
      setLookupOrderId(orderId);
      await handleLookup(orderId);
    } catch (err: any) {
      setTxError(err.message || 'Failed to create escrow order');
      setTxStatus('failed');
    }
  };

  const handleFund = async () => {
    if (!userAddress || !currentOrder) return;
    setTxError(null);
    setTxStatus('initiating');

    try {
      const hash = await fundEscrowOrderOnChain(
        userAddress,
        currentOrder.orderId,
        walletId || 'freighter',
        (status) => setTxStatus(status)
      );
      setTxHash(hash);
      setTxStatus('successful');
      await handleLookup(currentOrder.orderId);
    } catch (err: any) {
      setTxError(err.message || 'Funding escrow failed');
      setTxStatus('failed');
    }
  };

  const handleRelease = async () => {
    if (!userAddress || !currentOrder) return;
    setTxError(null);
    setTxStatus('initiating');

    try {
      const hash = await releaseEscrowOrderOnChain(
        userAddress,
        currentOrder.orderId,
        walletId || 'freighter',
        (status) => setTxStatus(status)
      );
      setTxHash(hash);
      setTxStatus('successful');
      await handleLookup(currentOrder.orderId);
    } catch (err: any) {
      setTxError(err.message || 'Release escrow failed');
      setTxStatus('failed');
    }
  };

  const handleRefund = async () => {
    if (!userAddress || !currentOrder) return;
    setTxError(null);
    setTxStatus('initiating');

    try {
      const hash = await refundEscrowOrderOnChain(
        userAddress,
        currentOrder.orderId,
        walletId || 'freighter',
        (status) => setTxStatus(status)
      );
      setTxHash(hash);
      setTxStatus('successful');
      await handleLookup(currentOrder.orderId);
    } catch (err: any) {
      setTxError(err.message || 'Refund escrow failed');
      setTxStatus('failed');
    }
  };

  const getLifecycleStageLabel = (stateNum: number) => {
    switch (stateNum) {
      case 0:
        return { label: 'Created (Unfunded)', color: 'text-amber-400 bg-amber-950/60 border-amber-800' };
      case 1:
        return { label: 'Funded (In Escrow)', color: 'text-blue-400 bg-blue-950/60 border-blue-800' };
      case 2:
        return { label: 'Released to Seller', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' };
      case 3:
        return { label: 'Refunded to Buyer', color: 'text-purple-400 bg-purple-950/60 border-purple-800' };
      case 4:
        return { label: 'Cancelled', color: 'text-stone-400 bg-stone-900 border-stone-800' };
      default:
        return { label: 'Unknown', color: 'text-stone-400 bg-stone-900 border-stone-800' };
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
            <Coins className="w-6 h-6 text-amber-400" />
            B2B Fashion Production Escrow
          </h2>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl">
            Contract-controlled milestone settlement for wholesale fashion orders and garment production.
            Eliminates counterparty risk between clothing brands and textile manufacturers.
          </p>
        </div>

        <div className="text-right flex items-center md:flex-col md:items-end justify-between gap-1">
          <span className="text-xs text-stone-500">Contract ID:</span>
          <a
            href={`https://stellar.expert/explorer/testnet/contract/${DEPLOYED_CONTRACTS.fashionEscrow}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
          >
            {shortenAddress(DEPLOYED_CONTRACTS.fashionEscrow, 6)}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left Column: Create Order */}
        <div className="lg:col-span-6">
          <form
            onSubmit={handleCreateOrder}
            className="p-6 rounded-xl bg-stone-950/70 border border-stone-800 space-y-4"
          >
            <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wider">
              Create New Escrow Agreement
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Order ID</label>
                <input
                  type="number"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 font-mono text-xs focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Order Reference
                </label>
                <input
                  type="text"
                  required
                  value={orderRef}
                  onChange={(e) => setOrderRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">
                Seller (Manufacturer / Atelier) Address
              </label>
              <input
                type="text"
                required
                value={sellerAddress}
                onChange={(e) => setSellerAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 font-mono text-xs focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Settlement Token Contract
                </label>
                <input
                  type="text"
                  required
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 font-mono text-[11px] focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Amount (Stroops / Units)
                </label>
                <input
                  type="text"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="10000000"
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 font-mono text-xs focus:border-amber-400"
                />
              </div>
            </div>

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

            {txError && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs">
                {txError}
              </div>
            )}

            <button
              type="submit"
              disabled={!isConnected || txStatus === 'submitting' || txStatus === 'pending_confirmation'}
              className="w-full py-3 px-4 rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-lg shadow-amber-950/30 disabled:opacity-50"
            >
              {txStatus === 'submitting' || txStatus === 'pending_confirmation' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Confirming Escrow on Stellar...
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4" />
                  Create Escrow Order on Testnet
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Order Lifecycle Management */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-xl bg-stone-950/70 border border-stone-800 space-y-4">
            <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wider flex items-center justify-between">
              <span>Order Lifecycle & Settlement</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={lookupOrderId}
                  onChange={(e) => setLookupOrderId(parseInt(e.target.value) || 0)}
                  placeholder="Order ID"
                  className="w-24 px-2 py-1 rounded bg-stone-900 border border-stone-700 text-stone-100 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleLookup(lookupOrderId)}
                  disabled={isLookingUp}
                  className="p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-amber-400 transition"
                  title="Search order"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </h3>

            {isLookingUp ? (
              <div className="p-8 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-amber-400 mx-auto mb-2" />
                <p className="text-xs text-stone-400">Loading escrow order details...</p>
              </div>
            ) : currentOrder ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-stone-500">Order Ref:</span>
                      <p className="font-bold text-amber-200">{currentOrder.orderRef}</p>
                    </div>
                    {(() => {
                      const badge = getLifecycleStageLabel(currentOrder.state);
                      return (
                        <span className={`text-[10px] px-2.5 py-1 rounded-full border font-medium ${badge.color}`}>
                          {badge.label}
                        </span>
                      );
                    })()}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs border-t border-stone-800 pt-3">
                    <div>
                      <span className="text-stone-500">Buyer (Brand):</span>
                      <p className="font-mono text-[11px] text-stone-300 truncate">
                        {currentOrder.buyer}
                      </p>
                    </div>
                    <div>
                      <span className="text-stone-500">Seller (Manufacturer):</span>
                      <p className="font-mono text-[11px] text-stone-300 truncate">
                        {currentOrder.seller}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs">
                    <span className="text-stone-500">Escrow Value:</span>
                    <p className="text-base font-serif font-bold text-amber-400">
                      {(Number(currentOrder.amount) / 10_000_000).toFixed(2)} XLM
                      <span className="text-[11px] text-stone-500 font-sans ml-1">
                        ({currentOrder.amount} units)
                      </span>
                    </p>
                  </div>
                </div>

                {/* Permitted Actions */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">
                    Permitted Smart Contract Transitions
                  </span>

                  <div className="grid grid-cols-3 gap-2">
                    {/* Action 1: Fund Order */}
                    <button
                      onClick={handleFund}
                      disabled={currentOrder.state !== 0 || !isConnected}
                      className="py-2.5 px-3 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      Fund Escrow
                    </button>

                    {/* Action 2: Release Funds */}
                    <button
                      onClick={handleRelease}
                      disabled={currentOrder.state !== 1 || !isConnected}
                      className="py-2.5 px-3 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Release Funds
                    </button>

                    {/* Action 3: Refund Funds */}
                    <button
                      onClick={handleRefund}
                      disabled={currentOrder.state !== 1 || !isConnected}
                      className="py-2.5 px-3 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Refund Funds
                    </button>
                  </div>

                  {currentOrder.state !== 0 && currentOrder.state !== 1 && (
                    <p className="text-[11px] text-stone-500 text-center italic mt-2">
                      Order is settled ({getLifecycleStageLabel(currentOrder.state).label}). No further state transitions allowed.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-stone-500">
                <Coins className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">
                  Create an order or enter an ID above to inspect its real-time escrow state.
                </p>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 text-[11px] text-stone-400 space-y-1">
            <span className="font-semibold text-amber-300 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Security & Trust Rules:
            </span>
            <p>
              The escrow contract strictly protects user funds without administrator backdoors. Funds can
              only be released by the buyer or refunded by the seller upon verification.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
