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
import Svg, {
  Path,
  Circle,
  Rect,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BusFrontIcon,
  NavArrowIcon,
  SwapVerticalIcon,
  AlertSosIcon,
  CheckCircleIcon,
  ExpandMapIcon,
  RadarPulseIcon,
  HistoryClockIcon,
  MapPinIcon,
  TicketIcon,
} from './PassengerIcons';

const avatarSana = require('../../assets/images/avatar-sana.png');
const avatarCaptain = require('../../assets/images/avatar-ahmad.png');

export interface PassengerHomeScreenProps {
  onTrackLive?: () => void;
  onExpandMap?: () => void;
  onActiveTripPress?: () => void;
  onProfilePress?: () => void;
  onSwitchRole?: () => void;
}

export const PassengerHomeScreen: React.FC<PassengerHomeScreenProps> = ({
  onTrackLive,
  onExpandMap,
  onActiveTripPress,
  onProfilePress,
  onSwitchRole,
}) => {
  const insets = useSafeAreaInsets();
  const [pickupPoint, setPickupPoint] = useState('Current Location (Saddar Post Office)');
  const [destinationPoint, setDestinationPoint] = useState('University Road / Islamia College');
  const [selectedQuickChip, setSelectedQuickChip] = useState<'Home' | 'Islamia' | 'Hayatabad'>('Islamia');

  const handleSwap = () => {
    const temp = pickupPoint;
    setPickupPoint(destinationPoint);
    setDestinationPoint(temp);
  };

  const handleQuickChip = (chip: 'Home' | 'Islamia' | 'Hayatabad') => {
    setSelectedQuickChip(chip);
    if (chip === 'Home') {
      setDestinationPoint('Gulbahar Phase 2 (Home)');
    } else if (chip === 'Islamia') {
      setDestinationPoint('University Road / Islamia College');
    } else if (chip === 'Hayatabad') {
      setDestinationPoint('Hayatabad Phase 3 Commercial');
    }
  };

  const handleFindRide = () => {
    Alert.alert(
      'Searching Real-Time Transits 🚍',
      `Locating active buses between:\n• ${pickupPoint}\n• ${destinationPoint}\n\nFastest arrival: Bus PK-102 (2 mins away).`,
      [
        {
          text: 'Track on Live Map',
          onPress: () => onTrackLive?.(),
        },
        { text: 'OK', style: 'cancel' },
      ]
    );
  };

  const handleSos = () => {
    Alert.alert(
      '🚨 EMERGENCY SOS BROADCAST',
      'Instant panic alert with live GPS coordinates will be dispatched to KP Police Highway Interceptors (15) and Rescue 1122.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Broadcast SOS Now', style: 'destructive' },
      ]
    );
  };

  const handleNearbyStops = () => {
    Alert.alert(
      'Nearby Transit Stations (4 Active)',
      '1. Saddar Post Office (30m away)\n2. Cantt Railway Station Bay 3 (180m away)\n3. GPO Mall Road Junction (240m away)\n4. Khyber Bazaar Feeder Stop (300m away)'
    );
  };

  const handleFindTransport = () => {
    Alert.alert(
      'Search Corridor Schedules',
      'Corridor N-5: Buses departing every 4 mins\nRing Road BRT: Buses departing every 6 mins\nCharsadda Regional: Buses departing every 12 mins',
      [
        {
          text: 'Open Explore Network',
          onPress: () => onTrackLive?.(),
        },
        { text: 'Close', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top > 0 ? insets.top + 4 : 10 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================== */}
        {/* 1. TOP GREETING HEADER                                     */}
        {/* ========================================================== */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.profileAvatarWrapper}
            activeOpacity={0.8}
            onPress={onProfilePress || onSwitchRole}
          >
            <Image source={avatarSana} style={styles.avatarImage} />
            <View style={styles.onlineStatusDot} />
          </TouchableOpacity>

          <View style={styles.greetingTextCol}>
            <Text style={styles.greetingTitle}>Good morning, Sana ✨</Text>
            <Text style={styles.greetingSubtitle} numberOfLines={1}>
              Ready for Peshawar Transit commute
            </Text>
          </View>

          {/* Mint GPS Active Pill */}
          <View style={styles.gpsActivePill}>
            <View style={styles.gpsDot} />
            <View style={styles.gpsTextCol}>
              <Text style={styles.gpsPillTextTop}>GPS</Text>
              <Text style={styles.gpsPillTextBottom}>Active</Text>
            </View>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 2. PLAN YOUR JOURNEY CARD                                  */}
        {/* ========================================================== */}
        <View style={styles.cardContainer}>
          {/* Card Header */}
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleWithIcon}>
              <BusFrontIcon size={18} color="#064E3B" strokeWidth={2.4} />
              <Text style={styles.cardTitle}>Plan Your Journey</Text>
            </View>
            <View style={styles.transitBadgePill}>
              <Text style={styles.transitBadgeText}>BRT & GT Transit</Text>
            </View>
          </View>

          {/* Input Area with Floating Swap Button */}
          <View style={styles.journeyInputsContainer}>
            {/* Pickup Point Input Box */}
            <View style={styles.inputBox}>
              <View style={styles.pickupCircleIcon} />
              <View style={styles.inputBoxCol}>
                <Text style={styles.inputLabel}>PICKUP POINT</Text>
                <Text style={styles.inputValueText} numberOfLines={1}>
                  {pickupPoint}
                </Text>
              </View>
            </View>

            {/* Floating Swap Button */}
            <TouchableOpacity
              style={styles.floatingSwapBtn}
              activeOpacity={0.8}
              onPress={handleSwap}
            >
              <SwapVerticalIcon size={16} color="#064E3B" strokeWidth={2.4} />
            </TouchableOpacity>

            {/* Destination Point Input Box */}
            <View style={[styles.inputBox, { marginTop: 8 }]}>
              <View style={styles.destinationPinIcon}>
                <MapPinIcon size={14} color="#EF4444" strokeWidth={2.4} />
              </View>
              <View style={styles.inputBoxCol}>
                <Text style={styles.inputLabel}>DESTINATION</Text>
                <Text style={styles.inputValueText} numberOfLines={1}>
                  {destinationPoint}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Destination Chips */}
          <View style={styles.quickChipsRow}>
            <TouchableOpacity
              style={[
                styles.quickChip,
                selectedQuickChip === 'Home' && styles.quickChipSelected,
              ]}
              onPress={() => handleQuickChip('Home')}
              activeOpacity={0.75}
            >
              <Text style={styles.quickChipIcon}>🏠</Text>
              <Text style={styles.quickChipText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.quickChip,
                selectedQuickChip === 'Islamia' && styles.quickChipSelected,
              ]}
              onPress={() => handleQuickChip('Islamia')}
              activeOpacity={0.75}
            >
              <Text style={styles.quickChipIcon}>🎓</Text>
              <Text style={styles.quickChipText}>Islamia College</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.quickChip,
                selectedQuickChip === 'Hayatabad' && styles.quickChipSelected,
              ]}
              onPress={() => handleQuickChip('Hayatabad')}
              activeOpacity={0.75}
            >
              <Text style={styles.quickChipIcon}>🏢</Text>
              <Text style={styles.quickChipText}>Hayatabad</Text>
            </TouchableOpacity>
          </View>

          {/* Find My Ride Primary Button */}
          <TouchableOpacity
            style={styles.findRideBtn}
            activeOpacity={0.88}
            onPress={handleFindRide}
          >
            <BusFrontIcon size={16} color="#FFFFFF" strokeWidth={2.2} />
            <Text style={styles.findRideBtnText}>Find My Ride</Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================== */}
        {/* 3. APPROACHING BUS CARD (Peshawar → Mardan Express)        */}
        {/* ========================================================== */}
        <View style={styles.cardContainer}>
          {/* Card Top Row with ETA */}
          <View style={styles.approachingTopRow}>
            <View style={styles.approachingLeftRow}>
              <View style={styles.routeTagPill}>
                <Text style={styles.routeTagText}>ROUTE N-5</Text>
              </View>
              <View style={styles.approachingLiveDot} />
              <Text style={styles.approachingLabel}>Approaching Stop</Text>
            </View>

            <View style={styles.etaCol}>
              <Text style={styles.etaBigNumber}>2</Text>
              <Text style={styles.etaSubText}>mins away</Text>
            </View>
          </View>

          {/* Express Corridor Title */}
          <Text style={styles.approachingTitle}>Peshawar &rarr; Mardan Express</Text>

          {/* 3-Column Telemetry Strip */}
          <View style={styles.telemetryStripRow}>
            <View style={styles.telemetryCol}>
              <Text style={styles.telemetryLabel}>Vehicle</Text>
              <View style={styles.telemetryValWithIcon}>
                <Text style={styles.telemetryValText}>🚌 PK-102 (AC)</Text>
              </View>
            </View>

            <View style={styles.telemetryCol}>
              <Text style={styles.telemetryLabel}>Distance</Text>
              <View style={styles.telemetryValWithIcon}>
                <Text style={styles.telemetryValText}>↗ 120m</Text>
              </View>
            </View>

            <View style={styles.telemetryCol}>
              <Text style={styles.telemetryLabel}>Free Seats</Text>
              <View style={styles.telemetryValWithIcon}>
                <Text style={[styles.telemetryValText, { color: '#059669', fontWeight: '900' }]}>
                  💺 17 Available
                </Text>
              </View>
            </View>
          </View>

          {/* Captain Info & Track Live Row */}
          <View style={styles.driverTrackRow}>
            <View style={styles.captainInfoLeft}>
              <Image source={avatarCaptain} style={styles.captainPhoto} />
              <View style={styles.captainNameCol}>
                <View style={styles.captainNameRow}>
                  <Text style={styles.captainNameText}>Muhammad Ali</Text>
                  <View style={styles.verifiedGreenCheck}>
                    <Text style={styles.verifiedCheckChar}>&check;</Text>
                  </View>
                </View>
                <Text style={styles.captainMetaSub}>
                  4.8 &starf; &bull; KPK Police Verified
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.trackLiveBtn}
              activeOpacity={0.85}
              onPress={onTrackLive}
            >
              <NavArrowIcon size={14} color="#064E3B" strokeWidth={2.4} />
              <Text style={styles.trackLiveBtnText}>Track Live</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 4. LIVE TRANSIT RADAR MINI-MAP CARD                        */}
        {/* ========================================================== */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleWithIcon}>
              <RadarPulseIcon size={18} color="#059669" strokeWidth={2.2} />
              <Text style={styles.cardTitle}>Live Transit Radar</Text>
            </View>
            <Text style={styles.timeUpdatedText}>Updated 4s ago</Text>
          </View>

          {/* Mini Vector Map Container */}
          <View style={styles.miniMapWrapper}>
            <Svg width="100%" height="100%" viewBox="0 0 340 140" style={StyleSheet.absoluteFill}>
              <Defs>
                <LinearGradient id="radarMapBg" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor="#E9F1F6" />
                  <Stop offset="50%" stopColor="#EFF6EE" />
                  <Stop offset="100%" stopColor="#E0EDF5" />
                </LinearGradient>
              </Defs>

              <Rect x="0" y="0" width="340" height="140" fill="url(#radarMapBg)" />

              {/* City Street Grid */}
              <Path
                d="M 50,0 L 50,140 M 150,0 L 150,140 M 270,0 L 270,140"
                stroke="#FFFFFF"
                strokeWidth={10}
                opacity={0.8}
              />
              <Path
                d="M 0,40 L 340,40 M 0,95 L 340,95"
                stroke="#FFFFFF"
                strokeWidth={8}
                opacity={0.8}
              />

              {/* Active Highway Curved Polyline (GT Road Corridor) */}
              <Path
                d="M 12,90 C 80,85 140,55 170,50 C 200,45 280,50 330,50"
                stroke="#059669"
                strokeWidth={5}
                strokeLinecap="round"
              />
              <Path
                d="M 12,90 C 80,85 140,55 170,50 C 200,45 280,50 330,50"
                stroke="#A7F3D0"
                strokeWidth={2}
                strokeLinecap="round"
              />

              {/* Chamkani Terminal Stop Marker */}
              <Circle cx="222" cy="48" r="5" fill="#047857" />
              <Circle cx="222" cy="48" r="2.5" fill="#FFFFFF" />
            </Svg>

            {/* Floating Corridor Tag on Mini Map */}
            <View style={styles.corridorTagPill}>
              <Text style={styles.corridorTagText}>↗ GT Road Main Corridor</Text>
            </View>

            {/* Bus Marker Capsule */}
            <View style={styles.miniMapBusMarker}>
              <Text style={styles.miniMapBusText}>🚌 PK-102</Text>
              <View style={styles.miniMapBusPointer} />
            </View>

            {/* Chamkani Terminal Label */}
            <View style={styles.chamkaniLabelPill}>
              <Text style={styles.chamkaniLabelText}>Chamkani Terminal</Text>
            </View>

            {/* User "You (Saddar)" Marker */}
            <View style={styles.miniMapUserMarker}>
              <View style={styles.userDotPulseRing}>
                <View style={styles.userDotCore} />
              </View>
              <View style={styles.youSaddarPill}>
                <Text style={styles.youSaddarText}>You (Saddar)</Text>
              </View>
            </View>

            {/* Expand Live Map Button */}
            <TouchableOpacity
              style={styles.expandMapBtn}
              activeOpacity={0.85}
              onPress={onExpandMap || onTrackLive}
            >
              <ExpandMapIcon size={12} color="#0F172A" strokeWidth={2.4} />
              <Text style={styles.expandMapBtnText}>Expand Live Map</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 5. 2x2 QUICK ACTION TILES GRID                             */}
        {/* ========================================================== */}
        <View style={styles.quickGridContainer}>
          {/* Tile 1: Find Transport */}
          <TouchableOpacity
            style={styles.gridTileCard}
            activeOpacity={0.8}
            onPress={handleFindTransport}
          >
            <View style={styles.gridTileIconBox}>
              <BusFrontIcon size={18} color="#4F46E5" strokeWidth={2.4} />
            </View>
            <Text style={styles.gridTileTitle}>Find Transport</Text>
            <Text style={styles.gridTileSub}>Search bus schedules</Text>
          </TouchableOpacity>

          {/* Tile 2: Nearby Stops */}
          <TouchableOpacity
            style={styles.gridTileCard}
            activeOpacity={0.8}
            onPress={handleNearbyStops}
          >
            <View style={styles.gridTileIconBox}>
              <MapPinIcon size={18} color="#059669" strokeWidth={2.4} />
            </View>
            <View style={styles.tileTitleWithBadge}>
              <Text style={styles.gridTileTitle}>Nearby Stops</Text>
              <View style={styles.stopCountBadge}>
                <Text style={styles.stopCountText}>4</Text>
              </View>
            </View>
            <Text style={styles.gridTileSub}>Closest 300m away</Text>
          </TouchableOpacity>

          {/* Tile 3: My Active Trip */}
          <TouchableOpacity
            style={styles.gridTileCard}
            activeOpacity={0.8}
            onPress={onActiveTripPress}
          >
            <View style={styles.gridTileIconBox}>
              <TicketIcon size={18} color="#0284C7" strokeWidth={2.2} />
            </View>
            <Text style={styles.gridTileTitle}>My Active Trip</Text>
            <Text style={styles.gridTileSub}>View QR ticket &amp; receipt</Text>
          </TouchableOpacity>

          {/* Tile 4: Emergency SOS (Coral Red) */}
          <TouchableOpacity
            style={styles.sosGridTileCard}
            activeOpacity={0.8}
            onPress={handleSos}
          >
            <View style={styles.sosTileIconBox}>
              <AlertSosIcon size={18} color="#FFFFFF" strokeWidth={2.4} />
            </View>
            <Text style={styles.sosTileTitle}>Emergency SOS</Text>
            <Text style={styles.sosTileSub}>KP 15 &amp; BRT Patrol</Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================== */}
        {/* 6. TRANSIT ACTIVITY & ALERTS                               */}
        {/* ========================================================== */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Transit Activity &amp; Alerts</Text>
            <Text style={styles.liveFeedLink}>Live Feed</Text>
          </View>

          {/* Bright Green Normal Operation Banner */}
          <View style={styles.networkStatusBanner}>
            <View style={styles.networkCheckCircle}>
              <CheckCircleIcon size={16} color="#064E3B" strokeWidth={2.6} />
            </View>
            <View style={styles.networkTextCol}>
              <Text style={styles.networkStatusTitle}>Network Operating Normally</Text>
              <Text style={styles.networkStatusSub}>
                BRT Feeder &amp; GT Road Corridors running normal
              </Text>
            </View>
          </View>

          {/* Recent History Item */}
          <View style={styles.recentActivityRow}>
            <View style={styles.historyIconCircle}>
              <HistoryClockIcon size={16} color="#4F46E5" strokeWidth={2.2} />
            </View>
            <View style={styles.recentActivityCol}>
              <Text style={styles.recentActivityTitle}>
                Yesterday: Route N-5 Chamkani to Mardan
              </Text>
              <Text style={styles.recentActivitySub}>PKR 45 &bull; Completed</Text>
            </View>
            <View style={styles.paidBadgePill}>
              <Text style={styles.paidBadgeText}>Paid</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  /* --- 1. Top Greeting Header --- */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  profileAvatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
  },
  onlineStatusDot: {
    position: 'absolute',
    bottom: -1,
    left: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#059669',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  greetingTextCol: {
    flex: 1,
    marginHorizontal: 10,
  },
  greetingTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  greetingSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  gpsActivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6EE7B7', // Mint green matching screenshot
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    ...Platform.select({
      ios: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 4px rgba(16,185,129,0.2)',
      },
    }),
  },
  gpsDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#047857',
  },
  gpsTextCol: {
    alignItems: 'flex-start',
  },
  gpsPillTextTop: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#064E3B',
    lineHeight: 12,
  },
  gpsPillTextBottom: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#064E3B',
    lineHeight: 11,
  },

  /* --- Generic Card Base --- */
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      },
    }),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  transitBadgePill: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 3.5,
    paddingHorizontal: 9,
    borderRadius: 12,
  },
  transitBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#065F46',
  },

  /* --- 2. Plan Journey Inputs --- */
  journeyInputsContainer: {
    position: 'relative',
    marginVertical: 4,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
  },
  pickupCircleIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2.5,
    borderColor: '#059669',
    backgroundColor: '#FFFFFF',
  },
  destinationPinIcon: {
    width: 14,
    alignItems: 'center',
  },
  inputBoxCol: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.4,
  },
  inputValueText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1,
  },
  floatingSwapBtn: {
    position: 'absolute',
    right: 12,
    top: 38,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
      },
    }),
  },
  quickChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    gap: 5,
  },
  quickChipSelected: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  quickChipIcon: {
    fontSize: 12,
  },
  quickChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  findRideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#064E3B', // Signature deep green
    paddingVertical: 13,
    borderRadius: 12,
    gap: 8,
    marginTop: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#064E3B',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 8px rgba(6,78,59,0.3)',
      },
    }),
  },
  findRideBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },

  /* --- 3. Approaching Bus --- */
  approachingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  approachingLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeTagPill: {
    backgroundColor: '#064E3B',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 5,
  },
  routeTagText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  approachingLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
    marginLeft: 2,
  },
  approachingLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#065F46',
  },
  etaCol: {
    alignItems: 'flex-end',
  },
  etaBigNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: '#064E3B',
    lineHeight: 28,
  },
  etaSubText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
    marginTop: -2,
  },
  approachingTitle: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
    marginTop: 4,
    marginBottom: 10,
  },
  telemetryStripRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    justifyContent: 'space-between',
  },
  telemetryCol: {
    flex: 1,
  },
  telemetryLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  telemetryValWithIcon: {
    marginTop: 2,
  },
  telemetryValText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  driverTrackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  captainInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  captainPhoto: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E2E8F0',
  },
  captainNameCol: {
    justifyContent: 'center',
  },
  captainNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  captainNameText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  verifiedGreenCheck: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedCheckChar: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
    lineHeight: 10,
  },
  captainMetaSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  trackLiveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6EE7B7', // Mint button
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 5,
  },
  trackLiveBtnText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#064E3B',
  },

  /* --- 4. Live Transit Radar --- */
  timeUpdatedText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#64748B',
  },
  miniMapWrapper: {
    height: 135,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  corridorTagPill: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  corridorTagText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  miniMapBusMarker: {
    position: 'absolute',
    top: 48,
    left: 170,
    backgroundColor: '#064E3B',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 6,
  },
  miniMapBusText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  miniMapBusPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#064E3B',
    marginTop: -1,
  },
  chamkaniLabelPill: {
    position: 'absolute',
    top: 36,
    left: 175,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  chamkaniLabelText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#334155',
  },
  miniMapUserMarker: {
    position: 'absolute',
    bottom: 12,
    left: 80,
    alignItems: 'center',
    zIndex: 5,
  },
  userDotPulseRing: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDotCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#047857',
  },
  youSaddarPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginTop: 2,
  },
  youSaddarText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  expandMapBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 4.5,
    paddingHorizontal: 9,
    borderRadius: 8,
    gap: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  expandMapBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A',
  },

  /* --- 5. Quick Action Tiles Grid --- */
  quickGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 14,
  },
  gridTileCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 6px rgba(0,0,0,0.03)',
      },
    }),
  },
  gridTileIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  gridTileTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  tileTitleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  stopCountBadge: {
    backgroundColor: '#22C55E',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopCountText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
  },
  gridTileSub: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  sosGridTileCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: '#FEE2E2', // Coral / Red background matching screenshot
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  sosTileIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#B91C1C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  sosTileTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#B91C1C',
  },
  sosTileSub: {
    fontSize: 10.5,
    color: '#991B1B',
    fontWeight: '700',
    marginTop: 2,
  },

  /* --- 6. Transit Activity & Alerts --- */
  liveFeedLink: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  networkStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6EE7B7', // Bright mint banner
    borderRadius: 12,
    padding: 11,
    gap: 9,
    marginBottom: 10,
  },
  networkCheckCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  networkTextCol: {
    flex: 1,
  },
  networkStatusTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#064E3B',
  },
  networkStatusSub: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46',
    marginTop: 1,
  },
  recentActivityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 11,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  historyIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  recentActivityCol: {
    flex: 1,
  },
  recentActivityTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  recentActivitySub: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  paidBadgePill: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginLeft: 6,
  },
  paidBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
});

export default PassengerHomeScreen;
