import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { DriverDashboardScreen } from '@/driver/dashboard/DriverDashboardScreen';
import { PassengerDashboardScreen } from '@/passenger/dashboard/PassengerDashboardScreen';
import {
  BusFrontIcon,
  NavArrowIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
} from '@/passenger/icons/PassengerIcons';

export default function AppLandingPage() {
  const insets = useSafeAreaInsets();
  // State to switch between Landing Page, Driver Dashboard, and Passenger Dashboard
  const [activeRole, setActiveRole] = useState<'landing' | 'driver' | 'passenger'>('landing');

  // If user selected Driver Dashboard
  if (activeRole === 'driver') {
    return (
      <DriverDashboardScreen
        onSwitchRole={() => setActiveRole('landing')}
        onNavigatePassenger={() => setActiveRole('passenger')}
      />
    );
  }

  // If user selected Passenger Dashboard
  if (activeRole === 'passenger') {
    return (
      <PassengerDashboardScreen
        onSwitchRole={() => setActiveRole('landing')}
        onNavigateDriver={() => setActiveRole('driver')}
      />
    );
  }

  // Default: Project Landing Page with 2 Buttons (Driver Dashboard & Passenger Dashboard)
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingTop: insets.top > 0 ? insets.top + 16 : 28,
            paddingBottom: insets.bottom > 0 ? insets.bottom + 24 : 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================== */}
        {/* 1. BRAND HEADER & PROVINCIAL BADGE                        */}
        {/* ========================================================== */}
        <View style={styles.brandHeader}>
          <View style={styles.logoRow}>
            <View style={styles.logoSquircle}>
              <BusFrontIcon size={26} color="#FFFFFF" strokeWidth={2.2} />
            </View>
            <View style={styles.brandTitleCol}>
              <View style={styles.titleWithBadge}>
                <Text style={styles.appName}>SmartTransit</Text>
                <View style={styles.kpBadge}>
                  <Text style={styles.kpBadgeText}>KP</Text>
                </View>
              </View>
              <Text style={styles.tagline}>
                SafeTrack Provincial Transit System
              </Text>
            </View>
          </View>

          <View style={styles.statusChip}>
            <View style={styles.pulseDot} />
            <Text style={styles.statusChipText}>
              PESHAWAR &bull; MARDAN NETWORK ACTIVE
            </Text>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 2. INVITATION / SELECT DASHBOARD PROMPT                   */}
        {/* ========================================================== */}
        <View style={styles.introBlock}>
          <Text style={styles.headline}>Select Your Dashboard</Text>
          <Text style={styles.subheadline}>
            Choose your operating mode to open the corresponding transit interface:
          </Text>
        </View>

        {/* ========================================================== */}
        {/* 3. BUTTON CARD 1: DRIVER DASHBOARD                        */}
        {/* ========================================================== */}
        <TouchableOpacity
          style={styles.roleCard}
          activeOpacity={0.88}
          onPress={() => setActiveRole('driver')}
          accessibilityRole="button"
          accessibilityLabel="Open Driver Dashboard"
        >
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconBoxGreen}>
              <BusFrontIcon size={24} color="#FFFFFF" strokeWidth={2.2} />
            </View>
            <View style={styles.terminalBadge}>
              <Text style={styles.terminalBadgeText}>CAPTAIN TERMINAL</Text>
            </View>
          </View>

          <Text style={styles.cardTitle}>Driver Dashboard</Text>
          <Text style={styles.cardDesc}>
            For transit captains, bus pilots &amp; crew members operating on
            provincial highway corridors.
          </Text>

          {/* Key Capabilities */}
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>
                Active Shift &amp; GT Highway Route N-5 Navigation
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>
                Live Commuter Hail Requests &amp; Auto-Balancing
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>
                In-Cabin DMS AI Safety Shield &amp; 1122 Fast Dispatch
              </Text>
            </View>
          </View>

          {/* Primary Action Button */}
          <View style={styles.primaryActionButton}>
            <Text style={styles.actionButtonText}>Open Driver Dashboard</Text>
            <ArrowRightIcon size={16} color="#FFFFFF" strokeWidth={2.4} />
          </View>
        </TouchableOpacity>

        {/* ========================================================== */}
        {/* 4. BUTTON CARD 2: PASSENGER DASHBOARD                     */}
        {/* ========================================================== */}
        <TouchableOpacity
          style={styles.roleCard}
          activeOpacity={0.88}
          onPress={() => setActiveRole('passenger')}
          accessibilityRole="button"
          accessibilityLabel="Open Passenger Dashboard"
        >
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconBoxGreen}>
              <NavArrowIcon size={22} color="#FFFFFF" strokeWidth={2.4} />
            </View>
            <View style={styles.commuterBadge}>
              <Text style={styles.commuterBadgeText}>COMMUTER PORTAL</Text>
            </View>
          </View>

          <Text style={styles.cardTitle}>Passenger Dashboard</Text>
          <Text style={styles.cardDesc}>
            For daily commuters &amp; citizens traveling across Peshawar,
            Nowshera, and Mardan.
          </Text>

          {/* Key Capabilities */}
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>
                Nearby Pickup Zone Selection (Saddar Road, etc.)
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>
                Live RTK-GPS Bus Radar &amp; Seat Availability (17 Free)
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>
                Instant Pickup Hail &amp; SafeTrack Emergency Guard
              </Text>
            </View>
          </View>

          {/* Primary Action Button */}
          <View style={styles.primaryActionButton}>
            <Text style={styles.actionButtonText}>Open Passenger Dashboard</Text>
            <ArrowRightIcon size={16} color="#FFFFFF" strokeWidth={2.4} />
          </View>
        </TouchableOpacity>

        {/* ========================================================== */}
        {/* 5. FOOTER / GOVERNMENT SEAL & TELEMETRY HEALTH            */}
        {/* ========================================================== */}
        <View style={styles.footerBlock}>
          <View style={styles.shieldRow}>
            <ShieldCheckIcon size={15} color="#064E3B" strokeWidth={2.4} />
            <Text style={styles.footerText}>
              Government of Khyber Pakhtunkhwa &bull; Transport Dept
            </Text>
          </View>
          <Text style={styles.footerSub}>
            SafeTrack Intelligent Transit Infrastructure v2.4
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollArea: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },

  /* --- 1. Brand Header --- */
  brandHeader: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      },
    }),
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoSquircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#064E3B', // Signature dark forest green
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitleCol: {
    flex: 1,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  kpBadge: {
    backgroundColor: '#064E3B',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  kpBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusChipText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#064E3B',
    letterSpacing: 0.4,
  },

  /* --- 2. Intro Block --- */
  introBlock: {
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  headline: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  subheadline: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 18,
  },

  /* --- 3 & 4. Role Cards --- */
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 3px 12px rgba(0,0,0,0.05)',
      },
    }),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconBoxGreen: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  terminalBadge: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  terminalBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#15803D',
    letterSpacing: 0.4,
  },
  commuterBadge: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  commuterBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#2563EB',
    letterSpacing: 0.4,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 12,
  },
  featuresList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#064E3B',
  },
  featureText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#064E3B', // Matching app primary button color
    paddingVertical: 13,
    borderRadius: 12,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#064E3B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 8px rgba(6,78,59,0.25)',
      },
    }),
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  /* --- 5. Footer --- */
  footerBlock: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  shieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  footerSub: {
    fontSize: 9.5,
    color: '#94A3B8',
    marginTop: 2,
  },
});
