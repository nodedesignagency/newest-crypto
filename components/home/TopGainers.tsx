import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { CoinAvatar } from '../ui/CoinAvatar';
import { ChangeBadge } from '../ui/ChangeBadge';
import { Coin } from '../../services/types';
import { colors } from '../../theme/colors';
import { GUTTER, radius, spacing } from '../../theme/spacing';
import { CARD_BORDER_WIDTH, CARD_GAP, CARD_PADDING, innerGlow } from '../../theme/effects';
import { typography } from '../../theme/typography';

type Props = {
  coins: Coin[];
  onSelect?: (index: number) => void;
};

/** Horizontally scrolling row of best 24h performers. */
export function TopGainers({ coins, onSelect }: Props) {
  return (
    <FlatList
      horizontal
      data={coins}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item, index }) => (
        <GainerCard coin={item} onPress={() => onSelect?.(index)} />
      )}
    />
  );
}

function GainerCard({ coin, onPress }: { coin: Coin; onPress: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress} accessibilityRole="button">
      {/* Logo and symbol are one unit, 8px apart; the change sits outside that group. */}
      <View style={styles.identity}>
        {/* Sized so the card hugs to Figma's 43.94 total: 23.4 + 9.35 padding x2 + 1 border x2. */}
        <CoinAvatar coin={coin} size={23.4} />
        <Text style={[typography.rowTitle, styles.name]} numberOfLines={1}>
          {coin.symbol}
        </Text>
      </View>
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
    gap: CARD_GAP,
    padding: CARD_PADDING,
    borderRadius: radius.none,
    borderWidth: CARD_BORDER_WIDTH,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardFill,
    boxShadow: innerGlow.gainerCard,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    color: colors.text,
    fontSize: 15,
  },
});
