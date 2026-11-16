import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/** Tilted Navigation / Paper-Airplane arrow pointing North-East */
export const NavArrowIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#064E3B',
  strokeWidth = 2.4,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 11.5L21 3L12.5 21L10.5 13.5L3 11.5Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Downward chevron for location dropdown */
export const ChevronDownIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#475569',
  strokeWidth = 2.4,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9L12 15L18 9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Outline Notification Bell matching passenger header */
export const NotificationBellIcon: React.FC<IconProps> = ({
  size = 22,
  color = '#1E293B',
  strokeWidth = 2.1,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.73 21a2 2 0 01-3.46 0"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** User bust icon inside avatar */
export const UserBustIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  strokeWidth = 2.1,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path
      d="M5 20C5 16.5 8 14 12 14C16 14 19 16.5 19 20"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

/** Search magnifying glass */
export const SearchIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#64748B',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M21 21L16.65 16.65"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Map Pin location marker */
export const MapPinIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#064E3B',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

/** Bus front icon */
export const BusFrontIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#064E3B',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 6C5 4.34315 6.34315 3 8 3H16C17.6569 3 19 4.34315 19 6V16.5C19 17.6046 18.1046 18.5 17 18.5H7C5.89543 18.5 5 17.6046 5 16.5V6Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M5 10.5H19" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M12 3V10.5" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="8" cy="14.5" r="1.3" fill={color} />
    <Circle cx="16" cy="14.5" r="1.3" fill={color} />
  </Svg>
);

/** Shield Check safety verification */
export const ShieldCheckIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#15803D',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 22S20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 12L11 14L15 10"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Clock / ETA icon */
export const ClockIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#64748B',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M12 6V12L16 14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

/** Back / Left Arrow matching passenger header screenshot */
export const ArrowLeftIcon: React.FC<IconProps> = ({
  size = 22,
  color = '#0F172A',
  strokeWidth = 2.2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M12 19L5 12L12 5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Right Arrow */
export const ArrowRightIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#064E3B',
  strokeWidth = 2.2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12H19M19 12L12 5M19 12L12 19"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Commuter seat / users icon */
export const UsersIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#047857',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17 21V19C17 17.9 16.1 17 15 17H9C7.9 17 7 17.9 7 19V21"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Circle cx="12" cy="11" r="4" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

/** Compass Explore Icon matching bottom tab */
export const CompassExploreIcon: React.FC<IconProps> = ({
  size = 22,
  color = '#262626',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Transit Pass / Ticket Icon matching bottom tab */
export const TicketIcon: React.FC<IconProps> = ({
  size = 22,
  color = '#262626',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 8C4.66 8 6 9.34 6 11C6 12.66 4.66 14 3 14V17C3 17.55 3.45 18 4 18H20C20.55 18 21 17.55 21 17V14C19.34 14 18 12.66 18 11C18 9.34 19.34 8 21 8V5C21 4.45 20.55 4 20 4H4C3.45 4 3 4.45 3 5V8Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 4V6M12 10V14M12 18V20"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

/** Shield with cross inside matching bottom tab */
export const ShieldCrossIcon: React.FC<IconProps> = ({
  size = 22,
  color = '#262626',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 22C12 22 20 18 20 11V5L12 2L4 5V11C4 18 12 22 12 22Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 8V16M8 12H16"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

/** Profile Circle Icon matching bottom tab */
export const ProfileCircleIcon: React.FC<IconProps> = ({
  size = 22,
  color = '#262626',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="12" cy="9.2" r="3" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M6.6 17.8C7.6 15.3 9.6 14.2 12 14.2C14.4 14.2 16.4 15.3 17.4 17.8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

/** Microphone icon for voice search */
export const MicIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#64748B',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Filter Sliders icon */
export const FilterSlidersIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#334155',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Crosshair GPS target icon */
export const CrosshairIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#064E3B',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

/** List Bullet icon */
export const ListBulletIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#334155',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Layers map mode icon */
export const LayersIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#334155',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Hand Hail Passenger icon */
export const HandHailIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#FFFFFF',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="4" r="2.2" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M15 8L12 13V21M12 13L9 8M18 4L13 9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Route Stops icon */
export const RouteStopsIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#064E3B',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 3v12M18 9v12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Circle cx="6" cy="18" r="3" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="18" cy="6" r="3" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

/** Seat Armchair icon */
export const SeatArmchairIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#047857',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 9V6a2 2 0 00-2-2H7a2 2 0 00-2 2v3M5 18v2M19 18v2M5 10v6a2 2 0 002 2h10a2 2 0 002-2v-6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Banknote fare icon */
export const BanknoteIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#64748B',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 6h20v12H2z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

/** Split Branch icon */
export const SplitBranchIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#FFFFFF',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21V13M12 13C12 9.8 7.5 9 7.5 5.5M5 8L7.5 5.5L10 8M12 13C12 9.8 16.5 9 16.5 5.5M14 8L16.5 5.5L19 8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Vertical Swap Arrows for Pickup & Destination inputs */
export const SwapVerticalIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#064E3B',
  strokeWidth = 2.2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 4V20M7 4L3 8M7 4L11 8M17 20V4M17 20L13 16M17 20L21 16"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Emergency SOS broadcast beacon */
export const AlertSosIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  strokeWidth = 2.2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L2 22H22L12 2Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M12 9V14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Circle cx="12" cy="18" r="1.2" fill={color} />
  </Svg>
);

/** Check circle icon */
export const CheckCircleIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#064E3B',
  strokeWidth = 2.2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M8 12.5L10.5 15L16 9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Expand icon for live map card */
export const ExpandMapIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#0F172A',
  strokeWidth = 2.2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Radar Pulse Antenna icon */
export const RadarPulseIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#059669',
  strokeWidth = 2.2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 19a7 7 0 100-14 7 7 0 000 14z"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Path
      d="M12 15a3 3 0 100-6 3 3 0 000 6z"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Path d="M12 12h.01" stroke={color} strokeWidth={strokeWidth + 1} strokeLinecap="round" />
  </Svg>
);

/** History Clock / Recent activity icon */
export const HistoryClockIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#4F46E5',
  strokeWidth = 2.2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 8v4l2.5 2.5M3.05 11a9 9 0 11.5 4m-.55-4H2m0 0V6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Digital Wallet icon */
export const WalletCardIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#059669',
  strokeWidth = 2.2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 12V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V16"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M16 12H21V16H16C14.8954 16 14 15.1046 14 14C14 12.8954 14.8954 12 16 12Z"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Circle cx="17.5" cy="14" r="1" fill={color} />
  </Svg>
);

/** QR Scan icon */
export const QrScanCodeIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#475569',
  strokeWidth = 2.2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9V5C3 3.89543 3.89543 3 5 3H9M15 3H19C20.1046 3 21 3.89543 21 5V9M21 15V19C21 20.1046 20.1046 21 19 21H15M9 21H5C3.89543 21 3 20.1046 3 19V15"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M7 7H10V10H7V7Z" stroke={color} strokeWidth={strokeWidth - 0.4} />
    <Path d="M14 7H17V10H14V7Z" stroke={color} strokeWidth={strokeWidth - 0.4} />
    <Path d="M7 14H10V17H7V14Z" stroke={color} strokeWidth={strokeWidth - 0.4} />
  </Svg>
);

/** Selected Radio Button */
export const RadioSelectedIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#064E3B',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2.4} />
    <Circle cx="12" cy="12" r="5" fill={color} />
  </Svg>
);

/** Unselected Radio Button */
export const RadioUnselectedIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#94A3B8',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
  </Svg>
);

/** Phone Call icon */
export const PhoneCallIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#064E3B',
  strokeWidth = 2.2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Direct Message Chat Bubble icon */
export const ChatBubbleIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#FFFFFF',
  strokeWidth = 2.2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Speedometer Gauge icon */
export const SpeedometerIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#0F172A',
  strokeWidth = 2.2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2a10 10 0 00-7.07 17.07L12 12l4.95-4.95A10 10 0 0012 2z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

/** Settings Gear icon */
export const SettingsIcon: React.FC<IconProps> = ({
  size = 22,
  color = '#262626',
  strokeWidth = 2.1,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Globe / Language icon */
export const GlobeIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#262626',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M2 12h20" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </Svg>
);
