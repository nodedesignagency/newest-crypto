import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { CoinAvatar } from '../ui/CoinAvatar';
import { GainIcon, LossIcon } from '../icons';
import { PriceChart } from './PriceChart';
import { TimeframeSelector } from './TimeframeSelector';
import { useCoinChart } from '../../hooks/useCoinChart';
import { ChartRange, Coin } from '../../services/types';
import { colors } from '../../theme/colors';
import { CARD_BORDER_WIDTH } from '../../theme/effects';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatPercent, formatPrice } from '../../utils/format';

type Props = {
  coin: Coin;
  width: number;
  /** Measured pager height — pages need a definite one to push Buy Now down. */
  height: number;
  /** Only the page in view fetches its chart; neighbours stay idle until swiped to. */
  active: boolean;
};

const CHART_HEIGHT = 190;

/** One coin's page inside the drawer. Several are mounted side by side for swiping. */
export function CoinDrawerPage({ coin, width, height, active }: Props) {
  const [range, setRange] = useState<ChartRange>('24H');
  const { points, loading, error, retry } = useCoinChart(active ? coin.id : null, range);

  const up = coin.changePct >= 0;
  const tint = up ? colors.positive : colors.negative;
  const absoluteChange = Math.abs(coin.price * (coin.changePct / 100));
  const chartWidth = width - spacing.xl * 2;

  const rank = coin.rank ? `Rank #${coin.rank}` : '';
  const subtitle = [coin.name === coin.symbol ? '' : coin.symbol, rank].filter(Boolean).join(' • ');

  return (
    <View style={[styles.page, { width }, height ? { height } : null]}>
      <View style={styles.identityRow}>
        <CoinAvatar coin={coin} size={34} />
        <View>
          <Text style={typography.rowTitle}>{coin.name}</Text>
          {subtitle ? (
            <Text style={[typography.rowSubtitle, styles.subtitle]}>{subtitle}</Text>
          ) : null}
        </View>
      </View>

      <Animated.View entering={FadeInDown.duration(320)} style={styles.priceBlock}>
        <Text style={styles.price}>{formatPrice(coin.price)}</Text>
        <View style={styles.changeRow}>
          {up ? <GainIcon size={9} /> : <LossIcon size={11} />}
          <Text style={[typography.label, styles.change, { color: tint }]}>
            {formatPrice(absoluteChange)} ({formatPercent(coin.changePct)})
          </Text>
          <Text style={[typography.label, styles.muted]}>Past 24 hours</Text>
        </View>
      </Animated.View>

      <View style={[styles.chart, { height: CHART_HEIGHT }]}>
        {points ? (
          <PriceChart
            // Remounting per range lets the new line fade in rather than snap.
            key={`${coin.id}-${range}`}
            points={points}
            width={chartWidth}
            height={CHART_HEIGHT}
            color={tint}
          />
        ) : null}

        {loading && !points ? (
          <View style={styles.chartState}>
            <ActivityIndicator color={colors.accent} />
          </View>
        ) : null}

        {error && !points ? (
          <Pressable style={styles.chartState} onPress={retry} accessibilityRole="button">
            <Text style={[typography.label, styles.muted]}>{error.message}</Text>
            <Text style={[typography.label, styles.retry]}>Tap to retry</Text>
          </Pressable>
        ) : null}
      </View>

      <TimeframeSelector value={range} onChange={setRange} />

      <View style={styles.spacer} />

      <Animated.View entering={FadeIn.delay(120)} style={styles.buyWrap}>
        <Pressable style={styles.buy} accessibilityRole="button">
          <View style={styles.buyGlyph}>
            <Text style={styles.buyGlyphText}>$</Text>
          </View>
          <Text style={styles.buyText}>Buy Now</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },
  spacer: {
    flex: 1,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  subtitle: {
    color: colors.textMuted,
  },
  priceBlock: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  price: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '500',
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  change: {
    fontSize: 14,
  },
  muted: {
    color: colors.textMuted,
  },
  chart: {
    justifyContent: 'center',
  },
  chartState: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  retry: {
    color: colors.accent,
    fontWeight: '500',
  },
  buyWrap: {
    paddingTop: spacing.xs,
  },
  buy: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    height: 54,
    borderRadius: radius.none,
    borderWidth: CARD_BORDER_WIDTH,
    borderColor: colors.accent,
    backgroundColor: 'rgba(16,245,212,0.12)',
    boxShadow: 'inset 0px 0px 44px -12px rgba(16,245,212,0.55)',
  },
  buyGlyph: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: CARD_BORDER_WIDTH,
    borderColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyGlyphText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 14,
  },
  buyText: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '500',
  },
});
