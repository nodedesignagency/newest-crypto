import React from 'react';
import { Tabs } from 'expo-router';
import { HoldingsIcon, HomeIcon, RewardsIcon } from '../../components/icons';
import { colors } from '../../theme/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        sceneStyle: { backgroundColor: colors.bg },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 76,
          paddingTop: 10,
          paddingBottom: 12,
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
