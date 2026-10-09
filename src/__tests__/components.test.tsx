import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WalletStatusCard } from '../components/wallet/WalletStatusCard';
import { BalanceCard } from '../components/wallet/BalanceCard';
import { PaymentForm } from '../components/payment/PaymentForm';
import { TransactionActivity } from '../components/history/TransactionActivity';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

describe('Frontend UI Components', () => {
  describe('WalletStatusCard', () => {
    it('renders Freighter missing message when not installed', () => {
      render(
        <WalletStatusCard
          status="disconnected"
          address={null}
          network={null}
          isFreighterInstalled={false}
          error={null}
          onConnect={vi.fn()}
          onDisconnect={vi.fn()}
        />
      );

      expect(screen.getByText(/Freighter Wallet Not Detected/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Install Freighter/i })).toHaveAttribute(
        'href',
        'https://www.freighter.app'
      );
    });

    it('renders connect button when Freighter is installed but disconnected', () => {
      const handleConnect = vi.fn();
      render(
        <WalletStatusCard
          status="disconnected"
          address={null}
          network={null}
          isFreighterInstalled={true}
          error={null}
          onConnect={handleConnect}
          onDisconnect={vi.fn()}
        />
      );

      const connectBtn = screen.getByRole('button', { name: /Connect Freighter Wallet/i });
      expect(connectBtn).toBeInTheDocument();
      fireEvent.click(connectBtn);
      expect(handleConnect).toHaveBeenCalled();
    });

    it('displays connected address and disconnect button when connected', () => {
      const testAddress = 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN';
      const handleDisconnect = vi.fn();

      render(
        <WalletStatusCard
          status="connected"
          address={testAddress}
          network="testnet"
          isFreighterInstalled={true}
          error={null}
          onConnect={vi.fn()}
          onDisconnect={handleDisconnect}
        />
      );

      expect(screen.getByText(testAddress)).toBeInTheDocument();
      expect(screen.getByText(/Wallet Active/i)).toBeInTheDocument();

      const disconnectBtn = screen.getByRole('button', { name: /Disconnect Wallet/i });
      fireEvent.click(disconnectBtn);
      expect(handleDisconnect).toHaveBeenCalled();
    });
  });

  describe('BalanceCard', () => {
    it('renders loading state when balance is fetching', () => {
      render(
        <BalanceCard
          nativeBalance={null}
          isAccountFunded={true}
          isLoading={true}
          error={null}
          isFunding={false}
          fundingMessage={null}
          onRefresh={vi.fn()}
          onRequestFriendbot={vi.fn()}
        />
      );

      expect(screen.getByText(/Querying Stellar Testnet Horizon RPC/i)).toBeInTheDocument();
    });

    it('renders unfunded notice and Friendbot button when account is not funded', () => {
      const handleFund = vi.fn();
      render(
        <BalanceCard
          nativeBalance="0.0000000"
          isAccountFunded={false}
          isLoading={false}
          error={null}
          isFunding={false}
          fundingMessage={null}
          onRefresh={vi.fn()}
          onRequestFriendbot={handleFund}
        />
      );

      expect(screen.getByText(/Unfunded Testnet Account/i)).toBeInTheDocument();
      const fundBtn = screen.getByRole('button', { name: /Fund Account with 10,000 Testnet XLM/i });
      fireEvent.click(fundBtn);
      expect(handleFund).toHaveBeenCalled();
    });

    it('renders active balance and spendable capacity when funded', () => {
      render(
        <BalanceCard
          nativeBalance="100.5000000"
          isAccountFunded={true}
          isLoading={false}
          error={null}
          isFunding={false}
          fundingMessage={null}
          onRefresh={vi.fn()}
          onRequestFriendbot={vi.fn()}
        />
      );

      expect(screen.getByText(/100.5/)).toBeInTheDocument();
      expect(screen.getByText(/Spendable Capacity/i)).toBeInTheDocument();
    });
  });

  describe('PaymentForm', () => {
    it('renders disabled state when sender is not connected', () => {
      render(
        <PaymentForm
          senderAddress={null}
          availableBalanceXlm={null}
          isAccountFunded={false}
          onPaymentSuccess={vi.fn()}
          onRefreshBalance={vi.fn()}
        />
      );

      expect(screen.getByRole('button', { name: /Connect Wallet to Transfer XLM/i })).toBeDisabled();
    });

    it('validates required fields on submission attempt', () => {
      render(
        <PaymentForm
          senderAddress="GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN"
          availableBalanceXlm="50.0"
          isAccountFunded={true}
          onPaymentSuccess={vi.fn()}
          onRefreshBalance={vi.fn()}
        />
      );

      const submitBtn = screen.getByRole('button', { name: /Sign & Submit Payment/i });
      fireEvent.click(submitBtn);

      expect(screen.getByText(/Recipient Stellar public address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Payment amount is required/i)).toBeInTheDocument();
    });
  });

  describe('TransactionActivity', () => {
    it('renders helpful empty state when no session transactions exist', () => {
      render(
        <TransactionActivity
          sessionTransactions={[]}
          onChainPayments={[]}
          isLoadingOnChain={false}
          onRefresh={vi.fn()}
          onClearSession={vi.fn()}
        />
      );

      expect(screen.getByText(/No Transactions Submitted This Session/i)).toBeInTheDocument();
    });

    it('renders session transactions in the table', () => {
      const mockTx = {
        id: 'mock-hash-1',
        hash: 'mock-hash-1-1234567890abcdef',
        from: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
        to: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
        amount: '25.0',
        memo: 'Textile roll order',
        status: 'confirmed' as const,
        timestamp: Date.now(),
        explorerUrl: 'https://stellar.expert/explorer/testnet/tx/mock-hash-1',
      };

      render(
        <TransactionActivity
          sessionTransactions={[mockTx]}
          onChainPayments={[]}
          isLoadingOnChain={false}
          onRefresh={vi.fn()}
          onClearSession={vi.fn()}
        />
      );

      expect(screen.getByText('25.0')).toBeInTheDocument();
      expect(screen.getByText('Textile roll order')).toBeInTheDocument();
      expect(screen.getByText(/confirmed/i)).toBeInTheDocument();
    });
  });

  describe('Navbar & Footer', () => {
    it('renders brand identity and testnet status in Navbar', () => {
      render(
        <Navbar
          walletAddress={null}
          walletStatus="disconnected"
          isConnecting={false}
          onConnect={vi.fn()}
          onDisconnect={vi.fn()}
        />
      );

      expect(screen.getByText(/STELLAR THREADS/i)).toBeInTheDocument();
      expect(screen.getByText(/Stellar Testnet/i)).toBeInTheDocument();
    });

    it('renders tagline and repository links in Footer', () => {
      render(<Footer />);

      expect(screen.getByText(/From design to ownership, powered by Stellar/i)).toBeInTheDocument();
      expect(screen.getByText(/stellar-threads-frontend/i)).toBeInTheDocument();
      expect(screen.getByText(/stellar-threads-core/i)).toBeInTheDocument();
    });
  });
});
