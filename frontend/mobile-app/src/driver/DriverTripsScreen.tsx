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
import { DriverHeader } from './DriverHeader';
import { DriverTabKey } from './DriverBottomTabs';
import {
  CompassHeadingIcon,
  TrafficLightIcon,
  CrosshairIcon,
  LayersIcon,
  CheckCircleIcon,
  MapPinIcon,
  SeatCrossIcon,
  ListBulletIcon,
  TriangleAlertIcon,
  AsteriskIcon,
  FlagFinishIcon,
  UserCheckIcon,
} from './DriverIcons';

export interface DriverTripsScreenProps {
  showHeader?: boolean;
  onNavigateTab?: (tab: DriverTabKey) => void;
  onSosPress?: () => void;
}

export const DriverTripsScreen: React.FC<DriverTripsScreenProps> = ({
  showHeader = true,
  onNavigateTab,
  onSosPress,
}) => {
  const insets = useSafeAreaInsets();
  const [isVehicleFull, setIsVehicleFull] = useState(false);
  const [pickupAcked, setPickupAcked] = useState(false);
  const [tripCompleted, setTripCompleted] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(42);

  const handleAckPickup = () => {
    setPickupAcked(true);
    Alert.alert(
      'Pickup Acknowledged',
      'Pabbi Railway Station Bypass commuter notified: PK-102 approaching waypoint in 2 mins.'
    );
  };

  const handleToggleFull = () => {
    const next = !isVehicleFull;
    setIsVehicleFull(next);
    Alert.alert(
      next ? 'Vehicle Marked 100% Full' : 'Vehicle Set to Normal Seating',
      next
        ? 'Bus PK-102 status set to Full Occupancy (45/45). Central dispatch will divert subsequent hails to following bus.'
        : 'Bus PK-102 set to Open Seating (28/45). Available capacity restored.'
    );
  };

  const handleStopsEta = () => {
    Alert.alert(
      'Route RT-01 Waypoint Headway',
      '1. Peshawar Cantt Hub (Departed 08:30 AM)\n2. Chamkani Flyover (Passed)\n3. Pabbi Station (Approaching)\n4. Nowshera Cantt (ETA: 09:15 AM)\n5. Risalpur Bypass (ETA: 09:35 AM)\n6. Mardan Central Terminal (ETA: 09:55 AM)'
    );
  };

  const handleReportDelay = () => {
    Alert.alert(
      'Report Traffic / Corridor Delay',
      'Select delay cause for N-5 Grand Trunk Corridor dispatch log:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Roadwork / Congestion (+10m)',
          onPress: () => Alert.alert('Reported', 'Corridor RT-01 dispatch adjusted +10 mins.'),
        },
        {
          text: 'Security / Checkpost (+15m)',
          onPress: () => Alert.alert('Reported', 'Police transit monitor synchronized +15 mins.'),
        },
      ]
    );
  };

  const handleCompleteTrip = () => {
    if (tripCompleted) {
      Alert.alert('Trip Ended', 'Shift headway already closed.');
      return;
    }
    Alert.alert(
      '🏁 Complete / End Route Trip',
      'Confirm route completion for Peshawar Cantt ➔ Mardan Central (58.4 km)? All passenger trips will be finalized.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Route Completion',
          style: 'default',
          onPress: () => {
            setTripCompleted(true);
            setCurrentSpeed(0);
            Alert.alert('Trip Finalized', 'Route RT-01 Headway marked 100% complete.');
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
        {/* 1. LIVE GPS INTERACTIVE NAVIGATION MAP                     */}
        {/* ========================================================== */}
        <View style={styles.mapCard}>
          <Image
            source={require('../../assets/images/live-navigation-map.png')}
            style={styles.mapImage}
            resizeMode="cover"
          />

          {/* Floating Top-Left Next Destination Box */}
          <View style={styles.nextDestBox}>
            <View style={styles.nextDestIconCircle}>
              <CompassHeadingIcon size={12} color="#059669" strokeWidth={2} />
            </View>
            <View style={styles.nextDestTextCol}>
              <Text style={styles.nextDestKicker}>Next Destination</Text>
              <Text style={styles.nextDestTitle}>
                Nowshera Junction (3.4 km)
              </Text>
            </View>
          </View>

          {/* Floating Top-Right Traffic Condition Badge */}
          <View style={styles.trafficClearBadge}>
            <TrafficLightIcon size={12} color="#059669" strokeWidth={2} />
            <Text style={styles.trafficClearText}>Clear</Text>
          </View>

          {/* Right-Hand Map Controls Stack */}
          <View style={styles.mapControlsCol}>
            <TouchableOpacity
              style={styles.mapControlBtn}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Recenter', 'Map view locked to vehicle PK-102 GPS fix.')}
            >
              <CrosshairIcon size={14} color="#064E3B" strokeWidth={2.4} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.mapControlBtn}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Zoom In', 'Map magnification: 16x.')}
            >
              <Text style={styles.zoomText}>+</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.mapControlBtn}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Zoom Out', 'Map magnification: 12x.')}
            >
              <Text style={styles.zoomText}>−</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.mapControlBtn, styles.layerBtn]}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Map Layer', 'Switching between Transit, Traffic, and Satellite view.')}
            >
              <LayersIcon size={14} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Bottom GPS Telemetry Strip */}
          <View style={styles.mapBottomBar}>
            <View style={styles.gpsDotGreen} />
            <Text style={styles.mapBottomText}>
              On Route • GT Highway N-5 GPS: ±3m • 2s ago
            </Text>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 2. TELEMETRY SPLIT CARDS (SPEED & OCCUPANCY)               */}
        {/* ========================================================== */}
        <View style={styles.telemetrySplitRow}>
          {/* Card 1: SPEED */}
          <View style={styles.teleCard}>
            <View style={styles.teleHeadRow}>
              <Text style={styles.teleKicker}>SPEED</Text>
              <View style={styles.speedLimitBadge}>
                <Text style={styles.speedLimitText}>Limit 65</Text>
              </View>
            </View>

            <View style={styles.teleBigRow}>
              <Text style={styles.teleBigNum}>{currentSpeed}</Text>
              <Text style={styles.teleUnit}> km/h</Text>
            </View>

            {/* Gauge progress bar */}
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${(currentSpeed / 65) * 100}%` },
                ]}
              />
            </View>

            <View style={styles.teleFooterRow}>
              <CheckCircleIcon size={12} color="#059669" strokeWidth={2.4} />
              <Text style={styles.teleFooterGreen}>Safe Cruise Range</Text>
            </View>
          </View>

          {/* Card 2: OCCUPANCY */}
          <View style={styles.teleCard}>
            <View style={styles.teleHeadRow}>
              <Text style={styles.teleKicker}>OCCUPANCY</Text>
              <View style={styles.capBadge}>
                <Text style={styles.capBadgeText}>
                  {isVehicleFull ? '100% Cap' : '62% Cap'}
                </Text>
              </View>
            </View>

            <View style={styles.teleBigRow}>
              <Text style={styles.teleBigNum}>{isVehicleFull ? 45 : 28}</Text>
              <Text style={styles.teleUnit}> / 45 seats</Text>
            </View>

            {/* Occupancy progress bar */}
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  styles.progressOccupancyFill,
                  { width: isVehicleFull ? '100%' : '62%' },
                ]}
              />
            </View>

            <View style={styles.teleFooterRow}>
              <Text style={styles.teleFooterMuted}>
                {isVehicleFull ? 'Vehicle Full (0 Available)' : '17 Seats Available'}
              </Text>
            </View>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 3. NEXT STOP WAYPOINT CARD                                 */}
        {/* ========================================================== */}
        <View style={styles.nextStopCard}>
          <View style={styles.nextStopTopRow}>
            {/* Dark green square with pin icon */}
            <View style={styles.nextStopIconBox}>
              <MapPinIcon size={18} color="#FFFFFF" strokeWidth={2.2} />
            </View>

            {/* Stop title & metadata */}
            <View style={styles.nextStopTextCol}>
              <View style={styles.nextStopKickerRow}>
                <Text style={styles.nextStopKicker}>NEXT STOP</Text>
                <View style={styles.stopNumPill}>
                  <Text style={styles.stopNumText}>Stop #4</Text>
                </View>
              </View>
              <Text style={styles.nextStopName}>Nowshera Cantt</Text>
              <Text style={styles.nextStopSub}>Main Mall Road Terminal Bay 2</Text>
            </View>

            {/* Arrival Time & ETA */}
            <View style={styles.nextStopEtaCol}>
              <Text style={styles.nextStopTime}>09:15 AM</Text>
              <View style={styles.etaPillMint}>
                <Text style={styles.etaPillMintText}>6 mins away</Text>
              </View>
            </View>
          </View>

          {/* Inner Pickup Alert Strip */}
          <View style={styles.pickupAlertStrip}>
            <View style={styles.pickupAvatarBox}>
              <UserCheckIcon size={15} color="#064E3B" strokeWidth={2.2} />
            </View>
            <View style={styles.pickupTextCol}>
              <Text style={styles.pickupTitle}>
                {pickupAcked ? 'Pickup Acknowledged (1 Seated)' : '1 Pickup Waiting'}
              </Text>
              <Text style={styles.pickupSub}>
                Pabbi Railway Station Bypass
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.ackButton,
                pickupAcked && styles.ackButtonDone,
              ]}
              activeOpacity={0.8}
              onPress={handleAckPickup}
            >
              <Text style={styles.ackButtonText}>
                {pickupAcked ? '✓ Ack' : 'Ack'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 4. QUICK ACTIONS (2x2 GRID)                                */}
        {/* ========================================================== */}
        <View style={styles.actionsGrid}>
          {/* Row 1 */}
          <View style={styles.actionsRow}>
            {/* Mark Vehicle Full */}
            <TouchableOpacity
              style={[
                styles.actionCard,
                isVehicleFull && styles.actionCardActive,
              ]}
              activeOpacity={0.75}
              onPress={handleToggleFull}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#EFF6FF' }]}>
                <SeatCrossIcon size={17} color="#2563EB" strokeWidth={2} />
              </View>
              <View style={styles.actionTextCol}>
                <Text style={styles.actionTitle}>Mark Vehicle Full</Text>
                <Text style={styles.actionSub}>
                  {isVehicleFull ? 'Current: 45/45 (Full)' : 'Current: 28/45'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Pass. Requests */}
            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.75}
              onPress={() => onNavigateTab ? onNavigateTab('requests') : null}
            >
              <View style={styles.passReqIconWrap}>
                <View style={[styles.actionIconBox, { backgroundColor: '#86EFAC' }]}>
                  <MapPinIcon size={16} color="#064E3B" strokeWidth={2.2} />
                </View>
                <View style={styles.reqBadgeOne}>
                  <Text style={styles.reqBadgeOneText}>1</Text>
                </View>
              </View>
              <View style={styles.actionTextCol}>
                <Text style={styles.actionTitle}>Pass. Requests</Text>
                <Text style={styles.actionSub}>1 Pending Action</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Row 2 */}
          <View style={styles.actionsRow}>
            {/* Stops & ETA */}
            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.75}
              onPress={handleStopsEta}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#EFF6FF' }]}>
                <ListBulletIcon size={16} color="#2563EB" strokeWidth={2} />
              </View>
              <View style={styles.actionTextCol}>
                <Text style={styles.actionTitle}>Stops &amp; ETA</Text>
                <Text style={styles.actionSub}>5 Stops Left</Text>
              </View>
            </TouchableOpacity>

            {/* Report Delay */}
            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.75}
              onPress={handleReportDelay}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#EFF6FF' }]}>
                <TriangleAlertIcon size={16} color="#4F46E5" strokeWidth={2.2} />
              </View>
              <View style={styles.actionTextCol}>
                <Text style={styles.actionTitle}>Report Delay</Text>
                <Text style={styles.actionSub}>Roadwork / Ops</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 5. SOS ALERT BANNER                                        */}
        {/* ========================================================== */}
        <TouchableOpacity
          style={styles.sosAlertBanner}
          activeOpacity={0.85}
          onPress={handleEmergencySos}
        >
          <View style={styles.sosBannerLeft}>
            <AsteriskIcon size={17} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={styles.sosBannerText}>SOS ALERT</Text>
          </View>

          <View style={styles.centralDispatchBadge}>
            <Text style={styles.centralDispatchText}>CENTRAL DISPATCH</Text>
          </View>
        </TouchableOpacity>

        {/* ========================================================== */}
        {/* 6. PRIMARY BUTTON: COMPLETE / END TRIP                     */}
        {/* ========================================================== */}
        <TouchableOpacity
          style={[
            styles.completeTripButton,
            tripCompleted && styles.completeTripButtonDone,
          ]}
          activeOpacity={0.85}
          onPress={handleCompleteTrip}
        >
          <FlagFinishIcon size={17} color="#FFFFFF" strokeWidth={2.2} />
          <Text style={styles.completeTripButtonText}>
            {tripCompleted ? 'Route Headway Finalized ✓' : 'Complete / End Trip'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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

  /* --- 1. Live Navigation Map --- */
  mapCard: {
    height: 275,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  mapImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  nextDestBox: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  nextDestIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextDestTextCol: {
    flexShrink: 1,
  },
  nextDestKicker: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
  },
  nextDestTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 1,
  },
  trafficClearBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trafficClearText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  mapControlsCol: {
    position: 'absolute',
    right: 12,
    top: 50,
    gap: 8,
    alignItems: 'center',
  },
  mapControlBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
      },
    }),
  },
  layerBtn: {
    backgroundColor: '#064E3B',
  },
  zoomText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#334155',
    lineHeight: 18,
  },
  mapBottomBar: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gpsDotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  mapBottomText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  /* --- 2. Telemetry Split Cards --- */
  telemetrySplitRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  teleCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  teleHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  teleKicker: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  speedLimitBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  speedLimitText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#312E81',
  },
  capBadge: {
    backgroundColor: '#86EFAC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  capBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#064E3B',
  },
  teleBigRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  teleBigNum: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 32,
  },
  teleUnit: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 3,
  },
  progressOccupancyFill: {
    backgroundColor: '#064E3B',
  },
  teleFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  teleFooterGreen: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  teleFooterMuted: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },

  /* --- 3. Next Stop Waypoint Card --- */
  nextStopCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  nextStopTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nextStopIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextStopTextCol: {
    flex: 1,
  },
  nextStopKickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nextStopKicker: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#064E3B',
    letterSpacing: 0.4,
  },
  stopNumPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  stopNumText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#475569',
  },
  nextStopName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 1,
  },
  nextStopSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  nextStopEtaCol: {
    alignItems: 'flex-end',
  },
  nextStopTime: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  etaPillMint: {
    backgroundColor: '#BBF7D0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    marginTop: 3,
  },
  etaPillMintText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#064E3B',
  },
  pickupAlertStrip: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 9,
    marginTop: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  pickupAvatarBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#86EFAC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupTextCol: {
    flex: 1,
  },
  pickupTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  pickupSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  ackButton: {
    backgroundColor: '#064E3B',
    borderRadius: 7,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  ackButtonDone: {
    backgroundColor: '#047857',
  },
  ackButtonText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
  },

  /* --- 4. Quick Actions (2x2 Grid) --- */
  actionsGrid: {
    gap: 8,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 11,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionCardActive: {
    borderColor: '#064E3B',
    backgroundColor: '#F0FDF4',
  },
  actionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextCol: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  actionSub: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 1,
  },
  passReqIconWrap: {
    position: 'relative',
  },
  reqBadgeOne: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#DC2626',
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  reqBadgeOneText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
  },

  /* --- 5. SOS Alert Banner --- */
  sosAlertBanner: {
    backgroundColor: '#991B1B', // Deep crimson red
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#991B1B',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 3px 10px rgba(153, 27, 27, 0.3)',
      },
    }),
  },
  sosBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sosBannerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  centralDispatchBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
  },
  centralDispatchText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  /* --- 6. Primary Button: Complete / End Trip --- */
  completeTripButton: {
    backgroundColor: '#064E3B', // Forest green
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  completeTripButtonDone: {
    backgroundColor: '#047857',
  },
  completeTripButtonText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
});

export default DriverTripsScreen;

