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
  balance: { ...base, fontSize: 23, fontWeight: '500' },
  sectionTitle: { ...base, fontSize: 19, fontWeight: '500' },
  rowTitle: { ...base, fontSize: 14, fontWeight: '500' },
  rowSubtitle: { ...base, fontSize: 10, fontWeight: '400' },
  price: { ...base, fontSize: 14, fontWeight: '500' },
  label: { ...base, fontSize: 12, fontWeight: '400' },
  badge: { ...base, fontSize: 13, fontWeight: '500' },
} satisfies Record<string, TextStyle>;
