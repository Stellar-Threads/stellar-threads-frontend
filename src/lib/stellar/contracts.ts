import {
  rpc,
  Address,
  nativeToScVal,
  scValToNative,
  TransactionBuilder,
  Operation,
  Keypair,
} from '@stellar/stellar-sdk';
import { STELLAR_NETWORK } from '../../config/stellar';
import { signTransactionWithSelectedWallet } from '../wallet/multiWallet';
import {
  DesignerProfileData,
  ProductPassportData,
  EscrowOrderData,
  WalletProviderId,
} from '../../types/stellar';

export const DEPLOYED_CONTRACTS = {
  designerRegistry: process.env.NEXT_PUBLIC_DESIGNER_REGISTRY_CONTRACT || 'CDUF5C2CNF3NFMMUOGCO74D2NFKCYUK6VVILPGXM5RDC7CDCGD3GJEHR',
  productPassport: process.env.NEXT_PUBLIC_PRODUCT_PASSPORT_CONTRACT || 'CAJLI5PXVPQWOY4C2MCG7GII37IORAP4PL5AVX7GSOCUV6FH5FTW2E4U',
  fashionEscrow: process.env.NEXT_PUBLIC_FASHION_ESCROW_CONTRACT || 'CBULSNLLBDACPNNNM4JB5NL2XB56QP6FVU7HHIOTNUXKUBSU4JHJGV5D',
};

export const sorobanServer = new rpc.Server(STELLAR_NETWORK.rpcUrl);

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Polls Soroban RPC for confirmed transaction result
 */
export async function pollTransactionStatus(hash: string, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await sorobanServer.getTransaction(hash);
    if (res.status === 'SUCCESS') {
      return res;
    }
    if (res.status === 'FAILED') {
      throw new Error(`Contract invocation failed on Testnet: ${JSON.stringify(res)}`);
    }
    await sleep(2500);
  }
  throw new Error(`Transaction confirmation timed out for ${hash}`);
}

/**
 * Sign and submit a prepared Soroban contract invocation
 */
async function signAndSubmitTransaction(
  tx: any,
  sourceAddress: string,
  walletId: WalletProviderId,
  onStatusChange?: (status: string) => void
): Promise<string> {
  onStatusChange?.('preparing');
  const prepared = await sorobanServer.prepareTransaction(tx);

  onStatusChange?.('awaiting_authorization');
  const signResult = await signTransactionWithSelectedWallet(
    walletId,
    prepared.toXDR(),
    sourceAddress
  );

  if (!signResult.success || !signResult.signedTxXdr) {
    throw new Error(signResult.error || 'Wallet signature was cancelled or failed');
  }

  onStatusChange?.('submitting');
  const sendRes = await sorobanServer.sendTransaction(
    TransactionBuilder.fromXDR(signResult.signedTxXdr, STELLAR_NETWORK.passphrase) as any
  );

  if (sendRes.status === 'ERROR') {
    throw new Error(`Network rejected transaction submission: ${JSON.stringify(sendRes)}`);
  }

  onStatusChange?.('pending_confirmation');
  await pollTransactionStatus(sendRes.hash);

  onStatusChange?.('successful');
  return sendRes.hash;
}

// -------------------------------------------------------------
// DESIGNER REGISTRY CONTRACT
// -------------------------------------------------------------

