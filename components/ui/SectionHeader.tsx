import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { GUTTER, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type Props = {
  icon: ReactNode;
  title: string;
};

/**
 * Section heading: icon + title, followed by the hairline rule that starts with a
 * small dot and fades out toward the right — the divider motif from the design.
 */
export function SectionHeader({ icon, title }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        {icon}
        <Text style={typography.sectionTitle}>{title}</Text>
      </View>
      <Divider />
    </View>
  );
}

/**
 * Hairline rule with a small square cap at its left end — square, not round, and
 * brighter than the line it leads into.
 */
export function Divider() {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.cap} />
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: GUTTER,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: GUTTER / 2,
  },
  cap: {
    width: 4,
    height: 4,
    backgroundColor: colors.dividerCap,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
});
