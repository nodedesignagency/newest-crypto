/**
 * Card surface treatment, taken from the Figma inspector.
 *
 * Cards are not a solid fill — they are 2% white over the page ground with a 10%
 * white hairline border, lit by inset white glows. React Native has no
 * `shadowInset`, so these use the CSS-style `boxShadow` prop, which supports
 * `inset` on the New Architecture (default in Expo SDK 54 / RN 0.81) and maps
 * straight to CSS on web.
 *
 * Values are kept at Figma's own precision rather than rounded — the fractional
 * border and padding are what the design specifies.
 */

/** Figma: Borders — 0.93px, inner alignment. */
export const CARD_BORDER_WIDTH = 0.93;

/** Figma: Padding 9.35px on the Top Gainers card. */
export const CARD_PADDING = 9.35;

/** Figma: Gap 18.7px between items inside the Top Gainers card. */
export const CARD_GAP = 18.7;

export const innerGlow = {
  /**
   * Spotlight card. Two stacked inset glows: a wide soft one and a tighter,
   * brighter one that picks out the edges.
   *   X 0, Y 0, Blur 144.63, Spread -20.57, #FFFFFF 12%
   *   X 0, Y 0, Blur  79.61, Spread -51.24, #FFFFFF 25%
   */
  spotlight:
    'inset 0px 0px 144.63px -20.57px rgba(255,255,255,0.12), ' +
    'inset 0px 0px 79.61px -51.24px rgba(255,255,255,0.25)',

  /**
   * Top Gainers card — a single, much fainter glow.
   *   X 0, Y 0, Blur 146.03, Spread -20.57, #FFFFFF 4%
   */
  gainerCard: 'inset 0px 0px 146.03px -20.57px rgba(255,255,255,0.04)',
} as const;
