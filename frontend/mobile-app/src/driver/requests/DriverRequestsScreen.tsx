import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DriverHeader } from '../header/DriverHeader';
import { DriverTabKey } from '../bottom_tabs/DriverBottomTabs';
import {
  SeatIcon,
  RobotDispatchIcon,
  MapPinIcon,
  TargetBullseyeIcon,
  DiamondTargetIcon,
  UserCheckIcon,
  CloseXIcon,
  SurgeTrendIcon,
  CheckCircleIcon,
  BusFrontIcon,
} from '../icons/DriverIcons';

export interface DriverRequestsScreenProps {
  showHeader?: boolean;
  onNavigateTab?: (tab: DriverTabKey) => void;
  onSosPress?: () => void;
}

type RequestCategory = 'incoming' | 'accepted' | 'history';

interface HailRequest {
  id: string;
  paxId: string;
  name: string;
  avatar: any;
  rating: number;
  seats: number;
  distance: string;
  eta: string;
  etaType: 'urgent' | 'standard';
  pickup: string;
  destination?: string;
  isUrgent?: boolean;
  expiresInSec?: number;
  isDirectWaypoint?: boolean;
  hasRadarMap?: boolean;
}

export const DriverRequestsScreen: React.FC<DriverRequestsScreenProps> = ({
  showHeader = true,
  onNavigateTab,
  onSosPress,
}) => {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState<RequestCategory>('incoming');
  const [acceptedIds, setAcceptedIds] = useState<string[]>([]);
  const [declinedIds, setDeclinedIds] = useState<string[]>([]);
  const [availableSeats, setAvailableSeats] = useState(17);

  const initialRequests: HailRequest[] = [
    {
      id: 'REQ-101',
      paxId: '#P-1024',
      name: 'Ahmad Khan',
      avatar: require('../../../assets/images/avatar-ahmad.png'),
      rating: 4.8,
      seats: 1,
      distance: '120m away',
      eta: 'ETA: 45s',
      etaType: 'urgent',
      pickup: 'University Road Opp. Islamia College, Peshawar',
      destination: 'Mardan Central Terminal (Intercity Stop)',
      isUrgent: true,
      expiresInSec: 17,
      hasRadarMap: true,
    },
    {
      id: 'REQ-102',
      paxId: '#P-1025',
      name: 'Sana Gul',
      avatar: require('../../../assets/images/avatar-sana.png'),
      rating: 5.0,
      seats: 1,
      distance: '350m away',
      eta: 'ETA: 2 mins',
      etaType: 'standard',
      pickup: 'Saddar Road Post Office Stop',
      isDirectWaypoint: true,
    },
  ];

  const handleAccept = (req: HailRequest) => {
    setAcceptedIds((prev) => [...prev, req.id]);
    setAvailableSeats((s) => Math.max(0, s - req.seats));
    Alert.alert(
      '✅ Passenger Request Accepted',
      `Hail confirmed for ${req.name} (${req.paxId}). Pickup location synchronized: ${req.pickup}. Headway navigation locked.`,
      [{ text: 'Navigate to Stop', style: 'default' }]
    );
  };

  const handleDecline = (req: HailRequest) => {
    Alert.alert(
      'Skip Passenger Hail',
      `Decline hail from ${req.name}? This request will be re-routed to the next bus on Corridor RT-01.`,
      [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            setDeclinedIds((prev) => [...prev, req.id]);
          },
        },
      ]
    );
  };

  const handleEmergencySos = () => {
    if (onSosPress) {
      onSosPress();
      return;
    }
    Alert.alert(
      '🚨 EMERGENCY SOS DISPATCH',
      'Distress signal dispatched to Police Control & 1122 Rescue.'
    );
  };

  const visibleRequests = initialRequests.filter(
    (r) => !declinedIds.includes(r.id)
  );

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
        {/* 1. PAGE TITLE & REMAINING CAPACITY BADGE                   */}
        {/* ========================================================== */}
        <View style={styles.titleRow}>
          <View style={styles.titleCol}>
            <Text style={styles.pageHeading}>Passenger Requests</Text>
            <Text style={styles.pageSub}>
              Nearby commuters requesting pickup along corridor
            </Text>
          </View>

          {/* Seat Capacity Pill */}
          <View style={styles.freeSeatsPill}>
            <SeatIcon size={13} color="#059669" strokeWidth={2.2} />
            <Text style={styles.freeSeatsText}>{availableSeats} free</Text>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 2. SMART DISPATCH AUTO-BALANCE BANNER                      */}
        {/* ========================================================== */}
        <View style={styles.smartDispatchBanner}>
          <View style={styles.robotIconBox}>
            <RobotDispatchIcon size={16} color="#059669" strokeWidth={2} />
          </View>
          <Text style={styles.smartDispatchText}>
            <Text style={styles.smartDispatchBold}>Smart Dispatch: </Text>
            Auto-balanced by remaining bus capacity (
            <Text style={styles.seatsAvailableHighlight}>
              {availableSeats} seats
            </Text>{' '}
            available).
          </Text>
        </View>

        {/* ========================================================== */}
        {/* 3. CATEGORY SEGMENTED CONTROL TABS                         */}
        {/* ========================================================== */}
        <View style={styles.segmentedContainer}>
          {/* Incoming Tab */}
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              activeCategory === 'incoming' && styles.segmentBtnActive,
            ]}
            onPress={() => setActiveCategory('incoming')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentText,
                activeCategory === 'incoming' && styles.segmentTextActive,
              ]}
            >
              Incoming
            </Text>
            <View
              style={[
                styles.badgeCounter,
                activeCategory === 'incoming'
                  ? styles.badgeCounterActive
                  : styles.badgeCounterInactive,
              ]}
            >
              <Text
                style={[
                  styles.badgeCounterText,
                  activeCategory === 'incoming' && styles.badgeCounterTextActive,
                ]}
              >
                {visibleRequests.length}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Accepted Tab */}
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              activeCategory === 'accepted' && styles.segmentBtnActive,
            ]}
            onPress={() => setActiveCategory('accepted')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentText,
                activeCategory === 'accepted' && styles.segmentTextActive,
              ]}
            >
              Accepted
            </Text>
            <View
              style={[
                styles.badgeCounter,
                activeCategory === 'accepted'
                  ? styles.badgeCounterActive
                  : styles.badgeCounterInactive,
              ]}
            >
              <Text
                style={[
                  styles.badgeCounterText,
                  activeCategory === 'accepted' && styles.badgeCounterTextActive,
                ]}
              >
                {acceptedIds.length > 0 ? acceptedIds.length : 1}
              </Text>
            </View>
          </TouchableOpacity>

          {/* History Tab */}
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              activeCategory === 'history' && styles.segmentBtnActive,
            ]}
            onPress={() => setActiveCategory('history')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentText,
                activeCategory === 'history' && styles.segmentTextActive,
              ]}
            >
              History
            </Text>
            <View
              style={[
                styles.badgeCounter,
                activeCategory === 'history'
                  ? styles.badgeCounterActive
                  : styles.badgeCounterInactive,
              ]}
            >
              <Text
                style={[
                  styles.badgeCounterText,
                  activeCategory === 'history' && styles.badgeCounterTextActive,
                ]}
              >
                18
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ========================================================== */}
        {/* 4. REQUESTS LIST OR ACCEPTED/HISTORY VIEWS                 */}
        {/* ========================================================== */}
        {activeCategory === 'incoming' && (
          <>
            {/* Card 1: Urgent Instant Hail (Ahmad Khan) */}
            {visibleRequests.some((r) => r.id === 'REQ-101') && (
              <View style={styles.requestCard}>
                {/* Urgent Header Row */}
                <View style={styles.urgentHeaderRow}>
                  <View style={styles.urgentTagGroup}>
                    <View style={styles.pulsingRedDot} />
                    <Text style={styles.urgentTagText}>URGENT INSTANT HAIL</Text>
                  </View>

                  <View style={styles.expiresPill}>
                    <Text style={styles.expiresText}>⏱ Expires in 17s</Text>
                  </View>
                </View>

                {/* Commuter Profile Row */}
                <View style={styles.profileRow}>
                  <View style={styles.avatarWrap}>
                    <Image
                      source={require('../../../assets/images/avatar-ahmad.png')}
                      style={styles.avatarImage}
                      resizeMode="cover"
                    />
                    <View style={styles.verifiedCheckBadge}>
                      <CheckCircleIcon size={12} color="#FFFFFF" strokeWidth={2.6} />
                    </View>
                  </View>

                  <View style={styles.profileDetailsCol}>
                    <View style={styles.nameRow}>
                      <Text style={styles.paxName}>Ahmad Khan</Text>
                      <View style={styles.paxIdBadge}>
                        <Text style={styles.paxIdText}>#P-1024</Text>
                      </View>
                    </View>

                    <View style={styles.paxMetaRow}>
                      <Text style={styles.paxStar}>★ 4.8</Text>
                      <Text style={styles.paxMetaDot}>•</Text>
                      <SeatIcon size={11} color="#059669" strokeWidth={2.2} />
                      <Text style={styles.paxSeatedText}>1 Seated</Text>
                    </View>
                  </View>

                  {/* Distance & ETA */}
                  <View style={styles.distanceEtaCol}>
                    <Text style={styles.distanceText}>
                      <Text style={styles.distanceBold}>120m </Text>
                      away
                    </Text>
                    <View style={styles.etaPillMint}>
                      <Text style={styles.etaTextMint}>ETA: 45s</Text>
                    </View>
                  </View>
                </View>

                {/* Pickup & Destination Waypoint Box */}
                <View style={styles.waypointsBox}>
                  {/* Pickup */}
                  <View style={styles.waypointStepRow}>
                    <View style={styles.waypointStepIcon}>
                      <TargetBullseyeIcon size={13} color="#059669" strokeWidth={2} />
                    </View>
                    <View style={styles.waypointStepTextCol}>
                      <Text style={styles.waypointStepKicker}>PICKUP LANDMARK</Text>
                      <Text style={styles.waypointStepValue}>
                        University Road Opp. Islamia College, Peshawar
                      </Text>
                    </View>
                  </View>

                  {/* Connecting Line */}
                  <View style={styles.waypointConnectorLine} />

                  {/* Destination */}
                  <View style={styles.waypointStepRow}>
                    <View style={styles.waypointStepIcon}>
                      <MapPinIcon size={13} color="#64748B" strokeWidth={2} />
                    </View>
                    <View style={styles.waypointStepTextCol}>
                      <Text style={styles.waypointStepKicker}>DESTINATION</Text>
                      <Text style={styles.waypointStepValue}>
                        Mardan Central Terminal (Intercity Stop)
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Live Radar Lock Map Viewport */}
                <View style={styles.radarViewportContainer}>
                  <Image
                    source={require('../../../assets/images/request-radar-map.png')}
                    style={styles.radarMapImage}
                    resizeMode="cover"
                  />

                  {/* Radar Lock Pill */}
                  <View style={styles.radarLockBadge}>
                    <View style={styles.radarDotGreen} />
                    <Text style={styles.radarLockText}>
                      RADAR LOCK • RTK-GPS
                    </Text>
                  </View>

                  {/* Bus Station Marker */}
                  <View style={styles.busRadarPin}>
                    <View style={styles.busRadarCircle}>
                      <BusFrontIcon size={14} color="#FFFFFF" strokeWidth={2} />
                    </View>
                    <View style={styles.busRadarLabelPill}>
                      <Text style={styles.busRadarLabelText}>PK-102</Text>
                    </View>
                  </View>

                  {/* Distance Line Bubble */}
                  <View style={styles.radarDistBubble}>
                    <Text style={styles.radarDistText}>120m</Text>
                  </View>

                  {/* Passenger Marker */}
                  <View style={styles.paxRadarPin}>
                    <View style={styles.paxRadarCircle}>
                      <MapPinIcon size={14} color="#FFFFFF" strokeWidth={2.4} />
                    </View>
                    <View style={styles.paxRadarLabelPill}>
                      <Text style={styles.paxRadarLabelText}>Ahmad K.</Text>
                    </View>
                  </View>
                </View>

                {/* Action Buttons Row */}
                <View style={styles.actionsBtnRow}>
                  <TouchableOpacity
                    style={styles.declineButton}
                    activeOpacity={0.8}
                    onPress={() => handleDecline(initialRequests[0])}
                  >
                    <CloseXIcon size={13} color="#475569" strokeWidth={2.4} />
                    <Text style={styles.declineButtonText}>Decline</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.acceptButton,
                      acceptedIds.includes('REQ-101') && styles.acceptButtonDone,
                    ]}
                    activeOpacity={0.85}
                    onPress={() => handleAccept(initialRequests[0])}
                  >
                    <UserCheckIcon size={16} color="#FFFFFF" strokeWidth={2.4} />
                    <Text style={styles.acceptButtonText}>
                      {acceptedIds.includes('REQ-101')
                        ? 'Accepted • En Route'
                        : 'Accept Request'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Card 2: Sana Gul */}
            {visibleRequests.some((r) => r.id === 'REQ-102') && (
              <View style={styles.requestCard}>
                {/* Profile Row */}
                <View style={styles.profileRow}>
                  <View style={styles.avatarWrap}>
                    <Image
                      source={require('../../../assets/images/avatar-sana.png')}
                      style={styles.avatarImage}
                      resizeMode="cover"
                    />
                    <View style={styles.verifiedCheckBadge}>
                      <CheckCircleIcon size={12} color="#FFFFFF" strokeWidth={2.6} />
                    </View>
                  </View>

                  <View style={styles.profileDetailsCol}>
                    <View style={styles.nameRow}>
                      <Text style={styles.paxName}>Sana Gul</Text>
                      <View style={styles.paxIdBadge}>
                        <Text style={styles.paxIdText}>#P-1025</Text>
                      </View>
                    </View>

                    <View style={styles.paxMetaRow}>
                      <Text style={styles.paxStar}>★ 5.0</Text>
                      <Text style={styles.paxMetaDot}>•</Text>
                      <SeatIcon size={11} color="#059669" strokeWidth={2.2} />
                      <Text style={styles.paxSeatedText}>1 Seated</Text>
                    </View>
                  </View>

                  {/* Distance & ETA */}
                  <View style={styles.distanceEtaCol}>
                    <Text style={styles.distanceText}>
                      <Text style={styles.distanceBold}>350m </Text>
                      away
                    </Text>
                    <View style={styles.etaPillLavender}>
                      <Text style={styles.etaTextLavender}>ETA: 2 mins</Text>
                    </View>
                  </View>
                </View>

                {/* Pickup Landmark Row with Direct Waypoint Pill */}
                <View style={styles.singleWaypointBox}>
                  <View style={styles.singleWaypointLeft}>
                    <DiamondTargetIcon size={14} color="#059669" strokeWidth={2} />
                    <View style={styles.singleWaypointTextCol}>
                      <Text style={styles.waypointStepKicker}>PICKUP LANDMARK</Text>
                      <Text style={styles.singleWaypointValue}>
                        Saddar Road Post Office Stop
                      </Text>
                    </View>
                  </View>

                  <View style={styles.directWaypointBadge}>
                    <Text style={styles.directWaypointText}>Direct Waypoint</Text>
                  </View>
                </View>

                {/* Action Buttons Row */}
                <View style={styles.actionsBtnRow}>
                  <TouchableOpacity
                    style={styles.declineButton}
                    activeOpacity={0.8}
                    onPress={() => handleDecline(initialRequests[1])}
                  >
                    <CloseXIcon size={13} color="#475569" strokeWidth={2.4} />
                    <Text style={styles.declineButtonText}>Decline</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.acceptButton,
                      acceptedIds.includes('REQ-102') && styles.acceptButtonDone,
                    ]}
                    activeOpacity={0.85}
                    onPress={() => handleAccept(initialRequests[1])}
                  >
                    <UserCheckIcon size={16} color="#FFFFFF" strokeWidth={2.4} />
                    <Text style={styles.acceptButtonText}>
                      {acceptedIds.includes('REQ-102')
                        ? 'Accepted • En Route'
                        : 'Accept Request'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* High Demand Zone Banner Card */}
            <View style={styles.highDemandCard}>
              <View style={styles.surgeIconBox}>
                <SurgeTrendIcon size={17} color="#2563EB" strokeWidth={2.2} />
              </View>
              <View style={styles.surgeTextCol}>
                <Text style={styles.surgeTitle}>High Demand Zone</Text>
                <Text style={styles.surgeSub}>
                  Charsadda Interchange • +4 queued calls
                </Text>
              </View>
              <View style={styles.corridorBadge}>
                <Text style={styles.corridorBadgeText}>Corridor</Text>
                <Text style={styles.corridorBadgeNum}>1</Text>
              </View>
            </View>
          </>
        )}

        {/* Accepted Tab View */}
        {activeCategory === 'accepted' && (
          <View style={styles.emptyTabCard}>
            <UserCheckIcon size={28} color="#059669" strokeWidth={2} />
            <Text style={styles.emptyTabTitle}>Accepted Active Passenger</Text>
            <Text style={styles.emptyTabDesc}>
              {acceptedIds.length > 0
                ? `${acceptedIds.length} passenger hail(s) confirmed and prioritized on current headway trip.`
                : 'Dr. Ayesha Durrani (#P-1022) seated at Peshawar Cantt Hub.'}
            </Text>
          </View>
        )}

        {/* History Tab View */}
        {activeCategory === 'history' && (
          <View style={styles.emptyTabCard}>
            <SeatIcon size={28} color="#64748B" strokeWidth={2} />
            <Text style={styles.emptyTabTitle}>18 Shift Hails Completed</Text>
            <Text style={styles.emptyTabDesc}>
              All passenger trips on Route RT-01 verified with electronic ticket issuance.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* ========================================================== */}
      {/* 5. FLOATING ACTION BUTTON: SOS ALERT                       */}
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

  /* --- 1. Page Title & Seats Badge --- */
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleCol: {
    flex: 1,
    marginRight: 8,
  },
  pageHeading: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  pageSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  freeSeatsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  freeSeatsText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },

  /* --- 2. Smart Dispatch Banner --- */
  smartDispatchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 9,
    marginBottom: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  robotIconBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smartDispatchText: {
    fontSize: 11,
    color: '#334155',
    flex: 1,
    lineHeight: 15,
  },
  smartDispatchBold: {
    fontWeight: '800',
    color: '#0F172A',
  },
  seatsAvailableHighlight: {
    fontWeight: '800',
    color: '#047857',
  },

  /* --- 3. Category Segmented Control --- */
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    borderRadius: 22,
    padding: 3,
    marginBottom: 14,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 18,
    gap: 6,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
      },
    }),
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  badgeCounter: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 10,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCounterActive: {
    backgroundColor: '#064E3B',
  },
  badgeCounterInactive: {
    backgroundColor: '#CBD5E1',
  },
  badgeCounterText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#475569',
  },
  badgeCounterTextActive: {
    color: '#FFFFFF',
  },

  /* --- 4. Request Cards --- */
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  urgentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  urgentTagGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulsingRedDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#DC2626',
  },
  urgentTagText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#DC2626',
    letterSpacing: 0.3,
  },
  expiresPill: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  expiresText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    position: 'relative',
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
  },
  verifiedCheckBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  profileDetailsCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paxName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  paxIdBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  paxIdText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#475569',
  },
  paxMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  paxStar: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  paxMetaDot: {
    fontSize: 10,
    color: '#94A3B8',
  },
  paxSeatedText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#047857',
  },
  distanceEtaCol: {
    alignItems: 'flex-end',
  },
  distanceText: {
    fontSize: 10.5,
    color: '#64748B',
  },
  distanceBold: {
    fontSize: 13,
    fontWeight: '900',
    color: '#064E3B',
  },
  etaPillMint: {
    backgroundColor: '#86EFAC', // Mint green badge
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    marginTop: 3,
  },
  etaTextMint: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#064E3B',
  },
  etaPillLavender: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    marginTop: 3,
  },
  etaTextLavender: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#312E81',
  },

  /* --- Waypoints Box --- */
  waypointsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
    marginBottom: 10,
  },
  waypointStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  waypointStepIcon: {
    marginTop: 1,
  },
  waypointStepTextCol: {
    flex: 1,
  },
  waypointStepKicker: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.4,
  },
  waypointStepValue: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 15,
    marginTop: 1,
  },
  waypointConnectorLine: {
    width: 1.5,
    height: 10,
    backgroundColor: '#CBD5E1',
    marginLeft: 6,
    marginVertical: 2,
  },

  /* --- Single Waypoint Box (Sana Gul) --- */
  singleWaypointBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  singleWaypointLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  singleWaypointTextCol: {
    flex: 1,
  },
  singleWaypointValue: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1,
  },
  directWaypointBadge: {
    backgroundColor: '#86EFAC',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  directWaypointText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#064E3B',
  },

  /* --- Live Radar Viewport Container --- */
  radarViewportContainer: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#CBD5E1',
    marginBottom: 12,
  },
  radarMapImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  radarLockBadge: {
    position: 'absolute',
    top: 6,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
    gap: 5,
  },
  radarDotGreen: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
  },
  radarLockText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  busRadarPin: {
    position: 'absolute',
    left: '18%',
    top: '36%',
    alignItems: 'center',
  },
  busRadarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#064E3B',
    borderWidth: 2,
    borderColor: '#86EFAC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  busRadarLabelPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    marginTop: 2,
  },
  busRadarLabelText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
  },
  radarDistBubble: {
    position: 'absolute',
    left: '46%',
    top: '46%',
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  radarDistText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  paxRadarPin: {
    position: 'absolute',
    right: '20%',
    top: '36%',
    alignItems: 'center',
  },
  paxRadarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#064E3B',
    borderWidth: 2,
    borderColor: '#86EFAC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paxRadarLabelPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    marginTop: 2,
  },
  paxRadarLabelText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
  },

  /* --- Action Buttons Row --- */
  actionsBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  declineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 5,
  },
  declineButtonText: {
    color: '#475569',
    fontSize: 12.5,
    fontWeight: '800',
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#064E3B', // Deep forest green
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  acceptButtonDone: {
    backgroundColor: '#047857',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.2,
  },

  /* --- High Demand Zone Card --- */
  highDemandCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  surgeIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  surgeTextCol: {
    flex: 1,
  },
  surgeTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  surgeSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  corridorBadge: {
    backgroundColor: '#064E3B',
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 4,
    alignItems: 'center',
  },
  corridorBadgeText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '700',
  },
  corridorBadgeNum: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  /* --- Empty State --- */
  emptyTabCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 16,
    gap: 8,
  },
  emptyTabTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  emptyTabDesc: {
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },

  /* --- Floating SOS Button --- */
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

export default DriverRequestsScreen;
