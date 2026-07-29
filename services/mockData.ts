/**
 * Mock market data mirroring the home-screen design.
 *
 * This is the single source of truth for the screen today. To go live, add a real
 * implementation of `fetchHomeData` (e.g. CoinGecko) that returns the same `HomeData`
 * shape — no component needs to change.
 */
import { Coin, HomeData, SpotlightItem } from './types';

const vine: Coin = {
  id: 'vine',
  name: 'Vine Coin',
  symbol: 'VINE',
  price: 0.275,
  changePct: -19.29,
  marketCap: 146_000_000,
  color: '#00BF63',
  glyph: 'V',
};

const jup: Coin = {
  id: 'jupiter',
  name: 'JUP',
  symbol: 'JUP',
  price: 0.275,
  changePct: 26.52,
  marketCap: 19_800_000_000,
  color: '#0B3B36',
  glyph: 'J',
};

const trendingCoins: Coin[] = [
  { ...vine, name: 'Vine', changePct: 26.52 },
  jup,
  {
    id: 'bonk',
    name: 'BONK',
    symbol: 'BONK',
    price: 0.0000214,
    changePct: 8.14,
    marketCap: 1_600_000_000,
    color: '#F5A524',
  },
  {
    id: 'wif',
    name: 'dogwifhat',
    symbol: 'WIF',
    price: 1.42,
    changePct: -3.87,
    marketCap: 1_420_000_000,
    color: '#8B5CF6',
  },
  {
    id: 'pyth',
    name: 'Pyth Network',
    symbol: 'PYTH',
    price: 0.331,
    changePct: 4.02,
    marketCap: 1_190_000_000,
    color: '#7C3AED',
  },
  {
    id: 'jto',
    name: 'Jito',
    symbol: 'JTO',
    price: 2.18,
    changePct: -1.44,
    marketCap: 728_000_000,
    color: '#2DD4BF',
  },
];

const topGainers: Coin[] = [
  {
    id: 'smith-1',
    name: 'SMITH',
    symbol: 'SMITH',
    price: 0.0412,
    changePct: 26.52,
    marketCap: 42_000_000,
    color: '#7C5CD6',
  },
  {
    id: 'smith-2',
    name: 'SMITH',
    symbol: 'SMITH',
    price: 0.0188,
    changePct: 12.12,
    marketCap: 18_800_000,
    color: '#F08A24',
  },
  {
    id: 'pepe',
    name: 'PEPE',
    symbol: 'PEPE',
    price: 0.0000091,
    changePct: 9.74,
    marketCap: 3_800_000_000,
    color: '#4CAF50',
  },
  {
    id: 'moodeng',
    name: 'MOODENG',
    symbol: 'MOO',
    price: 0.214,
    changePct: 7.31,
    marketCap: 214_000_000,
    color: '#E879A0',
  },
];

const spotlight: SpotlightItem = {
  coin: vine,
  venue: 'Moonshot',
  isLive: true,
  window: 'Past hour',
  soldUsd: 2_400,
  windowChangePct: -19.29,
};

export const mockHomeData: HomeData = {
  totalBalance: 2_000,
  spotlight,
  topGainers,
  trending: trendingCoins,
};

/**
 * Simulates a network round-trip so the screen exercises its real loading path.
 * Used when EXPO_PUBLIC_USE_MOCK=1; see `./marketData`.
 */
export function fetchHomeData(delayMs = 600): Promise<HomeData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockHomeData), delayMs);
  });
}
