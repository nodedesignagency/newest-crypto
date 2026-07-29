import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRightIcon } from '../icons';
import { colors } from '../../theme/colors';
import { GUTTER, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatBalance } from '../../utils/format';

type Props = {
  balance: number;
  onPress?: () => void;
};

/** Total portfolio value; tapping through to a holdings breakdown is not built yet. */
export function BalanceCard({ balance, onPress }: Props) {
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Total balance ${formatBalance(balance)}`}
    >
      <View style={styles.textBlock}>
        <Text style={[typography.label, styles.label]}>Total Balance</Text>
        <Text style={typography.balance}>{formatBalance(balance)}</Text>
      </View>
      <ChevronRightIcon size={24} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: GUTTER,
    paddingVertical: spacing.xl,
  },
  textBlock: {
    gap: spacing.sm,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
