# Stellar Threads — Frontend Client

> **From design to ownership, powered by Stellar.**

[![Frontend CI](https://github.com/Stellar-Threads/stellar-threads-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/Stellar-Threads/stellar-threads-frontend/actions)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Stellar Network](https://img.shields.io/badge/Network-Stellar_Testnet-gold.svg)](https://stellar.expert/explorer/testnet)

Stellar Threads is a global decentralized fashion finance and trade protocol powered by the Stellar blockchain. The protocol establishes an open, transparent, and non-custodial financial rails connecting independent fashion designers, ateliers, sustainable textile mills, apparel manufacturers, suppliers, and global buyers.

This repository (`stellar-threads-frontend`) contains the complete web application, client-side wallet connectors, balance retrieval engine, and operational payment interface for the protocol.

---

## Architecture & Ecosystem Relationship

Stellar Threads is organized into two primary repositories within the [`Stellar-Threads`](https://github.com/Stellar-Threads) organization:

1. **`stellar-threads-frontend` (This Repository)**: Next.js 16 client, Freighter wallet integration, native XLM Testnet settlement, and editorial user experience.
2. **[`stellar-threads-core`](https://github.com/Stellar-Threads/stellar-threads-core)**: Backend service APIs, shared protocol types, Stellar transaction validation, database indexing schemas, and Soroban smart contract foundations.

---

## Key Features

- **Luxury Fashion Editorial Interface**: Refined editorial aesthetic designed specifically for the global fashion trade rather than a generic crypto dashboard.
- **Genuine Freighter Wallet Integration**: Real browser extension detection, permission authorization, account switching detection, and cryptographic signing.
- **Live Testnet XLM Balance Queries**: Real-time balance retrieval via official Stellar Testnet Horizon (`https://horizon-testnet.stellar.org`).
- **Integrated Testnet Friendbot**: One-click testnet faucet activation funding new accounts with 10,000 Testnet XLM directly through the SDF Friendbot API.
- **Operational Payment Engine**:
  - Live recipient public key validation with Stellar `StrKey` Ed25519 checksum verification.
  - Precision limits (up to 7 decimal stroop digits) and dynamic balance deduction checks with 1.0 XLM minimum reserve protection.
  - Optional memo support adhering to Stellar constraints (Text up to 28 bytes UTF-8, ID uint64, 32-byte hex Hash).
  - Complete transaction state machine (`Validating` → `Signing with Freighter` → `Submitting to Horizon` → `Confirmed`).
  - Direct links to [Stellar Expert Testnet Explorer](https://stellar.expert/explorer/testnet).
- **Dual Transaction Activity**:
  - Locally tracked session submissions with status, timestamps, and hashes.
  - Verified on-chain payment history queried directly from Horizon account operations.
- **Honest Protocol Roadmap**: Clear architectural preview of upcoming modules (Designer Sovereign Identity, Garment Digital Passport, B2B Fashion Escrow, Pre-Order Financing).

---

## Technology Stack

- **Framework**: Next.js 16 (App Router) & React 19
- **Language**: TypeScript 5 (Strict mode)
- **Styling**: Tailwind CSS 4
- **Blockchain Tooling**:
  - `@stellar/freighter-api` (v6.0.1) — Browser wallet connector
  - `@stellar/stellar-sdk` (v17.2.1) — Horizon client, TransactionBuilder, StrKey
- **Testing**: Vitest & React Testing Library with JSDOM
- **Icons**: Lucide React

---

## Stellar Testnet Configuration

| Parameter | Value |
| :--- | :--- |
| **Network** | Stellar Testnet |
| **Network Passphrase** | `Test SDF Network ; September 2015` |
| **Horizon Server** | `https://horizon-testnet.stellar.org` |
| **Soroban RPC** | `https://soroban-testnet.stellar.org` |
| **Friendbot Faucet** | `https://friendbot.stellar.org` |
| **Block Explorer** | `https://stellar.expert/explorer/testnet` |
| **Base Fee** | 100 stroops (`0.00001 XLM`) |
| **Minimum Reserve** | `1.0 XLM` (account sequence activation) |

> ⚠️ **Safety Note**: Testnet XLM holds no real monetary value. Secret keys (`S...`) are never collected, stored, or accepted by this application. All authorizations occur securely through the Freighter browser extension.

---

## Getting Started

### Prerequisites

- Node.js `20.x` or `22.x` or later
- npm `10.x` or later
- [Freighter Wallet](https://www.freighter.app/) extension installed in your browser

### Installation

```bash
git clone https://github.com/Stellar-Threads/stellar-threads-frontend.git
cd stellar-threads-frontend
npm install
```

### Environment Configuration

Copy the example environment configuration:

```bash
cp .env.example .env.local
```

### Development Server

Run the development server locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the application.

### Running Tests

Execute the automated Vitest suite:

```bash
npm test
```

### Type Checking

```bash
npm run typecheck
```

### Production Build

```bash
npm run build
npm start
```

---

## Community & Contribution

We welcome contributions from designers, engineers, and fashion industry participants.
- Please review [CONTRIBUTING.md](CONTRIBUTING.md) for pull request guidelines and coding conventions.
- See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for our community standards.
- View [SECURITY.md](SECURITY.md) for our responsible vulnerability disclosure policy.

---

## License

Stellar Threads Frontend is licensed under the [Apache-2.0 License](LICENSE).
