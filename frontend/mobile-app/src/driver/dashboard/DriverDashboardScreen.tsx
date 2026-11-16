import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DriverHeader } from '../header/DriverHeader';
import { DriverBottomTabs, DriverTabKey } from '../bottom_tabs/DriverBottomTabs';
import { DriverHomeScreen } from '../home/DriverHomeScreen';
import { DriverRequestsScreen } from '../requests/DriverRequestsScreen';
import { DriverTripsScreen } from '../trips/DriverTripsScreen';
import { DriverSafetyScreen } from '../safety/DriverSafetyScreen';
import { DriverSettingsScreen } from '../settings/DriverSettingsScreen';
import { DriverProfileScreen } from '../profile/DriverProfileScreen';

export interface DriverDashboardScreenProps {
  onSwitchRole?: () => void;
  onNavigatePassenger?: () => void;
}

export const DriverDashboardScreen: React.FC<DriverDashboardScreenProps> = ({
  onSwitchRole,
  onNavigatePassenger,
}) => {
  const [activeTab, setActiveTab] = useState<DriverTabKey>('home');
  const [isOnline] = useState(true);

  return (
    <View style={styles.safeContainer}>
      <StatusBar style="dark" />

      {/* --- Exact SmartTransit KP Driver Header matching screenshot --- */}
      <DriverHeader
        appName="SmartTransit"
        regionBadge="KP"
        dutyStatus={isOnline ? 'ACTIVE DUTY' : 'OFFLINE'}
        city="PESHAWAR"
        isOnline={isOnline}
        onLogoPress={() => setActiveTab('home')}
        onProfilePress={() => setActiveTab('profile')}
      />

      {/* Quick Role Switcher Banner */}
      {(onSwitchRole || onNavigatePassenger) && (
        <View style={styles.roleBannerRow}>
          <View style={styles.roleActivePill}>
            <View style={styles.dotGreen} />
            <Text style={styles.roleActiveText}>Driver Mode (Crew)</Text>
          </View>

          <View style={styles.roleSwitchActions}>
            {onNavigatePassenger && (
              <TouchableOpacity
                style={styles.switchButton}
                onPress={onNavigatePassenger}
                activeOpacity={0.8}
              >
                <Text style={styles.switchButtonText}>Passenger Mode</Text>
              </TouchableOpacity>
            )}
            {onSwitchRole && (
              <TouchableOpacity
                style={styles.portalButton}
                onPress={onSwitchRole}
                activeOpacity={0.8}
              >
                <Text style={styles.portalButtonText}>Switch Role</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Dynamic Tab Body */}
      {activeTab === 'home' && (
        <View style={styles.tabViewContainer}>
          <DriverHomeScreen
            showHeader={false}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSosPress={() => setActiveTab('safety')}
          />
        </View>
      )}

      {activeTab === 'trips' && (
        <View style={styles.tabViewContainer}>
          <DriverTripsScreen
            showHeader={false}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSosPress={() => setActiveTab('safety')}
          />
        </View>
      )}

      {activeTab === 'requests' && (
        <View style={styles.tabViewContainer}>
          <DriverRequestsScreen
            showHeader={false}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSosPress={() => setActiveTab('safety')}
          />
        </View>
      )}

      {activeTab === 'safety' && (
        <View style={styles.tabViewContainer}>
          <DriverSafetyScreen showHeader={false} />
        </View>
      )}

      {activeTab === 'settings' && (
        <View style={styles.tabViewContainer}>
          <DriverSettingsScreen
            showHeader={false}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSosPress={() => setActiveTab('safety')}
          />
        </View>
      )}

      {activeTab === 'profile' && (
        <View style={styles.tabViewContainer}>
          <DriverProfileScreen
            showHeader={false}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSosPress={() => setActiveTab('safety')}
          />
        </View>
      )}

      {/* --- Pixel-Perfect Driver Bottom Tabs Menu matching the screenshot --- */}
      <DriverBottomTabs
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        requestsBadgeCount={4}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  tabViewContainer: {
    flex: 1,
  },
  /* --- Role Switcher Banner --- */
  roleBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginHorizontal: 14,
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  roleActivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  roleActiveText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#064E3B',
  },
  roleSwitchActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  switchButton: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 3.5,
    paddingHorizontal: 7,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  switchButtonText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#064E3B',
  },
  portalButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 3.5,
    paddingHorizontal: 7,
    borderRadius: 5,
  },
  portalButtonText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
});

export default DriverDashboardScreen;
