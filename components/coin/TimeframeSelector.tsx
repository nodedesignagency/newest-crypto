import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { CHART_RANGES, ChartRange } from '../../services/types';
import { colors } from '../../theme/colors';
import { CARD_BORDER_WIDTH } from '../../theme/effects';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type Props = {
  value: ChartRange;
  onChange: (range: ChartRange) => void;
};

/** LIVE / 24H / 1W / 1M / 1Y / ALL. The active range gets a bordered chip and a dot. */
export function TimeframeSelector({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {CHART_RANGES.map((range) => {
        const active = range === value;
        return (
          <Pressable
            key={range}
            onPress={() => onChange(range)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            hitSlop={8}
          >
            <Animated.View
              layout={LinearTransition.duration(220)}
              style={[styles.chip, active && styles.chipActive]}
            >
              {active ? <View style={styles.dot} /> : null}
              <Text style={[typography.label, styles.text, active && styles.textActive]}>
                {range}
              </Text>
            </Animated.View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.none,
    borderWidth: CARD_BORDER_WIDTH,
    borderColor: 'transparent',
  },
  chipActive: {
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardFill,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.accent,
  },
  text: {
    color: colors.textMuted,
    letterSpacing: 0.4,
  },
  textActive: {
    color: colors.text,
    fontWeight: '500',
  },
});
