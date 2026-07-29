import React from 'react';
import { Tabs } from 'expo-router';
import { HoldingsIcon, HomeIcon, RewardsIcon } from '../../components/icons';
import { colors } from '../../theme/colors';
import { CARD_BORDER_WIDTH, innerGlow, TAB_BAR_HEIGHT } from '../../theme/effects';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        sceneStyle: { backgroundColor: colors.bg },
        // Figma: 402 x 87.88, fill #050410, 0.93px top-side border at 10% white,
        // lit by two inset glows. The spec also lists a 109.1 background blur,
        // which has no effect behind an opaque fill — see theme/effects.ts.
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.cardBorder,
          borderTopWidth: CARD_BORDER_WIDTH,
          height: TAB_BAR_HEIGHT,
          paddingTop: 10,
          paddingBottom: 12,
          boxShadow: innerGlow.tabBar,
          elevation: 0,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <HomeIcon size={24} color={color} opacity={focused ? 1 : 0.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ color, focused }) => (
            <RewardsIcon size={24} color={color} opacity={focused ? 1 : 0.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="holdings"
        options={{
          title: 'Holdings',
          tabBarIcon: ({ color, focused }) => (
            <HoldingsIcon size={24} color={color} opacity={focused ? 1 : 0.5} />
          ),
        }}
      />
    </Tabs>
  );
}
