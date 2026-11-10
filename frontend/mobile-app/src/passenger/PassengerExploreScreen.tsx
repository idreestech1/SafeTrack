import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  SearchIcon,
  MicIcon,
  FilterSlidersIcon,
  CrosshairIcon,
  ListBulletIcon,
  LayersIcon,
  HandHailIcon,
  RouteStopsIcon,
  SeatArmchairIcon,
  BanknoteIcon,
  SplitBranchIcon,
  BusFrontIcon,
} from './PassengerIcons';

const avatarPilot = require('../../assets/images/avatar-ahmad.png');

export interface PassengerExploreScreenProps {
  onBackPress?: () => void;
  onRequestHailSuccess?: () => void;
}

export const PassengerExploreScreen: React.FC<PassengerExploreScreenProps> = ({
  onBackPress,
  onRequestHailSuccess,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedRoute, setSelectedRoute] = useState<'N-5' | 'all' | 'available'>('N-5');
  const [mapMode, setMapMode] = useState<'standard' | 'satellite'>('standard');
  const [hailRequested, setHailRequested] = useState(false);
  const [selectedBus, setSelectedBus] = useState<'PK-102' | 'PK-105' | 'PK-221'>('PK-102');

  const handleRequestHail = () => {
    setHailRequested(true);
    Alert.alert(
      'Pickup Hail Dispatched! 🚍',
      'Captain Muhammad Ali (PK-102) has acknowledged your hail at Saddar Terminal.\nETA: 3 minutes.\nAssigned seat: #14.',
      [
        {
          text: 'Track Arrival',
          style: 'default',
          onPress: () => {
            onRequestHailSuccess?.();
          },
        },
      ]
    );
  };

  const handleViewRouteStops = () => {
    Alert.alert(
      'Route N-5 (Urban Express) Stops',
      '1. Peshawar Cantt Station (Origin)\n2. Saddar General Post Office\n3. Khyber Bazaar Interchange\n4. Gulbahar Square\n5. Chamkani Bus Terminal\n6. Taru Jabba Junction\n7. Pabbi Station\n8. Nowshera Cantt\n9. Risalpur Interchange\n10. Mardan Central Terminal (Final)\n\nTotal Corridor Distance: 44.2 km • 14 Station Stops'
    );
  };

  const handleSos = () => {
    Alert.alert(
      '🚨 EMERGENCY SOS BROADCAST',
      'Immediate panic alert with live GPS coordinates will be dispatched to KP Police Highway Interceptors and Rescue 1122.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Broadcast SOS', style: 'destructive' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* ========================================================== */}
      {/* 1. FULL-BLEED REALISTIC VECTOR MAP CANVAS                  */}
      {/* ========================================================== */}
      <View style={styles.mapCanvasContainer}>
        <Svg width="100%" height="100%" viewBox="0 0 400 480" style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="mapBgGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor={mapMode === 'satellite' ? '#1E293B' : '#E9F1F6'} />
              <Stop offset="50%" stopColor={mapMode === 'satellite' ? '#0F172A' : '#EFF6E9'} />
              <Stop offset="100%" stopColor={mapMode === 'satellite' ? '#1E293B' : '#E6F0F8'} />
            </LinearGradient>
            <LinearGradient id="corridorGlow" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#10B981" />
              <Stop offset="100%" stopColor="#047857" />
            </LinearGradient>
          </Defs>

          {/* Map Surface Background */}
          <Rect x="0" y="0" width="400" height="480" fill="url(#mapBgGrad)" />

          {/* Park & Forest Natural Zones */}
          <Path
            d="M 280,0 L 400,0 L 400,160 C 370,140 330,120 280,100 Z"
            fill="#D1E7DD"
            opacity={0.65}
          />
          <Path
            d="M 0,280 C 40,290 80,310 110,350 L 60,420 L 0,400 Z"
            fill="#D5EAD8"
            opacity={0.5}
          />

          {/* Secondary Arterial City Grid Lines */}
          <Path
            d="M 60,0 L 60,480 M 160,0 L 160,480 M 320,0 L 320,480"
            stroke="#FFFFFF"
            strokeWidth={14}
            opacity={0.9}
          />
          <Path
            d="M 60,0 L 60,480 M 160,0 L 160,480 M 320,0 L 320,480"
            stroke="#CBD5E1"
            strokeWidth={1}
            opacity={0.6}
          />

          <Path
            d="M 0,110 L 400,110 M 0,230 L 400,230 M 0,340 L 400,340"
            stroke="#FFFFFF"
            strokeWidth={12}
            opacity={0.9}
          />
          <Path
            d="M 0,110 L 400,110 M 0,230 L 400,230 M 0,340 L 400,340"
            stroke="#CBD5E1"
            strokeWidth={1}
            opacity={0.6}
          />

          {/* Diagonal Highway Connectors */}
          <Path
            d="M 0,320 L 180,140 L 400,140"
            stroke="#FFFFFF"
            strokeWidth={16}
          />
          <Path
            d="M 0,320 L 180,140 L 400,140"
            stroke="#CBD5E1"
            strokeWidth={1.5}
          />

          {/* Active Route N-5 Main Highway Polyline (Glowing Green) */}
          <Path
            d="M 28,290 C 90,240 145,150 170,135 C 195,120 280,145 390,145"
            stroke="#059669"
            strokeWidth={5}
            strokeLinecap="round"
          />
          <Path
            d="M 28,290 C 90,240 145,150 170,135 C 195,120 280,145 390,145"
            stroke="#A7F3D0"
            strokeWidth={2}
            strokeLinecap="round"
          />

          {/* Dashed Transit Walkway to Bus Stop */}
          <Path
            d="M 174,275 C 190,250 205,215 215,178"
            stroke="#64748B"
            strokeWidth={3}
            strokeDasharray="4,4"
            opacity={0.8}
          />

          {/* Landmark Labels on Map Canvas */}
          <G>
            {/* Chamkani Landmark */}
            <Circle cx="340" cy="130" r="3.5" fill="#64748B" />
            <Rect x="300" y="112" width="60" height="14" rx="3" fill="rgba(255,255,255,0.85)" />
            <SvgText x="305" y="123" fontSize="8.5" fontWeight="bold" fill="#334155">
              Chamkani
            </SvgText>

            {/* Saddar Terminal Badge */}
            <Rect x="236" y="196" width="68" height="16" rx="4" fill="#0F172A" />
            <SvgText x="242" y="208" fontSize="8" fontWeight="bold" fill="#FFFFFF">
              Saddar Terminal
            </SvgText>

            {/* Islamia College Landmark */}
            <SvgText x="220" y="308" fontSize="8" fontWeight="bold" fill="#64748B">
              Islamia College
            </SvgText>
          </G>
        </Svg>

        {/* ========================================================== */}
        {/* MAP MARKER 1: "YOU ARE HERE" USER BEACON                   */}
        {/* ========================================================== */}
        <View style={styles.userBeaconMarker}>
          <View style={styles.userBeaconPulseRing} />
          <View style={styles.userBeaconInnerRing}>
            <View style={styles.userBeaconCenterDot} />
          </View>
          <View style={styles.youAreHerePill}>
            <Text style={styles.youAreHereText}>You are here</Text>
          </View>
        </View>

        {/* ========================================================== */}
        {/* MAP MARKER 2: HERO BUS PK-102 (120m • 17 free)             */}
        {/* ========================================================== */}
        <TouchableOpacity
          style={[
            styles.heroBusMarker,
            selectedBus === 'PK-102' && styles.heroBusMarkerSelected,
          ]}
          activeOpacity={0.85}
          onPress={() => setSelectedBus('PK-102')}
        >
          <View style={styles.heroBusContentRow}>
            <View style={styles.heroBusWhiteIconCircle}>
              <BusFrontIcon size={14} color="#064E3B" strokeWidth={2.4} />
            </View>
            <View style={styles.heroBusTextCol}>
              <View style={styles.heroBusTitleRow}>
                <Text style={styles.heroBusTitle}>PK-102</Text>
                <View style={styles.heroBusGreenDot} />
              </View>
              <Text style={styles.heroBusSub}>120m • 17 free</Text>
            </View>
          </View>
          {/* Pointer Arrow pointing to road */}
          <View style={styles.heroBusPointer} />
        </TouchableOpacity>

        {/* ========================================================== */}
        {/* MAP MARKER 3: BUS PK-105 (350m • 8 seats)                  */}
        {/* ========================================================== */}
        <TouchableOpacity
          style={styles.nearbyBusPill}
          activeOpacity={0.85}
          onPress={() => setSelectedBus('PK-105')}
        >
          <View style={styles.nearbyBusOrangeIconCircle}>
            <BusFrontIcon size={12} color="#FFFFFF" strokeWidth={2.2} />
          </View>
          <View>
            <Text style={styles.nearbyBusTitle}>PK-105</Text>
            <Text style={styles.nearbyBusSub}>350m • 8 seats</Text>
          </View>
        </TouchableOpacity>

        {/* ========================================================== */}
        {/* MAP MARKER 4: BUS PK-221 (Full • GT Rd)                    */}
        {/* ========================================================== */}
        <View style={styles.corridorBusPill}>
          <View style={styles.corridorBusRedIconCircle} />
          <View>
            <Text style={styles.corridorBusTitle}>PK-221</Text>
            <Text style={styles.corridorBusSub}>Full • GT Rd</Text>
          </View>
        </View>

        {/* ========================================================== */}
        {/* MAP OVERLAY: FLOATING GPS STATUS PILL                      */}
        {/* ========================================================== */}
        <View style={[styles.gpsStatusPill, { top: insets.top + 54 }]}>
          <View style={styles.gpsPulseDot} />
          <Text style={styles.gpsStatusText}>GPS Live &bull; 12 Active Transits</Text>
        </View>

        {/* ========================================================== */}
        {/* MAP OVERLAY: FLOATING RIGHT TOOLBAR                        */}
        {/* ========================================================== */}
        <View style={styles.floatingRightToolbar}>
          <TouchableOpacity
            style={styles.mapToolButton}
            activeOpacity={0.8}
            onPress={() => Alert.alert('Recenter GPS', 'Locked camera onto your current position at Saddar Terminal.')}
          >
            <CrosshairIcon size={18} color="#064E3B" strokeWidth={2.4} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mapToolButton}
            activeOpacity={0.8}
            onPress={handleViewRouteStops}
          >
            <ListBulletIcon size={18} color="#334155" strokeWidth={2.2} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mapToolButton}
            activeOpacity={0.8}
            onPress={() => setMapMode((prev) => (prev === 'standard' ? 'satellite' : 'standard'))}
          >
            <LayersIcon size={18} color="#334155" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>

        {/* ========================================================== */}
        {/* MAP OVERLAY: FLOATING SOS DISPATCH PILL                    */}
        {/* ========================================================== */}
        <TouchableOpacity
          style={styles.floatingSosPill}
          activeOpacity={0.85}
          onPress={handleSos}
        >
          <Text style={styles.floatingSosText}>SOS</Text>
        </TouchableOpacity>
      </View>

      {/* ========================================================== */}
      {/* 2. FLOATING SEARCH BAR & HORIZONTAL FILTER CHIPS          */}
      {/* ========================================================== */}
      <View style={[styles.topFloatingBarArea, { paddingTop: insets.top > 0 ? insets.top : 8 }]}>
        {/* Search Bar matching screenshot */}
        <View style={styles.searchBarBox}>
          <SearchIcon size={17} color="#64748B" strokeWidth={2.2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Route N-5 • Saddar Express"
            placeholderTextColor="#0F172A"
            defaultValue="Route N-5 • Saddar Express"
          />
          <TouchableOpacity
            style={styles.micButton}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Voice Search', 'Speak destination or route corridor...')}
          >
            <MicIcon size={16} color="#64748B" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>

        {/* Filter Chips matching screenshot */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChipsRow}
        >
          {/* Chip 1: Route N-5 (Active Dark Green) */}
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedRoute === 'N-5' ? styles.filterChipActiveGreen : styles.filterChipWhite,
            ]}
            onPress={() => setSelectedRoute('N-5')}
            activeOpacity={0.8}
          >
            <SplitBranchIcon
              size={13}
              color={selectedRoute === 'N-5' ? '#FFFFFF' : '#334155'}
              strokeWidth={2.4}
            />
            <Text
              style={[
                styles.filterChipText,
                selectedRoute === 'N-5' ? styles.filterChipTextActive : styles.filterChipTextInactive,
              ]}
            >
              Route N-5
            </Text>
          </TouchableOpacity>

          {/* Chip 2: All Routes */}
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedRoute === 'all' ? styles.filterChipActiveGreen : styles.filterChipWhite,
            ]}
            onPress={() => setSelectedRoute('all')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedRoute === 'all' ? styles.filterChipTextActive : styles.filterChipTextInactive,
              ]}
            >
              All Routes
            </Text>
          </TouchableOpacity>

          {/* Chip 3: Available Now (with green dot) */}
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedRoute === 'available' ? styles.filterChipActiveGreen : styles.filterChipWhite,
            ]}
            onPress={() => setSelectedRoute('available')}
            activeOpacity={0.8}
          >
            <View style={styles.chipGreenDot} />
            <Text
              style={[
                styles.filterChipText,
                selectedRoute === 'available' ? styles.filterChipTextActive : styles.filterChipTextInactive,
              ]}
            >
              Available Now
            </Text>
          </TouchableOpacity>

          {/* Chip 4: More Filter Sliders */}
          <TouchableOpacity
            style={[styles.filterChip, styles.filterChipWhite, { paddingHorizontal: 9 }]}
            onPress={() => Alert.alert('Corridor Filters', 'Showing AC Express, Direct Intercity & Lady-Reserved seating.')}
            activeOpacity={0.8}
          >
            <FilterSlidersIcon size={14} color="#334155" strokeWidth={2.4} />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* ========================================================== */}
      {/* 3. BOTTOM SHEET: TRANSIT VEHICLE & ROUTE DOSSIER           */}
      {/* ========================================================== */}
      <View style={styles.bottomSheetCard}>
        {/* Sheet Drag Handle */}
        <View style={styles.dragHandleBar} />

        {/* Bus Title & ETA Header */}
        <View style={styles.sheetHeaderRow}>
          <View style={styles.sheetTitleCol}>
            <View style={styles.routePillBadge}>
              <Text style={styles.routePillBadgeText}>ROUTE N-5</Text>
            </View>
            <Text style={styles.sheetMainTitle}>Urban Express</Text>
            <Text style={styles.sheetSubtitle}>
              {selectedBus} &bull; Hino Metro AC Deluxe
            </Text>
          </View>

          {/* Mint ETA Box */}
          <View style={styles.mintEtaBox}>
            <View style={styles.mintEtaTopRow}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M3 11.5L21 3L12.5 21L10.5 13.5L3 11.5Z"
                  stroke="#064E3B"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.mintEtaBigText}>3 mins</Text>
            </View>
            <Text style={styles.mintEtaSubText}>180m away</Text>
          </View>
        </View>

        {/* Side-by-Side Telemetry & Captain Metric Cards */}
        <View style={styles.metricsTwoColRow}>
          {/* Card 1: Seats Free */}
          <View style={styles.metricCardBox}>
            <View style={styles.metricIconSquircle}>
              <SeatArmchairIcon size={18} color="#047857" strokeWidth={2.4} />
            </View>
            <View>
              <Text style={styles.metricCardLabel}>SEATS FREE</Text>
              <Text style={styles.metricCardValue}>17 Seats</Text>
              <Text style={styles.metricCardSub}>28/45 on board</Text>
            </View>
          </View>

          {/* Card 2: Captain Verified Profile */}
          <View style={styles.metricCardBox}>
            <Image source={avatarPilot} style={styles.pilotPhotoThumb} />
            <View>
              <View style={styles.pilotNameRow}>
                <Text style={styles.pilotNameText}>M. Ali</Text>
                <View style={styles.verifiedCheckPillSmall}>
                  <Text style={styles.verifiedCheckChar}>&check;</Text>
                </View>
              </View>
              <Text style={styles.pilotRatingText}>
                4.8 &starf; <Text style={styles.pilotRatingCount}>(312)</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Fare & Direct Waypoint Strip */}
        <View style={styles.fareRouteStrip}>
          <View style={styles.fareGroup}>
            <BanknoteIcon size={17} color="#64748B" strokeWidth={2.2} />
            <View style={{ marginLeft: 6 }}>
              <Text style={styles.fareLabel}>Fixed Digital Fare</Text>
              <Text style={styles.fareAmount}>PKR 50.00</Text>
            </View>
          </View>

          <Text style={styles.routeEndpointsText}>
            Saddar &rarr; University Rd
          </Text>
        </View>

        {/* Primary Action Button: Request Digital Hail Pickup */}
        <TouchableOpacity
          style={[
            styles.primaryHailBtn,
            hailRequested && styles.primaryHailBtnConfirmed,
          ]}
          activeOpacity={0.88}
          onPress={handleRequestHail}
        >
          <HandHailIcon size={18} color="#FFFFFF" strokeWidth={2.2} />
          <Text style={styles.primaryHailBtnText}>
            {hailRequested ? '&check; Digital Hail Confirmed (PK-102)' : 'Request Digital Hail Pickup'}
          </Text>
        </TouchableOpacity>

        {/* Secondary Action Button: View All 14 Route Stops */}
        <TouchableOpacity
          style={styles.secondaryStopsBtn}
          activeOpacity={0.8}
          onPress={handleViewRouteStops}
        >
          <RouteStopsIcon size={16} color="#064E3B" strokeWidth={2.4} />
          <Text style={styles.secondaryStopsBtnText}>View All 14 Route Stops</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Helper text component inside SVG
