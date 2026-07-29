import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeInDown, runOnJS } from 'react-native-reanimated';
import { CoinAvatar } from '../ui/CoinAvatar';
import { ExpandIcon, GainIcon, LossIcon } from '../icons';
import { PriceChart, scrubX } from './PriceChart';
import { StatPair } from './StatPair';
import { TimeframeSelector } from './TimeframeSelector';
import { useCoinChart } from '../../hooks/useCoinChart';
import { ChartRange, Coin } from '../../services/types';
import { colors } from '../../theme/colors';
import { CARD_BORDER_WIDTH } from '../../theme/effects';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatCompactUsd, formatPercent, formatPrice } from '../../utils/format';

type Props = {
  coin: Coin;
  width: number;
  /** Measured pager height — pages need a definite one to push Buy Now down. */
  height: number;
  /** Only the page in view fetches its chart; neighbours stay idle until swiped to. */
  active: boolean;
  onOpenDetail?: (coin: Coin) => void;
};

/**
 * Everything above the chart plus everything below it, measured: identity row,
 * price block, timeframes, two stat pairs, the buy button, and the gaps between.
 * The chart takes whatever is left, so the button can never be pushed off-screen
 * on a short device — which is exactly what happened on a 720x1600 phone.
 */
const CHROME_HEIGHT = 430;
const CHART_MIN = 96;
const CHART_MAX = 190;

/**
 * How long to hold before a drag scrubs the chart. Without this, dragging
 * sideways on the chart would be ambiguous — page to the next coin, or inspect
 * a price? Holding first states the intent.
 */
const SCRUB_HOLD_MS = 160;

