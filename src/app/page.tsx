'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/brand/HeroSection';
import { ProtocolRoadmap } from '../components/brand/ProtocolRoadmap';
import { WalletStatusCard } from '../components/wallet/WalletStatusCard';
import { BalanceCard } from '../components/wallet/BalanceCard';
import { WalletModal } from '../components/wallet/WalletModal';
import { PaymentForm } from '../components/payment/PaymentForm';
import { TransactionActivity } from '../components/history/TransactionActivity';
import { DesignerRegistrySection } from '../components/designer/DesignerRegistrySection';
import { ProductPassportSection } from '../components/passport/ProductPassportSection';
import { FashionEscrowSection } from '../components/escrow/FashionEscrowSection';
import { ProductionFinancingSection } from '../components/financing/ProductionFinancingSection';
import { RealtimeActivitySection } from '../components/events/RealtimeActivitySection';
import { AlertBanner } from '../components/common/AlertBanner';
import { useStellarWallet } from '../hooks/useStellarWallet';
import { useStellarBalance } from '../hooks/useStellarBalance';
import { useTransactionHistory } from '../hooks/useTransactionHistory';
import { STELLAR_NETWORK } from '../config/stellar';
import {
  Radio,
  Shield,
  Layers,
  Building2,
  Tag,
  Coins,
  Activity,
  Send,
  TrendingUp,
} from 'lucide-react';

