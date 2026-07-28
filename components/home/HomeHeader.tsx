import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { HistoryIcon, SearchIcon, SettingsIcon } from '../icons';
import { colors } from '../../theme/colors';
import { GUTTER, radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

/** Top bar: history shortcut, search field, settings. */
export function HomeHeader() {
  return (
    <View style={styles.row}>
      <Pressable hitSlop={12} accessibilityRole="button" accessibilityLabel="Transaction history">
        <HistoryIcon size={26} />
      </Pressable>

      <View style={styles.searchField}>
        <SearchIcon size={20} color={colors.text} opacity={0.85} />
        <TextInput
          style={[typography.label, styles.input]}
          placeholder="Search"
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
        />
      </View>

      <Pressable hitSlop={12} accessibilityRole="button" accessibilityLabel="Settings">
        <SettingsIcon size={26} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: GUTTER,
    paddingBottom: spacing.xl,
  },
  searchField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 17,
    // RN web adds a focus ring on inputs; the field border is the affordance here.
    outlineStyle: 'none',
  } as any,
});
