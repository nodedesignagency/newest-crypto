import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LiveDotIcon, UserIcon } from '../icons';
import { CoinAvatar } from '../ui/CoinAvatar';
import { ChangeBadge } from '../ui/ChangeBadge';
import { SpotlightItem } from '../../services/types';
import { colors } from '../../theme/colors';
import { GUTTER, radius, spacing } from '../../theme/spacing';
import { CARD_BORDER_WIDTH, CARD_PADDING, innerGlow } from '../../theme/effects';
import { typography } from '../../theme/typography';
import { formatCompactUsd } from '../../utils/format';

type Props = {
  item: SpotlightItem;
  onPress?: () => void;
};

/** Featured coin card: identity + venue, live badge, hourly move, sold volume. */
export function SpotlightCard({ item, onPress }: Props) {
  const { coin, venue, isLive, window, soldUsd, windowChangePct } = item;

  return (
    <Pressable style={styles.card} onPress={onPress} accessibilityRole="button">
      {/*
        The glow lives on its own layer inside the border rather than on the card.
        A translucent border lets the card's own inset shadow bleed through it, which
        lifted the border to within 1/255 of the fill's luminance and made it vanish.
        Clipped to the padding box, the glow cannot reach the border.
      */}
      <View style={styles.glow} pointerEvents="none" />

      <View style={styles.topRow}>
        <CoinAvatar coin={coin} size={46} />
        <View style={styles.identity}>
          <Text style={typography.rowTitle}>{coin.name}</Text>
          <Text style={[typography.rowSubtitle, styles.subtitle]}>
            {coin.symbol} • {venue}
          </Text>
        </View>
        {isLive ? (
          <View style={styles.liveRow}>
            <LiveDotIcon size={9} />
            <Text style={[typography.badge, styles.liveText]}>LIVE</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.changeGroup}>
          <ChangeBadge changePct={windowChangePct} size="md" />
          <Text style={[typography.label, styles.muted]}>{window}</Text>
        </View>
        <View style={styles.soldGroup}>
          <UserIcon size={17} />
          <Text style={[typography.label, styles.muted]}>Sold</Text>
          <Text style={[typography.label, styles.soldValue]}>{formatCompactUsd(soldUsd)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: GUTTER,
    padding: CARD_PADDING,
    gap: spacing.md,
    borderRadius: radius.none,
    borderWidth: CARD_BORDER_WIDTH,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardFill,
    overflow: 'hidden',
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    boxShadow: innerGlow.spotlight,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  identity: {
    flex: 1,
    gap: 2,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 11,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  liveText: {
    color: colors.accent,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  changeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  soldGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  muted: {
    color: colors.textMuted,
    fontSize: 13,
  },
  soldValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
  },
});
