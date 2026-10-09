# Stellar Threads — Luxury Fashion-Finance Frontend & Soroban dApp

> **From design to ownership, powered by Stellar.**

[![Frontend CI](https://github.com/Stellar-Threads/stellar-threads-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/Stellar-Threads/stellar-threads-frontend/actions)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Stellar Network](https://img.shields.io/badge/Network-Stellar_Testnet-gold.svg)](https://stellar.expert/explorer/testnet)

Stellar Threads is a global decentralized fashion finance and trade protocol powered by the Stellar blockchain and Soroban smart contracts. It connects independent fashion designers, ateliers, sustainable textile mills, apparel manufacturers, suppliers, and global luxury buyers through an open, transparent, and non-custodial ecosystem.

This repository (`stellar-threads-frontend`) contains the luxury fashion-finance portal featuring **multi-wallet authentication**, **on-chain Soroban contract interactions**, **digital garment passports**, **production escrows**, and **real-time event streaming**.

---

## Live Smart Contracts (Stellar Testnet)

The frontend communicates with deployed and verified Soroban contracts on Stellar Testnet:

| Contract | Address | Explorer |
|---|---|---|
| **Designer Registry** | `CDUF5C2CNF3NFMMUOGCO74D2NFKCYUK6VVILPGXM5RDC7CDCGD3GJEHR` | [Stellar Expert](https://stellar.expert/explorer/testnet/contract/CDUF5C2CNF3NFMMUOGCO74D2NFKCYUK6VVILPGXM5RDC7CDCGD3GJEHR) |
| **Product Passport Registry** | `CAJLI5PXVPQWOY4C2MCG7GII37IORAP4PL5AVX7GSOCUV6FH5FTW2E4U` | [Stellar Expert](https://stellar.expert/explorer/testnet/contract/CAJLI5PXVPQWOY4C2MCG7GII37IORAP4PL5AVX7GSOCUV6FH5FTW2E4U) |
| **Fashion Escrow** | `CBULSNLLBDACPNNNM4JB5NL2XB56QP6FVU7HHIOTNUXKUBSU4JHJGV5D` | [Stellar Expert](https://stellar.expert/explorer/testnet/contract/CBULSNLLBDACPNNNM4JB5NL2XB56QP6FVU7HHIOTNUXKUBSU4JHJGV5D) |

---

## Key Features

### 1. Multi-Wallet Integration (`StellarWalletsKit`)
- Connect seamlessly with **Freighter**, **xBull**, **Albedo**, **Lobstr**, **Rabet**, and **Hana**.
- Automatic network detection, public address display, and balance synchronization.
- Real-time account switching detection and safe session disconnection without leaving stale data.
- Zero private key exposure: cryptographic signing delegated entirely to the user's selected wallet.

### 2. Designer & Atelier Registry
- On-chain designer registration tying a brand's public key to their unique identifier and metadata URI.
- Live on-chain status querying and profile reference updates.
- Real-time transaction feedback with verified Stellar Expert transaction links.

### 3. Digital Product Passports (DPP)
- Issue immutable digital twins for luxury garments with brand metadata and textile composition.
- Cryptographic SHA-256 integrity verification: guarantees product metadata has never been altered.
- Transparent disclaimer distinguishing blockchain record integrity from physical garment authentication.

### 4. B2B Fashion Escrow
- Create milestone-based wholesale and production escrow agreements between buyers and sellers.
- Non-custodial funding, buyer-authorized release upon garment inspection, and seller-authorized refunds.
- Complete lifecycle tracking (`Created` → `Funded` → `Released` / `Refunded`) with strict on-chain authorization.

### 5. Real-Time Contract Activity Stream
- Live contract event feed powered by Server-Sent Events (SSE) from the core indexing service.
- Categorized filtering for Designer Registrations, Product Passports, and Escrow events.
- Displays ledger numbers, contract IDs, transaction hashes, and event parameters in real time.

### 6. Preserved Native XLM Settlement & Faucet
- Direct XLM payment interface with recipient checksum validation, stroop precision limits, and memo support.
- One-click Testnet Friendbot funding button for instant 10,000 XLM test balance.

---

## Technology Stack

- **Framework**: Next.js 16 (App Router) & React 19
- **Styling**: Tailwind CSS 4 & Vanilla CSS design tokens
- **Wallet Integration**: `@creit.tech/stellar-wallets-kit` (v2.7.1) & `@stellar/freighter-api` (v6.0.1)
- **Stellar SDK**: `@stellar/stellar-sdk` (v17.2.1)
- **Icons**: Lucide React
- **Testing**: Vitest, React Testing Library, and JSDOM

---

## Wallet Setup Guide

To interact with the Stellar Threads dApp on Stellar Testnet:

1. **Install a Supported Wallet**:
   - [Freighter Extension](https://www.freighter.app/) (Chrome, Brave, Firefox)
   - [xBull Wallet](https://xbull.app/)
   - [Albedo](https://albedo.link/) (No extension required, opens in secure pop-up)
   - [Lobstr](https://lobstr.co/)
2. **Switch to Stellar Testnet**:
   - Open your wallet settings and select **Testnet**.
3. **Fund Your Account**:
   - Click the **"Fund with Friendbot (+10,000 XLM)"** button directly in the Stellar Threads navbar or use the [Stellar Laboratory Faucet](https://laboratory.stellar.org/#account-creator).

---

## Contract Interaction Instructions

### Registering an Atelier
1. Open the **Designer Registry** tab.
2. Enter your unique Designer ID (e.g., `atelier-valenti`), Brand Name, and IPFS metadata URI.
3. Click **"Register Atelier on Soroban"**.
4. Confirm the transaction in your connected wallet.
5. View the confirmed transaction hash and explorer link.

### Minting a Product Passport
1. Open the **Product Passports** tab.
2. Provide a Product ID (e.g., `garment-001`), Brand ID, Metadata URI, and 32-byte hex SHA-256 digest.
3. Click **"Mint Product Passport"** and sign with your wallet.
4. Verify record integrity by inputting the expected hash into the integrity verifier.

### Managing an Escrow Order
1. Open the **Fashion Escrow** tab.
2. Enter Order ID, Buyer address, Seller address, and payment amount.
3. Click **"Create Escrow Order"**.
4. Use **"Fund Order"**, **"Release Funds"**, or **"Refund Order"** depending on your authorized role.

---

## Local Development & Testing

```bash
# Clone the repository
git clone https://github.com/Stellar-Threads/stellar-threads-frontend.git
cd stellar-threads-frontend

# Install dependencies
npm install

# Run automated tests
npm test

# Run linter
npm run lint

# Run TypeScript typecheck
npm run typecheck

# Start development server
npm run dev

# Build production bundle
npm run build
```

---

## Known Limitations

- **Physical Authenticity:** Cryptographic digital product passports prove that the record was created by the brand and is unchanged. They do not replace trusted physical tags (e.g., tamper-proof NFC chips) for counterfeit detection.
- **Audit Disclaimer:** Contracts have been rigorously tested with automated unit and integration suites on Testnet, but have not undergone an external third-party security firm audit.

---

## License

Stellar Threads Frontend is licensed under the [Apache-2.0 License](LICENSE).
