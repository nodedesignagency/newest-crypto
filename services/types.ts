/** Shared domain types. The mock service and the live API client both satisfy these. */

export type Coin = {
  id: string;
  name: string;
  symbol: string;
  /** USD spot price. */
  price: number;
  /** 24h change as a percentage, e.g. -19.29 or 26.52. */
  changePct: number;
  marketCap: number;
  /** Fallback circle color for the monogram avatar, used when no logo is available. */
  color: string;
  /** Optional short glyph shown in the avatar; falls back to the symbol's initial. */
  glyph?: string;
  /** Remote coin artwork. When present the avatar renders this instead of a monogram. */
  logoUrl?: string;
  /** 24h traded volume in USD. */
  volume24h?: number;
  /** Market cap rank, 1 = largest. */
  rank?: number;
};

export type SpotlightItem = {
  coin: Coin;
  /** Context line beside the symbol — the coin's market cap rank, e.g. "Rank #23". */
  venue: string;
  /**
   * Momentum flag. No price API exposes a real "live event" signal, so this is
   * derived: true when the coin's move over `window` clears LIVE_THRESHOLD_PCT.
   */
  isLive: boolean;
  /** Window the change is measured over, e.g. "Past hour". */
  window: string;
  /** Traded volume in USD over the last 24h. */
  soldUsd: number;
  /** Change over `window`, used for the card's percentage badge. */
  windowChangePct: number;
};

export type HomeData = {
  totalBalance: number;
  spotlight: SpotlightItem;
  topGainers: Coin[];
  trending: Coin[];
};