/** One coin's page inside the drawer. Several are mounted side by side for swiping. */
export function CoinDrawerPage({ coin, width, height, active, onOpenDetail }: Props) {
  const [range, setRange] = useState<ChartRange>('24H');
  const [scrubIndex, setScrubIndex] = useState<number | null>(null);
  const { points, loading, error, retry } = useCoinChart(active ? coin.id : null, range);

  const up = coin.changePct >= 0;
  const tint = up ? colors.positive : colors.negative;
  const absoluteChange = Math.abs(coin.price * (coin.changePct / 100));
  const chartWidth = width - spacing.xl * 2;
  const chartHeight = height
    ? Math.max(CHART_MIN, Math.min(CHART_MAX, height - CHROME_HEIGHT))
    : CHART_MAX;

  const rank = coin.rank ? `Rank #${coin.rank}` : '';
  const subtitle = [coin.name === coin.symbol ? '' : coin.symbol, rank].filter(Boolean).join(' • ');

  const extremes = useMemo(() => {
    if (!points?.length) return null;
    return { high: Math.max(...points), low: Math.min(...points) };
  }, [points]);

  const setIndex = useCallback(
    (i: number | null) => {
      if (!points?.length) return;
      setScrubIndex(i === null ? null : Math.min(points.length - 1, Math.max(0, i)));
    },
    [points],
  );

  const scrub = useMemo(
    () =>
      Gesture.Pan()
        .activateAfterLongPress(SCRUB_HOLD_MS)
        .onUpdate((e) => {
          'worklet';
          const count = points?.length ?? 0;
          if (count < 2) return;
          runOnJS(setIndex)(Math.round((e.x / chartWidth) * (count - 1)));
        })
        .onFinalize(() => {
          'worklet';
          runOnJS(setIndex)(null);
        }),
    [chartWidth, points, setIndex],
  );

  const scrubbedPrice = scrubIndex != null && points ? points[scrubIndex] : null;

  return (
    <View style={[styles.page, { width }, height ? { height } : null]}>
      <View style={styles.header}>
        <View style={styles.identityRow}>
          <CoinAvatar coin={coin} size={34} />
          <View>
            <Text style={typography.rowTitle}>{coin.name}</Text>
            {subtitle ? (
              <Text style={[typography.rowSubtitle, styles.subtitle]}>{subtitle}</Text>
            ) : null}
          </View>
        </View>

        {/* Absolute so the identity stays optically centred regardless of name length. */}
        <Pressable
          style={styles.expand}
          hitSlop={10}
          onPress={() => onOpenDetail?.(coin)}
          accessibilityRole="button"
          accessibilityLabel={`Open the full ${coin.name} page`}
        >
          <ExpandIcon size={18} />
        </Pressable>
      </View>

      <Animated.View entering={FadeInDown.duration(320)} style={styles.priceBlock}>
        <Text style={styles.price}>{formatPrice(scrubbedPrice ?? coin.price)}</Text>
        <View style={styles.changeRow}>
          {up ? <GainIcon size={9} /> : <LossIcon size={11} />}
          <Text style={[typography.label, styles.change, { color: tint }]}>
            {formatPrice(absoluteChange)} ({formatPercent(coin.changePct)})
          </Text>
          <Text style={[typography.label, styles.muted]}>Past 24 hours</Text>
        </View>
      </Animated.View>

      <GestureDetector gesture={scrub}>
        <View style={[styles.chart, { height: chartHeight }]}>
          {points ? (
            <>
              <PriceChart
                // Remounting per range lets the new line fade in rather than snap.
                key={`${coin.id}-${range}`}
                points={points}
                width={chartWidth}
                height={chartHeight}
                color={tint}
                scrubIndex={scrubIndex}
              />

              {/* Hidden while scrubbing — the bubble occupies that corner, and the
                  value under your finger is what you're reading at that moment. */}
              {extremes && scrubIndex == null ? (
                <>
                  <Text style={[typography.rowSubtitle, styles.high]}>
                    {formatPrice(extremes.high)}
                  </Text>
                  <Text style={[typography.rowSubtitle, styles.low]}>
                    {formatPrice(extremes.low)}
                  </Text>
                </>
              ) : null}

              {scrubbedPrice != null ? (
                <View
                  pointerEvents="none"
                  style={[
                    styles.bubble,
                    // Clamped so the bubble never hangs off either edge.
                    {
                      left: Math.min(
                        chartWidth - BUBBLE_WIDTH,
                        Math.max(0, scrubX(scrubIndex!, points.length, chartWidth) - BUBBLE_WIDTH / 2),
                      ),
                    },
                  ]}
                >
                  <Text style={styles.bubbleText}>{formatPrice(scrubbedPrice)}</Text>
                </View>
              ) : null}
            </>
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
      </GestureDetector>

      <TimeframeSelector value={range} onChange={setRange} />

      <View style={styles.stats}>
        <StatPair
          left={{ label: 'Your balance', value: `0 ${coin.symbol}` }}
          right={{ label: 'Value', value: '$0.00' }}
        />
        <StatPair
          left={{ label: '24h volume', value: formatCompactUsd(coin.volume24h ?? 0) }}
          right={{ label: 'Market cap', value: formatCompactUsd(coin.marketCap) }}
        />
      </View>

      <View style={styles.spacer} />

      <Animated.View entering={FadeIn.delay(120)}>
        <Pressable style={styles.buy} accessibilityRole="button">
          <View style={styles.buyGlyph}>
            <Text style={styles.buyGlyphText}>$</Text>
          </View>
          <Text style={styles.buyText}>Buy {coin.symbol}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const BUBBLE_WIDTH = 84;

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  spacer: {
    flex: 1,
  },
  header: {
    justifyContent: 'center',
  },
  expand: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
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
    fontSize: 38,
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
  high: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: colors.textMuted,
  },
  low: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    color: colors.textMuted,
  },
  bubble: {
    position: 'absolute',
    top: -6,
    width: BUBBLE_WIDTH,
    paddingVertical: 3,
    alignItems: 'center',
    borderRadius: radius.none,
    borderWidth: CARD_BORDER_WIDTH,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
  },
  bubbleText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '500',
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
  stats: {
    gap: spacing.md,
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
