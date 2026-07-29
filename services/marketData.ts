/**
 * Chooses between live market data and the bundled mock. The only module that
 * knows both exist — everything upstream just calls `fetchHomeData()`.
 *
 * Set EXPO_PUBLIC_USE_MOCK=1 to force mock data (useful offline, and required in
 * sandboxes where api.coingecko.com is unreachable).
 */
import { fetchHomeData as fetchLive, fetchMarketChart as fetchLiveChart } from './coingecko';
import { fetchHomeData as fetchMock, fetchMockChart } from './mockData';
import { ChartRange, HomeData } from './types';

export const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === '1';

export function fetchHomeData(options: { fresh?: boolean } = {}): Promise<HomeData> {
  return USE_MOCK ? fetchMock() : fetchLive(options);
}

export function fetchChart(
  coinId: string,
  range: ChartRange,
  options: { fresh?: boolean } = {},
): Promise<number[]> {
  return USE_MOCK ? fetchMockChart(coinId, range) : fetchLiveChart(coinId, range, options);
}
