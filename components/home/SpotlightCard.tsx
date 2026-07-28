import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LiveDotIcon, UserIcon } from '../icons';
import { CoinAvatar } from '../ui/CoinAvatar';
import { ChangeBadge } from '../ui/ChangeBadge';
import { SpotlightItem } from '../../services/types';
import { colors } from '../../theme/colors';
import { GUTTER, radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatCompactUsd } from '../../utils/format';

type Props = {
  item: SpotlightItem;
};

/** Featured coin card: identity + venue, live badge, hourly move, sold volume. */
export function SpotlightCard({ item }: Props) {
  const { coin, venue, isLive, window, soldUsd } = item;

  return (
    <Pressable style={styles.card} accessibilityRole="button">
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
          <ChangeBadge changePct={coin.changePct} size="md" />
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
    padding: spacing.lg,
    gap: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
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
    fontSize: 14,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  liveText: {
    color: colors.accent,
    fontSize: 17,
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
    fontSize: 16,
  },
  soldValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
});