export default function HomePage() {
  const {
    status: walletStatus,
    address: userAddress,
    network,
    selectedWalletId,
    selectedWalletName,
    isFreighterInstalled,
    error: walletError,
    availableWallets,
    isModalOpen,
    openModal,
    closeModal,
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

  const [activeTab, setActiveTab] = useState<
    'all' | 'designers' | 'passports' | 'escrow' | 'financing' | 'events' | 'payments'
  >('all');

  const isConnected = walletStatus === 'connected' && !!userAddress;

  return (
    <div className="flex flex-col min-h-screen bg-[#08090b] text-zinc-100">
      {/* Multi-Wallet Modal */}
      <WalletModal
        isOpen={isModalOpen}
        onClose={closeModal}
        wallets={availableWallets}
        onSelectWallet={(id) => connect(id)}
        activeWalletId={selectedWalletId}
        isConnecting={walletStatus === 'connecting'}
      />

      {/* Primary Navigation */}
      <Navbar
        walletAddress={userAddress}
        walletStatus={walletStatus}
        walletName={selectedWalletName || 'Wallet'}
        isConnecting={walletStatus === 'connecting'}
        onOpenWalletModal={openModal}
        onDisconnect={disconnect}
      />

      <main className="flex-1">
        {/* Editorial Fashion-Finance Hero */}
        <HeroSection onConnectClick={openModal} isConnected={isConnected} />

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
                    Stellar Testnet Online &bull; Soroban Contracts Active
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
                  <Radio className="w-3.5 h-3.5 text-[#e5c158]" />
                  <span>RPC: {new URL(STELLAR_NETWORK.rpcUrl).hostname}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-zinc-400 font-mono text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    Multi-Wallet: {selectedWalletName || 'Non-Custodial'}
                  </span>
                </div>
                <div className="hidden md:flex items-center gap-1.5 text-zinc-400">
                  <span>Network:</span>
                  <span className="text-amber-400 font-bold uppercase">Testnet</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Application Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          {/* Unconnected Notice */}
          {!isConnected && (
            <AlertBanner
              type="info"
              title="Connect Your Stellar Wallet"
              message={
                <span>
                  Connect via <strong>Freighter</strong>, <strong>xBull</strong>,{' '}
                  <strong>Albedo</strong>, <strong>Rabet</strong>, or <strong>Lobstr</strong> to
                  interact with deployed Soroban contracts: register designer ateliers, mint product
                  passports, and manage production escrow.
                </span>
              }
              action={
                <button
                  type="button"
                  onClick={openModal}
                  className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] to-[#b38e22] text-zinc-950 hover:brightness-110 cursor-pointer"
                >
                  Select & Connect Wallet
                </button>
              }
            />
          )}

          {/* Module Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-800 scrollbar-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/20'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              All Protocol Modules
            </button>
            <button
              onClick={() => setActiveTab('designers')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'designers'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/20'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Atelier Registry
            </button>
            <button
              onClick={() => setActiveTab('passports')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'passports'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/20'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              Digital Product Passports
            </button>
            <button
              onClick={() => setActiveTab('escrow')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'escrow'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/20'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              Fashion Escrow
            </button>
            <button
              onClick={() => setActiveTab('financing')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'financing'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/20'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Production Financing
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'events'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/20'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Live Events
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'payments'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/20'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              Treasury & Payments
            </button>
          </div>

          {/* Module 1: Treasury & Account Overview */}
          {(activeTab === 'all' || activeTab === 'payments') && (
            <section id="dashboard" className="space-y-4">
              <div className="space-y-1">
                <h2 className="font-serif text-2xl font-bold tracking-tight text-zinc-100">
                  Treasury & Multi-Wallet Control
                </h2>
                <p className="text-xs text-zinc-400 max-w-2xl font-light">
                  Inspect active wallet details, retrieve live Testnet XLM balance, and fund via
                  Friendbot faucet.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <WalletStatusCard
                  status={walletStatus}
                  address={userAddress}
                  network={network}
                  isFreighterInstalled={isFreighterInstalled}
                  error={walletError}
                  onConnect={openModal}
                  onDisconnect={disconnect}
                />

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
            </section>
          )}

          {/* Module 2: Atelier & Designer Registry */}
          {(activeTab === 'all' || activeTab === 'designers') && (
            <div id="designers">
              <DesignerRegistrySection
                userAddress={userAddress}
                walletId={selectedWalletId}
                isConnected={isConnected}
              />
            </div>
          )}

          {/* Module 3: Digital Product Passports */}
          {(activeTab === 'all' || activeTab === 'passports') && (
            <div id="passports">
              <ProductPassportSection
                userAddress={userAddress}
                walletId={selectedWalletId}
                isConnected={isConnected}
              />
            </div>
          )}

          {/* Module 4: B2B Fashion Production Escrow */}
          {(activeTab === 'all' || activeTab === 'escrow') && (
            <div id="escrow">
              <FashionEscrowSection
                userAddress={userAddress}
                walletId={selectedWalletId}
                isConnected={isConnected}
              />
            </div>
          )}

          {/* Module 4.5: Production Financing */}
          {(activeTab === 'all' || activeTab === 'financing') && (
            <div id="financing">
              <ProductionFinancingSection walletAddress={userAddress} />
            </div>
          )}

          {/* Module 5: Live Contract Events */}
          {(activeTab === 'all' || activeTab === 'events') && (
            <div id="events">
              <RealtimeActivitySection />
            </div>
          )}

          {/* Module 6: Stage 1 Direct Payment & History */}
          {(activeTab === 'all' || activeTab === 'payments') && (
            <section id="payment" className="space-y-8 pt-4">
              <div className="space-y-1">
                <h2 className="font-serif text-2xl font-bold tracking-tight text-zinc-100">
                  Direct XLM Payment Engine
                </h2>
                <p className="text-xs text-zinc-400 max-w-2xl font-light">
                  Direct peer-to-peer fashion settlement on Stellar Testnet with cryptographic signature.
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

              <div id="activity" className="space-y-4 pt-6">
                <div className="space-y-1">
                  <h2 className="font-serif text-2xl font-bold tracking-tight text-zinc-100">
                    Payment Transaction Ledger
                  </h2>
                  <p className="text-xs text-zinc-400 max-w-2xl font-light">
                    Transactions submitted during this session and Horizon payment history.
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
          )}

          {/* Protocol Roadmap */}
          <ProtocolRoadmap />
        </div>
      </main>

      <Footer />
    </div>
  );
}
