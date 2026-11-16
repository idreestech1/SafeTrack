import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BusFrontIcon, CrosshairIcon, UserBustIcon } from '../icons/DriverIcons';

export interface DriverHeaderProps {
  appName?: string;
  regionBadge?: string;
  dutyStatus?: string;
  city?: string;
  isOnline?: boolean;
  corridorCode?: string;
  showCorridor?: boolean;
  onLogoPress?: () => void;
  onCorridorPress?: () => void;
  onProfilePress?: () => void;
}

export const DriverHeader: React.FC<DriverHeaderProps> = ({
  appName = 'SmartTransit',
  regionBadge = 'KP',
  dutyStatus = 'ACTIVE DUTY',
  city = 'PESHAWAR',
  isOnline = true,
  corridorCode = 'PSH-MDN',
  showCorridor = false, // Hidden by default as requested to prevent overlapping and clipping
  onLogoPress,
  onCorridorPress,
  onProfilePress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.safeWrapper,
        {
          paddingTop: insets.top > 0 ? insets.top + 2 : (Platform.OS === 'ios' ? 10 : 6),
        },
      ]}
    >
      <View style={styles.headerRow}>
        {/* Left Section: Green Squircle Bus Logo + Brand Title */}
        <View style={styles.brandGroup}>
          <TouchableOpacity
            style={styles.logoSquircle}
            activeOpacity={0.85}
            onPress={onLogoPress}
            accessibilityRole="button"
            accessibilityLabel={`${appName} App Logo`}
          >
            <BusFrontIcon size={24} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.titleColumn}>
            <View style={styles.titleRow}>
              <Text style={styles.appNameText} numberOfLines={1}>
                {appName}
              </Text>
              <View style={styles.regionBadge}>
                <Text style={styles.regionBadgeText}>{regionBadge}</Text>
              </View>
            </View>

            <View style={styles.dutyRow}>
              <View
                style={[
                  styles.dutyDot,
                  { backgroundColor: isOnline ? '#10B981' : '#94A3B8' },
                ]}
              />
              <Text
                style={[
                  styles.dutyText,
                  { color: isOnline ? '#047857' : '#64748B' },
                ]}
                numberOfLines={1}
              >
                {dutyStatus} • {city}
              </Text>
            </View>
          </View>
        </View>

        {/* Right Section: Optional Corridor Pill + Profile Avatar */}
        <View style={styles.rightGroup}>
          {showCorridor && (
            <TouchableOpacity
              style={styles.corridorPill}
              activeOpacity={0.8}
              onPress={onCorridorPress}
              accessibilityRole="button"
              accessibilityLabel={`Corridor: ${corridorCode}`}
            >
              <CrosshairIcon size={14} color="#16A34A" strokeWidth={2.2} />
              <Text style={styles.corridorText}>{corridorCode}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.profileAvatar}
            activeOpacity={0.85}
            onPress={onProfilePress}
            accessibilityRole="button"
            accessibilityLabel="Driver Profile"
          >
            <UserBustIcon size={20} color="#FFFFFF" strokeWidth={2.1} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 10,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  /* --- Dark Green Squircle Bus Logo --- */
  logoSquircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#054425', // Deep forest green matching the screenshot
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#054425',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 6px rgba(5, 68, 37, 0.25)',
      },
    }),
  },
  titleColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appNameText: {
    fontSize: 18.5,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  regionBadge: {
    backgroundColor: '#14532D', // Dark green capsule
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regionBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DCFCE7', // Crisp mint/light green
    letterSpacing: 0.2,
  },
  dutyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  dutyDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  dutyText: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  /* --- Soft Ice-Blue Corridor Pill --- */
  corridorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F9', // Subtle ice-blue / lavender slate tint
    borderRadius: 20,
    height: 38,
    paddingHorizontal: 13,
    gap: 6,
  },
  corridorText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.2,
  },
  /* --- Circular Dark Green Profile Avatar --- */
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#054425', // Deep forest green matching logo
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DriverHeader;

