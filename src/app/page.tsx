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

import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { ProtocolAnalyticsDashboard } from '../components/analytics/ProtocolAnalyticsDashboard';
import { SolvencyAuditorSection } from '../components/auditor/SolvencyAuditorSection';
import { ProtocolBadge } from '../components/common/ProtocolBadge';
import { FriendbotFaucetModal } from '../components/wallet/FriendbotFaucetModal';
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
  Droplet,
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
    'all' | 'designers' | 'passports' | 'escrow' | 'financing' | 'events' | 'auditor' | 'payments'
  >('all');
  const [isFaucetOpen, setIsFaucetOpen] = useState(false);

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
        <ErrorBoundary fallbackTitle="Hero Presentation Error">
          <HeroSection onConnectClick={openModal} isConnected={isConnected} />
        </ErrorBoundary>

        {/* Global Network Status Banner */}
        <section className="border-y border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <ProtocolBadge protocolVersion="Protocol 22" isOnline={true} />
                </div>

                <div className="hidden sm:flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
                  <Radio className="w-3.5 h-3.5 text-[#e5c158]" />
                  <span>RPC: {new URL(STELLAR_NETWORK.rpcUrl).hostname}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-zinc-400 font-mono text-[11px]">
                <button
                  onClick={() => setIsFaucetOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
                >
                  <Droplet className="h-3 w-3 text-amber-400" />
                  <span>Friendbot (10k XLM)</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Multi-Wallet: {selectedWalletName || 'Freighter'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Application Workspace */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          {/* Sub-Navigation Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800/80">
            {[
              { id: 'all', label: 'All Modules', icon: Layers },
              { id: 'designers', label: 'Ateliers', icon: Building2 },
              { id: 'passports', label: 'Garment Passports', icon: Tag },
              { id: 'escrow', label: 'Fashion Escrow', icon: Shield },
              { id: 'financing', label: 'Factoring', icon: Coins },
              { id: 'auditor', label: 'Solvency Proof', icon: Shield },
              { id: 'events', label: 'Events Feed', icon: Activity },
              { id: 'payments', label: 'Direct Payments', icon: Send },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#e5c158] text-zinc-950 font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Module: Solvency Proof-of-Reserve Auditor & Protocol Financial Aggregates */}
          {(activeTab === 'all' || activeTab === 'auditor') && (
            <ErrorBoundary fallbackTitle="Solvency Auditor Module Error">
              <section className="space-y-6">
                <ProtocolAnalyticsDashboard />
                <SolvencyAuditorSection />
              </section>
            </ErrorBoundary>
          )}

          {/* Module 1: Treasury & Multi-Wallet Control */}
          {(activeTab === 'all' || activeTab === 'payments') && (
            <section id="treasury" className="space-y-8">
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
              <ErrorBoundary fallbackTitle="Designer Registry Module Error">
                <DesignerRegistrySection
                  userAddress={userAddress}
                  walletId={selectedWalletId}
                  isConnected={isConnected}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* Module 3: Digital Product Passports */}
          {(activeTab === 'all' || activeTab === 'passports') && (
            <div id="passports">
              <ErrorBoundary fallbackTitle="Garment Passports Module Error">
                <ProductPassportSection
                  userAddress={userAddress}
                  walletId={selectedWalletId}
                  isConnected={isConnected}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* Module 4: B2B Fashion Production Escrow */}
          {(activeTab === 'all' || activeTab === 'escrow') && (
            <div id="escrow">
              <ErrorBoundary fallbackTitle="Fashion Escrow Module Error">
                <FashionEscrowSection
                  userAddress={userAddress}
                  walletId={selectedWalletId}
                  isConnected={isConnected}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* Module 4.5: Production Financing */}
          {(activeTab === 'all' || activeTab === 'financing') && (
            <div id="financing">
              <ErrorBoundary fallbackTitle="Production Financing Module Error">
                <ProductionFinancingSection walletAddress={userAddress} />
              </ErrorBoundary>
            </div>
          )}

          {/* Module 5: Live Contract Events */}
          {(activeTab === 'all' || activeTab === 'events') && (
            <div id="events">
              <ErrorBoundary fallbackTitle="Events Stream Module Error">
                <RealtimeActivitySection />
              </ErrorBoundary>
            </div>
          )}

          {/* Module 6: Direct XLM Payment Form & History */}
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

      <FriendbotFaucetModal
        isOpen={isFaucetOpen}
        onClose={() => setIsFaucetOpen(false)}
        defaultPublicKey={userAddress || ''}
        onFunded={refreshBalance}
      />
    </div>
  );
}
