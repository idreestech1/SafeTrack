import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BusFrontIcon,
  CompassExploreIcon,
  TicketIcon,
  ShieldCrossIcon,
  SettingsIcon,
} from './PassengerIcons';

export type PassengerTabKey = 'home' | 'explore' | 'trips' | 'safety' | 'settings' | 'profile';

export interface PassengerBottomTabsProps {
  activeTab?: PassengerTabKey;
  onTabChange?: (tab: PassengerTabKey) => void;
  tripsNotificationDot?: boolean;
  // Support Expo Router bottom tab bar props if used in <Tabs tabBar={...}>
  state?: any;
  descriptors?: any;
  navigation?: any;
}

interface TabConfig {
  key: PassengerTabKey;
  label: string;
  renderIcon: (color: string) => React.ReactNode;
  hasDot?: boolean;
}

const TABS: TabConfig[] = [
  {
    key: 'home',
    label: 'Home',
    renderIcon: (color) => <BusFrontIcon size={21} color={color} strokeWidth={2.1} />,
  },
  {
    key: 'explore',
    label: 'Explore',
    renderIcon: (color) => <CompassExploreIcon size={21} color={color} strokeWidth={2.1} />,
  },
  {
    key: 'trips',
    label: 'My Trips',
    renderIcon: (color) => <TicketIcon size={21} color={color} strokeWidth={2.1} />,
    hasDot: true,
  },
  {
    key: 'safety',
    label: 'Safety',
    renderIcon: (color) => <ShieldCrossIcon size={21} color={color} strokeWidth={2.1} />,
  },
  {
    key: 'settings',
    label: 'Settings',
    renderIcon: (color) => <SettingsIcon size={21} color={color} strokeWidth={2.1} />,
  },
];

interface TabItemButtonProps {
  tab: TabConfig;
  isActive: boolean;
  tripsNotificationDot: boolean;
  onPress: () => void;
}

const TabItemButton: React.FC<TabItemButtonProps> = ({
  tab,
  isActive,
  tripsNotificationDot,
  onPress,
}) => {
  const [anim] = useState(() => new Animated.Value(isActive ? 1 : 0));

  useEffect(() => {
    Animated.spring(anim, {
      toValue: isActive ? 1 : 0,
      friction: 7,
      tension: 110,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [isActive, anim]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.88, 1],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      style={styles.tabWrapper}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`${tab.label} Tab`}
    >
      {/* Floating Dark Green Pill Background */}
      <Animated.View
        style={[
          styles.activeFloatingPill,
          {
            opacity: anim,
            transform: [{ translateY }, { scale }],
          },
        ]}
      />

      {/* Tab Icon and Label Content */}
      <Animated.View
        style={[
          styles.tabContent,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          {tab.renderIcon(isActive ? '#FFFFFF' : '#475569')}

          {/* Green notification dot for My Trips */}
          {tab.hasDot && tripsNotificationDot && (
            <View style={[styles.tripsDot, isActive && styles.tripsDotActive]} />
          )}
        </View>

        <Text
          numberOfLines={1}
          ellipsizeMode="clip"
          style={[
            styles.tabLabel,
            isActive ? styles.activeLabel : styles.inactiveLabel,
          ]}
        >
          {tab.label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export const PassengerBottomTabs: React.FC<PassengerBottomTabsProps> = ({
  activeTab = 'home',
  onTabChange,
  tripsNotificationDot = true,
  state,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  // If used inside Expo Router Tabs layout, derive activeTab from state
  const currentTab: PassengerTabKey = React.useMemo(() => {
    if (state?.routes && typeof state?.index === 'number') {
      const routeName = state.routes[state.index]?.name?.toLowerCase() || '';
      if (routeName.includes('explore')) return 'explore';
      if (routeName.includes('trip')) return 'trips';
      if (routeName.includes('safet')) return 'safety';
      if (routeName.includes('setting')) return 'settings';
      if (routeName.includes('profile')) return 'profile';
      if (routeName === 'index' || routeName.includes('home')) return 'home';
    }
    return activeTab;
  }, [state, activeTab]);

  const handlePress = (tabKey: PassengerTabKey) => {
    if (navigation && state?.routes) {
      const targetRoute = state.routes.find((r: any) => {
        const name = r.name.toLowerCase();
        if (tabKey === 'home') return name === 'index' || name.includes('home');
        return name.includes(tabKey);
      });
      if (targetRoute) {
        navigation.navigate(targetRoute.name);
      }
    }
    onTabChange?.(tabKey);
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 8) : 2,
        },
      ]}
    >
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TabItemButton
            key={tab.key}
            tab={tab}
            isActive={currentTab === tab.key}
            tripsNotificationDot={tripsNotificationDot}
            onPress={() => handlePress(tab.key)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 62,
    paddingHorizontal: 4,
  },
  tabWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
  },
  activeFloatingPill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 2,
    right: 2,
    backgroundColor: '#064E3B', // Deep forest green matching action buttons in application
    borderRadius: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#064E3B',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 3px 10px rgba(6, 78, 59, 0.35)',
      },
    }),
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 2,
    zIndex: 2,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 24,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  activeLabel: {
    fontWeight: '800',
    color: '#FFFFFF',
  },
  inactiveLabel: {
    fontWeight: '600',
    color: '#475569',
  },
  /* --- Green Notification Dot on My Trips matching screenshot --- */
  tripsDot: {
    position: 'absolute',
    top: -2,
    right: -3,
    backgroundColor: '#10B981', // Solid vibrant emerald green dot
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  tripsDotActive: {
    borderColor: '#064E3B', // Matches active green pill for seamless blending
  },
});

export default PassengerBottomTabs;

