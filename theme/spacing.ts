export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 28,
  '3xl': 36,
} as const;

/**
 * The design uses crisp rectangles — cards and the search field are square-cornered,
 * so `none` is the default for surfaces. Only genuinely pill-shaped elements round.
 */
export const radius = {
  none: 0,
  sm: 2,
  pill: 999,
} as const;

/**
 * Horizontal page gutter used by every section on the home screen.
 *
 * Figma puts the Spotlight card at 357.13px wide on a 393pt frame, which leaves
 * 17.9 a side — i.e. 18.7, twice the 9.35 unit the card padding is built on.
 */
export const GUTTER = 18.7;
