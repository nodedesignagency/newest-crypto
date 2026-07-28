/** Formatting helpers shared by every price/percentage surface on the home screen. */

/** `2000` -> `$2,000.00` */
export function formatBalance(value: number): string {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * `0.275` -> `$0.275`, `0.0000214` -> `$0.0000214`.
 * Sub-cent tokens keep enough significant digits to stay readable.
 */
export function formatPrice(value: number): string {
  if (value === 0) return '$0.00';
  if (value >= 1) {
    return `$${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  // Show 3 significant digits for anything below $1.
  const decimals = Math.min(12, Math.max(3, -Math.floor(Math.log10(value)) + 2));
  return `$${value.toFixed(decimals).replace(/0+$/, '').replace(/\.$/, '')}`;
}

/** `146000000` -> `$146M`, `19800000000` -> `$19.8B` */
export function formatCompactUsd(value: number): string {
  const units: [number, string][] = [
    [1e12, 'T'],
    [1e9, 'B'],
    [1e6, 'M'],
    [1e3, 'K'],
  ];
  for (const [threshold, suffix] of units) {
    if (Math.abs(value) >= threshold) {
      const scaled = value / threshold;
      // One decimal only when it adds information (19.8B, but 146M not 146.0M).
      const text = scaled >= 100 ? scaled.toFixed(0) : scaled.toFixed(1).replace(/\.0$/, '');
      return `$${text}${suffix}`;
    }
  }
  return `$${value.toFixed(0)}`;
}

/** `-19.29` -> `19.29%` (sign is conveyed by the gain/loss triangle, not the text). */
export function formatPercent(value: number): string {
  return `${Math.abs(value).toFixed(2)}%`;
}

/** First letter used for a coin's monogram avatar. */
export function monogram(symbol: string, glyph?: string): string {
  return (glyph ?? symbol.charAt(0)).toUpperCase();
}
