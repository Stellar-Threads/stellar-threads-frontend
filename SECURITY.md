# Security Policy — Stellar Threads Frontend

## Client-Side Security Model

The Stellar Threads frontend is an interface for decentralized fashion commerce, atelier registration, and smart-contract escrow.

### 1. Key Management & Signing Delegation
- **Zero Private Key Storage:** The frontend application **never** requests, reads, stores, or transmits private keys, mnemonic seeds, or recovery phrases.
- **Wallet Provider Delegation:** All transaction authorization and cryptographic signing is delegated to recognized wallet extensions via **StellarWalletsKit** (Freighter, xBull, Albedo, Lobstr, Rabet, Hana).
- **Session Isolation:** Disconnecting a wallet immediately purges local session identifiers, preventing cross-account state leakage or stale authorizations.

### 2. Transaction Integrity & Verification
- Transactions prepared by the client are presented to the wallet for explicit user confirmation.
- Transactions are verified on the Stellar Testnet ledger via Horizon and Soroban RPC.
- Success states are only rendered upon confirmed ledger ingestion, displaying the verified transaction hash and Stellar Expert block explorer link.

### 3. Auditing & Known Limitations
- The underlying Soroban smart contracts have undergone rigorous automated testing, but have **not been independently audited by a third-party security firm**.
- This application runs exclusively against the **Stellar Testnet**.
- Digital Product Passports verify cryptographic hash matches on-chain and do not replace physical verification audits of physical clothing.

---

## Reporting a Vulnerability

If you discover a vulnerability or potential exploit affecting the frontend, wallet integration, or API communication:

1. **Do not** report security vulnerabilities via public GitHub issues.
2. Email security inquiries to `security@stellar-threads.org` or open a confidential security advisory through GitHub's Security tab on the repository.
3. Include the following details:
   - A clear description of the vulnerability and its potential impact.
   - Exact steps or proof-of-concept to reproduce the behavior.
   - Any proposed mitigations or code patches.
