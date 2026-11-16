import React from 'react';
import { Tabs } from 'expo-router';
import { DriverBottomTabs } from '@/driver/bottom_tabs/DriverBottomTabs';

export default function DriverTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <DriverBottomTabs {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Trips',
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Requests',
        }}
      />
      <Tabs.Screen
        name="safety"
        options={{
          title: 'Safety',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          href: null,
        }}
      />
    </Tabs>
  );
}

