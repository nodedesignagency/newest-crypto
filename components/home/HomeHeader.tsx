import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { HistoryIcon, SearchIcon, SettingsIcon } from '../icons';
import { colors } from '../../theme/colors';
import { GUTTER, radius, spacing } from '../../theme/spacing';
import { CARD_BORDER_WIDTH, innerGlow } from '../../theme/effects';
import { typography } from '../../theme/typography';

/**
 * Figma: the search field is 38 tall with 12 padding on every side. Those only
 * reconcile if the content is small — 38 less the 1px borders and 24 of padding
 * leaves 12 — so the magnifier is sized to sit inside the padding rather than
 * pushing through it.
 */
const SEARCH_HEIGHT = 38;
const SEARCH_PADDING = 12;
const SEARCH_ICON = 14;

/** Top bar: history shortcut, search field, settings. */
export function HomeHeader() {
  return (
    <View style={styles.row}>
      <Pressable hitSlop={12} accessibilityRole="button" accessibilityLabel="Transaction history">
        <HistoryIcon size={26} />
      </Pressable>

      <View style={styles.searchField}>
        <SearchIcon size={SEARCH_ICON} color={colors.text} opacity={0.85} />
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
    height: SEARCH_HEIGHT,
    padding: SEARCH_PADDING,
    borderRadius: radius.none,
    // Same surface treatment as the Top Gainers card.
    borderWidth: CARD_BORDER_WIDTH,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardFill,
    boxShadow: innerGlow.gainerCard,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    // RN web adds a focus ring on inputs; the field border is the affordance here.
    outlineStyle: 'none',
  } as any,
});
