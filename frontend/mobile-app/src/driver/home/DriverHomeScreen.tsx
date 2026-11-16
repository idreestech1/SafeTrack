import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DriverHeader } from '../header/DriverHeader';
import { DriverTabKey } from '../bottom_tabs/DriverBottomTabs';
import {
  BusFrontIcon,
  PowerIcon,
  PlayCircleIcon,
  ObdGaugeIcon,
  UsersIcon,
  RouteDistanceIcon,
  TargetBullseyeIcon,
  MapPinIcon,
  HandHailIcon,
  ReceiptHistoryIcon,
  RefreshClockIcon,
  AsteriskIcon,
  PhoneCallIcon,
  CheckCircleIcon,
  TripsIcon,
} from '../icons/DriverIcons';

export interface DriverHomeScreenProps {
  showHeader?: boolean;
  onNavigateTab?: (tab: DriverTabKey) => void;
  onSosPress?: () => void;
}

export const DriverHomeScreen: React.FC<DriverHomeScreenProps> = ({
  showHeader = true,
  onNavigateTab,
  onSosPress,
}) => {
  const insets = useSafeAreaInsets();
  const [isOnline, setIsOnline] = useState(true);
  const [tripStarted, setTripStarted] = useState(false);

  const toggleOnline = () => {
    const next = !isOnline;
    setIsOnline(next);
    Alert.alert(
      next ? 'Shift Active' : 'Shift Paused',
      next
        ? 'You are now Online and accepting route assignments on Corridor RT-01.'
        : 'You are now Offline. Terminal dispatch has paused automatic hails.'
    );
  };

  const handleStartTrip = () => {
    if (tripStarted) {
      Alert.alert(
        'Route In Progress',
        'Bus PK-102 is currently transmitting telemetry along N-5 Expressway Corridor.',
        [
          { text: 'Continue Route', style: 'cancel' },
          {
            text: 'Finish Route Headway',
            style: 'destructive',
            onPress: () => setTripStarted(false),
          },
        ]
      );
    } else {
      setTripStarted(true);
      Alert.alert(
        '🚀 Route Trip Started',
        'Departure confirmed from Peshawar General Bus Stand. GPS tracking active for Mardan Central Terminal (58.4 km).'
      );
    }
  };

  const handleEmergencySos = () => {
    if (onSosPress) {
      onSosPress();
      return;
    }
    Alert.alert(
      '🚨 EMERGENCY SOS DISPATCH',
      'Instant silent panic alert with live telemetry sent to KPK Highway Police, 1122 Rescue, and Central Dispatch.',
      [{ text: 'Dismiss (Accidental)', style: 'cancel' }, { text: 'Confirm Distress', style: 'destructive' }]
    );
  };

  return (
    <View style={styles.screenWrapper}>
      {/* Top Header if rendered standalone */}
      {showHeader && <DriverHeader />}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingBottom: showHeader ? Math.max(insets.bottom, 24) + 80 : 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================== */}
        {/* 1. TOP STATUS & VEHICLE ASSIGNMENT CARD                    */}
        {/* ========================================================== */}
        <View style={styles.topStatusCard}>
          {/* Online status indicator & toggle button */}
          <View style={styles.onlineStatusRow}>
            <View style={styles.onlineIndicatorGroup}>
              <View
                style={[
                  styles.onlineDot,
                  { backgroundColor: isOnline ? '#10B981' : '#94A3B8' },
                ]}
              />
              <Text style={styles.onlineIndicatorText}>
                {isOnline
                  ? 'You are Online • Ready for assignments'
                  : 'You are Offline • Shift Paused'}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.goOfflineBtn,
                { backgroundColor: isOnline ? '#86EFAC' : '#F1F5F9' },
              ]}
              onPress={toggleOnline}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={isOnline ? 'Go Offline' : 'Go Online'}
            >
              <PowerIcon
                size={13}
                color={isOnline ? '#064E3B' : '#475569'}
                strokeWidth={2.4}
              />
              <Text
                style={[
                  styles.goOfflineText,
                  { color: isOnline ? '#064E3B' : '#475569' },
                ]}
              >
                {isOnline ? 'Go Offline' : 'Go Online'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Subtle divider */}
          <View style={styles.cardDivider} />

          {/* Vehicle & Assigned Corridor Row */}
          <View style={styles.vehicleAssignmentRow}>
            {/* Green Bus Icon Badge */}
            <View style={styles.busBadgeBox}>
              <BusFrontIcon size={20} color="#FFFFFF" strokeWidth={2} />
            </View>

            {/* Vehicle Model & Availability */}
            <View style={styles.vehicleDetailsCol}>
              <View style={styles.vehicleTitleRow}>
                <Text style={styles.vehicleCode}>PK-102</Text>
                <View style={styles.availableBadge}>
                  <Text style={styles.availableBadgeText}>AVAILABLE</Text>
                </View>
              </View>
              <Text style={styles.vehicleSub}>Hino Metro AC • 45 Seater</Text>
            </View>

            {/* Assigned Corridor */}
            <View style={styles.corridorCol}>
              <Text style={styles.corridorKicker}>ASSIGNED CORRIDOR</Text>
              <Text style={styles.corridorName}>Peshawar ➔ Mardan</Text>
            </View>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 2. ACTIVE ASSIGNED ROUTE HERO CARD                         */}
        {/* ========================================================== */}
        <View style={styles.routeHeroCard}>
          {/* Top Badges Row */}
          <View style={styles.routeTopRow}>
            <View style={styles.routePillsLeft}>
              <View style={styles.routePillDark}>
                <Text style={styles.routePillDarkText}>ROUTE N-5</Text>
              </View>
              <View style={styles.readyStatusGroup}>
                <RefreshClockIcon size={13} color="#059669" strokeWidth={2} />
                <Text style={styles.readyStatusText}>
                  {tripStarted ? 'Route In Progress' : 'Ready to Start'}
                </Text>
              </View>
            </View>

            {/* Scheduled Time Box */}
            <View style={styles.scheduledBox}>
              <Text style={styles.scheduledLabel}>SCHEDULED</Text>
              <Text style={styles.scheduledTime}>08:30 AM</Text>
            </View>
          </View>

          {/* Route Title & Corridor */}
          <Text style={styles.routeHeading}>Peshawar Cantt ➔ Mardan Central</Text>
          <Text style={styles.routeSub}>
            Via Grand Trunk Road (N-5 Expressway Corridor)
          </Text>

          {/* Route Waypoint Path Bar */}
          <View style={styles.waypointBar}>
            <View style={styles.waypointOrigin}>
              <TargetBullseyeIcon size={14} color="#059669" strokeWidth={2} />
              <Text style={styles.waypointText} numberOfLines={1}>
                Peshawar General Bus Stand
              </Text>
            </View>

            <Text style={styles.waypointArrow}>➔</Text>

            <View style={styles.waypointDest}>
              <MapPinIcon size={13} color="#64748B" strokeWidth={2} />
              <Text style={styles.waypointText} numberOfLines={1}>
                Mardan Terminal
              </Text>
            </View>
          </View>

          {/* Primary Action Button */}
          <TouchableOpacity
            style={[
              styles.startTripButton,
              tripStarted && styles.startTripButtonActive,
            ]}
            onPress={handleStartTrip}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Start Route Trip Now"
          >
            <PlayCircleIcon size={17} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.startTripButtonText}>
              {tripStarted ? 'Active Trip in Progress • Tap to Complete' : 'Start Route Trip Now'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================== */}
        {/* 3. TODAY'S SHIFT PERFORMANCE                               */}
        {/* ========================================================== */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Today&apos;s Shift Performance</Text>
          <Text style={styles.liveSyncBadge}>LIVE SYNC</Text>
        </View>

        <View style={styles.statsRow}>
          {/* Card 1: Trips Done */}
          <View style={styles.statCard}>
            <View style={styles.statIconCircle}>
              <ObdGaugeIcon size={15} color="#059669" strokeWidth={2} />
            </View>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Trips Done</Text>
          </View>

          {/* Card 2: Commuters */}
          <View style={styles.statCard}>
            <View style={styles.statIconCircle}>
              <UsersIcon size={15} color="#059669" strokeWidth={2} />
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Commuters</Text>
          </View>

          {/* Card 3: Kilometers */}
          <View style={styles.statCard}>
            <View style={styles.statIconCircle}>
              <RouteDistanceIcon size={15} color="#059669" strokeWidth={2} />
            </View>
            <Text style={styles.statNumber}>86</Text>
            <Text style={styles.statLabel}>Kilometers</Text>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 4. QUICK TERMINAL ACTIONS (2x2 GRID)                       */}
        {/* ========================================================== */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Quick Terminal Actions</Text>
        </View>

        <View style={styles.actionsGrid}>
          {/* Row 1 */}
          <View style={styles.actionRow}>
            {/* My Vehicle */}
            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.75}
              onPress={() =>
                Alert.alert(
                  'My Vehicle PK-102',
                  'Hino Metro AC • KP-LE-4091\nOBD Diagnostics: 99.8% Healthy\nFuel Tank: 92% (Est. 280 km range)'
                )
              }
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#EFF6FF' }]}>
                <BusFrontIcon size={17} color="#2563EB" strokeWidth={2} />
              </View>
              <Text style={styles.actionTitle}>My Vehicle</Text>
              <Text style={styles.actionSub}>PK-102 • 92% Fuel Diagnostics</Text>
            </TouchableOpacity>

            {/* Route & Stops */}
            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.75}
              onPress={() =>
                Alert.alert(
                  'Route & Stops: RT-01',
                  '1. Peshawar Cantt Hub\n2. Chamkani Flyover\n3. Nowshera Interchange\n4. Risalpur Bypass\n5. Mardan Central Terminal'
                )
              }
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#F0FDF4' }]}>
                <TripsIcon size={17} color="#059669" strokeWidth={2} />
              </View>
              <Text style={styles.actionTitle}>Route &amp; Stops</Text>
              <Text style={styles.actionSub}>5 Provincial Stations Map</Text>
            </TouchableOpacity>
          </View>

          {/* Row 2 */}
          <View style={styles.actionRow}>
            {/* Passenger Hail */}
            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.75}
              onPress={() => onNavigateTab ? onNavigateTab('requests') : null}
            >
              <View style={styles.actionIconWithBadgeRow}>
                <View style={[styles.actionIconBox, { backgroundColor: '#EFF6FF' }]}>
                  <HandHailIcon size={17} color="#2563EB" strokeWidth={2} />
                </View>
                <View style={styles.actionBadgePill}>
                  <Text style={styles.actionBadgeText}>2 New</Text>
                </View>
              </View>
              <Text style={styles.actionTitle}>Passenger Hail</Text>
              <Text style={styles.actionSub}>2 Pending at Chamkani</Text>
            </TouchableOpacity>

            {/* Trip History */}
            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.75}
              onPress={() => onNavigateTab ? onNavigateTab('trips') : null}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#F8FAFC' }]}>
                <ReceiptHistoryIcon size={17} color="#475569" strokeWidth={2} />
              </View>
              <Text style={styles.actionTitle}>Trip History</Text>
              <Text style={styles.actionSub}>Review logs &amp; fare audit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 5. PROVINCIAL TRANSIT SAFETY GUARD (DISTRESS CARD)         */}
        {/* ========================================================== */}
        <View style={styles.safetyGuardCard}>
          <View style={styles.safetyGuardHeader}>
            <View style={styles.safetyIconCircle}>
              <AsteriskIcon size={18} color="#FFFFFF" strokeWidth={2.4} />
            </View>
            <View style={styles.safetyGuardTitleCol}>
              <Text style={styles.safetyGuardHeading}>
                Provincial Transit Safety Guard
              </Text>
              <Text style={styles.safetyGuardSub}>
                Instant hotline: KPK Highway Police • 1122 • RT Authority
              </Text>
            </View>
          </View>

          {/* Emergency SOS Dispatch Button */}
          <TouchableOpacity
            style={styles.safetyDispatchBtn}
            activeOpacity={0.85}
            onPress={handleEmergencySos}
            accessibilityRole="button"
            accessibilityLabel="Emergency SOS Dispatch"
          >
            <PhoneCallIcon size={15} color="#FFFFFF" strokeWidth={2.2} />
            <Text style={styles.safetyDispatchText}>
              EMERGENCY SOS DISPATCH
            </Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================== */}
        {/* 6. RECENT ACTIVITY LOGS                                    */}
        {/* ========================================================== */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Activity Logs</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onNavigateTab ? onNavigateTab('trips') : null}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityCard}>
          {/* Item 1 */}
          <View style={styles.activityItem}>
            <View style={[styles.activityDotBox, { backgroundColor: '#4ADE80' }]}>
              <CheckCircleIcon size={14} color="#FFFFFF" strokeWidth={2.6} />
            </View>
            <View style={styles.activityTextCol}>
              <Text style={styles.activityTitle}>
                Trip #TR-2083 completed at Mardan Terminal
              </Text>
              <Text style={styles.activityMeta}>
                32m ago • 41 Passengers onboarded
              </Text>
            </View>
          </View>

          <View style={styles.activityDivider} />

          {/* Item 2 */}
          <View style={styles.activityItem}>
            <View style={[styles.activityDotBox, { backgroundColor: '#EEF2FF' }]}>
              <MapPinIcon size={13} color="#4F46E5" strokeWidth={2.2} />
            </View>
            <View style={styles.activityTextCol}>
              <Text style={styles.activityTitle}>
                Hail request accepted near Chamkani Interchange
              </Text>
              <Text style={styles.activityMeta}>
                1h 12m ago • Reserved seat #14
              </Text>
            </View>
          </View>

          <View style={styles.activityDivider} />

          {/* Item 3 */}
          <View style={styles.activityItem}>
            <View style={[styles.activityDotBox, { backgroundColor: '#EEF2FF' }]}>
              <BusFrontIcon size={13} color="#4F46E5" strokeWidth={2} />
            </View>
            <View style={styles.activityTextCol}>
              <Text style={styles.activityTitle}>
                Vehicle PK-102 marked 100% full occupancy
              </Text>
              <Text style={styles.activityMeta}>
                2h ago • Peshawar Cantt Hub
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ========================================================== */}
      {/* 7. FLOATING ACTION BUTTON: SOS ALERT                       */}
      {/* ========================================================== */}
      <TouchableOpacity
        style={[
          styles.floatingSosButton,
          {
            bottom: showHeader ? Math.max(insets.bottom, 12) + 72 : 16,
          },
        ]}
        activeOpacity={0.85}
        onPress={handleEmergencySos}
        accessibilityRole="button"
        accessibilityLabel="Emergency SOS Alert Quick Dispatch"
      >
        <MapPinIcon size={16} color="#FFFFFF" strokeWidth={2.4} />
        <Text style={styles.floatingSosText}>SOS ALERT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#FAFCFE',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 14,
    paddingTop: 12,
  },

  /* --- 1. Top Status & Vehicle Assignment Card --- */
  topStatusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  onlineStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  onlineIndicatorGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  onlineIndicatorText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    flexShrink: 1,
  },
  goOfflineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  goOfflineText: {
    fontSize: 11,
    fontWeight: '800',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  vehicleAssignmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  busBadgeBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#064E3B', // Forest green
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleDetailsCol: {
    flex: 1,
  },
  vehicleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vehicleCode: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  availableBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  availableBadgeText: {
    color: '#15803D',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  vehicleSub: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  corridorCol: {
    alignItems: 'flex-end',
  },
  corridorKicker: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  corridorName: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#047857',
    marginTop: 2,
  },

  /* --- 2. Active Assigned Route Hero Card --- */
  routeHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#064E3B',
    borderWidth: 1,
    borderTopColor: '#E2E8F0',
    borderRightColor: '#E2E8F0',
    borderBottomColor: '#E2E8F0',
    padding: 14,
    marginBottom: 14,
  },
  routeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  routePillsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routePillDark: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
  },
  routePillDarkText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  readyStatusGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readyStatusText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '700',
  },
  scheduledBox: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'flex-end',
  },
  scheduledLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  scheduledTime: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1E293B',
  },
  routeHeading: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 21,
  },
  routeSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  waypointBar: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  waypointOrigin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  waypointDest: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
    justifyContent: 'flex-end',
  },
  waypointText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0F172A',
    flexShrink: 1,
  },
  waypointArrow: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    marginHorizontal: 6,
  },
  startTripButton: {
    backgroundColor: '#064E3B',
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startTripButtonActive: {
    backgroundColor: '#047857',
  },
  startTripButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.2,
  },

  /* --- Section Common Headers --- */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 9,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  liveSyncBadge: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.5,
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },

  /* --- 3. Today's Shift Performance --- */
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 26,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },

  /* --- 4. Quick Terminal Actions (2x2 Grid) --- */
  actionsGrid: {
    gap: 8,
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconWithBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionBadgePill: {
    backgroundColor: '#DC2626',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
  },
  actionBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  actionTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
  },
  actionSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },

  /* --- 5. Provincial Transit Safety Guard (Distress Card) --- */
  safetyGuardCard: {
    backgroundColor: '#FFF1F0', // Soft coral peach
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginBottom: 14,
  },
  safetyGuardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  safetyIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#991B1B', // Crimson
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyGuardTitleCol: {
    flex: 1,
  },
  safetyGuardHeading: {
    fontSize: 13,
    fontWeight: '900',
    color: '#7F1D1D',
  },
  safetyGuardSub: {
    fontSize: 9.5,
    color: '#991B1B',
    marginTop: 2,
    fontWeight: '500',
  },
  safetyDispatchBtn: {
    backgroundColor: '#991B1B',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 12,
  },
  safetyDispatchText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.3,
  },

  /* --- 6. Recent Activity Logs --- */
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  activityDotBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTextCol: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 16,
  },
  activityMeta: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
    fontWeight: '500',
  },
  activityDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 9,
  },

  /* --- 7. Floating Action Button: SOS ALERT --- */
  floatingSosButton: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#991B1B', // Rich deep crimson red
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    gap: 7,
    zIndex: 99,
    ...Platform.select({
      ios: {
        shadowColor: '#991B1B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 4px 14px rgba(153, 27, 27, 0.4)',
      },
    }),
  },
  floatingSosText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
});

export default DriverHomeScreen;

