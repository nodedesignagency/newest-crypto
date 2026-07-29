import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CoinAvatar } from '../ui/CoinAvatar';
import { ChangeBadge } from '../ui/ChangeBadge';
import { Coin } from '../../services/types';
import { colors } from '../../theme/colors';
import { GUTTER, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatCompactUsd, formatPrice } from '../../utils/format';

type Props = {
  coins: Coin[];
  onSelect?: (index: number) => void;
};

/**
 * Vertical trending list. Rendered as plain views rather than a FlatList because it
 * lives inside the home ScrollView and the row count is small and bounded.
 */
export function TrendingList({ coins, onSelect }: Props) {
  return (
    <View style={styles.list}>
      {coins.map((coin, i) => (
        <TrendingRow key={coin.id} coin={coin} onPress={() => onSelect?.(i)} />
      ))}
    </View>
  );
}

function TrendingRow({ coin, onPress }: { coin: Coin; onPress: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onPress} accessibilityRole="button">
      <CoinAvatar coin={coin} size={42} />
      <View style={styles.identity}>
        <Text style={typography.rowTitle} numberOfLines={1}>
          {coin.name}
        </Text>
        <Text style={[typography.rowSubtitle, styles.cap]}>
          {formatCompactUsd(coin.marketCap)} MKT CAP
        </Text>
      </View>
      <View style={styles.figures}>
        <Text style={typography.price}>{formatPrice(coin.price)}</Text>
        <ChangeBadge changePct={coin.changePct} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.xl,
    paddingHorizontal: GUTTER,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  identity: {
    flex: 1,
    gap: 2,
  },
  cap: {
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  figures: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
});
