# Contributing to Stellar Threads

Thank you for your interest in contributing to Stellar Threads! We welcome code contributions, issue reports, documentation improvements, and architectural discussions.

## Code of Conduct

All contributors and participants agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Development Workflow

1. Fork the repository and clone your fork locally.
2. Create a feature branch with a descriptive name:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Verify tests and typechecking:
   ```bash
   npm run typecheck
   npm test
   ```
5. Commit your changes using conventional commit standards:
   - `feat:` for new capabilities
   - `fix:` for bug fixes
   - `docs:` for documentation updates
   - `test:` for test additions or modifications
   - `refactor:` for code restructurings without behavior changes
6. Push to your fork and submit a Pull Request targeting the `main` branch.

## Recommended Labels

When opening issues or labeling pull requests, use the following standard taxonomy:
- `good first issue`: Ideal for newcomers
- `help wanted`: Tasks seeking community collaboration
- `frontend`: User interface, hooks, and React components
- `backend`: Services, routes, and API contracts
- `stellar`: Stellar SDK, Horizon queries, and Testnet integration
- `soroban`: Smart contract development and Rust tooling
- `testing`: Unit, integration, and E2E test suites
- `documentation`: READMEs, protocol specifications, and guides

## Security Disclosures

Please do **not** open public issues for sensitive security vulnerabilities. Follow the reporting instructions in [SECURITY.md](SECURITY.md).
