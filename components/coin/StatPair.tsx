import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { CARD_BORDER_WIDTH, CARD_PADDING, innerGlow } from '../../theme/effects';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type Item = {
  label: string;
  value: string;
  /** Optional tint for the value, e.g. a high/low pair. */
  tone?: string;
};

/**
 * Two labelled figures side by side, on the app's card surface — used for
 * balance/value and volume/market cap.
 */
export function StatPair({ left, right }: { left: Item; right: Item }) {
  return (
    <View style={styles.card}>
      <Cell item={left} align="flex-start" />
      <View style={styles.rule} />
      <Cell item={right} align="flex-end" />
    </View>
  );
}

function Cell({ item, align }: { item: Item; align: 'flex-start' | 'flex-end' }) {
  return (
    <View style={[styles.cell, { alignItems: align }]}>
      <Text style={[typography.rowSubtitle, styles.label]}>{item.label}</Text>
      <Text style={[styles.value, item.tone ? { color: item.tone } : null]}>{item.value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: CARD_PADDING,
    borderRadius: radius.none,
    borderWidth: CARD_BORDER_WIDTH,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardFill,
    boxShadow: innerGlow.gainerCard,
  },
  cell: {
    flex: 1,
    gap: spacing.xs,
  },
  rule: {
    width: CARD_BORDER_WIDTH,
    alignSelf: 'stretch',
    backgroundColor: colors.border,
  },
  label: {
    color: colors.textMuted,
  },
  value: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
});
