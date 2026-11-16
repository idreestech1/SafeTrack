import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeftIcon, UserBustIcon } from '../icons/PassengerIcons';

export interface PassengerHeaderProps {
  title?: string;
  onBackPress?: () => void;
  onProfilePress?: () => void;
}

export const PassengerHeader: React.FC<PassengerHeaderProps> = ({
  title = 'Live Bus Tracker',
  onBackPress,
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
        {/* Left Section: Back Arrow + Page Title */}
        <View style={styles.leftGroup}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={onBackPress}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeftIcon size={23} color="#0F172A" strokeWidth={2.4} />
          </TouchableOpacity>

          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Right Section: Circular Dark Green Profile Avatar Button */}
        <TouchableOpacity
          style={styles.profileAvatarButton}
          activeOpacity={0.85}
          onPress={onProfilePress}
          accessibilityRole="button"
          accessibilityLabel="Passenger Profile"
        >
          <UserBustIcon size={20} color="#FFFFFF" strokeWidth={2.1} />
        </TouchableOpacity>
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
    marginRight: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A', // Deep dark navy/slate matching screenshot
    letterSpacing: -0.4,
  },
  profileAvatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#064E3B', // Deep forest green matching screenshot
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#064E3B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 8px rgba(6, 78, 59, 0.25)',
      },
    }),
  },
});

export default PassengerHeader;
