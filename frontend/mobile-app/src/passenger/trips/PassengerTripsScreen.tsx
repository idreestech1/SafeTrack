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
  HandHailIcon,
  ArrowLeftIcon,
  ClockIcon,
  SeatArmchairIcon,
  WalletCardIcon,
  QrScanCodeIcon,
  RadioSelectedIcon,
  RadioUnselectedIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from '../icons/PassengerIcons';

const avatarCaptain = require('../../../assets/images/avatar-ahmad.png');
const radarMapAsset = require('../../../assets/images/live-navigation-map.png');

export interface PassengerTripsScreenProps {
  onCancelReselect?: () => void;
  onConfirmSuccess?: () => void;
  onExplorePress?: () => void;
}

export const PassengerTripsScreen: React.FC<PassengerTripsScreenProps> = ({
  onCancelReselect,
  onConfirmSuccess,
  onExplorePress,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<'wallet' | 'cash'>('wallet');
  const [timeoutSeconds, setTimeoutSeconds] = useState(28);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Seat hold countdown timer
  useEffect(() => {
    if (isConfirmed || timeoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeoutSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isConfirmed, timeoutSeconds]);

  const handleConfirmPickup = () => {
    setIsConfirmed(true);
    Alert.alert(
      'Pickup Request Transmitted! 🚍',
      'Captain Muhammad Ali (PK-102) has acknowledged your hail at Saddar Road.\n\nAssigned Seat: #14 (Guaranteed)\nArrival: 2 mins\nFare: PKR 50.00 auto-debited via SmartTransit Wallet.',
      [
        {
          text: 'Track Bus Arrival',
          onPress: () => {
            onConfirmSuccess?.();
            onExplorePress?.();
          },
        },
        { text: 'View Ticket Pass', style: 'cancel' },
      ]
    );
  };

  const handleChangeLandmark = () => {
    Alert.alert(
      'Change Pickup Landmark',
      'Select nearby shelter along Route N-5 corridor:',
      [
        { text: 'Saddar Road Post Office (Current)' },
        { text: 'Cantt Railway Station Bay 3' },
        { text: 'Khyber Bazaar North Platform' },
        { text: 'Cancel', style: 'cancel' },
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
        {/* 1. MULTI-STEP PROGRESS STEPPER (STEP 3 OF 4)              */}
        {/* ========================================================== */}
        <View style={styles.stepperContainer}>
          <View style={styles.stepperHeaderRow}>
            <Text style={styles.stepCountText}>STEP 3 OF 4</Text>
            <View style={styles.liveMatchRow}>
              <View style={styles.liveGreenDot} />
              <Text style={styles.liveMatchText}>Live Match Ready</Text>
            </View>
          </View>

          {/* 4 Segment Progress Bars */}
          <View style={styles.segmentsRow}>
            {/* Step 1: Pickup (Completed Dark Green) */}
            <View style={styles.segmentCol}>
              <View style={[styles.segmentBar, styles.segmentBarComplete]} />
              <Text style={styles.segmentLabelActive}>1. Pickup</Text>
            </View>

            {/* Step 2: Dest (Completed Dark Green) */}
            <View style={styles.segmentCol}>
              <View style={[styles.segmentBar, styles.segmentBarComplete]} />
              <Text style={styles.segmentLabelActive}>2. Dest</Text>
            </View>

            {/* Step 3: Review (Active Vibrant Green) */}
            <View style={styles.segmentCol}>
              <View style={[styles.segmentBar, styles.segmentBarActive]} />
              <Text style={[styles.segmentLabelActive, { color: '#047857' }]}>3. Review</Text>
            </View>

            {/* Step 4: Dispatch (Pending Grey) */}
            <View style={styles.segmentCol}>
              <View style={[styles.segmentBar, styles.segmentBarPending]} />
              <Text style={styles.segmentLabelPending}>4. Dispatch</Text>
            </View>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 2. ROUTE CORRIDOR RADAR MAP CARD                           */}
        {/* ========================================================== */}
        <View style={styles.radarMapBanner}>
          <Image source={radarMapAsset} style={styles.radarMapImage} resizeMode="cover" />
          <View style={styles.radarMapOverlay} />

          {/* Floating Pill on Map */}
          <View style={styles.routeRadarPill}>
            <NavArrowIcon size={13} color="#064E3B" strokeWidth={2.4} />
            <Text style={styles.routeRadarText}>Live Route Radar: 4.2 km corridor</Text>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 3. ROUTE SUMMARY CARD                                      */}
        {/* ========================================================== */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionHeaderLabel}>ROUTE SUMMARY</Text>
            <TouchableOpacity
              style={styles.changeLandmarkBtn}
              activeOpacity={0.75}
              onPress={handleChangeLandmark}
            >
              <CheckCircleIcon size={13} color="#059669" strokeWidth={2.4} />
              <Text style={styles.changeLandmarkText}>Change landmark</Text>
            </TouchableOpacity>
          </View>

          {/* Route Timeline */}
          <View style={styles.timelineContainer}>
            {/* Pickup Stop Row */}
            <View style={styles.stopPointRow}>
              <View style={styles.pickupRingMarker}>
                <View style={styles.pickupInnerDot} />
              </View>
              <View style={styles.stopInfoCol}>
                <View style={styles.stopHeaderTagRow}>
                  <Text style={styles.stopTagLabel}>PICKUP STOP</Text>
                  <View style={styles.gpsPillSmall}>
                    <NavArrowIcon size={10} color="#065F46" strokeWidth={2.2} />
                    <Text style={styles.gpsPillText}>GPS ~3m</Text>
                  </View>
                </View>
                <Text style={styles.stopMainTitle}>Saddar Road Post Office</Text>
                <Text style={styles.stopSubtitle}>Front Gate Shelter, Saddar Bazar Peshawar</Text>
              </View>
            </View>

            {/* Connecting Corridor Distance Strip */}
            <View style={styles.connectorRow}>
              <View style={styles.verticalTrackLine} />
              <View style={styles.transitMetricPill}>
                <Text style={styles.transitArrowIcon}>↷</Text>
                <Text style={styles.transitMetricText}>
                  4.2 km total distance &bull; ~11 mins transit
                </Text>
              </View>
            </View>

            {/* Destination Row */}
            <View style={styles.stopPointRow}>
              <View style={styles.destinationSolidMarker} />
              <View style={styles.stopInfoCol}>
                <Text style={[styles.stopTagLabel, { color: '#065F46' }]}>DESTINATION</Text>
                <Text style={styles.stopMainTitle}>University Road Opp. Islamia College</Text>
                <Text style={styles.stopSubtitle}>North Platform Terminal, Peshawar</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 4. ASSIGNED VEHICLE & CAPTAIN CARD                         */}
        {/* ========================================================== */}
        <View style={styles.cardContainer}>
          {/* Top Pill Badges */}
          <View style={styles.vehiclePillsRow}>
            <View style={styles.busUnitPill}>
              <Text style={styles.busUnitText}>BUS PK-102</Text>
            </View>
            <View style={styles.routePillMint}>
              <Text style={styles.routePillMintText}>Route N-5 Express</Text>
            </View>
            <View style={styles.seatsFreePill}>
              <SeatArmchairIcon size={13} color="#047857" strokeWidth={2.4} />
              <Text style={styles.seatsFreeText}>17 Seats Free</Text>
            </View>
          </View>

          {/* Captain Dossier Box */}
          <View style={styles.captainDossierBox}>
            <Image source={avatarCaptain} style={styles.captainAvatarPhoto} />
            <View style={styles.captainDossierCol}>
              <View style={styles.captainNameRow}>
                <Text style={styles.captainName}>Muhammad Ali</Text>
                <Text style={styles.captainRating}>&starf; 4.8</Text>
              </View>
              <Text style={styles.captainVerification}>KPK Police Verified HTV Captain</Text>
              <View style={styles.fleetFeatureRow}>
                <View style={styles.fleetGreenDot} />
                <Text style={styles.fleetFeatureText}>
                  Hino Metro Air-Conditioned Rapid Fleet
                </Text>
              </View>
            </View>
          </View>

          {/* Estimated Wait & Guaranteed Seat Banner */}
          <View style={styles.estimatedWaitBox}>
            <View style={styles.estimatedWaitLeft}>
              <View style={styles.waitIconRow}>
                <ClockIcon size={14} color="#064E3B" strokeWidth={2.4} />
                <Text style={styles.waitMainTitle}>Estimated Wait: 2 mins</Text>
              </View>
              <Text style={styles.waitSubTitle}>Approaching Saddar Chowk (120m away)</Text>
            </View>

            <View style={styles.guaranteedSeatBadge}>
              <Text style={styles.guaranteedSeatTextTop}>GUARANTEED</Text>
              <Text style={styles.guaranteedSeatTextBottom}>SEAT</Text>
            </View>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 5. FARE & PAYMENT CARD                                     */}
        {/* ========================================================== */}
        <View style={styles.cardContainer}>
          <View style={styles.fareHeaderRow}>
            <Text style={styles.fareSectionTitle}>Fare &amp; Payment</Text>
            <View style={styles.fareAmountCol}>
              <Text style={styles.fareBigAmount}>PKR 50.00</Text>
              <Text style={styles.subsidizedNote}>Govt. Subsidized Urban Fare</Text>
            </View>
          </View>

          {/* Option 1: SmartTransit Digital Wallet (Default Selected) */}
          <TouchableOpacity
            style={[
              styles.paymentOptionBox,
              selectedPayment === 'wallet' && styles.paymentOptionSelected,
            ]}
            activeOpacity={0.85}
            onPress={() => setSelectedPayment('wallet')}
          >
            <View style={styles.radioWrapper}>
              {selectedPayment === 'wallet' ? (
                <RadioSelectedIcon size={19} color="#064E3B" />
              ) : (
                <RadioUnselectedIcon size={19} color="#94A3B8" />
              )}
            </View>

            <View style={styles.paymentInfoCol}>
              <View style={styles.paymentTitleRow}>
                <WalletCardIcon size={15} color="#059669" strokeWidth={2.2} />
                <Text style={styles.paymentTitle}>SmartTransit Digital Wallet</Text>
              </View>
              <Text style={styles.walletBalanceText}>
                Available Balance: <Text style={styles.walletBalanceAmount}>PKR 420.00</Text>
              </Text>
            </View>

            <View style={styles.autopayPill}>
              <Text style={styles.autopayText}>Autopay</Text>
            </View>
          </TouchableOpacity>

          {/* Option 2: Cash on Boarding / QR Code */}
          <TouchableOpacity
            style={[
              styles.paymentOptionBox,
              { marginTop: 8 },
              selectedPayment === 'cash' && styles.paymentOptionSelected,
            ]}
            activeOpacity={0.85}
            onPress={() => setSelectedPayment('cash')}
          >
            <View style={styles.radioWrapper}>
              {selectedPayment === 'cash' ? (
                <RadioSelectedIcon size={19} color="#064E3B" />
              ) : (
                <RadioUnselectedIcon size={19} color="#94A3B8" />
              )}
            </View>

            <View style={styles.paymentInfoCol}>
              <View style={styles.paymentTitleRow}>
                <QrScanCodeIcon size={15} color="#64748B" strokeWidth={2.2} />
                <Text style={styles.paymentTitle}>Cash on Boarding / QR Code</Text>
              </View>
              <Text style={styles.paymentSubText}>Conductor Scan at Entry Gate</Text>
            </View>

            <Text style={styles.manualText}>Manual</Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================== */}
        {/* 6. KPK SAFETY GUARANTEE BOX                                */}
        {/* ========================================================== */}
        <View style={styles.safetyGuaranteeCard}>
          <View style={styles.safetyCardHeaderRow}>
            <View style={styles.safetyShieldIconCircle}>
              <CheckCircleIcon size={16} color="#065F46" strokeWidth={2.4} />
            </View>
            <Text style={styles.safetyCardTitle}>KPK Safety Guarantee</Text>
          </View>
          <Text style={styles.safetyCardBody}>
            Includes KPK Transport Police 24/7 tracking, live GPS broadcast with loved ones, and emergency assistance coverage throughout Route N-5.
          </Text>

          <View style={styles.safetyTagsStrip}>
            <View style={styles.safetyFeatureTag}>
              <ShieldCheckIcon size={12} color="#064E3B" strokeWidth={2.4} />
              <Text style={styles.safetyFeatureTagText}>Verified Vehicle</Text>
            </View>

            <View style={styles.safetyFeatureTag}>
              <Text style={styles.sosAlarmIcon}>🚨</Text>
              <Text style={styles.safetyFeatureTagText}>SOS Trigger Armed</Text>
            </View>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 7. AUTO-HANDSHAKE TIMEOUT BANNER                           */}
        {/* ========================================================== */}
        <View style={styles.timeoutBanner}>
          <ClockIcon size={12} color="#64748B" strokeWidth={2.2} />
          <Text style={styles.timeoutBannerText}>
            Auto-handshake timeout holds seat for{' '}
            <Text style={styles.timeoutGreenSeconds}>{timeoutSeconds}s</Text> AUTO-RELEASE
          </Text>
        </View>

        {/* ========================================================== */}
        {/* 8. ACTION BUTTONS                                          */}
        {/* ========================================================== */}
        {/* Primary Action Button */}
        <TouchableOpacity
          style={[styles.confirmHailBtn, isConfirmed && styles.confirmHailBtnSuccess]}
          activeOpacity={0.88}
          onPress={handleConfirmPickup}
        >
          <HandHailIcon size={18} color="#FFFFFF" strokeWidth={2.2} />
          <Text style={styles.confirmHailBtnText}>
            {isConfirmed
              ? '✓ Pickup Confirmed (Bus PK-102 Approaching)'
              : 'Confirm & Request Pickup (Hail Bus PK-102)'}
          </Text>
        </TouchableOpacity>

        {/* Secondary Action Button */}
        <TouchableOpacity
          style={styles.cancelReselectBtn}
          activeOpacity={0.8}
          onPress={onCancelReselect}
        >
          <ArrowLeftIcon size={14} color="#064E3B" strokeWidth={2.4} />
          <Text style={styles.cancelReselectBtnText}>Cancel &amp; Re-select Vehicle</Text>
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

  /* --- 1. Multi-Step Stepper --- */
  stepperContainer: {
    backgroundColor: '#EEF2FF', // Soft lavender/blue container matching screenshot
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  stepperHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepCountText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#064E3B',
    letterSpacing: 0.3,
  },
  liveMatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
  },
  liveMatchText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#065F46',
  },
  segmentsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentCol: {
    flex: 1,
  },
  segmentBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  segmentBarComplete: {
    backgroundColor: '#064E3B', // Completed dark green
  },
  segmentBarActive: {
    backgroundColor: '#22C55E', // Active step 3 bright green
  },
  segmentBarPending: {
    backgroundColor: '#CBD5E1', // Pending step 4 grey
  },
  segmentLabelActive: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  segmentLabelPending: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#94A3B8',
  },

  /* --- 2. Route Corridor Radar Map --- */
  radarMapBanner: {
    height: 105,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  radarMapImage: {
    width: '100%',
    height: '100%',
  },
  radarMapOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  routeRadarPill: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 8,
    gap: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  routeRadarText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F172A',
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
  changeLandmarkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeLandmarkText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },

  /* --- 3. Route Summary --- */
  timelineContainer: {
    position: 'relative',
  },
  stopPointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  pickupRingMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#059669',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  pickupInnerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#059669',
  },
  destinationSolidMarker: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#064E3B',
    marginTop: 3,
    marginLeft: 1,
  },
  stopInfoCol: {
    flex: 1,
  },
  stopHeaderTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stopTagLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.4,
  },
  gpsPillSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingVertical: 1.5,
    paddingHorizontal: 6,
    borderRadius: 10,
    gap: 3,
  },
  gpsPillText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#065F46',
  },
  stopMainTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 1,
  },
  stopSubtitle: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  connectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  verticalTrackLine: {
    width: 2,
    height: 28,
    backgroundColor: '#CBD5E1',
    marginLeft: 7,
  },
  transitMetricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginLeft: 18,
    gap: 5,
  },
  transitArrowIcon: {
    fontSize: 11,
    color: '#475569',
  },
  transitMetricText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
  },

  /* --- 4. Assigned Vehicle & Captain --- */
  vehiclePillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  busUnitPill: {
    backgroundColor: '#064E3B',
    paddingVertical: 3.5,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  busUnitText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  routePillMint: {
    backgroundColor: '#86EFAC',
    paddingVertical: 3.5,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  routePillMintText: {
    color: '#064E3B',
    fontSize: 10,
    fontWeight: '900',
  },
  seatsFreePill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    gap: 4,
  },
  seatsFreeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#047857',
  },
  captainDossierBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  captainAvatarPhoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CBD5E1',
  },
  captainDossierCol: {
    flex: 1,
  },
  captainNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  captainName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  captainRating: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  captainVerification: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  fleetFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  fleetGreenDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#059669',
  },
  fleetFeatureText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#065F46',
  },
  estimatedWaitBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 11,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  estimatedWaitLeft: {
    flex: 1,
  },
  waitIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  waitMainTitle: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  waitSubTitle: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  guaranteedSeatBadge: {
    backgroundColor: '#1E5336', // Dark green badge
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 7,
    alignItems: 'center',
  },
  guaranteedSeatTextTop: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  guaranteedSeatTextBottom: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  /* --- 5. Fare & Payment --- */
  fareHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fareSectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  fareAmountCol: {
    alignItems: 'flex-end',
  },
  fareBigAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#064E3B',
    lineHeight: 26,
  },
  subsidizedNote: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  paymentOptionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  paymentOptionSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#064E3B',
    borderWidth: 1.5,
  },
  radioWrapper: {
    marginRight: 10,
  },
  paymentInfoCol: {
    flex: 1,
  },
  paymentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paymentTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  walletBalanceText: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  walletBalanceAmount: {
    color: '#047857',
    fontWeight: '800',
  },
  paymentSubText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  autopayPill: {
    backgroundColor: '#86EFAC',
    paddingVertical: 3.5,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  autopayText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#064E3B',
  },
  manualText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },

  /* --- 6. Safety Guarantee --- */
  safetyGuaranteeCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  safetyCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 6,
  },
  safetyShieldIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyCardTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  safetyCardBody: {
    fontSize: 10.5,
    color: '#475569',
    lineHeight: 15.5,
    fontWeight: '500',
  },
  safetyTagsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 10,
  },
  safetyFeatureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  safetyFeatureTagText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#064E3B',
  },
  sosAlarmIcon: {
    fontSize: 11,
  },

  /* --- 7. Timeout Banner --- */
  timeoutBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
    gap: 6,
    marginBottom: 14,
  },
  timeoutBannerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
  },
  timeoutGreenSeconds: {
    color: '#059669',
    fontWeight: '900',
  },

  /* --- 8. Action Buttons --- */
  confirmHailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#064E3B', // Deep forest green
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#064E3B',
        shadowOffset: { width: 0, height: 3 },
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
  confirmHailBtnSuccess: {
    backgroundColor: '#047857',
  },
  confirmHailBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  cancelReselectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  cancelReselectBtnText: {
    color: '#064E3B',
    fontSize: 12,
    fontWeight: '800',
  },
});

export default PassengerTripsScreen;
