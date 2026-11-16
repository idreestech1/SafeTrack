import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DriverHeader } from '../header/DriverHeader';
import { DriverTabKey } from '../bottom_tabs/DriverBottomTabs';
import {
  BusFrontIcon,
  ShieldCheckIcon,
  IdCardIcon,
  StarIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  SettingsIcon,
  LogOutIcon,
  MapPinIcon,
  PhoneCallIcon,
} from '../icons/DriverIcons';

export interface DriverProfileScreenProps {
  showHeader?: boolean;
  onNavigateTab?: (tab: DriverTabKey) => void;
  onSosPress?: () => void;
}

export const DriverProfileScreen: React.FC<DriverProfileScreenProps> = ({
  showHeader = true,
  onNavigateTab,
  onSosPress,
}) => {
  const insets = useSafeAreaInsets();
  const [acceptHails, setAcceptHails] = useState(true);
  const [overspeedAlerts, setOverspeedAlerts] = useState(true);
  const [autoBeacon, setAutoBeacon] = useState(true);

  const handleDownloadSmartPass = () => {
    Alert.alert(
      'KPK SmartPass Generated',
      'Digital Transit Captain ID for Muhammad Ali (#DRV-4412) with QR Code & NADRA Bio-Stamp exported to local downloads.',
      [{ text: 'Open Digital Pass', style: 'default' }]
    );
  };

  const handleViewEarnings = () => {
    Alert.alert(
      'Monthly Shift Earnings',
      'Gross Accrued: PKR 84,200\nCompleted Trips: 128 Runs\nOn-Time Bonus: PKR 6,500\nSafety Compliance Dividend: PKR 4,000\nDisbursement Date: 1st of next month.'
    );
  };

  const handleEndShift = () => {
    Alert.alert(
      'End Duty Shift & Clock Out',
      'Confirm clocking out from Corridor RT-01? Bus PK-102 will be scheduled for terminal depot bay parking.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Clock Out',
          style: 'destructive',
          onPress: () => {
            if (onNavigateTab) onNavigateTab('home');
            Alert.alert('Shift Closed', 'Shift summary logged with Central Transport Bureau.');
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
        {/* Quick Nav Bar back to Cockpit or Settings */}
        {onNavigateTab && (
          <View style={styles.topNavRow}>
            <TouchableOpacity
              style={styles.navBackBtn}
              activeOpacity={0.7}
              onPress={() => onNavigateTab('home')}
            >
              <ChevronLeftIcon size={14} color="#064E3B" strokeWidth={2.4} />
              <Text style={styles.navBackBtnText}>Cockpit Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navSettingsBtn}
              activeOpacity={0.7}
              onPress={() => onNavigateTab('settings')}
            >
              <SettingsIcon size={14} color="#047857" strokeWidth={2.2} />
              <Text style={styles.navSettingsBtnText}>Settings</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ========================================================== */}
        {/* 1. CAPTAIN HERO PROFILE CARD                               */}
        {/* ========================================================== */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            {/* Captain Avatar with Gold Verification Border */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitials}>MA</Text>
              </View>
              <View style={styles.verifiedCheckPill}>
                <CheckCircleIcon size={12} color="#FFFFFF" strokeWidth={2.8} />
              </View>
            </View>

            {/* Captain Info Column */}
            <View style={styles.heroInfoCol}>
              <View style={styles.badgeRow}>
                <View style={styles.pilotIdPill}>
                  <Text style={styles.pilotIdText}>#DRV-4412</Text>
                </View>
                <View style={styles.gradePill}>
                  <Text style={styles.gradePillText}>GRADE A PILOT</Text>
                </View>
              </View>

              <Text style={styles.captainName}>Muhammad Ali</Text>
              <Text style={styles.captainRole}>
                Senior Commercial Transit Captain
              </Text>

              <View style={styles.ratingRow}>
                <StarIcon size={13} color="#FBBF24" />
                <Text style={styles.ratingScore}>4.9</Text>
                <Text style={styles.ratingTotal}>/ 5.0</Text>
                <Text style={styles.ratingRank}>(Top 1% in Peshawar)</Text>
              </View>
            </View>
          </View>

          {/* Bottom Corridor & Shift Duty Strip */}
          <View style={styles.heroDutyStrip}>
            <View style={styles.dutyDotGreen} />
            <Text style={styles.dutyStripText} numberOfLines={1}>
              Active Shift • RT-01 Corridor (Peshawar Cantt ⇄ Mardan)
            </Text>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 2. PERFORMANCE & TRUST METRICS RIBBON (3 STAT CARDS)       */}
        {/* ========================================================== */}
        <View style={styles.statsRibbon}>
          {/* Card 1: Trips */}
          <View style={styles.statBox}>
            <Text style={styles.statBigNum}>1,248</Text>
            <Text style={styles.statLabel}>Trips Logged</Text>
            <Text style={styles.statSub}>100% On-Time</Text>
          </View>

          {/* Card 2: Safety Score */}
          <View style={styles.statBox}>
            <Text style={[styles.statBigNum, { color: '#047857' }]}>98.4%</Text>
            <Text style={styles.statLabel}>Safety Score</Text>
            <Text style={styles.statSub}>Zero Violations</Text>
          </View>

          {/* Card 3: Commuters */}
          <View style={styles.statBox}>
            <Text style={styles.statBigNum}>28.4k</Text>
            <Text style={styles.statLabel}>Citizens Served</Text>
            <Text style={styles.statSub}>Peshawar Division</Text>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 3. OFFICIAL GOVERNMENT CREDENTIALS & LICENSES              */}
        {/* ========================================================== */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Government Verification</Text>
          <View style={styles.nadraVerifiedBadge}>
            <ShieldCheckIcon size={12} color="#15803D" strokeWidth={2.2} />
            <Text style={styles.nadraVerifiedText}>NADRA BIO-LOCK</Text>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.credentialRow}>
            <Text style={styles.credentialKey}>National CNIC</Text>
            <Text style={styles.credentialVal}>17301-4492102-1</Text>
          </View>
          <View style={styles.credentialDivider} />

          <View style={styles.credentialRow}>
            <Text style={styles.credentialKey}>Commercial HTV License</Text>
            <View style={styles.credValueGroup}>
              <Text style={styles.credentialVal}>#KPK-88412-COMM</Text>
              <View style={styles.expPill}>
                <Text style={styles.expPillText}>Valid 2028</Text>
              </View>
            </View>
          </View>
          <View style={styles.credentialDivider} />

          <View style={styles.credentialRow}>
            <Text style={styles.credentialKey}>Transport Authority Reg.</Text>
            <Text style={styles.credentialVal}>KPK-TMTA-77491</Text>
          </View>
          <View style={styles.credentialDivider} />

          <View style={styles.credentialRow}>
            <Text style={styles.credentialKey}>Medical &amp; Drug Test</Text>
            <Text style={[styles.credentialVal, { color: '#047857' }]}>
              Class-1 Certified (Passed Oct 2026)
            </Text>
          </View>
          <View style={styles.credentialDivider} />

          <View style={styles.credentialRow}>
            <Text style={styles.credentialKey}>Police Background Check</Text>
            <Text style={[styles.credentialVal, { color: '#047857' }]}>
              Clear Record (Insp. Rashid Verified)
            </Text>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 4. ASSIGNED FLEET VEHICLE DOSSIER                          */}
        {/* ========================================================== */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Assigned Fleet Vehicle</Text>
          <View style={styles.busAvailablePill}>
            <Text style={styles.busAvailableText}>ACTIVE ON CORRIDOR</Text>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.busInfoTopRow}>
            <View style={styles.busIconBox}>
              <BusFrontIcon size={20} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View style={styles.busTitleCol}>
              <Text style={styles.busModelName}>Hino Metro AC • 45-Seater</Text>
              <Text style={styles.busRegNumber}>Reg: KP-MN-9921 • Unit PK-102</Text>
            </View>
            <View style={styles.depotBasePill}>
              <Text style={styles.depotBaseText}>Bay 3 Depot</Text>
            </View>
          </View>

          <View style={styles.busTelemetryGrid}>
            <View style={styles.busTeleItem}>
              <Text style={styles.busTeleKey}>Fuel &amp; Range</Text>
              <Text style={styles.busTeleVal}>92% (280 km)</Text>
            </View>
            <View style={styles.busTeleItem}>
              <Text style={styles.busTeleKey}>OBD CAN Health</Text>
              <Text style={[styles.busTeleVal, { color: '#047857' }]}>99.8% Perfect</Text>
            </View>
            <View style={styles.busTeleItem}>
              <Text style={styles.busTeleKey}>GNSS Satellite</Text>
              <Text style={styles.busTeleVal}>12 Sats Locked</Text>
            </View>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 5. OPERATIONAL PREFERENCES & SAFETY SWITCHES               */}
        {/* ========================================================== */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Operational Safety Controls</Text>
        </View>

        <View style={styles.cardContainer}>
          {/* Toggle 1: Passenger Hails */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={styles.toggleTitle}>Accept Commuter Hails</Text>
              <Text style={styles.toggleSub}>
                Allow roadside pickup requests along active route
              </Text>
            </View>
            <Switch
              value={acceptHails}
              onValueChange={setAcceptHails}
              trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
              thumbColor={acceptHails ? '#064E3B' : '#F1F5F9'}
            />
          </View>
          <View style={styles.credentialDivider} />

          {/* Toggle 2: Overspeed Alerts */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={styles.toggleTitle}>Cabin Overspeed Audio Alarm</Text>
              <Text style={styles.toggleSub}>
                Warning beep when exceeding 65 km/h urban limit
              </Text>
            </View>
            <Switch
              value={overspeedAlerts}
              onValueChange={setOverspeedAlerts}
              trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
              thumbColor={overspeedAlerts ? '#064E3B' : '#F1F5F9'}
            />
          </View>
          <View style={styles.credentialDivider} />

          {/* Toggle 3: Auto Beacon Relay */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={styles.toggleTitle}>Auto-Relay Emergency SOS</Text>
              <Text style={styles.toggleSub}>
                Direct dispatch link to 1122 and Highway Interceptor
              </Text>
            </View>
            <Switch
              value={autoBeacon}
              onValueChange={setAutoBeacon}
              trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
              thumbColor={autoBeacon ? '#064E3B' : '#F1F5F9'}
            />
          </View>
        </View>

        {/* ========================================================== */}
        {/* 6. ACCOUNT & SMARTPASS QUICK ACTIONS                       */}
        {/* ========================================================== */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Captain SmartPass &amp; Payroll</Text>
        </View>

        <View style={styles.cardContainer}>
          {/* Digital SmartPass */}
          <TouchableOpacity
            style={styles.actionMenuRow}
            activeOpacity={0.7}
            onPress={handleDownloadSmartPass}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <IdCardIcon size={16} color="#2563EB" strokeWidth={2} />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>Download KP Digital Captain Pass</Text>
              <Text style={styles.menuSub}>Verified QR identity card with biometric hash</Text>
            </View>
            <ChevronRightIcon size={14} color="#94A3B8" />
          </TouchableOpacity>
          <View style={styles.credentialDivider} />

          {/* Earnings & Pay Slip */}
          <TouchableOpacity
            style={styles.actionMenuRow}
            activeOpacity={0.7}
            onPress={handleViewEarnings}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#F0FDF4' }]}>
              <Text style={styles.pkrCurrencyText}>PKR</Text>
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>Monthly Earnings &amp; Safety Bonus</Text>
              <Text style={styles.menuSub}>Accrued: PKR 84,200 this month</Text>
            </View>
            <ChevronRightIcon size={14} color="#94A3B8" />
          </TouchableOpacity>
          <View style={styles.credentialDivider} />

          {/* Next of Kin Emergency Contacts */}
          <TouchableOpacity
            style={styles.actionMenuRow}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                'Next of Kin Emergency Contact',
                'Designated Contact: Qasim Shah (Father)\nPhone: +92 300 4488219\nAddress: Sector G-2, Hayatabad, Peshawar'
              )
            }
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#FEE2E2' }]}>
              <PhoneCallIcon size={14} color="#DC2626" strokeWidth={2.2} />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>Emergency Contact Dossier</Text>
              <Text style={styles.menuSub}>Qasim Shah (Father) • +92 300 4488219</Text>
            </View>
            <ChevronRightIcon size={14} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* ========================================================== */}
        {/* 7. CLOCK OUT & END SHIFT BUTTON                            */}
        {/* ========================================================== */}
        <TouchableOpacity
          style={styles.clockOutButton}
          activeOpacity={0.85}
          onPress={handleEndShift}
        >
          <LogOutIcon size={16} color="#DC2626" strokeWidth={2.2} />
          <Text style={styles.clockOutText}>End Duty Shift &amp; Clock Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Action Button: SOS ALERT */}
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

  /* --- Top Nav Row --- */
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  navBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 4,
  },
  navBackBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#064E3B',
  },
  navSettingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 5,
  },
  navSettingsBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#334155',
  },

  /* --- 1. Captain Hero Profile Card --- */
  heroCard: {
    backgroundColor: '#064E3B', // Deep forest green
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#064E3B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 14px rgba(6, 78, 59, 0.25)',
      },
    }),
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#047857',
    borderWidth: 2.5,
    borderColor: '#86EFAC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  verifiedCheckPill: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#064E3B',
  },
  heroInfoCol: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  pilotIdPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  pilotIdText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  gradePill: {
    backgroundColor: '#86EFAC',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  gradePillText: {
    color: '#064E3B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  captainName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  captainRole: {
    fontSize: 11,
    color: '#A7F3D0',
    fontWeight: '600',
    marginTop: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingScore: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  ratingTotal: {
    color: '#A7F3D0',
    fontSize: 10,
    fontWeight: '700',
  },
  ratingRank: {
    color: '#86EFAC',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  heroDutyStrip: {
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  dutyDotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
  },
  dutyStripText: {
    color: '#ECFDF5',
    fontSize: 10.5,
    fontWeight: '700',
    flex: 1,
  },

  /* --- 2. Stats Ribbon --- */
  statsRibbon: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statBigNum: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
    marginTop: 2,
  },
  statSub: {
    fontSize: 9,
    color: '#059669',
    fontWeight: '700',
    marginTop: 1,
  },

  /* --- Section Common Headers --- */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  nadraVerifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  nadraVerifiedText: {
    color: '#15803D',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  busAvailablePill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  busAvailableText: {
    color: '#3730A3',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.3,
  },

  /* --- Common Card Container --- */
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },

  /* --- 3. Credentials Rows --- */
  credentialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  credentialKey: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  credentialVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  credValueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  expPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  expPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569',
  },
  credentialDivider: {
    height: 1,
    backgroundColor: '#F8FAFC',
    marginVertical: 8,
  },

  /* --- 4. Assigned Bus Specs --- */
  busInfoTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  busIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  busTitleCol: {
    flex: 1,
  },
  busModelName: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  busRegNumber: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
    fontWeight: '500',
  },
  depotBasePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  depotBaseText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#475569',
  },
  busTelemetryGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-between',
  },
  busTeleItem: {
    alignItems: 'center',
  },
  busTeleKey: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '600',
  },
  busTeleVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },

  /* --- 5. Toggle Preferences --- */
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleTextCol: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  toggleSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },

  /* --- 6. Quick Action Menus --- */
  actionMenuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 2,
  },
  menuIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pkrCurrencyText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#059669',
  },
  menuTextCol: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  menuSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },

  /* --- 7. Clock Out Button --- */
  clockOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    paddingVertical: 13,
    gap: 7,
    marginBottom: 20,
  },
  clockOutText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '800',
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

export default DriverProfileScreen;

