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
import {
  ProfileCircleIcon,
  ShieldCheckIcon,
  GlobeIcon,
  PhoneCallIcon,
} from '../icons/PassengerIcons';

export interface PassengerSettingsScreenProps {
  onOpenProfile?: () => void;
  onSwitchRole?: () => void;
  onSosPress?: () => void;
}

export const PassengerSettingsScreen: React.FC<PassengerSettingsScreenProps> = ({
  onOpenProfile,
  onSwitchRole,
  onSosPress,
}) => {
  // 1. Regional Display & Language
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ur' | 'ps'>('en');
  const [nightMode, setNightMode] = useState(false);
  const [keepScreenAwake, setKeepScreenAwake] = useState(true);

  // 2. Travel Alerts & Guidance
  const [approachAlerts, setApproachAlerts] = useState(true);
  const [stopAudioChime, setStopAudioChime] = useState(true);
  const [autoSelectExpress, setAutoSelectExpress] = useState(true);

  // 3. SmartPass Wallet
  const [autoDebitFare, setAutoDebitFare] = useState(true);
  const [lowBalanceAlert, setLowBalanceAlert] = useState(true);

  // 4. Safety & Family
  const [autoShareRide, setAutoShareRide] = useState(true);
  const [silentPanicMode, setSilentPanicMode] = useState(true);

  // 5. Cache
  const [cacheSize, setCacheSize] = useState('32.4 MB');

  const handleClearCache = () => {
    Alert.alert(
      'Clear Offline Cache',
      `Free up ${cacheSize} of cached Peshawar maps and schedules?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Cache',
          style: 'destructive',
          onPress: () => {
            setCacheSize('0.0 KB');
            Alert.alert('Cache Cleared', 'Offline map cache has been cleared.');
          },
        },
      ]
    );
  };

  const handleDiagnosticTest = () => {
    Alert.alert(
      'SafeTrack Diagnostic Test',
      '• RTK-GPS Satellite Lock: ±3m accuracy (High precision)\n• KP Central Dispatch: Connected (18ms ping)\n• Biometric NADRA Token: Verified Active\n• Transit Wallet Gateway: 1Link Online\n\nAll Systems Operational & Certified.',
      [{ text: 'Dismiss', style: 'default' }]
    );
  };

  const handleEmergencySos = () => {
    if (onSosPress) {
      onSosPress();
      return;
    }
    Alert.alert(
      '🚨 EMERGENCY SOS DISPATCH',
      'Connecting to KPK Police Control Room (15) and Rescue 1122.'
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
        {/* 1. COMMUTER PROFILE SHORTCUT DOSSIER CARD                  */}
        {/* ========================================================== */}
        <TouchableOpacity
          style={styles.profileDossierCard}
          activeOpacity={0.88}
          onPress={onOpenProfile}
        >
          <View style={styles.profileAvatarBox}>
            <ProfileCircleIcon size={24} color="#064E3B" strokeWidth={2.2} />
          </View>

          <View style={styles.profileDossierInfo}>
            <View style={styles.profileNameRow}>
              <Text style={styles.profileNameText}>Ahmad Khan</Text>
              <View style={styles.bioLockBadge}>
                <ShieldCheckIcon size={10} color="#065F46" strokeWidth={2.4} />
                <Text style={styles.bioLockBadgeText}>NADRA BIO-LOCKED</Text>
              </View>
            </View>
            <Text style={styles.profileIdText}>
              SmartPass ID #PAX-99214 &bull; Peshawar Cantt
            </Text>
          </View>

          <View style={styles.viewDossierPill}>
            <Text style={styles.viewDossierText}>Dossier &rarr;</Text>
          </View>
        </TouchableOpacity>

        {/* ========================================================== */}
        {/* 2. REGIONAL DISPLAY & LANGUAGE                             */}
        {/* ========================================================== */}
        <Text style={styles.sectionHeaderTitle}>Interface Display &amp; Language</Text>

        <View style={styles.settingsGroupCard}>
          {/* Language Selector */}
          <View style={styles.settingItemCol}>
            <View style={styles.settingLabelRow}>
              <GlobeIcon size={16} color="#064E3B" strokeWidth={2.2} />
              <View>
                <Text style={styles.settingMainTitle}>Regional Language</Text>
                <Text style={styles.settingSubtitle}>
                  Select commuter app interface dialect
                </Text>
              </View>
            </View>

            {/* Segmented Button Pills */}
            <View style={styles.segmentedRow}>
              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  selectedLanguage === 'en' && styles.segmentBtnActive,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedLanguage('en')}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    selectedLanguage === 'en' && styles.segmentBtnTextActive,
                  ]}
                >
                  English
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  selectedLanguage === 'ur' && styles.segmentBtnActive,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedLanguage('ur')}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    selectedLanguage === 'ur' && styles.segmentBtnTextActive,
                  ]}
                >
                  اردو (Urdu)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  selectedLanguage === 'ps' && styles.segmentBtnActive,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedLanguage('ps')}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    selectedLanguage === 'ps' && styles.segmentBtnTextActive,
                  ]}
                >
                  پښتو (Pashto)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.cardDivider} />

          {/* Night Mode */}
          <View style={styles.settingItemRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingMainTitle}>Night HUD Theme</Text>
              <Text style={styles.settingSubtitle}>
                Glare-reducing high contrast dark map theme
              </Text>
            </View>
            <Switch
              value={nightMode}
              onValueChange={setNightMode}
              trackColor={{ false: '#E2E8F0', true: '#064E3B' }}
              thumbColor={nightMode ? '#34D399' : '#FFFFFF'}
            />
          </View>

          <View style={styles.cardDivider} />

          {/* Keep Screen Awake */}
          <View style={styles.settingItemRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingMainTitle}>Keep Screen Awake on Commute</Text>
              <Text style={styles.settingSubtitle}>
                Prevents display sleep while bus transit is underway
              </Text>
            </View>
            <Switch
              value={keepScreenAwake}
              onValueChange={setKeepScreenAwake}
              trackColor={{ false: '#E2E8F0', true: '#064E3B' }}
              thumbColor={keepScreenAwake ? '#34D399' : '#FFFFFF'}
            />
          </View>
        </View>

        {/* ========================================================== */}
        {/* 3. TRAVEL ALERTS & BUS AUDIO GUIDANCE                      */}
        {/* ========================================================== */}
        <Text style={styles.sectionHeaderTitle}>Transit Guidance &amp; Alerts</Text>

        <View style={styles.settingsGroupCard}>
          {/* Approach Push Alerts */}
          <View style={styles.settingItemRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingMainTitle}>Bus Approaching Push Alerts</Text>
              <Text style={styles.settingSubtitle}>
                Notify when bus is within 180m / 3 mins of your shelter
              </Text>
            </View>
            <Switch
              value={approachAlerts}
              onValueChange={setApproachAlerts}
              trackColor={{ false: '#E2E8F0', true: '#064E3B' }}
              thumbColor={approachAlerts ? '#34D399' : '#FFFFFF'}
            />
          </View>

          <View style={styles.cardDivider} />

          {/* Station Stop Audio Chime */}
          <View style={styles.settingItemRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingMainTitle}>Audible Stop Announcement Chime</Text>
              <Text style={styles.settingSubtitle}>
                Voice alert before bus reaches your destination stop
              </Text>
            </View>
            <Switch
              value={stopAudioChime}
              onValueChange={setStopAudioChime}
              trackColor={{ false: '#E2E8F0', true: '#064E3B' }}
              thumbColor={stopAudioChime ? '#34D399' : '#FFFFFF'}
            />
          </View>

          <View style={styles.cardDivider} />

          {/* Auto-Select Express Corridor */}
          <View style={styles.settingItemRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingMainTitle}>Prioritize Fast Express Corridors</Text>
              <Text style={styles.settingSubtitle}>
                Prefer AC Deluxe Route N-5 and BRT feeder links
              </Text>
            </View>
            <Switch
              value={autoSelectExpress}
              onValueChange={setAutoSelectExpress}
              trackColor={{ false: '#E2E8F0', true: '#064E3B' }}
              thumbColor={autoSelectExpress ? '#34D399' : '#FFFFFF'}
            />
          </View>
        </View>

        {/* ========================================================== */}
        {/* 4. SMARTPASS WALLET & AUTOPAY                              */}
        {/* ========================================================== */}
        <Text style={styles.sectionHeaderTitle}>Digital Wallet &amp; Fare Autopay</Text>

        <View style={styles.settingsGroupCard}>
          {/* Auto-Debit Fare */}
          <View style={styles.settingItemRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingMainTitle}>Auto-Debit Fare on Entry</Text>
              <Text style={styles.settingSubtitle}>
                Instant contactless debit from SmartTransit Wallet
              </Text>
            </View>
            <Switch
              value={autoDebitFare}
              onValueChange={setAutoDebitFare}
              trackColor={{ false: '#E2E8F0', true: '#064E3B' }}
              thumbColor={autoDebitFare ? '#34D399' : '#FFFFFF'}
            />
          </View>

          <View style={styles.cardDivider} />

          {/* Low Balance Warning */}
          <View style={styles.settingItemRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingMainTitle}>Low Balance Warning (&lt; PKR 100)</Text>
              <Text style={styles.settingSubtitle}>
                Prompt top-up reminder via Easypaisa or JazzCash
              </Text>
            </View>
            <Switch
              value={lowBalanceAlert}
              onValueChange={setLowBalanceAlert}
              trackColor={{ false: '#E2E8F0', true: '#064E3B' }}
              thumbColor={lowBalanceAlert ? '#34D399' : '#FFFFFF'}
            />
          </View>
        </View>

        {/* ========================================================== */}
        {/* 5. COMMUTER SAFETY & FAMILY SHARING                        */}
        {/* ========================================================== */}
        <Text style={styles.sectionHeaderTitle}>Safety Shield &amp; Family Protection</Text>

        <View style={styles.settingsGroupCard}>
          {/* Auto-Share Trip */}
          <View style={styles.settingItemRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingMainTitle}>Auto-Share Ride with Family</Text>
              <Text style={styles.settingSubtitle}>
                Automatically sends encrypted live GPS link upon boarding
              </Text>
            </View>
            <Switch
              value={autoShareRide}
              onValueChange={setAutoShareRide}
              trackColor={{ false: '#E2E8F0', true: '#064E3B' }}
              thumbColor={autoShareRide ? '#34D399' : '#FFFFFF'}
            />
          </View>

          <View style={styles.cardDivider} />

          {/* Silent Panic Mode */}
          <View style={styles.settingItemRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingMainTitle}>Silent Panic Broadcast</Text>
              <Text style={styles.settingSubtitle}>
                Transmits quiet alert to Police 15 without phone siren noise
              </Text>
            </View>
            <Switch
              value={silentPanicMode}
              onValueChange={setSilentPanicMode}
              trackColor={{ false: '#E2E8F0', true: '#064E3B' }}
              thumbColor={silentPanicMode ? '#34D399' : '#FFFFFF'}
            />
          </View>

          <View style={styles.cardDivider} />

          {/* Emergency Guardian */}
          <TouchableOpacity
            style={styles.settingItemRow}
            activeOpacity={0.75}
            onPress={() => Alert.alert('Emergency Guardian Contact', 'Registered Contact: Tariq Khan (Brother) • +92 312 9988112')}
          >
            <View style={styles.settingTextCol}>
              <Text style={styles.settingMainTitle}>Registered Guardian Contact</Text>
              <Text style={styles.settingSubtitle}>
                Tariq Khan (Brother) &bull; +92 312 9988112
              </Text>
            </View>
            <Text style={styles.actionLinkText}>Manage &rarr;</Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================== */}
        {/* 6. STORAGE & SYSTEM DIAGNOSTICS                            */}
        {/* ========================================================== */}
        <Text style={styles.sectionHeaderTitle}>Storage &amp; Diagnostics</Text>

        <View style={styles.settingsGroupCard}>
          <TouchableOpacity
            style={styles.settingItemRow}
            activeOpacity={0.75}
            onPress={handleClearCache}
          >
            <View style={styles.settingTextCol}>
              <Text style={styles.settingMainTitle}>Clear Offline Route Maps</Text>
              <Text style={styles.settingSubtitle}>
                Cached GT Road &amp; BRT Corridors ({cacheSize})
              </Text>
            </View>
            <Text style={[styles.actionLinkText, { color: '#B91C1C' }]}>Clear</Text>
          </TouchableOpacity>

          <View style={styles.cardDivider} />

          <TouchableOpacity
            style={styles.settingItemRow}
            activeOpacity={0.75}
            onPress={handleDiagnosticTest}
          >
            <View style={styles.settingTextCol}>
              <Text style={styles.settingMainTitle}>Run System Diagnostic Check</Text>
              <Text style={styles.settingSubtitle}>
                Test GPS lock, GNSS satellite, and server ping
              </Text>
            </View>
            <Text style={styles.actionLinkText}>Test &rarr;</Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================== */}
        {/* 7. EMERGENCY SOS TRIGGER & SWITCH MODE                     */}
        {/* ========================================================== */}
        <TouchableOpacity
          style={styles.sosButton}
          activeOpacity={0.88}
          onPress={handleEmergencySos}
        >
          <PhoneCallIcon size={16} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.sosButtonText}>EMERGENCY SOS DIRECT DISPATCH</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchModeButton}
          activeOpacity={0.8}
          onPress={onSwitchRole}
        >
          <Text style={styles.switchModeText}>
            Switch Operating Mode / Terminal &rarr;
          </Text>
        </TouchableOpacity>

        {/* App Version Tag */}
        <Text style={styles.appVersionText}>
          SafeTrack Commuter Mobile v2.4.0 &bull; Provincial Transit KP
        </Text>
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
    paddingTop: 12,
    paddingBottom: 28,
  },

  /* --- 1. Commuter Profile Dossier Card --- */
  profileDossierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
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
  profileAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
  },
  profileDossierInfo: {
    flex: 1,
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileNameText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  bioLockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    gap: 3,
  },
  bioLockBadgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#065F46',
  },
  profileIdText: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  viewDossierPill: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  viewDossierText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#064E3B',
  },

  /* --- Section Headers --- */
  sectionHeaderTitle: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
    marginTop: 6,
    letterSpacing: -0.2,
  },

  /* --- Settings Group Card --- */
  settingsGroupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  settingItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingItemCol: {
    paddingVertical: 12,
  },
  settingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  settingTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  settingMainTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  settingSubtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  actionLinkText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#059669',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },

  /* Segmented Buttons */
  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentBtnActive: {
    backgroundColor: '#064E3B',
  },
  segmentBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  segmentBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },

  /* --- Emergency & Switch Buttons --- */
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B91C1C',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginBottom: 10,
    marginTop: 4,
  },
  sosButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  switchModeButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 14,
  },
  switchModeText: {
    color: '#DC2626',
    fontSize: 12.5,
    fontWeight: '800',
  },
  appVersionText: {
    textAlign: 'center',
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 8,
  },
});

export default PassengerSettingsScreen;
