import React, { useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeHeader } from '../../components/home/HomeHeader';
import { BalanceCard } from '../../components/home/BalanceCard';
import { SpotlightCard } from '../../components/home/SpotlightCard';
import { TopGainers } from '../../components/home/TopGainers';
import { TrendingList } from '../../components/home/TrendingList';
import { Divider, SectionHeader } from '../../components/ui/SectionHeader';
import { BottomFade } from '../../components/ui/BottomFade';
import { CoinDrawer } from '../../components/coin/CoinDrawer';
import { SpotlightIcon, TopGainersIcon, TrendingIcon } from '../../components/icons';
import { useHomeData } from '../../hooks/useHomeData';
import { Coin } from '../../services/types';
import { colors } from '../../theme/colors';
import { GUTTER, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { data, loading, error, refreshing, refresh, retry } = useHomeData();

  // The drawer swipes through whichever list it was opened from, so opening it
  // carries that list along rather than reaching back into `data`.
  const [drawer, setDrawer] = useState<{ coins: Coin[]; index: number } | null>(null);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.md }]}>
      <HomeHeader />
      <Divider />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      >
        {loading ? <Loading /> : null}
        {error ? <ErrorState message={error.message} onRetry={retry} /> : null}

        {data ? (
          <>
            <BalanceCard balance={data.totalBalance} />

            <View style={styles.section}>
              <SectionHeader icon={<SpotlightIcon size={26} />} title="Spotlight" />
              <SpotlightCard
                item={data.spotlight}
                onPress={() => setDrawer({ coins: [data.spotlight.coin], index: 0 })}
              />
            </View>

            <View style={styles.section}>
              <SectionHeader icon={<TopGainersIcon size={26} />} title="Top Gainers" />
              <TopGainers
                coins={data.topGainers}
                onSelect={(index) => setDrawer({ coins: data.topGainers, index })}
              />
            </View>

            <View style={styles.section}>
              <SectionHeader icon={<TrendingIcon size={26} />} title="Trending" />
              <TrendingList
                coins={data.trending}
                onSelect={(index) => setDrawer({ coins: data.trending, index })}
              />
            </View>
          </>
        ) : null}
      </ScrollView>

      <BottomFade />

      <CoinDrawer
        coins={drawer?.coins ?? []}
        index={drawer?.index ?? null}
        onClose={() => setDrawer(null)}
        // The dedicated token page isn't built yet; the affordance is here so the
        // drawer's layout is settled for when it is.
        onOpenDetail={() => {}}
      />
    </View>
  );
}

function Loading() {
  return (
    <View style={styles.stateBox}>
      <ActivityIndicator color={colors.accent} />
    </View>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.stateBox}>
      <Text style={[typography.label, styles.errorText]}>{message}</Text>
      <Pressable onPress={onRetry} accessibilityRole="button" style={styles.retry}>
        <Text style={[typography.label, styles.retryText]}>Retry</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingBottom: spacing['3xl'],
  },
  section: {
    gap: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing['2xl'],
  },
  stateBox: {
    paddingVertical: spacing['3xl'],
    alignItems: 'center',
    gap: spacing.lg,
  },
  errorText: {
    color: colors.textMuted,
  },
  retry: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  retryText: {
    color: colors.accent,
    fontWeight: '500',
  },
});
