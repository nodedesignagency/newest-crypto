/**
 * Design tokens derived from the home-screen mockup and the exported Figma icons.
 * Nothing outside this file should hardcode a hex value.
 */
export const colors = {
  bg: '#05070A',
  surface: '#12161C',
  surfaceRaised: '#171C24',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.14)',

  /** Canonical brand teal. The icons ship three near-identical teals
   * (#10F5D4, #0BF5D3, #02F5D1); they collapse to accent/positive here. */
  accent: '#10F5D4',
  positive: '#0BF5D3',
  negative: '#FF588C',

  text: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.5)',
  textFaint: 'rgba(255,255,255,0.32)',

  /** Per-section icon hues, baked into their SVGs. */
  spotlight: '#3ED1FF',
  gainers: '#9C90FF',
  trending: '#00E7FF',
} as const;

export type ColorToken = keyof typeof colors;
