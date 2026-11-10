import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {
  ProfileCircleIcon,
  ShieldCheckIcon,
  SettingsIcon,
  GlobeIcon,
  PhoneCallIcon,
} from './PassengerIcons';

export interface PassengerProfileScreenProps {
  onBackPress?: () => void;
  onOpenSettings?: () => void;
  onSwitchRole?: () => void;
}

export const PassengerProfileScreen: React.FC<PassengerProfileScreenProps> = ({
  onBackPress,
  onOpenSettings,
  onSwitchRole,
}) => {
  const [walletBalance, setWalletBalance] = useState(480.0);
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Urdu' | 'Pashto'>('English');

  const handleTopUp = () => {
    Alert.alert(
      'Top Up Transit Wallet',
      'Select instant recharge channel:',
      [
        {
          text: '+ PKR 200 (Easypaisa)',
          onPress: () => {
            setWalletBalance((prev) => prev + 200);
            Alert.alert('Top Up Successful', 'PKR 200.00 added to your Transit Wallet.');
          },
        },
        {
          text: '+ PKR 500 (JazzCash)',
          onPress: () => {
            setWalletBalance((prev) => prev + 500);
            Alert.alert('Top Up Successful', 'PKR 500.00 added to your Transit Wallet.');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleLanguageChange = () => {
    Alert.alert(
      'Select App Language',
      'Choose your preferred regional interface dialect:',
      [
        { text: 'English', onPress: () => setSelectedLanguage('English') },
        { text: 'اردو (Urdu)', onPress: () => setSelectedLanguage('Urdu') },
        { text: 'پښتو (Pashto)', onPress: () => setSelectedLanguage('Pashto') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSosContact = () => {
    Alert.alert(
      'Registered Emergency Contact',
      'Primary Guardian / Family Member:\n• Name: Tariq Khan (Brother)\n• Phone: +92 312 9988112\n• Relation: Immediate Family\n• Auto-SMS Live GPS: Enabled',
      [
        { text: 'Edit Contact', onPress: () => Alert.alert('Edit Contact', 'Enter new guardian contact details in Settings.') },
        { text: 'OK', style: 'cancel' },
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
        {/* 1. GREEN COMMUTER HERO DOSSIER CARD                        */}
        {/* ========================================================== */}
        <View style={styles.heroDossierCard}>
          <View style={styles.avatarCircleWrapper}>
            <View style={styles.avatarInnerCircle}>
              <ProfileCircleIcon size={46} color="#FFFFFF" strokeWidth={2} />
            </View>
          </View>

          <Text style={styles.heroName}>Ahmad Khan</Text>
          <Text style={styles.heroSubText}>
            SmartPass ID #PAX-99214 &bull; NADRA Verified
          </Text>

          <View style={styles.provincialStatusBadge}>
            <ShieldCheckIcon size={13} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={styles.provincialStatusText}>PROVINCIAL COMMUTER STATUS</Text>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 2. TRANSIT WALLET BALANCE CARD                             */}
        {/* ========================================================== */}
        <View style={styles.walletCard}>
          <View style={styles.walletLeftCol}>
            <Text style={styles.walletLabel}>TRANSIT WALLET BALANCE</Text>
            <Text style={styles.walletAmount}>PKR {walletBalance.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={styles.topUpButton}
            activeOpacity={0.85}
            onPress={handleTopUp}
          >
            <Text style={styles.topUpButtonText}>+ Top Up</Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================== */}
        {/* 3. COMMUTER VERIFICATION & STATISTICS METRICS              */}
        {/* ========================================================== */}
        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricNumber}>48</Text>
            <Text style={styles.metricLabel}>Trips Logged</Text>
            <Text style={styles.metricSub}>100% On-Time</Text>
          </View>

          <View style={styles.metricBox}>
            <Text style={[styles.metricNumber, { color: '#059669' }]}>99.6%</Text>
            <Text style={styles.metricLabel}>Safety Score</Text>
            <Text style={styles.metricSub}>Zero Violations</Text>
          </View>

          <View style={styles.metricBox}>
            <Text style={styles.metricNumber}>12.4kg</Text>
            <Text style={styles.metricLabel}>CO₂ Saved</Text>
            <Text style={styles.metricSub}>Green Commute</Text>
          </View>
        </View>

        {/* ========================================================== */}
        {/* 4. SETTINGS & PREFERENCES LIST CARD                        */}
        {/* ========================================================== */}
        <View style={styles.actionListCard}>
          {/* Emergency SOS Contact */}
          <TouchableOpacity
            style={styles.actionItemRow}
            activeOpacity={0.75}
            onPress={handleSosContact}
          >
            <View style={styles.actionItemLeft}>
              <PhoneCallIcon size={16} color="#064E3B" strokeWidth={2.2} />
              <Text style={styles.actionItemTitle}>Emergency SOS Contact</Text>
            </View>
            <Text style={styles.actionItemValueGreen}>Tariq Khan &rarr;</Text>
          </TouchableOpacity>

          <View style={styles.cardDivider} />

          {/* App Language */}
          <TouchableOpacity
            style={styles.actionItemRow}
            activeOpacity={0.75}
            onPress={handleLanguageChange}
          >
            <View style={styles.actionItemLeft}>
              <GlobeIcon size={16} color="#064E3B" strokeWidth={2.2} />
              <Text style={styles.actionItemTitle}>App Language</Text>
            </View>
            <Text style={styles.actionItemValueGreen}>{selectedLanguage} &rarr;</Text>
          </TouchableOpacity>

          <View style={styles.cardDivider} />

          {/* Settings Panel Link */}
          <TouchableOpacity
            style={styles.actionItemRow}
            activeOpacity={0.75}
            onPress={onOpenSettings}
          >
            <View style={styles.actionItemLeft}>
              <SettingsIcon size={16} color="#064E3B" strokeWidth={2.2} />
              <Text style={styles.actionItemTitle}>Application Settings</Text>
            </View>
            <Text style={styles.actionItemValueGreen}>Preferences &rarr;</Text>
          </TouchableOpacity>

          <View style={styles.cardDivider} />

          {/* Switch Operating Mode / Terminal */}
          <TouchableOpacity
            style={styles.actionItemRow}
            activeOpacity={0.75}
            onPress={onSwitchRole}
          >
            <Text style={[styles.actionItemTitle, { color: '#DC2626', fontWeight: '800' }]}>
              Switch Operating Mode / Terminal
            </Text>
            <Text style={[styles.actionItemValueGreen, { color: '#DC2626' }]}>Switch &rarr;</Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================== */}
        {/* 5. GOVERNMENT NADRA VERIFICATION DOSSIER                   */}
        {/* ========================================================== */}
        <View style={styles.govCard}>
          <View style={styles.govHeaderRow}>
            <Text style={styles.govHeaderTitle}>Government Verification</Text>
            <View style={styles.bioLockPill}>
              <ShieldCheckIcon size={11} color="#065F46" strokeWidth={2.4} />
              <Text style={styles.bioLockText}>NADRA BIO-LOCK</Text>
            </View>
          </View>

          <View style={styles.govDetailRow}>
            <Text style={styles.govLabel}>National CNIC</Text>
            <Text style={styles.govVal}>17301-4492102-1</Text>
          </View>

          <View style={styles.govDetailRow}>
            <Text style={styles.govLabel}>Transit Pass Serial</Text>
            <Text style={styles.govVal}>#KPK-PAX-88412-COMM</Text>
          </View>

          <View style={styles.govDetailRow}>
            <Text style={styles.govLabel}>Emergency Safety Guard</Text>
            <Text style={[styles.govVal, { color: '#059669', fontWeight: '800' }]}>
              Active (KPK Police 15 Linked)
            </Text>
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
    paddingTop: 14,
    paddingBottom: 28,
  },

  /* --- 1. Green Commuter Hero Card --- */
  heroDossierCard: {
    backgroundColor: '#064E3B', // Signature deep green matching screenshot
    borderRadius: 22,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#064E3B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 4px 14px rgba(6,78,59,0.3)',
      },
    }),
  },
  avatarCircleWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#34D399',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  heroSubText: {
    fontSize: 11.5,
    color: '#A7F3D0',
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 14,
  },
  provincialStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  provincialStatusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  /* --- 2. Transit Wallet Card --- */
  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  walletLeftCol: {
    flex: 1,
  },
  walletLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.4,
  },
  walletAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  topUpButton: {
    backgroundColor: '#064E3B', // Dark green button
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topUpButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  /* --- 3. Metrics Row --- */
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metricNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 2,
  },
  metricSub: {
    fontSize: 9,
    color: '#059669',
    fontWeight: '700',
    marginTop: 1,
  },

  /* --- 4. Action List Card --- */
  actionListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  actionItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  actionItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionItemTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  actionItemValueGreen: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },

  /* --- 5. Government Verification Dossier --- */
  govCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  govHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  govHeaderTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
  },
  bioLockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 4,
  },
  bioLockText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#065F46',
  },
  govDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  govLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  govVal: {
    fontSize: 11.5,
    color: '#0F172A',
    fontWeight: '800',
  },
});

export default PassengerProfileScreen;
