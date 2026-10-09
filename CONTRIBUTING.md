# Contributing to Stellar Threads Frontend

Thank you for your interest in contributing to **Stellar Threads Frontend**, the luxury fashion-finance portal powered by Stellar and Soroban smart contracts!

---

## Code of Conduct

All contributors and community members are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Please maintain a welcoming, respectful, and inclusive environment.

---

## Architecture Overview

```
stellar-threads-frontend/
├── src/
│   ├── app/                    # Next.js App Router (Layout & Pages)
│   ├── components/
│   │   ├── brand/              # Protocol branding, hero banner & roadmap
│   │   ├── designer/           # Atelier registration & status verification
│   │   ├── passport/           # Digital Product Passport minting & hash verification
│   │   ├── escrow/             # B2B fashion orders & escrow lifecycle management
│   │   ├── events/             # Real-time SSE contract event stream & filters
│   │   ├── layout/             # Navigation, luxury header, network badge
│   │   ├── payment/            # Stage 1 XLM transfer form (preserved)
│   │   └── wallet/             # Multi-wallet selector modal & balance cards
│   ├── config/                 # Deployed Soroban contracts & network endpoints
│   ├── hooks/                  # React hooks (useStellarWallet, useTransactionHistory)
│   ├── lib/
│   │   ├── stellar/            # Horizon queries & Soroban contract invocations
│   │   └── wallet/             # StellarWalletsKit multi-wallet manager
│   └── types/                  # Typed interfaces for wallets, orders, passports
└── src/__tests__/              # Vitest component and logic test suites
```

---

## Local Development Setup

1. **Clone and Install**:
   ```bash
   git clone https://github.com/Stellar-Threads/stellar-threads-frontend.git
   cd stellar-threads-frontend
   npm install
   ```

2. **Environment Configuration**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Ensure `NEXT_PUBLIC_STELLAR_NETWORK=TESTNET` is active.

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Testing & Quality Assurance

Always verify your changes before submitting a PR:

```bash
# Run test suites
npm test

# Run TypeScript compiler checks
npm run typecheck

# Run linter
npm run lint

# Verify production Turbopack build
npm run build
```

---

## Multi-Wallet Testing Guidelines

When testing wallet interactions:
- Connect using **Freighter** (browser extension) or **Albedo** (web pop-up).
- Ensure your wallet is configured for **Stellar Testnet**.
- Never commit secret keys or seed phrases into the codebase.
- Verify that disconnecting or switching accounts immediately resets UI states.

---

## Recommended Issue and PR Labels

| Label | Description |
|---|---|
| `good first issue` | Great entry points for first-time contributors |
| `help wanted` | Complex issues where external input is appreciated |
| `frontend` | React components, UI/UX, and Tailwind CSS styles |
| `wallet` | StellarWalletsKit and provider connection logic |
| `soroban` | Soroban contract invocation & transaction signing |
| `stellar` | Horizon API, payment envelopes, and ledger state |
| `testing` | Vitest suites, mocks, and interaction tests |
| `security` | Key handling, input validation, and CSP headers |
| `documentation` | Guides, diagrams, and README enhancements |

---

## Maintainer Workflow & Issue Triage

1. **Issue Triage:** Issues receive labels and maintainer replies within 48 hours.
2. **Review Criteria:** All PRs must have passing CI checks (`npm test`, `npm run lint`, `npm run build`), no console errors, and follow clean coding standards.
3. **Commit Messages:** Use clear, descriptive, professional commit messages without extraneous tags.

---

## Public Roadmap & Opportunities

- [x] Multi-wallet modal supporting Freighter, xBull, Albedo, Lobstr, Rabet, Hana.
- [x] Atelier designer registration and status retrieval.
- [x] Digital product passport minting with cryptographic SHA-256 verification.
- [x] B2B escrow order lifecycle: Create, Fund, Release, Refund.
- [x] Real-time live contract activity feed via Server-Sent Events (SSE).
- [ ] WalletConnect v2 integration for mobile QR sign-in.
- [ ] NFC / QR code scanner for retail garment tag verification.
- [ ] Multi-sig escrow release with authorized inspection agents.

---

## Security Disclosures

Do **not** post security vulnerabilities in public issues. Refer to [SECURITY.md](SECURITY.md) for our private vulnerability disclosure process.
