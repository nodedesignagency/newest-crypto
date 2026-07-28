import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { GUTTER, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type Props = {
  icon: ReactNode;
  title: string;
  subtitle: string;
};

/** Stand-in for tabs that aren't designed yet, so navigation is real and tappable. */
export function PlaceholderScreen({ icon, title, subtitle }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {icon}
      <Text style={typography.sectionTitle}>{title}</Text>
      <Text style={[typography.label, styles.subtitle]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: GUTTER,
    backgroundColor: colors.bg,
  },
  subtitle: {
    color: colors.textMuted,
    textAlign: 'center',
  },
});
