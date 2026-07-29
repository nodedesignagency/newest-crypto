/**
 * CoinGecko client. Every CoinGecko-specific shape and every bit of parsing lives
 * here — the rest of the app only ever sees the domain types from `./types`.
 *
 * Free tier: works without a key at a low rate limit; set EXPO_PUBLIC_COINGECKO_KEY
 * to a free Demo key for ~30 calls/min.
 */
import { Coin, HomeData, SpotlightItem } from './types';

/** Overridable so the live path can be exercised against a local fixture server. */
const BASE_URL =
  process.env.EXPO_PUBLIC_COINGECKO_BASE_URL ?? 'https://api.coingecko.com/api/v3';
const API_KEY = process.env.EXPO_PUBLIC_COINGECKO_KEY;

const REQUEST_TIMEOUT_MS = 20_000;
const CACHE_TTL_MS = 60_000;

/** The Spotlight card shows LIVE once the hourly move clears this. */
const LIVE_THRESHOLD_PCT = 3;

const TOP_GAINERS_COUNT = 6;
const MARKETS_PAGE_SIZE = 100;

/** Placeholder until a real wallet exists — the balance is not market data. */
const PLACEHOLDER_BALANCE = 2000;

// ---------------------------------------------------------------- raw shapes

type RawMarketCoin = {
  id: string;
  symbol: string;
  name: string;
  image: string | null;
  current_price: number | null;
  market_cap: number | null;
  market_cap_rank: number | null;
  total_volume: number | null;
  price_change_percentage_24h: number | null;
  price_change_percentage_1h_in_currency?: number | null;
};

type RawTrendingResponse = {
  coins: {
    item: {
      id: string;
      name: string;
      symbol: string;
      small?: string;
      thumb?: string;
      large?: string;
      market_cap_rank: number | null;
      data?: {
        price?: number | string | null;
        market_cap?: string | null;
        total_volume?: string | null;
        price_change_percentage_24h?: { usd?: number } | null;
      };
    };
  }[];
};

// ---------------------------------------------------------------- transport

export class ApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

type CacheEntry = { at: number; value: unknown };
const cache = new Map<string, CacheEntry>();
/** In-flight requests, so a double pull-to-refresh doesn't spend two calls. */
const inFlight = new Map<string, Promise<unknown>>();

async function request<T>(path: string, { fresh = false } = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;

  if (!fresh) {
    const hit = cache.get(url);
    if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.value as T;
  }

  const pending = inFlight.get(url);
  if (pending) return pending as Promise<T>;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const task = (async () => {
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          accept: 'application/json',
          ...(API_KEY ? { 'x-cg-demo-api-key': API_KEY } : {}),
        },
      });

      if (res.status === 429) {
        throw new ApiError('Too many requests. Give it a minute and try again.', 429);
      }
      if (!res.ok) {
        throw new ApiError(`Market data unavailable (${res.status}).`, res.status);
      }

      const value = (await res.json()) as T;
      cache.set(url, { at: Date.now(), value });
      return value;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      if (err instanceof Error && err.name === 'AbortError') {
        throw new ApiError('Request timed out. Check your connection.');
      }
      throw new ApiError('Could not reach the market data service.');
    } finally {
      clearTimeout(timeout);
      inFlight.delete(url);
    }
  })();

  inFlight.set(url, task);
  return task;
}

// ---------------------------------------------------------------- mapping

/**
 * Stable fallback color for a coin with no logo. Hashing the symbol keeps the
 * color consistent across refreshes rather than flickering between renders.
 */
export function colorForSymbol(symbol: string): string {
  let hash = 0;
  for (let i = 0; i < symbol.length; i += 1) {
    hash = (hash * 31 + symbol.charCodeAt(i)) % 360;
  }
  return `hsl(${hash}, 58%, 45%)`;
}

function num(value: unknown): number {
  const n = typeof value === 'string' ? Number(value.replace(/[$,]/g, '')) : Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function toCoin(raw: RawMarketCoin): Coin {
  const symbol = (raw.symbol ?? '').toUpperCase();
  return {
    id: raw.id,
    name: raw.name,
    symbol,
    price: num(raw.current_price),
    changePct: num(raw.price_change_percentage_24h),
    marketCap: num(raw.market_cap),
    color: colorForSymbol(symbol),
    logoUrl: raw.image ?? undefined,
    volume24h: num(raw.total_volume),
    rank: raw.market_cap_rank ?? undefined,
  };
}

export function toTrendingCoins(raw: RawTrendingResponse): Coin[] {
  return (raw.coins ?? []).map(({ item }) => {
    const symbol = (item.symbol ?? '').toUpperCase();
    return {
      id: item.id,
      name: item.name,
      symbol,
      price: num(item.data?.price),
      changePct: num(item.data?.price_change_percentage_24h?.usd),
      marketCap: num(item.data?.market_cap),
      color: colorForSymbol(symbol),
      logoUrl: item.small ?? item.large ?? item.thumb ?? undefined,
      volume24h: num(item.data?.total_volume),
      rank: item.market_cap_rank ?? undefined,
    };
  });
}

/** Largest absolute 1h mover — the coin most worth spotlighting right now. */
export function toSpotlight(markets: RawMarketCoin[]): SpotlightItem {
  const ranked = [...markets].sort(
    (a, b) =>
      Math.abs(num(b.price_change_percentage_1h_in_currency)) -
      Math.abs(num(a.price_change_percentage_1h_in_currency)),
  );

  const raw = ranked[0];
  const coin = toCoin(raw);
  const hourChange = num(raw.price_change_percentage_1h_in_currency);

  return {
    coin,
    venue: coin.rank ? `Rank #${coin.rank}` : coin.symbol,
    isLive: Math.abs(hourChange) >= LIVE_THRESHOLD_PCT,
    window: 'Past hour',
    soldUsd: coin.volume24h ?? 0,
    windowChangePct: hourChange,
  };
}

export function toTopGainers(markets: RawMarketCoin[]): Coin[] {
  return [...markets]
    .filter((c) => num(c.price_change_percentage_24h) > 0)
    .sort(
      (a, b) => num(b.price_change_percentage_24h) - num(a.price_change_percentage_24h),
    )
    .slice(0, TOP_GAINERS_COUNT)
    .map(toCoin);
}

// ---------------------------------------------------------------- public API

export async function fetchHomeData({ fresh = false } = {}): Promise<HomeData> {
  const marketsPath =
    `/coins/markets?vs_currency=usd&order=market_cap_desc` +
    `&per_page=${MARKETS_PAGE_SIZE}&page=1&price_change_percentage=1h%2C24h`;

  // Both requests are independent; failing either should fail the screen.
  const [markets, trending] = await Promise.all([
    request<RawMarketCoin[]>(marketsPath, { fresh }),
    request<RawTrendingResponse>('/search/trending', { fresh }),
  ]);

  if (!Array.isArray(markets) || markets.length === 0) {
    throw new ApiError('Market data came back empty.');
  }

  return {
    totalBalance: PLACEHOLDER_BALANCE,
    spotlight: toSpotlight(markets),
    topGainers: toTopGainers(markets),
    trending: toTrendingCoins(trending),
  };
}
