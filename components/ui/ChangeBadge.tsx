import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GainIcon, LossIcon } from '../icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatPercent } from '../../utils/format';

type Props = {
  changePct: number;
  size?: 'sm' | 'md';
};

/** Directional triangle + percentage, colored by sign. */
export function ChangeBadge({ changePct, size = 'sm' }: Props) {
  const up = changePct >= 0;
  const fontSize = size === 'md' ? 14 : 11;

  return (
    <View style={styles.row}>
      {up ? <GainIcon size={size === 'md' ? 10 : 8} /> : <LossIcon size={size === 'md' ? 12 : 10} />}
      <Text
        style={[
          typography.label,
          styles.text,
          { fontSize, color: up ? colors.positive : colors.negative },
        ]}
      >
        {formatPercent(changePct)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  text: {
    fontWeight: '500',
  },
});