export async function fetchDesignerRecord(
  address: string
): Promise<DesignerProfileData | null> {
  try {
    const dummy = Keypair.random();
    const tx = new TransactionBuilder(
      new (rpc as any).Account(dummy.publicKey(), '0'),
      { fee: '100', networkPassphrase: STELLAR_NETWORK.passphrase }
    )
      .addOperation(
        Operation.invokeContractFunction({
          contract: DEPLOYED_CONTRACTS.designerRegistry,
          function: 'get_designer',
          args: [new Address(address).toScVal()],
        })
      )
      .setTimeout(30)
      .build();

    const sim: any = await sorobanServer.simulateTransaction(tx);
    if (sim.result?.retval) {
      const native = scValToNative(sim.result.retval);
      return {
        designerAddress: native.designer_address,
        brandName: native.brand_name,
        atelierLocation: native.atelier_location,
        metadataUri: native.metadata_uri,
        registeredAt: Number(native.registered_at),
        isVerified: Boolean(native.is_verified),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function registerDesignerOnChain(
  sourceAddress: string,
  brandName: string,
  atelierLocation: string,
  metadataUri: string,
  walletId: WalletProviderId = 'freighter',
  onStatusChange?: (status: string) => void
): Promise<string> {
  const account = await sorobanServer.getAccount(sourceAddress);
  const tx = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: STELLAR_NETWORK.passphrase,
  })
    .addOperation(
      Operation.invokeContractFunction({
        contract: DEPLOYED_CONTRACTS.designerRegistry,
        function: 'register_designer',
        args: [
          new Address(sourceAddress).toScVal(),
          nativeToScVal(brandName, { type: 'string' }),
          nativeToScVal(atelierLocation, { type: 'string' }),
          nativeToScVal(metadataUri, { type: 'string' }),
        ],
      })
    )
    .setTimeout(60)
    .build();

  return signAndSubmitTransaction(tx, sourceAddress, walletId, onStatusChange);
}

// -------------------------------------------------------------
// PRODUCT PASSPORT CONTRACT
// -------------------------------------------------------------

export async function fetchPassportRecord(
  productId: string
): Promise<ProductPassportData | null> {
  try {
    const dummy = Keypair.random();
    const tx = new TransactionBuilder(
      new (rpc as any).Account(dummy.publicKey(), '0'),
      { fee: '100', networkPassphrase: STELLAR_NETWORK.passphrase }
    )
      .addOperation(
        Operation.invokeContractFunction({
          contract: DEPLOYED_CONTRACTS.productPassport,
          function: 'get_passport',
          args: [nativeToScVal(productId, { type: 'string' })],
        })
      )
      .setTimeout(30)
      .build();

    const sim: any = await sorobanServer.simulateTransaction(tx);
    if (sim.result?.retval) {
      const native = scValToNative(sim.result.retval);
      return {
        productId: native.product_id,
        creator: native.creator,
        owner: native.owner,
        brandName: native.brand_name,
        productName: native.product_name,
        metadataUri: native.metadata_uri,
        integrityHash: native.integrity_hash,
        totalEdition: Number(native.total_edition),
        status: Number(native.status),
        createdAt: Number(native.created_at),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function verifyPassportIntegrityOnChain(
  productId: string,
  providedHash: string
): Promise<boolean> {
  try {
    const dummy = Keypair.random();
    const tx = new TransactionBuilder(
      new (rpc as any).Account(dummy.publicKey(), '0'),
      { fee: '100', networkPassphrase: STELLAR_NETWORK.passphrase }
    )
      .addOperation(
        Operation.invokeContractFunction({
          contract: DEPLOYED_CONTRACTS.productPassport,
          function: 'verify_integrity',
          args: [
            nativeToScVal(productId, { type: 'string' }),
            nativeToScVal(providedHash, { type: 'string' }),
          ],
        })
      )
      .setTimeout(30)
      .build();

    const sim: any = await sorobanServer.simulateTransaction(tx);
    if (sim.result?.retval) {
      return Boolean(scValToNative(sim.result.retval));
    }
    return false;
  } catch {
    return false;
  }
}

export async function createPassportOnChain(
  sourceAddress: string,
  productId: string,
  brandName: string,
  productName: string,
  metadataUri: string,
  integrityHash: string,
  totalEdition: number,
  walletId: WalletProviderId = 'freighter',
  onStatusChange?: (status: string) => void
): Promise<string> {
  const account = await sorobanServer.getAccount(sourceAddress);
  const tx = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: STELLAR_NETWORK.passphrase,
  })
    .addOperation(
      Operation.invokeContractFunction({
        contract: DEPLOYED_CONTRACTS.productPassport,
        function: 'create_passport',
        args: [
          new Address(sourceAddress).toScVal(),
          nativeToScVal(productId, { type: 'string' }),
          nativeToScVal(brandName, { type: 'string' }),
          nativeToScVal(productName, { type: 'string' }),
          nativeToScVal(metadataUri, { type: 'string' }),
          nativeToScVal(integrityHash, { type: 'string' }),
          nativeToScVal(totalEdition, { type: 'u32' }),
        ],
      })
    )
    .setTimeout(60)
    .build();

  return signAndSubmitTransaction(tx, sourceAddress, walletId, onStatusChange);
}

// -------------------------------------------------------------
// FASHION ESCROW CONTRACT
// -------------------------------------------------------------

export async function fetchEscrowOrder(orderId: number): Promise<EscrowOrderData | null> {
  try {
    const dummy = Keypair.random();
    const tx = new TransactionBuilder(
      new (rpc as any).Account(dummy.publicKey(), '0'),
      { fee: '100', networkPassphrase: STELLAR_NETWORK.passphrase }
    )
      .addOperation(
        Operation.invokeContractFunction({
          contract: DEPLOYED_CONTRACTS.fashionEscrow,
          function: 'get_order',
          args: [nativeToScVal(BigInt(orderId), { type: 'u64' })],
        })
      )
      .setTimeout(30)
      .build();

    const sim: any = await sorobanServer.simulateTransaction(tx);
    if (sim.result?.retval) {
      const native = scValToNative(sim.result.retval);
      return {
        orderId: Number(native.order_id),
        buyer: native.buyer,
        seller: native.seller,
        token: native.token,
        amount: native.amount.toString(),
        orderRef: native.order_ref,
        state: Number(native.state),
        createdAt: Number(native.created_at),
        fundedAt: Number(native.funded_at),
        settledAt: Number(native.settled_at),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function createEscrowOrderOnChain(
  buyerAddress: string,
  orderId: number,
  sellerAddress: string,
  tokenAddress: string,
  amount: string,
  orderRef: string,
  walletId: WalletProviderId = 'freighter',
  onStatusChange?: (status: string) => void
): Promise<string> {
  const account = await sorobanServer.getAccount(buyerAddress);
  const tx = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: STELLAR_NETWORK.passphrase,
  })
    .addOperation(
      Operation.invokeContractFunction({
        contract: DEPLOYED_CONTRACTS.fashionEscrow,
        function: 'create_order',
        args: [
          nativeToScVal(BigInt(orderId), { type: 'u64' }),
          new Address(buyerAddress).toScVal(),
          new Address(sellerAddress).toScVal(),
          new Address(tokenAddress).toScVal(),
          nativeToScVal(BigInt(amount), { type: 'i128' }),
          nativeToScVal(orderRef, { type: 'string' }),
        ],
      })
    )
    .setTimeout(60)
    .build();

  return signAndSubmitTransaction(tx, buyerAddress, walletId, onStatusChange);
}

export async function fundEscrowOrderOnChain(
  buyerAddress: string,
  orderId: number,
  walletId: WalletProviderId = 'freighter',
  onStatusChange?: (status: string) => void
): Promise<string> {
  const account = await sorobanServer.getAccount(buyerAddress);
  const tx = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: STELLAR_NETWORK.passphrase,
  })
    .addOperation(
      Operation.invokeContractFunction({
        contract: DEPLOYED_CONTRACTS.fashionEscrow,
        function: 'fund_order',
        args: [nativeToScVal(BigInt(orderId), { type: 'u64' })],
      })
    )
    .setTimeout(60)
    .build();

  return signAndSubmitTransaction(tx, buyerAddress, walletId, onStatusChange);
}

export async function releaseEscrowOrderOnChain(
  buyerAddress: string,
  orderId: number,
  walletId: WalletProviderId = 'freighter',
  onStatusChange?: (status: string) => void
): Promise<string> {
  const account = await sorobanServer.getAccount(buyerAddress);
  const tx = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: STELLAR_NETWORK.passphrase,
  })
    .addOperation(
      Operation.invokeContractFunction({
        contract: DEPLOYED_CONTRACTS.fashionEscrow,
        function: 'release_funds',
        args: [nativeToScVal(BigInt(orderId), { type: 'u64' })],
      })
    )
    .setTimeout(60)
    .build();

  return signAndSubmitTransaction(tx, buyerAddress, walletId, onStatusChange);
}

export async function refundEscrowOrderOnChain(
  sellerAddress: string,
  orderId: number,
  walletId: WalletProviderId = 'freighter',
  onStatusChange?: (status: string) => void
): Promise<string> {
  const account = await sorobanServer.getAccount(sellerAddress);
  const tx = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: STELLAR_NETWORK.passphrase,
  })
    .addOperation(
      Operation.invokeContractFunction({
        contract: DEPLOYED_CONTRACTS.fashionEscrow,
        function: 'refund_funds',
        args: [nativeToScVal(BigInt(orderId), { type: 'u64' })],
      })
    )
    .setTimeout(60)
    .build();

  return signAndSubmitTransaction(tx, sellerAddress, walletId, onStatusChange);
}
