import React from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeHeader } from '../../components/home/HomeHeader';
import { BalanceCard } from '../../components/home/BalanceCard';
import { SpotlightCard } from '../../components/home/SpotlightCard';
import { TopGainers } from '../../components/home/TopGainers';
import { TrendingList } from '../../components/home/TrendingList';
import { Divider, SectionHeader } from '../../components/ui/SectionHeader';
import { SpotlightIcon, TopGainersIcon, TrendingIcon } from '../../components/icons';
import { useHomeData } from '../../hooks/useHomeData';
import { colors } from '../../theme/colors';
import { GUTTER, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { data, loading, error, refreshing, refresh, retry } = useHomeData();

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
              <SpotlightCard item={data.spotlight} />
            </View>

            <View style={styles.section}>
              <SectionHeader icon={<TopGainersIcon size={26} />} title="Top Gainers" />
              <TopGainers coins={data.topGainers} />
            </View>

            <View style={styles.section}>
              <SectionHeader icon={<TrendingIcon size={26} />} title="Trending" />
              <TrendingList coins={data.trending} />
            </View>
          </>
        ) : null}
      </ScrollView>
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
