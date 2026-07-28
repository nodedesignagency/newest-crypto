/** Shared domain types. The mock service and any future real API both satisfy these. */

export type Coin = {
  id: string;
  name: string;
  symbol: string;
  /** USD spot price. */
  price: number;
  /** 24h change as a percentage, e.g. -19.29 or 26.52. */
  changePct: number;
  marketCap: number;
  /** Brand color used for the monogram avatar. */
  color: string;
  /** Optional short glyph shown in the avatar; falls back to the symbol's initial. */
  glyph?: string;
};

export type SpotlightItem = {
  coin: Coin;
  /** Launchpad / venue label, e.g. "Moonshot". */
  venue: string;
  /** Whether the coin is currently in a live trading event. */
  isLive: boolean;
  /** Window the change is measured over, e.g. "Past hour". */
  window: string;
  /** Aggregate sold volume for the window, in USD. */
  soldUsd: number;
};

export type HomeData = {
  totalBalance: number;
  spotlight: SpotlightItem;
  topGainers: Coin[];
  trending: Coin[];
};
