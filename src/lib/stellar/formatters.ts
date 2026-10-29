export function truncateAddress(address: string, chars = 4): string {
  if (!address || address.length < chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function stroopsToXlm(stroops: string | bigint | number): string {
  const s = BigInt(stroops.toString());
  return (Number(s) / 10_000_000).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  });
}

export function formatBpsAsPercent(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`;
}
