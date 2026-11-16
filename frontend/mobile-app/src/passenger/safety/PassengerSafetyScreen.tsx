import React, { useState, useEffect } from 'react';
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
import {
  NavArrowIcon,
  PhoneCallIcon,
  ChatBubbleIcon,
  CrosshairIcon,
  ShieldCheckIcon,
  AlertSosIcon,
  MapPinIcon,
  BusFrontIcon,
  SpeedometerIcon,
} from '../icons/PassengerIcons';

const avatarCaptain = require('../../../assets/images/avatar-ahmad.png');
const liveMapAsset = require('../../../assets/images/live-navigation-map.png');

export interface PassengerSafetyScreenProps {
  onCancelPickup?: () => void;
  onExplorePress?: () => void;
  onSosPress?: () => void;
}

export const PassengerSafetyScreen: React.FC<PassengerSafetyScreenProps> = ({
  onCancelPickup,
  onExplorePress,
  onSosPress,
}) => {
  const [arrivingSeconds, setArrivingSeconds] = useState(73); // 1 min 13 sec
  const [cancelSeconds, setCancelSeconds] = useState(35);
  const [hasCancelled, setHasCancelled] = useState(false);

  // Live countdown timer for approaching bus and free cancellation window
  useEffect(() => {
    const timer = setInterval(() => {
      setArrivingSeconds((prev) => (prev > 1 ? prev - 1 : 1));
      setCancelSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatArrival = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins} min ${s < 10 ? '0' : ''}${s} sec`;
  };

  const handleCallDriver = () => {
    Alert.alert(
      'Connecting to Captain Muhammad Ali',
      'Encrypted transit call via KPK SafeTrack PBX.\nCaptain Mobile: +92 333 9182736',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Place Call', onPress: () => Alert.alert('Dialing...', 'Connecting call to bus cabin headset.') },
      ]
    );
  };

  const handleDirectMessage = () => {
    Alert.alert(
      'Message Captain Muhammad Ali',
      'Choose quick passenger prompt:',
      [
        { text: 'I am standing under the shelter', onPress: () => Alert.alert('Sent', 'Message transmitted to bus dashboard HUD.') },
        { text: 'Wearing a blue scarf / holding bag', onPress: () => Alert.alert('Sent', 'Message transmitted to bus dashboard HUD.') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSos = () => {
    if (onSosPress) {
      onSosPress();
      return;
    }
    Alert.alert(
      '🚨 EMERGENCY SOS CONTROL RELAY',
      'Instant high-priority emergency broadcast with live GPS coordinates will be sent to:\n• KPK Transport Police Patrol Unit 4\n• Rescue 1122 Rapid Response\n• Emergency Contact (Tariq Khan)',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Broadcast SOS Now', style: 'destructive' },
      ]
    );
  };

  const handleCancelRequest = () => {
    Alert.alert(
      'Cancel Pickup Request?',
      cancelSeconds > 0
        ? `Free cancellation window is active (${cancelSeconds}s remaining). No fare penalty will apply.`
        : 'Cancellation window has expired. Standard cancellation fee of PKR 15 may apply.',
      [
        { text: 'Keep Ride', style: 'cancel' },
        {
          text: 'Confirm Cancellation',
          style: 'destructive',
          onPress: () => {
            setHasCancelled(true);
            Alert.alert('Pickup Request Cancelled', 'Your hail for Bus PK-102 has been released.');
            onCancelPickup?.();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================== */}
        {/* 1. LIVE SIGNAL & APPROACH BANNER (Deep Forest Green)       */}
        {/* ========================================================== */}
        <View style={styles.approachHeroCard}>
          <View style={styles.approachTopRow}>
            <View style={styles.liveSignalPill}>
              <View style={styles.liveSignalDot} />
              <Text style={styles.liveSignalText}>LIVE SIGNAL &bull; EN ROUTE</Text>
            </View>

            <View style={styles.gpsLockPill}>
              <NavArrowIcon size={10} color="#86EFAC" strokeWidth={2.4} />
              <Text style={styles.gpsLockText}>GPS Lock</Text>
            </View>
          </View>

          <Text style={styles.approachMainTitle}>Driver Accepted &bull; Approaching</Text>
          <Text style={styles.approachSubtitle}>
            Arriving in {formatArrival(arrivingSeconds)}{' '}
            <Text style={styles.approachDistanceText}>
              ({Math.round(arrivingSeconds * 1.16)} meters away)
            </Text>
          </Text>
        </View>

        {/* ========================================================== */}
        {/* 2. LIVE TRACKING MAP CARD                                  */}
        {/* ========================================================== */}
        <View style={styles.liveMapWrapper}>
          <Image source={liveMapAsset} style={styles.liveMapImage} resizeMode="cover" />
          <View style={styles.liveMapOverlay} />

          {/* Top-Left: Speedometer Badge */}
          <View style={styles.speedometerBadge}>
            <SpeedometerIcon size={14} color="#0F172A" strokeWidth={2.2} />
            <View>
              <Text style={styles.speedValueText}>38 km/h</Text>
              <Text style={styles.speedSubText}>Smooth Cruise</Text>
            </View>
          </View>

          {/* Top-Right: Corridor Unit Capsule */}
          <View style={styles.corridorCapsule}>
            <Text style={styles.corridorCapsuleText}>
              GT-102 <Text style={styles.corridorGreenDot}>●</Text> North Express
            </Text>
          </View>

          {/* Bus PK-102 Map Marker */}
          <View style={styles.mapBusMarker}>
            <BusFrontIcon size={12} color="#FFFFFF" strokeWidth={2.2} />
            <Text style={styles.mapBusMarkerText}>PK-102</Text>
            <View style={styles.mapBusPointer} />
          </View>

          {/* Bottom-Left: Pickup Curb Badge */}
          <View style={styles.pickupCurbBadge}>
            <View style={styles.pickupGreenRing}>
              <View style={styles.pickupGreenDot} />
            </View>
            <View>
              <Text style={styles.pickupCurbTitle}>Your Pickup Curb</Text>
              <Text style={styles.pickupCurbSub}>Bay 2 &bull; Saddar Post</Text>
            </View>
          </View>

          {/* Bottom-Right: GPS Recenter Button */}
          <TouchableOpacity
            style={styles.recenterBtn}
            activeOpacity={0.85}
            onPress={onExplorePress}
          >
            <CrosshairIcon size={17} color="#064E3B" strokeWidth={2.4} />
          </TouchableOpacity>
        </View>

        {/* ========================================================== */}
        {/* 3. VERIFIED CAPTAIN & FLEET CARD                           */}
        {/* ========================================================== */}
        <View style={styles.cardContainer}>
          {/* Captain Profile Row */}
          <View style={styles.driverProfileRow}>
            <View style={styles.driverAvatarContainer}>
              <Image source={avatarCaptain} style={styles.driverAvatarPhoto} />
              <View style={styles.verifiedGreenBadge}>
                <Text style={styles.verifiedCheckText}>&check;</Text>
              </View>
            </View>

            <View style={styles.driverNameCol}>
              <View style={styles.driverNameTopRow}>
                <Text style={styles.driverNameText}>Muhammad Ali</Text>
                <Text style={styles.driverRatingText}>
                  &starf; 4.8 <Text style={styles.driverReviewCount}>(1,420)</Text>
                </Text>
              </View>
              <Text style={styles.driverBadgeLine}>
                <Text style={styles.driverBadgeHighlight}>Badge #DR-1024</Text> &bull; Senior Captain
              </Text>
            </View>
          </View>

          {/* Vehicle & Security Credentials Box */}
          <View style={styles.vehicleCredentialsBox}>
            <View style={styles.vehicleCredentialRow}>
              <View style={styles.vehicleTitleWithIcon}>
                <BusFrontIcon size={14} color="#0F172A" strokeWidth={2.2} />
                <Text style={styles.vehicleTitleText}>Hino Metro AC &bull; PK-102</Text>
              </View>
              <View style={styles.plateNumberPill}>
                <Text style={styles.plateNumberText}>KP-LE-4091</Text>
              </View>
            </View>

            <View style={[styles.vehicleCredentialRow, { marginTop: 6 }]}>
              <View style={styles.vehicleTitleWithIcon}>
                <ShieldCheckIcon size={13} color="#065F46" strokeWidth={2.4} />
                <Text style={styles.securityVerifiedText}>
                  KPK Police Transport Security Verified
                </Text>
              </View>
              <Text style={styles.securityIdText}>ID: SEC-884</Text>
            </View>
          </View>

          {/* Communication Buttons (Call & Direct Message) */}
          <View style={styles.commActionsRow}>
            <TouchableOpacity
              style={styles.callDriverBtn}
              activeOpacity={0.8}
              onPress={handleCallDriver}
            >
              <PhoneCallIcon size={15} color="#064E3B" strokeWidth={2.2} />
              <Text style={styles.callDriverBtnText}>Call Driver</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.directMessageBtn}
              activeOpacity={0.85}
              onPress={handleDirectMessage}
            >
              <ChatBubbleIcon size={15} color="#FFFFFF" strokeWidth={2.2} />
              <Text style={styles.directMessageBtnText}>Direct Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 4. DESIGNATED BOARDING SPOT CARD                           */}
        {/* ========================================================== */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionHeaderLabel}>DESIGNATED BOARDING SPOT</Text>
            <View style={styles.validatedCurbRow}>
              <View style={styles.validatedDot} />
              <Text style={styles.validatedCurbText}>Validated Curb</Text>
            </View>
          </View>

          {/* Stop Name & Platform */}
          <View style={styles.boardingSpotInfoRow}>
            <View style={styles.pinSquircleBox}>
              <MapPinIcon size={16} color="#064E3B" strokeWidth={2.4} />
            </View>
            <View style={styles.boardingSpotCol}>
              <Text style={styles.boardingSpotTitle}>Saddar Road Post Office</Text>
              <Text style={styles.boardingSpotSub}>
                Passenger Shelter Bay 2, Peshawar Cantt
              </Text>
            </View>
          </View>

          {/* Boarding Security PIN & QR Card */}
          <View style={styles.pinSecurityCard}>
            <View style={styles.pinInfoCol}>
              <Text style={styles.pinLabel}>Boarding Security PIN</Text>
              <Text style={styles.pinBigDigits}>8492</Text>
              <Text style={styles.pinHint}>Show upon entry</Text>
            </View>

            {/* QR Pattern Thumbnail */}
            <View style={styles.qrCodeThumbnailBox}>
              <View style={styles.qrCodeMatrix}>
                <View style={styles.qrDotSquare} />
                <View style={styles.qrDotSquare} />
                <View style={styles.qrDotSquare} />
                <View style={styles.qrDotSquare} />
              </View>
            </View>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 5. TRIP PROGRESS TIMELINE CARD                             */}
        {/* ========================================================== */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionHeaderLabel}>TRIP PROGRESS TIMELINE</Text>

          <View style={styles.timelineList}>
            {/* Step 1: Request Submitted */}
            <View style={styles.timelineItemRow}>
              <View style={styles.timelineIconCol}>
                <View style={styles.timelineCheckCircleComplete}>
                  <Text style={styles.timelineCheckChar}>&check;</Text>
                </View>
                <View style={[styles.timelineTrackLine, styles.trackLineSolid]} />
              </View>
              <View style={styles.timelineContentRow}>
                <Text style={styles.timelineTitleDone}>Request Submitted</Text>
                <Text style={styles.timelineTimeText}>2:43 PM</Text>
              </View>
            </View>

            {/* Step 2: Driver Accepted */}
            <View style={styles.timelineItemRow}>
              <View style={styles.timelineIconCol}>
                <View style={styles.timelineCheckCircleComplete}>
                  <Text style={styles.timelineCheckChar}>&check;</Text>
                </View>
                <View style={[styles.timelineTrackLine, styles.trackLineSolid]} />
              </View>
              <View style={styles.timelineContentRow}>
                <Text style={styles.timelineTitleDone}>Driver Accepted</Text>
                <Text style={styles.timelineTimeText}>2:43 PM</Text>
              </View>
            </View>

            {/* Step 3: Bus Approaching (Current Active) */}
            <View style={styles.timelineItemRow}>
              <View style={styles.timelineIconCol}>
                <View style={styles.activePulseRing}>
                  <View style={styles.activePulseDot} />
                </View>
                <View style={[styles.timelineTrackLine, styles.trackLineDashed]} />
              </View>
              <View style={styles.timelineContentRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.timelineTitleActive}>Bus Approaching</Text>
                  <Text style={styles.timelineSubActive}>Current &bull; 85m away on GT Corridor</Text>
                </View>
                <View style={styles.nowBadgePill}>
                  <Text style={styles.nowBadgeText}>Now</Text>
                </View>
              </View>
            </View>

            {/* Step 4: Boarding & Trip Start (Pending) */}
            <View style={styles.timelineItemRow}>
              <View style={styles.timelineIconCol}>
                <View style={styles.pendingCircleDot}>
                  <View style={styles.pendingInnerDot} />
                </View>
              </View>
              <View style={styles.timelineContentRow}>
                <Text style={styles.timelineTitlePending}>Boarding &amp; Trip Start</Text>
                <Text style={styles.timelineStatusPending}>Pending</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 6. EMERGENCY SOS • CONTROL RELAY BUTTON                    */}
        {/* ========================================================== */}
        <TouchableOpacity
          style={styles.emergencySosBtn}
          activeOpacity={0.88}
          onPress={handleSos}
        >
          <AlertSosIcon size={18} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.emergencySosBtnText}>EMERGENCY SOS &bull; CONTROL RELAY</Text>
        </TouchableOpacity>

        {/* ========================================================== */}
        {/* 7. CANCEL PICKUP REQUEST ACTION                            */}
        {/* ========================================================== */}
        <TouchableOpacity
          style={styles.cancelRequestContainer}
          activeOpacity={0.75}
          onPress={handleCancelRequest}
        >
          <Text style={[styles.cancelRequestTitle, hasCancelled && { color: '#94A3B8' }]}>
            {hasCancelled ? 'Pickup Cancelled' : 'Cancel Pickup Request'}
          </Text>
          <Text style={styles.cancelRequestSub}>
            {hasCancelled
              ? 'Ride is no longer active'
              : `Free cancellation window active (${cancelSeconds}s remaining)`}
          </Text>
        </TouchableOpacity>
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
    paddingTop: 10,
    paddingBottom: 24,
  },

  /* --- 1. Live Signal & Approach Banner --- */
  approachHeroCard: {
    backgroundColor: '#064E3B', // Deep forest green matching screenshot
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#064E3B',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 3px 10px rgba(6,78,59,0.3)',
      },
    }),
  },
  approachTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveSignalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveSignalDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#34D399',
  },
  liveSignalText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#86EFAC',
    letterSpacing: 0.4,
  },
  gpsLockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  gpsLockText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D1FAE5',
  },
  approachMainTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginTop: 8,
  },
  approachSubtitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#86EFAC',
    marginTop: 2,
  },
  approachDistanceText: {
    color: '#D1FAE5',
    fontWeight: '600',
    fontSize: 12,
  },

  /* --- 2. Live Tracking Map Card --- */
  liveMapWrapper: {
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  liveMapImage: {
    width: '100%',
    height: '100%',
  },
  liveMapOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  speedometerBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  speedValueText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0F172A',
  },
  speedSubText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#64748B',
  },
  corridorCapsule: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#064E3B',
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 12,
  },
  corridorCapsuleText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  corridorGreenDot: {
    color: '#34D399',
    fontSize: 8,
  },
  mapBusMarker: {
    position: 'absolute',
    top: 54,
    left: 140,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    paddingVertical: 3.5,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 5,
    zIndex: 6,
  },
  mapBusMarkerText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  mapBusPointer: {
    position: 'absolute',
    bottom: -4,
    left: 18,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#064E3B',
  },
  pickupCurbBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 8,
    gap: 7,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pickupGreenRing: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupGreenDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#059669',
  },
  pickupCurbTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0F172A',
  },
  pickupCurbSub: {
    fontSize: 8.5,
    color: '#64748B',
    fontWeight: '600',
  },
  recenterBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
      },
    }),
  },

  /* --- Generic Card Base --- */
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
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
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeaderLabel: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 0.5,
  },

  /* --- 3. Verified Captain & Fleet --- */
  driverProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  driverAvatarContainer: {
    position: 'relative',
  },
  driverAvatarPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#CBD5E1',
  },
  verifiedGreenBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  verifiedCheckText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    lineHeight: 11,
  },
  driverNameCol: {
    flex: 1,
  },
  driverNameTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  driverNameText: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  driverRatingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
  },
  driverReviewCount: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 11,
  },
  driverBadgeLine: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  driverBadgeHighlight: {
    color: '#065F46',
    fontWeight: '800',
  },
  vehicleCredentialsBox: {
    backgroundColor: '#F0F4FF', // Soft lavender/blue container
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  vehicleCredentialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vehicleTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vehicleTitleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  plateNumberPill: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  plateNumberText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A',
  },
  securityVerifiedText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#065F46',
  },
  securityIdText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A',
  },
  commActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  callDriverBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F4FF',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  callDriverBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#064E3B',
  },
  directMessageBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#064E3B', // Signature deep green
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  directMessageBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* --- 4. Designated Boarding Spot --- */
  validatedCurbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  validatedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
  },
  validatedCurbText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  boardingSpotInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pinSquircleBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  boardingSpotCol: {
    flex: 1,
  },
  boardingSpotTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  boardingSpotSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  pinSecurityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F4FF',
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  pinInfoCol: {
    flex: 1,
  },
  pinLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
  },
  pinBigDigits: {
    fontSize: 32,
    fontWeight: '900',
    color: '#064E3B',
    letterSpacing: 2.5,
    lineHeight: 36,
    marginTop: 2,
  },
  pinHint: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#64748B',
  },
  qrCodeThumbnailBox: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  qrCodeMatrix: {
    width: 32,
    height: 32,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrDotSquare: {
    width: 12,
    height: 12,
    backgroundColor: '#0F172A',
    borderRadius: 2,
  },

  /* --- 5. Trip Progress Timeline --- */
  timelineList: {
    marginTop: 12,
  },
  timelineItemRow: {
    flexDirection: 'row',
    minHeight: 46,
  },
  timelineIconCol: {
    width: 32,
    alignItems: 'center',
  },
  timelineCheckCircleComplete: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  timelineCheckChar: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  timelineTrackLine: {
    width: 2,
    flex: 1,
    marginVertical: -2,
  },
  trackLineSolid: {
    backgroundColor: '#064E3B',
  },
  trackLineDashed: {
    backgroundColor: '#CBD5E1',
  },
  activePulseRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(34, 197, 94, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  activePulseDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#059669',
  },
  pendingCircleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    zIndex: 2,
  },
  pendingInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
  },
  timelineContentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingLeft: 8,
    paddingTop: 2,
    paddingBottom: 10,
  },
  timelineTitleDone: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  timelineTimeText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  timelineTitleActive: {
    fontSize: 13,
    fontWeight: '900',
    color: '#065F46',
  },
  timelineSubActive: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  nowBadgePill: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 6,
  },
  nowBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
  },
  timelineTitlePending: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  timelineStatusPending: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '600',
  },

  /* --- 6. Emergency SOS Button --- */
  emergencySosBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B91C1C', // Deep crimson red
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#B91C1C',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 3px 10px rgba(185,28,28,0.35)',
      },
    }),
  },
  emergencySosBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  /* --- 7. Cancel Pickup Request Action --- */
  cancelRequestContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelRequestTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  cancelRequestSub: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
});

export default PassengerSafetyScreen;
