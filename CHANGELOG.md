# Changelog — Stellar Threads Frontend Portal

## [1.0.2] - 2026-10-29
### Fixed
- Fixed Netlify deployment output directory in `netlify.toml` from `.next` to `out`, matching Next.js static export.
- Cleaned up all unused imports across 22 components, achieving 0 ESLint warnings.
- Resolved TypeScript prop aliasing in `SustainabilityScoreCard`, `DisputeResolutionCard`, `CampaignContributionModal`, and `WalletStatusCard`.

### Added
- Embedded interactive vector screenshots (`public/screenshots/`) for dApp overview, digital passport, and factoring waterfall in README.
- Enhanced repository metadata with `freighter-wallet`, `protocol-22`, `circular-economy`, and `hackathon` topics.

---

## [1.0.1] - 2026-10-29
### Added
- **Multi-Wallet Integration**: Support for Freighter, Lobstr, and xBull through Stellar Wallets Kit.
- **Instant Friendbot Faucet Modal**: One-click 10,000 XLM grant for testnet evaluators.
- **Portal Navigation**: Overview, Escrows, Passports, Financing, Registry, and Solvency Auditor tabs.
- **Factoring Yield Calculator**: Interactive APY and duration sliders with Stroop formatting.
- **NFC Physical Twin Scanner**: SVG QR code generation and SHA-256 digest validation.
- **Production Netlify Hardening**: HSTS headers, frame deny policies, and SPA `_redirects`.
- **Component Test Suite**: 47 Vitest component tests passing with zero warnings.
