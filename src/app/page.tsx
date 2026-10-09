'use client';

import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/brand/HeroSection';
import { ProtocolRoadmap } from '../components/brand/ProtocolRoadmap';
import { WalletStatusCard } from '../components/wallet/WalletStatusCard';
import { BalanceCard } from '../components/wallet/BalanceCard';
import { PaymentForm } from '../components/payment/PaymentForm';
import { TransactionActivity } from '../components/history/TransactionActivity';
import { AlertBanner } from '../components/common/AlertBanner';
import { useStellarWallet } from '../hooks/useStellarWallet';
import { useStellarBalance } from '../hooks/useStellarBalance';
import { useTransactionHistory } from '../hooks/useTransactionHistory';
import { STELLAR_NETWORK } from '../config/stellar';
import { Globe, Radio, Shield, Sparkles } from 'lucide-react';

export default function HomePage() {
  const {
    status: walletStatus,
    address: userAddress,
    network,
    isFreighterInstalled,
    error: walletError,
    connect,
    disconnect,
  } = useStellarWallet();

  const {
    nativeBalance,
    isAccountFunded,
    isLoading: isBalanceLoading,
    error: balanceError,
    isFunding,
    fundingMessage,
    refreshBalance,
    requestFriendbotFunding,
  } = useStellarBalance(userAddress);

  const {
    sessionTransactions,
    onChainPayments,
    isLoadingOnChain,
    addSessionTransaction,
    clearSessionTransactions,
    refreshHistory,
  } = useTransactionHistory(userAddress);

  const isConnected = walletStatus === 'connected' && !!userAddress;

  return (
    <div className="flex flex-col min-h-screen bg-[#08090b] text-zinc-100">
      {/* Primary Navigation */}
      <Navbar
        walletAddress={userAddress}
        walletStatus={walletStatus}
        isConnecting={walletStatus === 'connecting'}
        onConnect={connect}
        onDisconnect={disconnect}
      />

      <main className="flex-1">
        {/* Editorial Fashion-Finance Hero */}
        <HeroSection onConnectClick={connect} isConnected={isConnected} />

        {/* Global Network Status Banner */}
        <section className="border-y border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span className="text-zinc-300 font-medium font-mono uppercase text-[11px]">
                    Stellar Testnet Online
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
                  <Radio className="w-3.5 h-3.5 text-[#e5c158]" />
                  <span>Horizon: {new URL(STELLAR_NETWORK.horizonUrl).hostname}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-zinc-400 font-mono text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Non-Custodial Client</span>
                </div>
                <div className="hidden md:flex items-center gap-1.5 text-zinc-400">
                  <span>Passphrase:</span>
                  <span className="text-zinc-300 truncate max-w-[120px]" title={STELLAR_NETWORK.passphrase}>
                    {STELLAR_NETWORK.passphrase}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Application Interface */}
        <section id="dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
          {/* Unconnected / Informational Banner */}
          {!isConnected && (
            <AlertBanner
              type="info"
              title="Welcome to Stellar Threads Stage 1"
              message={
                <span>
                  Connect your <strong>Freighter</strong> wallet to query your actual Stellar Testnet account balance and execute non-custodial XLM transfers. If you don&apos;t have an account on Testnet, our built-in Friendbot faucet will fund you with 10,000 Testnet XLM in seconds.
                </span>
              }
              action={
                <button
                  type="button"
                  onClick={connect}
                  className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] to-[#b38e22] text-zinc-950 hover:brightness-110 cursor-pointer"
                >
                  Connect Freighter Now
                </button>
              }
            />
          )}

          {/* Section: Treasury & Wallet Overview */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                Treasury & Wallet Control
              </h2>
              <p className="text-xs text-zinc-400 max-w-2xl font-light">
                Monitor your connected account public key, inspect live native XLM reserves on Stellar Testnet, and manage wallet permissions.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Card 1: Wallet Status & Key Details */}
              <WalletStatusCard
                status={walletStatus}
                address={userAddress}
                network={network}
                isFreighterInstalled={isFreighterInstalled}
                error={walletError}
                onConnect={connect}
                onDisconnect={disconnect}
              />

              {/* Card 2: Native Balance & Friendbot Funding */}
              <BalanceCard
                nativeBalance={nativeBalance}
                isAccountFunded={isAccountFunded}
                isLoading={isBalanceLoading}
                error={balanceError}
                isFunding={isFunding}
                fundingMessage={fundingMessage}
                onRefresh={refreshBalance}
                onRequestFriendbot={requestFriendbotFunding}
              />
            </div>
          </div>

          {/* Section: Transfer XLM Payment */}
          <div className="space-y-4 pt-6">
            <div className="space-y-1">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                Payment & Settlement Engine
              </h2>
              <p className="text-xs text-zinc-400 max-w-2xl font-light">
                Send native XLM on Stellar Testnet. Supports standard memo constraints, live balance deduction verification, and cryptographic Freighter authorization.
              </p>
            </div>

            <PaymentForm
              senderAddress={userAddress}
              availableBalanceXlm={nativeBalance}
              isAccountFunded={isAccountFunded}
              onPaymentSuccess={(tx) => {
                addSessionTransaction(tx);
                refreshHistory();
              }}
              onRefreshBalance={refreshBalance}
            />
          </div>

          {/* Section: Transaction Activity */}
          <div className="space-y-4 pt-6">
            <div className="space-y-1">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                Transaction Ledger & History
              </h2>
              <p className="text-xs text-zinc-400 max-w-2xl font-light">
                Audit transactions submitted during this active session and explore on-chain account payments queried directly from the Stellar Horizon testnet network.
              </p>
            </div>

            <TransactionActivity
              sessionTransactions={sessionTransactions}
              onChainPayments={onChainPayments}
              isLoadingOnChain={isLoadingOnChain}
              onRefresh={refreshHistory}
              onClearSession={clearSessionTransactions}
            />
          </div>
        </section>

        {/* Modular Protocol Roadmap Section */}
        <ProtocolRoadmap />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
