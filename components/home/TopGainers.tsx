import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { CoinAvatar } from '../ui/CoinAvatar';
import { ChangeBadge } from '../ui/ChangeBadge';
import { Coin } from '../../services/types';
import { colors } from '../../theme/colors';
import { GUTTER, radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type Props = {
  coins: Coin[];
};

/** Horizontally scrolling row of best 24h performers. */
export function TopGainers({ coins }: Props) {
  return (
    <FlatList
      horizontal
      data={coins}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <GainerCard coin={item} />}
    />
  );
}

function GainerCard({ coin }: { coin: Coin }) {
  return (
    <Pressable style={styles.card} accessibilityRole="button">
      <CoinAvatar coin={coin} size={38} />
      <Text style={[typography.rowTitle, styles.name]} numberOfLines={1}>
        {coin.symbol}
      </Text>
      <ChangeBadge changePct={coin.changePct} size="md" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: GUTTER,
    gap: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.none,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  name: {
    color: colors.text,
    fontSize: 16,
  },
});
