export function formatVolume(vol: bigint): string {
  const n = Number(vol);
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export function formatPrice(p: number): string {
  return p.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPercent(p: number): string {
  const sign = p >= 0 ? "+" : "";
  return `${sign}${p.toFixed(2)}%`;
}

export function formatMA(price: number, ma: number): string {
  if (ma === 0) return "N/A";
  const diff = ((price - ma) / ma) * 100;
  const sign = diff >= 0 ? "+" : "";
  return `${sign}${diff.toFixed(2)}%`;
}

export function formatLargeNumber(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
