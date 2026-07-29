import { Platform, TextStyle } from 'react-native';
import { colors } from './colors';

const family = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
});

/** Every token carries an explicit color — RN Web defaults <Text> to black otherwise. */
const base: TextStyle = { fontFamily: family, color: colors.text };

/**
 * Sizes derived from the mockup by measuring cap heights against the screen width,
 * so the scale holds regardless of the export's pixel density.
 */
export const typography = {
  balance: { ...base, fontSize: 26, fontWeight: '600' },
  sectionTitle: { ...base, fontSize: 22, fontWeight: '600' },
  rowTitle: { ...base, fontSize: 15, fontWeight: '500' },
  rowSubtitle: { ...base, fontSize: 11, fontWeight: '400' },
  price: { ...base, fontSize: 15, fontWeight: '500' },
  label: { ...base, fontSize: 13, fontWeight: '400' },
  badge: { ...base, fontSize: 14, fontWeight: '600' },
} satisfies Record<string, TextStyle>;
