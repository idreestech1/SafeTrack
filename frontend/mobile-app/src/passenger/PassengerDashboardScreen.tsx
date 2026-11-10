import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { PassengerHeader } from './PassengerHeader';
import { PassengerBottomTabs, PassengerTabKey } from './PassengerBottomTabs';
import { PassengerExploreScreen } from './PassengerExploreScreen';
import { PassengerHomeScreen } from './PassengerHomeScreen';
import { PassengerTripsScreen } from './PassengerTripsScreen';
import { PassengerSafetyScreen } from './PassengerSafetyScreen';
import { PassengerSettingsScreen } from './PassengerSettingsScreen';
import { PassengerProfileScreen } from './PassengerProfileScreen';

export interface PassengerDashboardScreenProps {
  onSwitchRole?: () => void;
  onNavigateDriver?: () => void;
}

export const PassengerDashboardScreen: React.FC<PassengerDashboardScreenProps> = ({
  onSwitchRole,
}) => {
  const [activeTab, setActiveTab] = useState<PassengerTabKey>('home');

  const handleProfilePress = () => {
    setActiveTab('profile');
  };

  const handleBackPress = () => {
    if (activeTab === 'profile') {
      setActiveTab('settings');
    } else if (activeTab === 'settings' || activeTab === 'trips' || activeTab === 'safety') {
      setActiveTab('home');
    } else if (onSwitchRole) {
      onSwitchRole();
    }
  };

  const handleSosEmergency = () => {
    Alert.alert(
      '🚨 EMERGENCY SOS DISPATCH',
      'Connecting to KPK Police Control Room (15) and Rescue 1122 with your live coordinates at Saddar Road.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Broadcast SOS', style: 'destructive' },
      ]
    );
  };

  // Header Title changes with tab for trips, safety, settings, and profile
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'Live Bus Tracker';
      case 'explore':
        return 'Explore Transit';
      case 'trips':
        return 'Live Bus Tracker'; // Matches exact header from user mockup
      case 'safety':
        return 'Live Bus Tracker'; // Matches exact header from user mockup
      case 'settings':
        return 'Commuter Settings';
      case 'profile':
        return 'Commuter Profile'; // Matches exact header from user mockup
      default:
        return 'Live Bus Tracker';
    }
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBar style="dark" />

      {/* --- Exact Passenger Header matching screenshot (rendered on Trips, Safety, Settings, Profile) --- */}
      {activeTab !== 'home' && activeTab !== 'explore' && (
        <PassengerHeader
          title={getHeaderTitle()}
          onBackPress={handleBackPress}
          onProfilePress={handleProfilePress}
        />
      )}

      {/* Main Tab Body */}
      <View style={styles.tabViewContainer}>
        {/* ========================================================== */}
        {/* TAB 1: HOME (Plan Journey, Approaching Bus, Radar & Grid)  */}
        {/* ========================================================== */}
        {activeTab === 'home' && (
          <PassengerHomeScreen
            onTrackLive={() => setActiveTab('explore')}
            onExpandMap={() => setActiveTab('explore')}
            onActiveTripPress={() => setActiveTab('trips')}
            onProfilePress={handleProfilePress}
            onSwitchRole={onSwitchRole}
          />
        )}

        {/* ========================================================== */}
        {/* TAB 2: EXPLORE (Interactive Vector Map & Transit Sheet)     */}
        {/* ========================================================== */}
        {activeTab === 'explore' && (
          <PassengerExploreScreen
            onBackPress={() => setActiveTab('home')}
            onRequestHailSuccess={() => setActiveTab('trips')}
          />
        )}

        {/* ========================================================== */}
        {/* TAB 3: MY TRIPS (Dispatch Review & Route Summary)          */}
        {/* ========================================================== */}
        {activeTab === 'trips' && (
          <PassengerTripsScreen
            onCancelReselect={() => setActiveTab('explore')}
            onConfirmSuccess={() => setActiveTab('safety')}
            onExplorePress={() => setActiveTab('explore')}
          />
        )}

        {/* ========================================================== */}
        {/* TAB 4: SAFETY (Live Approach, Safety & Emergency Relay)    */}
        {/* ========================================================== */}
        {activeTab === 'safety' && (
          <PassengerSafetyScreen
            onCancelPickup={() => setActiveTab('explore')}
            onExplorePress={() => setActiveTab('explore')}
            onSosPress={handleSosEmergency}
          />
        )}

        {/* ========================================================== */}
        {/* TAB 5: SETTINGS (Full Dedicated Passenger Settings Panel)   */}
        {/* ========================================================== */}
        {activeTab === 'settings' && (
          <PassengerSettingsScreen
            onOpenProfile={handleProfilePress}
            onSwitchRole={onSwitchRole}
            onSosPress={handleSosEmergency}
          />
        )}

        {/* ========================================================== */}
        {/* COMMUTER PROFILE DOSSIER SCREEN (Opened via Top-Right Avatar)*/}
        {/* ========================================================== */}
        {activeTab === 'profile' && (
          <PassengerProfileScreen
            onBackPress={handleBackPress}
            onOpenSettings={() => setActiveTab('settings')}
            onSwitchRole={onSwitchRole}
          />
        )}
      </View>

      {/* --- Pixel-Perfect Passenger Bottom Tabs matching design mockup --- */}
      <PassengerBottomTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tripsNotificationDot={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  tabViewContainer: {
    flex: 1,
  },
});

export default PassengerDashboardScreen;
