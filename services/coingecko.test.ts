/**
 * Mapper tests against saved CoinGecko responses.
 *
 * These cover the only non-trivial logic in the live-data path — the transport
 * itself can't be exercised here because api.coingecko.com is unreachable from
 * CI/sandboxes. Run with: npm test
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import markets from './__fixtures__/markets.json';
import trending from './__fixtures__/trending.json';
import { colorForSymbol, toCoin, toSpotlight, toTopGainers, toTrendingCoins } from './coingecko';

test('toCoin maps a market entry onto the domain type', () => {
  const coin = toCoin(markets[0] as never);

  assert.equal(coin.id, 'bitcoin');
  assert.equal(coin.symbol, 'BTC', 'symbol is upper-cased for display');
  assert.equal(coin.price, 118432.11);
  assert.equal(coin.changePct, 1.42);
  assert.equal(coin.rank, 1);
  assert.ok(coin.logoUrl?.startsWith('https://'));
});

test('toCoin survives an entry with every optional field null', () => {
  const coin = toCoin(markets[4] as never);

  assert.equal(coin.price, 0, 'null price becomes 0 rather than NaN');
  assert.equal(coin.changePct, 0);
  assert.equal(coin.marketCap, 0);
  assert.equal(coin.logoUrl, undefined);
  assert.equal(coin.rank, undefined);
  assert.ok(coin.color, 'still gets a fallback color for the monogram');
});

test('toSpotlight picks the largest absolute 1h mover', () => {
  const spotlight = toSpotlight(markets as never);

  // JUP moved -19.29% in an hour; Bitcoin only +0.31%.
  assert.equal(spotlight.coin.symbol, 'JUP');
  assert.equal(spotlight.windowChangePct, -19.29, 'a large drop is as newsworthy as a rise');
  assert.equal(spotlight.window, 'Past hour');
});

test('toSpotlight derives the venue label and LIVE flag', () => {
  const spotlight = toSpotlight(markets as never);

  assert.equal(spotlight.venue, 'Rank #23');
  assert.equal(spotlight.soldUsd, 2_400_000, 'sold figure is real 24h volume');
  assert.equal(spotlight.isLive, true, '19.29% clears the 3% threshold');
});

test('toSpotlight leaves LIVE off when nothing is moving', () => {
  const quiet = [{ ...(markets[0] as object), price_change_percentage_1h_in_currency: 0.4 }];
  assert.equal(toSpotlight(quiet as never).isLive, false);
});

test('toTopGainers ranks by 24h change and excludes losers', () => {
  const gainers = toTopGainers(markets as never);
  const symbols = gainers.map((c) => c.symbol);

  assert.deepEqual(symbols, ['JUP', 'BONK', 'BTC'], 'sorted high to low, WIF and NUL dropped');
  assert.ok(gainers.every((c) => c.changePct > 0));
});

test('toTrendingCoins parses the nested item shape and string numbers', () => {
  const coins = toTrendingCoins(trending as never);

  assert.equal(coins.length, 3);
  assert.equal(coins[0].name, 'Vine Coin');
  assert.equal(coins[0].price, 0.2751);
  assert.equal(coins[0].marketCap, 146_000_000, '"$146,000,000" is parsed to a number');
  assert.equal(coins[0].changePct, 26.52);
  assert.equal(coins[1].changePct, -4.02, 'negative changes keep their sign');
});

test('toTrendingCoins tolerates an item with no data block', () => {
  const sparse = toTrendingCoins(trending as never)[2];

  assert.equal(sparse.symbol, 'SPRS');
  assert.equal(sparse.price, 0);
  assert.equal(sparse.logoUrl, undefined);
});

test('colorForSymbol is stable across calls', () => {
  assert.equal(colorForSymbol('JUP'), colorForSymbol('JUP'));
  assert.notEqual(colorForSymbol('JUP'), colorForSymbol('BTC'));
});
