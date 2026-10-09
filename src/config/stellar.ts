/**
 * Stellar Threads — Stellar Testnet Configuration
 * Centralized, type-safe configuration strictly targeting Stellar Testnet.
 */

export const STELLAR_NETWORK = {
  name: 'testnet' as const,
  passphrase: 'Test SDF Network ; September 2015',
  horizonUrl: process.env.NEXT_PUBLIC_STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org',
  rpcUrl: process.env.NEXT_PUBLIC_STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org',
  friendbotUrl: 'https://friendbot.stellar.org',
  explorerBaseUrl: 'https://stellar.expert/explorer/testnet',
  baseFeeStroops: '100', // 0.00001 XLM standard base fee
  baseFeeXlm: '0.00001',
  baseReserveXlm: 0.5,
  minAccountReserveXlm: 1.0, // Minimum reserve to keep account alive + 1 trustline/native
};

export const PROTOCOL_INFO = {
  name: 'Stellar Threads',
  tagline: 'From design to ownership, powered by Stellar.',
  description:
    'A decentralized global fashion finance and trade protocol connecting independent designers, clothing brands, textile mills, manufacturers, and buyers through transparent, accessible commerce on Stellar.',
  orgUrl: 'https://github.com/Stellar-Threads',
  frontendRepoUrl: 'https://github.com/Stellar-Threads/stellar-threads-frontend',
  coreRepoUrl: 'https://github.com/Stellar-Threads/stellar-threads-core',
};

export function getTxExplorerUrl(hash: string): string {
  if (!hash) return '';
  return `${STELLAR_NETWORK.explorerBaseUrl}/tx/${encodeURIComponent(hash)}`;
}

export function getAccountExplorerUrl(address: string): string {
  if (!address) return '';
  return `${STELLAR_NETWORK.explorerBaseUrl}/account/${encodeURIComponent(address)}`;
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars + 1)}...${address.slice(-chars)}`;
}

export function shortenHash(hash: string, chars = 6): string {
  if (!hash) return '';
  if (hash.length <= chars * 2 + 3) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}
