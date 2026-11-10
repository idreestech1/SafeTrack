import React from 'react';
import { useRouter } from 'expo-router';
import { PassengerDashboardScreen } from '@/passenger/PassengerDashboardScreen';

export default function PassengerDashboardRoute() {
  const router = useRouter();

  return (
    <PassengerDashboardScreen
      onSwitchRole={() => router.replace('/')}
      onNavigateDriver={() => router.replace('/driver')}
    />
  );
}
