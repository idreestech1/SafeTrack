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
  MoonIcon,
  SunIcon,
  GlobeAltIcon,
  VolumeHighIcon,
  BellRingIcon,
  BluetoothIcon,
  SmartphoneIcon,
  Trash2Icon,
  RefreshCwIcon,
  SlidersIcon,
  InfoCircleIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  LogOutIcon,
  MapPinIcon,
  CheckCircleIcon,
} from '../icons/DriverIcons';

export interface DriverSettingsScreenProps {
  showHeader?: boolean;
  onNavigateTab?: (tab: DriverTabKey) => void;
  onSosPress?: () => void;
}

export const DriverSettingsScreen: React.FC<DriverSettingsScreenProps> = ({
  showHeader = true,
  onNavigateTab,
  onSosPress,
}) => {
  const insets = useSafeAreaInsets();

  // Cockpit & Display State
  const [nightModeHUD, setNightModeHUD] = useState(false);
  const [keepScreenAwake, setKeepScreenAwake] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ur' | 'ps'>('en');
  const [volumeLevel, setVolumeLevel] = useState<'low' | 'normal' | 'loud'>('normal');

  // Navigation & Audio Prompts
  const [voiceGuidance, setVoiceGuidance] = useState(true);
  const [stopApproachChime, setStopApproachChime] = useState(true);
  const [autoRerouteTraffic, setAutoRerouteTraffic] = useState(true);

  // Safety Peripherals & Telemetry
  const [dmsSensitivity, setDmsSensitivity] = useState<'standard' | 'high'>('high');
  const [autoCamCloudSync, setAutoCamCloudSync] = useState(true);
  const [vibrateOnHail, setVibrateOnHail] = useState(true);
  const [autoDeclineFull, setAutoDeclineFull] = useState(true);

  // Cache state
  const [cacheSize, setCacheSize] = useState('42.8 MB');

  const handleClearCache = () => {
    Alert.alert(
      'Clear Application Cache',
      `Free up ${cacheSize} of offline route maps, logs, and commuter avatars? Essential route blueprints will remain safe.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Cache',
          style: 'destructive',
          onPress: () => {
            setCacheSize('0.0 KB');
            Alert.alert('Cache Cleared', 'Temporary cache safely cleared.');
          },
        },
      ]
    );
  };

  const handleDiagnosticSelfTest = () => {
    Alert.alert(
      'Running Hardware Self-Test',
      '• RTK-GNSS Satellite: 12 Sats Locked (0.8m dev)\n• OBD-II CAN Bus: 99.8% Healthy (Unit PK-102)\n• Safety DMS Camera: Online (1080p stream)\n• KP Central Dispatch: Connected (24ms ping)\n\nSystem Health: DEFCON 1 ALL GREEN',
      [{ text: 'Dismiss', style: 'default' }]
    );
  };

  const handleUpdateOfflineMap = () => {
    Alert.alert(
      'Offline Map Synced',
      'Peshawar — Nowshera — Mardan N-5 Highway Corridor map pack is up to date (Latest Provincial Highway Edition).'
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

  const handleLogOut = () => {
    Alert.alert(
      'End Shift & Log Out',
      'Are you sure you want to log out of the Driver Terminal? Current shift for Muhammad Ali (#DRV-4412) will be closed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            if (onNavigateTab) onNavigateTab('home');
            Alert.alert('Logged Out', 'Duty session closed.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.screenWrapper}>
      {/* Standalone Header if rendered outside tabs */}
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
        {/* 1. CAPTAIN QUICK GLANCE BANNER WITH DIRECT PROFILE LINK   */}
        {/* ========================================================== */}
        <TouchableOpacity
          style={styles.profileBanner}
          activeOpacity={0.88}
          onPress={() => onNavigateTab?.('profile')}
        >
          <View style={styles.profileBannerRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>MA</Text>
              <View style={styles.verifiedDot}>
                <CheckCircleIcon size={10} color="#FFFFFF" strokeWidth={3} />
              </View>
            </View>

            <View style={styles.profileInfoCol}>
              <View style={styles.pilotBadgeRow}>
                <View style={styles.pilotIdPill}>
                  <Text style={styles.pilotIdText}>#DRV-4412</Text>
                </View>
                <View style={styles.verifiedGovPill}>
                  <ShieldCheckIcon size={10} color="#15803D" strokeWidth={2.4} />
                  <Text style={styles.verifiedGovText}>NADRA BIO-LOCKED</Text>
                </View>
              </View>
              <Text style={styles.captainName}>Muhammad Ali</Text>
              <Text style={styles.captainRole}>
                Senior Transit Captain • Grade A Pilot
              </Text>
            </View>

            <View style={styles.viewProfileBtn}>
              <Text style={styles.viewProfileText}>Dossier</Text>
              <ChevronRightIcon size={12} color="#064E3B" strokeWidth={2.4} />
            </View>
          </View>
        </TouchableOpacity>

        {/* ========================================================== */}
        {/* 2. COCKPIT DISPLAY & LOCALIZATION                         */}
        {/* ========================================================== */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Cockpit Display &amp; Language</Text>
        </View>

        <View style={styles.cardContainer}>
          {/* Language Selection */}
          <View style={styles.settingRow}>
            <View style={styles.settingIconCol}>
              <GlobeAltIcon size={18} color="#2563EB" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Terminal Language</Text>
              <Text style={styles.settingSub}>Select regional driver interface dialect</Text>
            </View>
          </View>

          <View style={styles.languageSegmentRow}>
            <TouchableOpacity
              style={[
                styles.languageBtn,
                selectedLanguage === 'en' && styles.languageBtnActive,
              ]}
              onPress={() => setSelectedLanguage('en')}
            >
              <Text
                style={[
                  styles.languageBtnText,
                  selectedLanguage === 'en' && styles.languageBtnTextActive,
                ]}
              >
                English
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageBtn,
                selectedLanguage === 'ur' && styles.languageBtnActive,
              ]}
              onPress={() => setSelectedLanguage('ur')}
            >
              <Text
                style={[
                  styles.languageBtnText,
                  selectedLanguage === 'ur' && styles.languageBtnTextActive,
                ]}
              >
                اردو (Urdu)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageBtn,
                selectedLanguage === 'ps' && styles.languageBtnActive,
              ]}
              onPress={() => setSelectedLanguage('ps')}
            >
              <Text
                style={[
                  styles.languageBtnText,
                  selectedLanguage === 'ps' && styles.languageBtnTextActive,
                ]}
              >
                پښتو (Pashto)
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Night Drive HUD High Contrast */}
          <View style={styles.settingRow}>
            <View style={styles.settingIconCol}>
              {nightModeHUD ? (
                <MoonIcon size={18} color="#6366F1" />
              ) : (
                <SunIcon size={18} color="#D97706" />
              )}
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Night Drive HUD Mode</Text>
              <Text style={styles.settingSub}>
                Glare-reducing high contrast theme for highway night runs
              </Text>
            </View>
            <Switch
              value={nightModeHUD}
              onValueChange={setNightModeHUD}
              trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
              thumbColor={nightModeHUD ? '#064E3B' : '#F1F5F9'}
            />
          </View>

          <View style={styles.divider} />

          {/* Keep Screen Awake */}
          <View style={styles.settingRow}>
            <View style={styles.settingIconCol}>
              <SmartphoneIcon size={18} color="#059669" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Keep Screen Awake on Duty</Text>
              <Text style={styles.settingSub}>
                Prevents display sleep while bus is underway
              </Text>
            </View>
            <Switch
              value={keepScreenAwake}
              onValueChange={setKeepScreenAwake}
              trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
              thumbColor={keepScreenAwake ? '#064E3B' : '#F1F5F9'}
            />
          </View>
        </View>

        {/* ========================================================== */}
        {/* 3. NAVIGATION & AUDIO PROMPTS                             */}
        {/* ========================================================== */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Navigation &amp; Voice Guidance</Text>
        </View>

        <View style={styles.cardContainer}>
          {/* Voice Guidance Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingIconCol}>
              <VolumeHighIcon size={18} color="#059669" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Turn-by-Turn Audio Navigation</Text>
              <Text style={styles.settingSub}>
                Voice alerts for highway interchanges &amp; stops
              </Text>
            </View>
            <Switch
              value={voiceGuidance}
              onValueChange={setVoiceGuidance}
              trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
              thumbColor={voiceGuidance ? '#064E3B' : '#F1F5F9'}
            />
          </View>

          <View style={styles.divider} />

          {/* Prompt Volume Level */}
          <View style={styles.settingRow}>
            <View style={styles.settingIconCol}>
              <SlidersIcon size={18} color="#475569" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Cabin Guidance Volume</Text>
              <Text style={styles.settingSub}>Adjust speaker acoustic level for engine noise</Text>
            </View>
          </View>

          <View style={styles.volumeSegmentRow}>
            <TouchableOpacity
              style={[
                styles.volumeBtn,
                volumeLevel === 'low' && styles.volumeBtnActive,
              ]}
              onPress={() => setVolumeLevel('low')}
            >
              <Text
                style={[
                  styles.volumeBtnText,
                  volumeLevel === 'low' && styles.volumeBtnTextActive,
                ]}
              >
                Low (50%)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.volumeBtn,
                volumeLevel === 'normal' && styles.volumeBtnActive,
              ]}
              onPress={() => setVolumeLevel('normal')}
            >
              <Text
                style={[
                  styles.volumeBtnText,
                  volumeLevel === 'normal' && styles.volumeBtnTextActive,
                ]}
              >
                Standard (80%)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.volumeBtn,
                volumeLevel === 'loud' && styles.volumeBtnActive,
              ]}
              onPress={() => setVolumeLevel('loud')}
            >
              <Text
                style={[
                  styles.volumeBtnText,
                  volumeLevel === 'loud' && styles.volumeBtnTextActive,
                ]}
              >
                High (100%)
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Stop Approach Chime */}
          <View style={styles.settingRow}>
            <View style={styles.settingIconCol}>
              <BellRingIcon size={18} color="#D97706" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Station Arrival Chime</Text>
              <Text style={styles.settingSub}>
                Play acoustic tone 200m before designated transit stations
              </Text>
            </View>
            <Switch
              value={stopApproachChime}
              onValueChange={setStopApproachChime}
              trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
              thumbColor={stopApproachChime ? '#064E3B' : '#F1F5F9'}
            />
          </View>

          <View style={styles.divider} />

          {/* Traffic Jam Auto-Reroute */}
          <View style={styles.settingRow}>
            <View style={styles.settingIconCol}>
              <RefreshCwIcon size={17} color="#059669" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Smart Corridor Rerouting</Text>
              <Text style={styles.settingSub}>
                Dynamically avoid bottlenecks &amp; roadworks on GT Highway
              </Text>
            </View>
            <Switch
              value={autoRerouteTraffic}
              onValueChange={setAutoRerouteTraffic}
              trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
              thumbColor={autoRerouteTraffic ? '#064E3B' : '#F1F5F9'}
            />
          </View>

          <View style={styles.divider} />

          {/* Offline Corridor Map Cache */}
          <View style={styles.settingRow}>
            <View style={styles.settingIconCol}>
              <RefreshCwIcon size={17} color="#2563EB" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Offline Highway Corridor Maps</Text>
              <Text style={styles.settingSub}>
                GT N-5 (Peshawar ⇄ Nowshera ⇄ Mardan) • 148 MB Cached
              </Text>
            </View>
            <TouchableOpacity
              style={styles.syncBtnPill}
              activeOpacity={0.8}
              onPress={handleUpdateOfflineMap}
            >
              <Text style={styles.syncBtnText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 4. SAFETY HARDWARE & PERIPHERALS                          */}
        {/* ========================================================== */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Safety Hardware &amp; Telemetry</Text>
          <View style={styles.activePillGreen}>
            <Text style={styles.activePillText}>DEFCON 1 SAFE</Text>
          </View>
        </View>

        <View style={styles.cardContainer}>
          {/* OBD-II CAN Link */}
          <View style={styles.settingRow}>
            <View style={styles.settingIconCol}>
              <BluetoothIcon size={18} color="#2563EB" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>OBD-II CAN Diagnostic Link</Text>
              <Text style={styles.settingSub}>
                Paired with Bus PK-102 (Hino CAN-Bus v4.2)
              </Text>
            </View>
            <View style={styles.statusPillActive}>
              <View style={styles.greenDotSmall} />
              <Text style={styles.statusPillText}>LOCKED</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* DMS Sensitivity */}
          <View style={styles.settingRow}>
            <View style={styles.settingIconCol}>
              <ShieldCheckIcon size={18} color="#047857" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>DMS AI Fatigue Sensitivity</Text>
              <Text style={styles.settingSub}>
                Triggers cabin alarm if driver eyes close for &gt;1.5s
              </Text>
            </View>
          </View>

          <View style={styles.sensitivityRow}>
            <TouchableOpacity
              style={[
                styles.sensBtn,
                dmsSensitivity === 'standard' && styles.sensBtnActive,
              ]}
              onPress={() => setDmsSensitivity('standard')}
            >
              <Text
                style={[
                  styles.sensBtnText,
                  dmsSensitivity === 'standard' && styles.sensBtnTextActive,
                ]}
              >
                Standard (2.0s threshold)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sensBtn,
                dmsSensitivity === 'high' && styles.sensBtnActive,
              ]}
              onPress={() => setDmsSensitivity('high')}
            >
              <Text
                style={[
                  styles.sensBtnText,
                  dmsSensitivity === 'high' && styles.sensBtnTextActive,
                ]}
              >
                High Safety (1.5s)
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Auto Camera Snapshot Upload */}
          <View style={styles.settingRow}>
            <View style={styles.settingIconCol}>
              <InfoCircleIcon size={18} color="#0284C7" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Auto-Sync Incident Telemetry</Text>
              <Text style={styles.settingSub}>
                Upload 30s cabin video clip on harsh braking or SOS
              </Text>
            </View>
            <Switch
              value={autoCamCloudSync}
              onValueChange={setAutoCamCloudSync}
              trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
              thumbColor={autoCamCloudSync ? '#064E3B' : '#F1F5F9'}
            />
          </View>
        </View>

        {/* ========================================================== */}
        {/* 5. COMMUTER HAILS & DISPATCH PREFERENCES                  */}
        {/* ========================================================== */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Commuter Hails &amp; Dispatch</Text>
        </View>

        <View style={styles.cardContainer}>
          {/* Vibrate on Request */}
          <View style={styles.settingRow}>
            <View style={styles.settingIconCol}>
              <SmartphoneIcon size={18} color="#6366F1" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Vibrate On Instant Hail</Text>
              <Text style={styles.settingSub}>
                Tactile pulse when passenger requests pickup
              </Text>
            </View>
            <Switch
              value={vibrateOnHail}
              onValueChange={setVibrateOnHail}
              trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
              thumbColor={vibrateOnHail ? '#064E3B' : '#F1F5F9'}
            />
          </View>

          <View style={styles.divider} />

          {/* Auto Decline when 100% full */}
          <View style={styles.settingRow}>
            <View style={styles.settingIconCol}>
              <SlidersIcon size={18} color="#D97706" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Auto-Mute Hails at Full Capacity</Text>
              <Text style={styles.settingSub}>
                Automatically balance requests when 45/45 seats occupied
              </Text>
            </View>
            <Switch
              value={autoDeclineFull}
              onValueChange={setAutoDeclineFull}
              trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
              thumbColor={autoDeclineFull ? '#064E3B' : '#F1F5F9'}
            />
          </View>
        </View>

        {/* ========================================================== */}
        {/* 6. STORAGE, CACHE & SYSTEM DIAGNOSTICS                    */}
        {/* ========================================================== */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>System Diagnostics &amp; Cache</Text>
        </View>

        <View style={styles.cardContainer}>
          {/* Hardware Diagnostic Self-Test */}
          <TouchableOpacity
            style={styles.actionMenuRow}
            activeOpacity={0.7}
            onPress={handleDiagnosticSelfTest}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#ECFDF5' }]}>
              <RefreshCwIcon size={16} color="#047857" strokeWidth={2.2} />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>Run Full System Diagnostics</Text>
              <Text style={styles.menuSub}>Test RTK GPS, CAN Bus, Camera &amp; Cloud Socket</Text>
            </View>
            <ChevronRightIcon size={14} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Clear Cache */}
          <TouchableOpacity
            style={styles.actionMenuRow}
            activeOpacity={0.7}
            onPress={handleClearCache}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Trash2Icon size={15} color="#DC2626" strokeWidth={2.2} />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>Clear App Cache</Text>
              <Text style={styles.menuSub}>Current temporary data: {cacheSize}</Text>
            </View>
            <ChevronRightIcon size={14} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* App Version Info */}
          <View style={styles.versionRow}>
            <View>
              <Text style={styles.versionTitle}>SmartTransit KP Driver Terminal</Text>
              <Text style={styles.versionSub}>
                Build v2.4.1 (Build 890) • Official Government Edition
              </Text>
            </View>
            <View style={styles.versionPill}>
              <Text style={styles.versionPillText}>UP TO DATE</Text>
            </View>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 7. END DUTY / LOG OUT BUTTON                               */}
        {/* ========================================================== */}
        <TouchableOpacity
          style={styles.logOutButton}
          activeOpacity={0.85}
          onPress={handleLogOut}
        >
          <LogOutIcon size={16} color="#DC2626" strokeWidth={2.2} />
          <Text style={styles.logOutText}>Log Out &amp; End Duty Session</Text>
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

  /* --- 1. Captain Banner --- */
  profileBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
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
  profileBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    color: '#86EFAC',
    fontSize: 17,
    fontWeight: '900',
  },
  verifiedDot: {
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
  profileInfoCol: {
    flex: 1,
  },
  pilotBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  pilotIdPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  pilotIdText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#475569',
  },
  verifiedGovPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    gap: 3,
  },
  verifiedGovText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#15803D',
    letterSpacing: 0.2,
  },
  captainName: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  captainRole: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  viewProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 3,
  },
  viewProfileText: {
    color: '#064E3B',
    fontSize: 11,
    fontWeight: '800',
  },

  /* --- Section Common Header --- */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.1,
  },
  activePillGreen: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 5,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#15803D',
    letterSpacing: 0.3,
  },

  /* --- Card Container --- */
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingIconCol: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTextCol: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  settingSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
    lineHeight: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },

  /* --- Language Segment --- */
  languageSegmentRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    marginTop: 10,
    gap: 4,
  },
  languageBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 7,
    alignItems: 'center',
  },
  languageBtnActive: {
    backgroundColor: '#064E3B',
  },
  languageBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  languageBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  /* --- Volume Segment --- */
  volumeSegmentRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    marginTop: 10,
    gap: 4,
  },
  volumeBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 7,
    alignItems: 'center',
  },
  volumeBtnActive: {
    backgroundColor: '#064E3B',
  },
  volumeBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  volumeBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  /* --- Sync Pill Button --- */
  syncBtnPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  syncBtnText: {
    color: '#2563EB',
    fontSize: 10.5,
    fontWeight: '800',
  },

  /* --- Status Pill Active --- */
  statusPillActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
    gap: 4,
  },
  greenDotSmall: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#16A34A',
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#15803D',
    letterSpacing: 0.3,
  },

  /* --- Sensitivity Row --- */
  sensitivityRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  sensBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  sensBtnActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  sensBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  sensBtnTextActive: {
    color: '#064E3B',
    fontWeight: '800',
  },

  /* --- Action Menu Items --- */
  actionMenuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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

  /* --- Version Row --- */
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  versionTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  versionSub: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 1,
  },
  versionPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  versionPillText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.3,
  },

  /* --- Log Out Button --- */
  logOutButton: {
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
  logOutText: {
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
    backgroundColor: '#991B1B',
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

export default DriverSettingsScreen;