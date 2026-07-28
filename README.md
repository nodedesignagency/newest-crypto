# Newest Crypto

A dark-mode crypto trading app built with Expo + React Native. This first pass implements
the Home screen from the design mockup, plus a working bottom tab shell.

## Running it

```bash
npm install
npm run web      # browser preview
npm start        # Expo Go on a device, via QR code
```

`npm run typecheck` runs `tsc --noEmit`.

## Layout

```
app/
  _layout.tsx          root stack: SafeArea + dark status bar
  (tabs)/_layout.tsx   bottom tabs (Home / Rewards / Holdings)
  (tabs)/index.tsx     Home screen
components/
  icons/               all 13 Figma icons as react-native-svg components
  ui/                  CoinAvatar, ChangeBadge, SectionHeader, PlaceholderScreen
  home/                HomeHeader, BalanceCard, SpotlightCard, TopGainers, TrendingList
theme/                 colors, spacing, typography — the only place hex values live
services/              domain types + mock market data
hooks/useHomeData.ts   loads market data (data / loading / error / refresh)
utils/format.ts        price, percent, and compact-USD formatting
```

## Data

The screen runs on **mock data** (`services/mockData.ts`) shaped to match the mockup.
`useHomeData` already exposes the loading, error, and pull-to-refresh states a real API
needs, so going live means replacing the body of `fetchHomeData` with a network call that
returns the same `HomeData` — no component changes.

Two fields have no obvious market-data source and are placeholders in the mock: the
Spotlight card's `isLive` badge and `soldUsd`, which are trade-activity signals rather
than price data.

## Icons

The 13 SVGs originally sat at the repo root with spaced filenames. They now live in
`assets/icons/` in kebab-case, and are hand-converted to `react-native-svg` components in
`components/icons/index.tsx`.

Icons exported with `stroke="white"` take `color`/`opacity` props so one component serves
both active and inactive tab states. Icons with a baked brand hue (spotlight blue, gainers
purple, trending cyan, home teal) keep their exported colors. Stroke widths, which the
exports had at 1.5 / 1.40233 / 1.31899, are normalized to 1.5.

## Not built yet

Rewards and Holdings are placeholder screens — no designs exist for them. The balance
chevron, search field, and coin rows are not wired to destinations.