const SvgText = ({ x, y, fontSize, fontWeight, fill, children }: any) => (
  <Text
    style={{
      position: 'absolute',
      left: Number(x),
      top: Number(y),
      fontSize: Number(fontSize),
      fontWeight: fontWeight || 'bold',
      color: fill || '#0F172A',
    }}
  >
    {children}
  </Text>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF1F6',
  },

  /* --- 1. Map Canvas --- */
  mapCanvasContainer: {
    flex: 1,
    position: 'relative',
  },

  /* User Location Beacon Marker */
  userBeaconMarker: {
    position: 'absolute',
    top: 250,
    left: 172,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userBeaconPulseRing: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.22)',
  },
  userBeaconInnerRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#064E3B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(6,78,59,0.3)',
      },
    }),
  },
  userBeaconCenterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#064E3B',
  },
  youAreHerePill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
  },
  youAreHereText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#0F172A',
  },

  /* Hero Bus PK-102 Marker (Dark Green) */
  heroBusMarker: {
    position: 'absolute',
    top: 168,
    left: 145,
    alignItems: 'center',
    zIndex: 10,
  },
  heroBusMarkerSelected: {
    transform: [{ scale: 1.05 }],
  },
  heroBusContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064E3B', // Deep forest green
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 18,
    gap: 7,
    borderWidth: 1.5,
    borderColor: '#059669',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.28,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 4px 12px rgba(6,78,59,0.35)',
      },
    }),
  },
  heroBusWhiteIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBusTextCol: {
    justifyContent: 'center',
  },
  heroBusTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroBusTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  heroBusGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  heroBusSub: {
    color: '#86EFAC',
    fontSize: 9,
    fontWeight: '700',
  },
  heroBusPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#064E3B',
    marginTop: -1,
  },

  /* Bus PK-105 Marker (White with Orange Circle) */
  nearbyBusPill: {
    position: 'absolute',
    top: 300,
    left: 36,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      },
    }),
  },
  nearbyBusOrangeIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nearbyBusTitle: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  nearbyBusSub: {
    fontSize: 8.5,
    color: '#64748B',
    fontWeight: '700',
  },

  /* Bus PK-221 Marker (Upper Right Corridor) */
  corridorBusPill: {
    position: 'absolute',
    top: 120,
    left: 178,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 12,
    gap: 5,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  corridorBusRedIconCircle: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EA580C',
  },
  corridorBusTitle: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  corridorBusSub: {
    fontSize: 8,
    fontWeight: '700',
    color: '#EA580C',
  },

  /* GPS Live Status Pill */
  gpsStatusPill: {
    position: 'absolute',
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      },
    }),
  },
  gpsPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#22C55E',
  },
  gpsStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A',
  },

  /* Right Floating Map Toolbar */
  floatingRightToolbar: {
    position: 'absolute',
    right: 14,
    top: 295,
    gap: 10,
    zIndex: 8,
  },
  mapToolButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
    }),
  },

  /* Left Floating SOS Pill */
  floatingSosPill: {
    position: 'absolute',
    left: 14,
    top: 412,
    backgroundColor: '#B91C1C', // Deep crimson red
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#B91C1C',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 3px 10px rgba(185,28,28,0.4)',
      },
    }),
  },
  floatingSosText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.6,
  },

  /* --- 2. Floating Search Bar & Horizontal Filter Chips --- */
  topFloatingBarArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 14,
    zIndex: 20,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      },
    }),
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    padding: 0,
  },
  micButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingBottom: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 5,
  },
  filterChipActiveGreen: {
    backgroundColor: '#064E3B', // Signature forest green
    ...Platform.select({
      ios: {
        shadowColor: '#064E3B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 6px rgba(6,78,59,0.25)',
      },
    }),
  },
  filterChipWhite: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterChipTextInactive: {
    color: '#334155',
  },
  chipGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },

  /* --- 3. Bottom Sheet --- */
  bottomSheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
      },
    }),
  },
  dragHandleBar: {
    width: 42,
    height: 4.5,
    borderRadius: 2.25,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sheetTitleCol: {
    flex: 1,
  },
  routePillBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#064E3B',
    paddingVertical: 2.5,
    paddingHorizontal: 7,
    borderRadius: 5,
    marginBottom: 3,
  },
  routePillBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  sheetMainTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  sheetSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
    fontWeight: '600',
  },

  /* Mint ETA Box */
  mintEtaBox: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  mintEtaTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mintEtaBigText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#064E3B',
  },
  mintEtaSubText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
    marginTop: 1,
  },

  /* Two Metric Cards */
  metricsTwoColRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  metricCardBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricIconSquircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricCardLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.4,
  },
  metricCardValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 1,
  },
  metricCardSub: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  pilotPhotoThumb: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E2E8F0',
  },
  pilotNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pilotNameText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  verifiedCheckPillSmall: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedCheckChar: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    lineHeight: 11,
  },
  pilotRatingText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#D97706',
    marginTop: 1,
  },
  pilotRatingCount: {
    color: '#64748B',
    fontWeight: '600',
  },

  /* Fare Strip */
  fareRouteStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fareGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fareLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '700',
  },
  fareAmount: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  routeEndpointsText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
  },

  /* Primary Hail Button */
  primaryHailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#064E3B', // Dark green matching all action buttons
    paddingVertical: 13,
    borderRadius: 12,
    gap: 8,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#064E3B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
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
  primaryHailBtnConfirmed: {
    backgroundColor: '#047857',
  },
  primaryHailBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  /* Secondary Stops Button */
  secondaryStopsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 11,
    borderRadius: 12,
    gap: 7,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryStopsBtnText: {
    color: '#064E3B',
    fontSize: 12.5,
    fontWeight: '800',
  },
});

export default PassengerExploreScreen;
