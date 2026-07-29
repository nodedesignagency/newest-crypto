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

The screen runs on **live market data from CoinGecko** (`services/coingecko.ts`).
Two requests cover the whole screen:

| Section | Endpoint | Notes |
|---|---|---|
| Trending | `/search/trending` | CoinGecko's own trending feed; carries price, market cap, change and logo in one call |
| Top Gainers | `/coins/markets` | Sorted client-side by 24h change, losers excluded, top 6 |
| Spotlight | `/coins/markets` | The largest absolute 1h mover |

Responses are cached for 60s and concurrent calls to the same endpoint are de-duped,
so remounting the screen or double-pulling doesn't spend rate limit. Pull-to-refresh
bypasses the cache.

### Spotlight fields

No price API exposes launchpad/social signals, so the mockup's `Moonshot` / `LIVE` /
`Sold $2.4K` map onto real data:

- **`Sold`** — the coin's real 24h traded volume
- **Venue line** — the coin's market cap rank, e.g. `Rank #23`
- **`LIVE`** — *derived*, not reported: shown when the 1h move exceeds 3%
  (`LIVE_THRESHOLD_PCT` in `services/coingecko.ts`)

### Configuration

Copy `.env.example` to `.env`:

```
EXPO_PUBLIC_COINGECKO_KEY=CG-xxxxxxxx   # optional, free Demo key
EXPO_PUBLIC_USE_MOCK=1                  # optional, forces the bundled mock data
```

The key is optional — without it the app works at a lower rate limit. Get a free
Demo key (no card) at coingecko.com under Developer Dashboard. `.env` is gitignored.

Set `EXPO_PUBLIC_USE_MOCK=1` to run against `services/mockData.ts` instead — useful
offline, and required in sandboxes that block `api.coingecko.com`.

## Tests

```bash
npm test
```

Covers the response mappers against saved fixtures in `services/__fixtures__/`,
including null-heavy entries and string-formatted numbers. The transport layer
isn't covered — it needs real network access.

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
