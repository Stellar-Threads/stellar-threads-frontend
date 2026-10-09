import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WalletModal } from '../components/wallet/WalletModal';
import { DesignerRegistrySection } from '../components/designer/DesignerRegistrySection';
import { ProductPassportSection } from '../components/passport/ProductPassportSection';
import { FashionEscrowSection } from '../components/escrow/FashionEscrowSection';
import { RealtimeActivitySection } from '../components/events/RealtimeActivitySection';
import { SUPPORTED_WALLETS } from '../lib/wallet/multiWallet';

describe('Stage 2 Soroban & Multi-Wallet Components', () => {
  it('WalletModal renders all supported wallets and triggers onSelectWallet', () => {
    const handleSelect = vi.fn();
    const handleClose = vi.fn();

    render(
      <WalletModal
        isOpen={true}
        onClose={handleClose}
        wallets={SUPPORTED_WALLETS}
        onSelectWallet={handleSelect}
        activeWalletId="freighter"
        isConnecting={false}
      />
    );

    expect(screen.getByText(/Connect Stellar Wallet/i)).toBeInTheDocument();
    expect(screen.getByText('Freighter')).toBeInTheDocument();
    expect(screen.getByText('xBull Wallet')).toBeInTheDocument();
    expect(screen.getByText('Albedo')).toBeInTheDocument();
    expect(screen.getByText('LOBSTR')).toBeInTheDocument();

    const albedoBtn = screen.getByText('Albedo');
    fireEvent.click(albedoBtn);
    expect(handleSelect).toHaveBeenCalledWith('albedo');
  });

  it('DesignerRegistrySection renders atelier registration form fields', () => {
    render(
      <DesignerRegistrySection
        userAddress="GBUYER1234567890ABCDEF"
        walletId="freighter"
        isConnected={true}
      />
    );

    expect(screen.getByText(/Designer & Atelier Sovereign Identity/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Maison Lumina Couture/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Paris, France/i)).toBeInTheDocument();
  });

  it('ProductPassportSection renders passport minting and verification cards', () => {
    render(
      <ProductPassportSection
        userAddress="GBUYER1234567890ABCDEF"
        walletId="freighter"
        isConnected={true}
      />
    );

    expect(screen.getByText(/Digital Product Passports & Integrity Registry/i)).toBeInTheDocument();
    expect(screen.getByText(/Mint New Digital Passport/i)).toBeInTheDocument();
    expect(screen.getByText(/On-Chain Passport Verification/i)).toBeInTheDocument();
  });

  it('FashionEscrowSection renders order creation and settlement controls', () => {
    render(
      <FashionEscrowSection
        userAddress="GBUYER1234567890ABCDEF"
        walletId="freighter"
        isConnected={true}
      />
    );

    expect(screen.getByText(/B2B Fashion Production Escrow/i)).toBeInTheDocument();
    expect(screen.getByText(/Create New Escrow Agreement/i)).toBeInTheDocument();
    expect(screen.getByText(/Order Lifecycle & Settlement/i)).toBeInTheDocument();
  });

  it('RealtimeActivitySection renders event filter tabs', () => {
    render(<RealtimeActivitySection />);

    expect(screen.getByText(/Real-Time Soroban Contract Event Stream/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^All$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Designers$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Passports$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Escrow$/i })).toBeInTheDocument();
  });
});
