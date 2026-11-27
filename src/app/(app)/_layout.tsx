import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ComponentProps } from 'react';
import { ColorValue as RNColorValue } from 'react-native';

import { useColors } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

function tabIcon(name: IconName) {
  return function TabIcon({ color, size }: { focused: boolean; color: RNColorValue; size: number }) {
    return <Ionicons name={name} size={size} color={color as unknown as string} />;
  };
}

export default function AppLayout() {
  const colors = useColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tabIcon('home-outline') }} />
      <Tabs.Screen name="transactions" options={{ title: 'Transactions', tabBarIcon: tabIcon('swap-horizontal-outline') }} />
      <Tabs.Screen name="accounts" options={{ title: 'Accounts', tabBarIcon: tabIcon('wallet-outline') }} />
      <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: tabIcon('ellipsis-horizontal') }} />
    </Tabs>
  );
}