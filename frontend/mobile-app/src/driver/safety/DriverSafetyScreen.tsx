import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  Platform,
  Linking,
  Image,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DriverHeader } from '../header/DriverHeader';
import {
  SirenRadioIcon,
  MapPinIcon,
  PhoneCallIcon,
  AsteriskIcon,
  SpeakerTriggerIcon,
  SatelliteEyeIcon,
  ObdGaugeIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  CalendarClockIcon,
  WrenchUserIcon,
} from '../icons/DriverIcons';

export interface DriverSafetyScreenProps {
  onBack?: () => void;
  showHeader?: boolean;
}

export const DriverSafetyScreen: React.FC<DriverSafetyScreenProps> = ({
  showHeader = true,
}) => {
  const insets = useSafeAreaInsets();

  // Hold-to-SOS interactive state
  const [holding, setHolding] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [beaconActive, setBeaconActive] = useState(false);
  const [holdAnim] = useState(() => new Animated.Value(0));

  const startHoldSos = () => {
    setHolding(true);
    Animated.timing(holdAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        triggerSosAlert();
      }
    });
  };

  const cancelHoldSos = () => {
    setHolding(false);
    Animated.timing(holdAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const triggerSosAlert = () => {
    setSosActive(true);
    Alert.alert(
      '🚨 EMERGENCY SOS BROADCAST SENT',
      'Silent distress relay with live GPS coordinates (34.0151° N, 71.5249° E) and bus PK-102 cabin telemetry dispatched to Peshawar Central Police Control Room & 1122 Rescue.',
      [
        {
          text: 'Dismiss / Accidental Release (5s)',
          style: 'destructive',
          onPress: () => {
            setSosActive(false);
            holdAnim.setValue(0);
          },
        },
        {
          text: 'Police Patrol Unit Dispatched',
          style: 'default',
        },
      ]
    );
  };

  const handleCallInterceptor = () => {
    Alert.alert(
      'Control Interceptor Call',
      'Connecting encrypted VoIP channel to Cmdr. Tariq Rehman (Peshawar Central Transit Desk)...',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call via GSM Phone',
          onPress: () => Linking.openURL('tel:15'),
        },
      ]
    );
  };

  const handleDial1122 = () => {
    Alert.alert(
      'KPK 1122 Rescue Dispatch',
      'Direct priority medical & ambulance link. Dial emergency dispatcher?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Dial 1122',
          onPress: () => Linking.openURL('tel:1122'),
        },
      ]
    );
  };

  const handleTriggerBeacon = () => {
    setBeaconActive(!beaconActive);
    Alert.alert(
      beaconActive ? 'Beacon Muted' : '🔊 Audio Beacon Triggered',
      beaconActive
        ? 'High-decibel interior horn deactivated.'
        : 'High-decibel cabin beacon pulse activated for passenger safety warning.'
    );
  };

  // Animated progress width for Hold-to-SOS
  const progressWidth = holdAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.screenWrapper}>
      {/* Top Header matching SmartTransit KP design */}
      {showHeader && <DriverHeader />}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingBottom: Math.max(insets.bottom, 24) + 80, // Space for floating button and bottom tabs
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================== */}
        {/* 1. TOP HERO DISTRESS CARD: CRITICAL DISPATCH               */}
        {/* ========================================================== */}
        <View style={styles.sosCard}>
          <View style={styles.sosCardHeader}>
            <View style={styles.sosIconCircle}>
              <SirenRadioIcon size={20} color="#FFFFFF" strokeWidth={2.2} />
            </View>
            <View style={styles.sosTitleCol}>
              <Text style={styles.sosKicker}>CRITICAL DISPATCH</Text>
              <Text style={styles.sosHeading}>EMERGENCY SOS BROADCAST</Text>
            </View>
          </View>

          <Text style={styles.sosDesc}>
            Sends instant silent panic alert with live GPS coordinates, camera
            telemetry, and bus ID to Peshawar Central Police Control Room &amp;
            1122 Rescue.
          </Text>

          {sosActive && (
            <View style={styles.sosDispatchedBanner}>
              <View style={styles.sosDispatchedDot} />
              <Text style={styles.sosDispatchedBannerText}>
                EMERGENCY RELAY ACTIVE • PATROL 04 DISPATCHED
              </Text>
            </View>
          )}

          {/* Interactive Hold-to-SOS Button */}
          <TouchableOpacity
            style={styles.holdButton}
            activeOpacity={0.9}
            onPressIn={startHoldSos}
            onPressOut={cancelHoldSos}
            accessibilityRole="button"
            accessibilityLabel="Hold 3 seconds for SOS distress alert"
          >
            {/* Animated Progress Fill */}
            <Animated.View
              style={[styles.holdProgressFill, { width: progressWidth }]}
            />

            <View style={styles.holdContentRow}>
              <MapPinIcon size={17} color="#FFFFFF" strokeWidth={2.2} />
              <Text style={styles.holdButtonText}>
                {holding ? 'HOLDING... (3S)' : 'HOLD 3S FOR SOS'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Sub-hints below the SOS button */}
          <View style={styles.sosFooterHints}>
            <Text style={styles.sosHintLeft}>☝ Press &amp; hold steadily</Text>
            <Text style={styles.sosHintRight}>
              Accidental lock: 5s release window
            </Text>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 2. SECTION: EMERGENCY FAST RESPONSE                        */}
        {/* ========================================================== */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Emergency Fast Response</Text>
          <Text style={styles.sectionSubtitleBadge}>DIRECT COMMS</Text>
        </View>

        {/* Card 1: Control Interceptor */}
        <View style={styles.commsCard}>
          <View style={[styles.commsIconBox, { backgroundColor: '#EEF2FF' }]}>
            <View style={styles.interceptorIconWrap}>
              <SirenRadioIcon size={18} color="#2563EB" strokeWidth={2} />
            </View>
          </View>
          <View style={styles.commsInfo}>
            <Text style={styles.commsTitle}>Control Interceptor</Text>
            <Text style={styles.commsSub} numberOfLines={1}>
              Cmdr. Tariq Rehman (Central Desk)
            </Text>
          </View>
          <TouchableOpacity
            style={styles.callButtonDark}
            onPress={handleCallInterceptor}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Call Control Interceptor"
          >
            <PhoneCallIcon size={13} color="#FFFFFF" strokeWidth={2.2} />
            <Text style={styles.callButtonText}>Call</Text>
          </TouchableOpacity>
        </View>

        {/* Card 2: 1122 Rescue KP */}
        <View style={styles.commsCard}>
          <View style={[styles.commsIconBox, { backgroundColor: '#FEE2E2' }]}>
            <AsteriskIcon size={17} color="#DC2626" strokeWidth={2.4} />
          </View>
          <View style={styles.commsInfo}>
            <Text style={styles.commsTitle}>1122 Rescue KP</Text>
            <Text style={styles.commsSub} numberOfLines={1}>
              Medical &amp; Ambulance Fast Unit
            </Text>
          </View>
          <TouchableOpacity
            style={styles.dial1122Button}
            onPress={handleDial1122}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Dial 1122 Rescue KP"
          >
            <PhoneCallIcon size={13} color="#4F46E5" strokeWidth={2.2} />
            <Text style={styles.dial1122Text}>Dial 1122</Text>
          </TouchableOpacity>
        </View>

        {/* Card 3: Cabin Audio Beacon */}
        <View style={styles.commsCard}>
          <View style={[styles.commsIconBox, { backgroundColor: '#E0E7FF' }]}>
            <SpeakerTriggerIcon size={17} color="#4338CA" strokeWidth={2} />
          </View>
          <View style={styles.commsInfo}>
            <Text style={styles.commsTitle}>Cabin Audio Beacon</Text>
            <Text style={styles.commsSub} numberOfLines={1}>
              Triggers high-decibel interior horn
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.triggerButton,
              beaconActive && styles.triggerButtonActive,
            ]}
            onPress={handleTriggerBeacon}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Trigger Cabin Audio Beacon"
          >
            <SpeakerTriggerIcon
              size={14}
              color={beaconActive ? '#FFFFFF' : '#064E3B'}
              strokeWidth={2.2}
            />
            <Text
              style={[
                styles.triggerButtonText,
                beaconActive && styles.triggerButtonTextActive,
              ]}
            >
              {beaconActive ? 'Active' : 'Trigger'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================== */}
        {/* 3. SECTION: TELEMETRY & VERIFICATION STREAM                */}
        {/* ========================================================== */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Telemetry &amp; Verification Stream</Text>
          <Text style={styles.healthBadge}>100% HEALTH</Text>
        </View>

        <View style={styles.telemetrySplitRow}>
          {/* Left Box: GNSS LOCK */}
          <View style={styles.telemetryCard}>
            <View style={styles.teleHead}>
              <Text style={styles.teleLabel}>GNSS LOCK</Text>
              <SatelliteEyeIcon size={15} color="#10B981" strokeWidth={2} />
            </View>
            <Text style={styles.teleBigVal}>12 Sats</Text>
            <Text style={styles.teleSub} numberOfLines={1}>
              Chamkani N-5 • 0.8m dev
            </Text>
          </View>

          {/* Right Box: OBD-II CAN */}
          <View style={styles.telemetryCard}>
            <View style={styles.teleHead}>
              <Text style={styles.teleLabel}>OBD-II CAN</Text>
              <ObdGaugeIcon size={15} color="#10B981" strokeWidth={2} />
            </View>
            <Text style={styles.teleBigVal}>99.8%</Text>
            <Text style={styles.teleSub} numberOfLines={1}>
              Brakes • Fuel • Normal
            </Text>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 4. SAFETY CAMERA TELEMETRY CARD                            */}
        {/* ========================================================== */}
        <View style={styles.cardContainer}>
          <View style={styles.cameraHeaderRow}>
            <View style={styles.cameraTitleGroup}>
              <VideoCameraIcon size={16} color="#0F172A" strokeWidth={2.2} />
              <View>
                <Text style={styles.cameraCardTitle}>Safety Camera</Text>
                <Text style={styles.cameraCardTitle}>Telemetry</Text>
              </View>
            </View>

            <View style={styles.camIdBadge}>
              <Text style={styles.camIdText}>Cam ID #04-CAB</Text>
            </View>
          </View>

          {/* Camera Viewport Canvas */}
          <View style={styles.cameraViewport}>
            {/* Real Bus Cabin Snapshot Feed */}
            <Image
              source={require('../../../assets/images/bus-cabin-feed.png')}
              style={styles.cameraFeedImage}
              resizeMode="cover"
            />

            {/* Live Log Top-Left Pill */}
            <View style={styles.liveLogPill}>
              <View style={styles.liveLogDot} />
              <Text style={styles.liveLogText}>LIVE LOG</Text>
            </View>

            {/* 2m ago snapshot Top-Right Pill */}
            <View style={styles.snapshotPill}>
              <Text style={styles.snapshotText}>2m ago snapshot</Text>
            </View>

            {/* Bottom Stream Overlays */}
            <View style={styles.cameraBottomBar}>
              <Text style={styles.cameraStreamActiveText}>
                Authorized Safety Stream Active
              </Text>
              <Text style={styles.cameraAesText}>Encrypted AES-256</Text>
            </View>
          </View>

          <Text style={styles.cameraFootnote}>
            Snapshot capture operates strictly for critical incident
            verification and police dispatcher synchronization.
          </Text>
        </View>

        {/* ========================================================== */}
        {/* 5. DRIVER SAFETY COMPLIANCE CARD                           */}
        {/* ========================================================== */}
        <View style={styles.cardContainer}>
          <View style={styles.complianceHeadRow}>
            <View style={styles.complianceTitleGroup}>
              <CheckCircleIcon size={17} color="#15803D" strokeWidth={2.2} />
              <Text style={styles.complianceTitle}>
                Driver Safety Compliance
              </Text>
            </View>
            <View style={styles.gradeBadge}>
              <Text style={styles.gradeBadgeText}>GRADE A</Text>
            </View>
          </View>

          {/* Inner Verified Box with 98% Vector Ring */}
          <View style={styles.complianceInnerBox}>
            <View style={styles.circleRingWrap}>
              <Svg width={48} height={48} viewBox="0 0 48 48">
                <Circle
                  cx={24}
                  cy={24}
                  r={20}
                  stroke="#E2E8F0"
                  strokeWidth={4.5}
                  fill="transparent"
                />
                <Circle
                  cx={24}
                  cy={24}
                  r={20}
                  stroke="#047857"
                  strokeWidth={4.5}
                  strokeDasharray={`${2 * Math.PI * 20} ${2 * Math.PI * 20}`}
                  strokeDashoffset={(2 * Math.PI * 20) * (1 - 0.98)}
                  strokeLinecap="round"
                  fill="transparent"
                  transform="rotate(-90 24 24)"
                />
              </Svg>
              <View style={styles.circleInnerCenter}>
                <Text style={styles.circlePercentVal}>98%</Text>
              </View>
            </View>

            <View style={styles.complianceTextCol}>
              <Text style={styles.verifiedHeading}>
                KP Transport Police Verified
              </Text>
              <Text style={styles.verifiedSub}>
                Top 5% safest urban commercial transit pilots in Peshawar
                Division today.
              </Text>
            </View>
          </View>

          {/* Sub-metrics Pills */}
          <View style={styles.compliancePillsRow}>
            <View style={styles.complianceSubPill}>
              <CheckCircleIcon size={14} color="#10B981" strokeWidth={2.2} />
              <View style={styles.complianceSubTextCol}>
                <Text style={styles.complianceSubBold}>0 Speed Alerts</Text>
                <Text style={styles.complianceSubDim}>Under 65 km/h limit</Text>
              </View>
            </View>

            <View style={styles.complianceSubPill}>
              <CheckCircleIcon size={14} color="#10B981" strokeWidth={2.2} />
              <View style={styles.complianceSubTextCol}>
                <Text style={styles.complianceSubBold}>0 Harsh Brakes</Text>
                <Text style={styles.complianceSubDim}>Smooth deceleration</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 6. SECTION: INCIDENT HISTORY LOG                           */}
        {/* ========================================================== */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Incident History Log</Text>
          <Text style={styles.sectionSubtitleMuted}>Last 14 Days</Text>
        </View>

        {/* Log Item 1: Flat Tire Replacement */}
        <View style={styles.logCard}>
          <View style={styles.logTopRow}>
            <View style={styles.logTitleGroup}>
              <View style={[styles.logStatusDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.logTitleText}>Flat Tire Replacement</Text>
            </View>
            <View style={[styles.logStatusPill, { backgroundColor: '#DCFCE7' }]}>
              <Text style={[styles.logStatusPillText, { color: '#15803D' }]}>
                RESOLVED
              </Text>
            </View>
          </View>

          <Text style={styles.logDescription}>
            Mobile Depot Quick Unit responded near Nowshera bypass. Bus
            re-certified for route clearance in 18 minutes.
          </Text>

          <View style={styles.logMetaRow}>
            <View style={styles.logMetaItem}>
              <CalendarClockIcon size={12} color="#64748B" />
              <Text style={styles.logMetaText}>Yesterday • 16:45</Text>
            </View>
            <View style={styles.logMetaItem}>
              <WrenchUserIcon size={12} color="#64748B" />
              <Text style={styles.logMetaText}>Depot Tech: Imran Khan</Text>
            </View>
          </View>
        </View>

        {/* Log Item 2: Chamkani Safety Inspection */}
        <View style={styles.logCard}>
          <View style={styles.logTopRow}>
            <View style={styles.logTitleGroup}>
              <View style={[styles.logStatusDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.logTitleText}>Chamkani Safety Inspection</Text>
            </View>
            <View style={[styles.logStatusPill, { backgroundColor: '#EEF2FF' }]}>
              <Text style={[styles.logStatusPillText, { color: '#3730A3' }]}>
                VERIFIED
              </Text>
            </View>
          </View>

          <Text style={styles.logDescription}>
            Routine transit authority inspection. First aid kit, fire
            extinguisher, and emergency doors checked clear.
          </Text>

          <View style={styles.logMetaRow}>
            <View style={styles.logMetaItem}>
              <CalendarClockIcon size={12} color="#64748B" />
              <Text style={styles.logMetaText}>Oct 24 • 08:15</Text>
            </View>
            <View style={styles.logMetaItem}>
              <WrenchUserIcon size={12} color="#64748B" />
              <Text style={styles.logMetaText}>Officer: Insp. Rashid</Text>
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
        onPress={triggerSosAlert}
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

  /* --- 1. Top Hero Distress Card --- */
  sosCard: {
    backgroundColor: '#FFF1F0', // Soft tinted coral peach
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#DC2626',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(220, 38, 38, 0.06)',
      },
    }),
  },
  sosCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  sosIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#991B1B', // Deep crimson circle
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosTitleCol: {
    flex: 1,
  },
  sosKicker: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#B91C1C',
    letterSpacing: 0.5,
  },
  sosHeading: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#7F1D1D',
    letterSpacing: 0.2,
    marginTop: 2,
  },
  sosDesc: {
    fontSize: 11.5,
    color: '#991B1B',
    lineHeight: 16.5,
    marginBottom: 14,
    fontWeight: '500',
  },
  sosDispatchedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
    gap: 6,
  },
  sosDispatchedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
  },
  sosDispatchedBannerText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#991B1B',
    letterSpacing: 0.3,
  },
  holdButton: {
    backgroundColor: '#991B1B', // Deep crimson red button
    borderRadius: 12,
    height: 48,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  holdProgressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#DC2626', // Lighter red fill indicating hold progress
  },
  holdContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 2,
  },
  holdButtonText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  sosFooterHints: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    flexWrap: 'wrap',
    gap: 4,
  },
  sosHintLeft: {
    fontSize: 10,
    fontWeight: '700',
    color: '#991B1B',
  },
  sosHintRight: {
    fontSize: 10,
    fontWeight: '600',
    color: '#991B1B',
  },

  /* --- Section Headers --- */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitleBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.4,
  },
  sectionSubtitleMuted: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  healthBadge: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#15803D',
    letterSpacing: 0.3,
  },

  /* --- 2. Emergency Fast Response Cards --- */
  commsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  commsIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  interceptorIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commsInfo: {
    flex: 1,
  },
  commsTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  commsSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  callButtonDark: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#054425', // Deep forest green
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 6,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  dial1122Button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  dial1122Text: {
    color: '#312E81',
    fontSize: 12,
    fontWeight: '800',
  },
  triggerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5EF18A', // Vibrant spring neon green
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: 10,
    gap: 5,
  },
  triggerButtonActive: {
    backgroundColor: '#DC2626',
  },
  triggerButtonText: {
    color: '#064E3B',
    fontSize: 12.5,
    fontWeight: '800',
  },
  triggerButtonTextActive: {
    color: '#FFFFFF',
  },

  /* --- 3. Telemetry Split Cards --- */
  telemetrySplitRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  telemetryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 13,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  teleHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  teleLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.3,
  },
  teleBigVal: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0F172A',
    marginVertical: 2,
  },
  teleSub: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },

  /* --- Generic Card Wrapper --- */
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  /* --- 4. Camera Telemetry --- */
  cameraHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cameraTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cameraCardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 16,
  },
  camIdBadge: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  camIdText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#3730A3',
  },
  cameraViewport: {
    height: 154,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1E293B',
    justifyContent: 'space-between',
  },
  cameraFeedImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  liveLogPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    alignSelf: 'flex-start',
    margin: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  liveLogDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFFFFF',
  },
  liveLogText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  snapshotPill: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  snapshotText: {
    color: '#F8FAFC',
    fontSize: 9.5,
    fontWeight: '700',
  },
  cameraBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
  },
  cameraStreamActiveText: {
    color: '#F1F5F9',
    fontSize: 9.5,
    fontWeight: '700',
  },
  cameraAesText: {
    color: '#38BDF8',
    fontSize: 9.5,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  cameraFootnote: {
    fontSize: 10.5,
    color: '#64748B',
    lineHeight: 14.5,
    marginTop: 8,
    fontWeight: '500',
  },

  /* --- 5. Driver Safety Compliance --- */
  complianceHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  complianceTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  complianceTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  gradeBadge: {
    backgroundColor: '#14532D', // Deep forest green pill
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  gradeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  complianceInnerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FA',
    borderRadius: 14,
    padding: 12,
    gap: 12,
    marginBottom: 10,
  },
  circleRingWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circleInnerCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circlePercentVal: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
  },
  complianceTextCol: {
    flex: 1,
  },
  verifiedHeading: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  verifiedSub: {
    fontSize: 10.5,
    color: '#64748B',
    lineHeight: 14.5,
    marginTop: 2,
  },
  compliancePillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  complianceSubPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 9,
    borderRadius: 10,
    gap: 7,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  complianceSubTextCol: {
    flex: 1,
  },
  complianceSubBold: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  complianceSubDim: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 1,
  },

  /* --- 6. Incident History Log --- */
  logCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  logTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  logTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flex: 1,
  },
  logStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  logTitleText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  logStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  logStatusPillText: {
    fontSize: 10,
    fontWeight: '900',
  },
  logDescription: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15.5,
    marginBottom: 8,
  },
  logMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 8,
  },
  logMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logMetaText: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
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

export default DriverSafetyScreen;
