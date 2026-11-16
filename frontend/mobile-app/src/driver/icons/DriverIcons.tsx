import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const HomeIcon: React.FC<IconProps> = ({
  size = 23,
  color = '#262626',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 10.5L12 3.2L21 10.5V20.2C21 20.64 20.64 21 20.2 21H3.8C3.36 21 3 20.64 3 20.2V10.5Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.5 21V12.8H14.5V21"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const TripsIcon: React.FC<IconProps> = ({
  size = 23,
  color = '#262626',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Trunk */}
    <Path
      d="M12 21V13"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Left branch */}
    <Path
      d="M12 13C12 9.8 7.5 9 7.5 5.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Left arrow head */}
    <Path
      d="M5 8L7.5 5.5L10 8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Right branch */}
    <Path
      d="M12 13C12 9.8 16.5 9 16.5 5.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Right arrow head */}
    <Path
      d="M14 8L16.5 5.5L19 8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const RequestsIcon: React.FC<IconProps> = ({
  size = 23,
  color = '#262626',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* User head */}
    <Circle
      cx="8.5"
      cy="7"
      r="3.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    {/* User bust */}
    <Path
      d="M2.5 20C2.5 16.4 5.5 14 8.5 14C10.2 14 11.8 14.6 13 15.6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    {/* Checkmark tick */}
    <Path
      d="M14 16.8L16.5 19.3L22 13.8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SafetyIcon: React.FC<IconProps> = ({
  size = 22,
  color = '#064E3B',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Full shield boundary */}
    <Path
      d="M12 21.5C12 21.5 19.5 17.5 19.5 11V5.5L12 2.5L4.5 5.5V11C4.5 17.5 12 21.5 12 21.5Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Split right-side filled half */}
    <Path
      d="M12 3.2V20.6C12 20.6 18.5 16.8 18.5 11V6L12 3.2Z"
      fill={color}
    />
  </Svg>
);

export const ProfileIcon: React.FC<IconProps> = ({
  size = 23,
  color = '#262626',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Outer circle */}
    <Circle
      cx="12"
      cy="12"
      r="9.5"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Head */}
    <Circle
      cx="12"
      cy="9.2"
      r="3"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Torso curve inside circle */}
    <Path
      d="M6.6 17.8C7.6 15.3 9.6 14.2 12 14.2C14.4 14.2 16.4 15.3 17.4 17.8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const BusFrontIcon: React.FC<IconProps> = ({
  size = 22,
  color = '#FFFFFF',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Bus body */}
    <Path
      d="M5 6C5 4.34315 6.34315 3 8 3H16C17.6569 3 19 4.34315 19 6V16.5C19 17.6046 18.1046 18.5 17 18.5H7C5.89543 18.5 5 17.6046 5 16.5V6Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Windshield */}
    <Path
      d="M5 10.5H19"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    {/* Windshield vertical divider */}
    <Path
      d="M12 3V10.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    {/* Headlights */}
    <Circle cx="8" cy="14.5" r="1.3" fill={color} />
    <Circle cx="16" cy="14.5" r="1.3" fill={color} />
    {/* Tires */}
    <Path
      d="M7 18.5V20.5"
      stroke={color}
      strokeWidth={strokeWidth + 0.5}
      strokeLinecap="round"
    />
    <Path
      d="M17 18.5V20.5"
      stroke={color}
      strokeWidth={strokeWidth + 0.5}
      strokeLinecap="round"
    />
  </Svg>
);

export const CrosshairIcon: React.FC<IconProps> = ({
  size = 15,
  color = '#15803D',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle
      cx="12"
      cy="12"
      r="6.5"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Circle cx="12" cy="12" r="1.8" fill={color} />
    <Path d="M12 2.5V5.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M12 18.5V21.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M2.5 12H5.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M18.5 12H21.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const UserBustIcon: React.FC<IconProps> = ({
  size = 19,
  color = '#FFFFFF',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle
      cx="12"
      cy="8"
      r="3.8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M5 19.5C5 16 8 13.8 12 13.8C16 13.8 19 16 19 19.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const SirenRadioIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C7.58 2 4 5.58 4 10C4 13.5 6.3 16.5 9.5 17.5V20C9.5 20.55 9.95 21 10.5 21H13.5C14.05 21 14.5 20.55 14.5 20V17.5C17.7 16.5 20 13.5 20 10C20 5.58 16.42 2 12 2Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M12 6V11" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M4 2L2 4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M20 2L22 4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const MapPinIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#FFFFFF',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21C16 16.5 19 12.5 19 9C19 5.134 15.866 2 12 2C8.134 2 5 5.134 5 9C5 12.5 8 16.5 12 21Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

export const PhoneCallIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#FFFFFF',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 16.92V19.92C22.0011 20.1986 21.9441 20.4742 21.8325 20.7294C21.7209 20.9846 21.5573 21.2137 21.3521 21.4019C21.1468 21.5902 20.9046 21.7332 20.6407 21.8218C20.3769 21.9104 20.0974 21.9426 19.82 21.916C16.7428 21.5819 13.787 20.5342 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.19 12.85C3.49999 10.2413 2.45145 7.27099 2.12 4.18C2.0935 3.90353 2.12542 3.62489 2.21367 3.36173C2.30193 3.09858 2.4445 2.85686 2.63204 2.65215C2.81958 2.44743 3.04781 2.28428 3.30184 2.17302C3.55587 2.06176 3.82998 2.00492 4.108 2.006H7.108C7.5953 1.99612 8.06733 2.17066 8.43261 2.49581C8.79789 2.82096 9.03051 3.27364 9.085 3.766C9.186 4.686 9.412 5.59 9.76 6.452C9.914 6.833 9.945 7.253 9.85 7.654C9.755 8.056 9.539 8.421 9.23 8.7L7.96 9.97C9.39 12.49 11.45 14.55 13.97 15.98L15.24 14.71C15.52 14.401 15.885 14.185 16.286 14.09C16.688 13.995 17.108 14.026 17.489 14.18C18.351 14.528 19.255 14.754 20.175 14.855C20.6724 14.9103 21.1292 15.1457 21.4557 15.5152C21.7822 15.8847 21.9547 16.3621 21.94 16.852L22 16.92Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const AsteriskIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#DC2626',
  strokeWidth = 2.4,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3V21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M4.2 7.5L19.8 16.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M4.2 16.5L19.8 7.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const SpeakerTriggerIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#064E3B',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 5L6 9H2V15H6L11 19V5Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.54 8.46C16.48 9.4 17 10.7 17 12C17 13.3 16.48 14.6 15.54 15.54"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M19.07 4.93C20.94 6.8 22 9.3 22 12C22 14.7 20.94 17.2 19.07 19.07"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const SatelliteEyeIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#10B981',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

export const ObdGaugeIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#10B981',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Path
      d="M19.07 4.93C17.2 3.06 14.7 2 12 2C9.3 2 6.8 3.06 4.93 4.93C3.06 6.8 2 9.3 2 12C2 14.7 3.06 17.2 4.93 19.07"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path d="M12 9V6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const VideoCameraIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#0F172A',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 7L16 12L23 17V7Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 5H3C1.89543 5 1 5.89543 1 7V17C1 18.1046 1.89543 19 3 19H14C15.1046 19 16 18.1046 16 17V7C16 5.89543 15.1046 5 14 5Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#10B981',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M8 12L11 15L16 9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CalendarClockIcon: React.FC<IconProps> = ({
  size = 12,
  color = '#64748B',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M16 2V6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M8 2V6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M3 10H21" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

export const WrenchUserIcon: React.FC<IconProps> = ({
  size = 12,
  color = '#64748B',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14.7 6.3C14.3 5.9 14 5.3 14 4.7C14 3.2 15.2 2 16.7 2C17.3 2 17.9 2.3 18.3 2.7L19.5 3.9C19.9 4.3 20.2 4.9 20.2 5.5C20.2 7 19 8.2 17.5 8.2C16.9 8.2 16.3 7.9 15.9 7.5L14.7 6.3Z"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Path
      d="M16.5 7.5L6.5 17.5C5.7 18.3 4.3 18.3 3.5 17.5C2.7 16.7 2.7 15.3 3.5 14.5L13.5 4.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const PowerIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#064E3B',
  strokeWidth = 2.2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18.36 6.64A9 9 0 1 1 5.63 6.64"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M12 2V12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const PlayCircleIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#FFFFFF',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M10 8L16 12L10 16V8Z" fill={color} />
  </Svg>
);

export const UsersIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#059669',
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
    <Path
      d="M20 8V6M23 8C23 6.9 22.1 6 21 6H19"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const RouteDistanceIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#059669',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="6" cy="19" r="3" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="18" cy="5" r="3" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M12 19H17C17.6 19 18 18.6 18 18V8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDasharray="2 2"
    />
    <Path
      d="M6 16V6C6 5.4 6.4 5 7 5H12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const TargetBullseyeIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#059669',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="12" cy="12" r="4" fill={color} />
  </Svg>
);

export const HandHailIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#2563EB',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="4" r="2.5" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M12 9V17"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M8 21L12 17L16 21"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 12L12 9L17 6L19 8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ReceiptHistoryIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#475569',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 3V21L7 19L10 21L13 19L16 21L19 19L22 21V3L19 5L16 3L13 5L10 3L7 5L4 3Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 8H16"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M8 12H16"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M8 16H12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const RefreshClockIcon: React.FC<IconProps> = ({
  size = 13,
  color = '#059669',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 12A9 9 0 0 0 6 5.3L3 8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 3V8H8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="12" r="1.5" fill={color} />
  </Svg>
);

export const SeatIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#059669',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 4V13C7 14.1 7.9 15 9 15H17C18.1 15 19 14.1 19 13V10"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M5 19H19"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M7 15V19M17 15V19"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const RobotDispatchIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#059669',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2V5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path
      d="M4 11C4 7.68629 6.68629 5 10 5H14C17.3137 5 20 7.68629 20 11V17C20 19.2091 18.2091 21 16 21H8C5.79086 21 4 19.2091 4 17V11Z"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Circle cx="9" cy="12" r="1.5" fill={color} />
    <Circle cx="15" cy="12" r="1.5" fill={color} />
    <Path d="M9 16H15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const UserCheckIcon: React.FC<IconProps> = ({
  size = 15,
  color = '#FFFFFF',
  strokeWidth = 2.2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M16 21V19C16 17.9 15.1 17 14 17H6C4.9 17 4 17.9 4 19V21"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Circle cx="10" cy="9" r="4" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M16 11L18 13L22 9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CloseXIcon: React.FC<IconProps> = ({
  size = 13,
  color = '#475569',
  strokeWidth = 2.2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6L18 18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SurgeTrendIcon: React.FC<IconProps> = ({
  size = 17,
  color = '#2563EB',
  strokeWidth = 2.2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 17L9 11L13 15L21 7"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 7H21V11"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const DiamondTargetIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#059669',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L21 12L12 21L3 12L12 2Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="12" r="3" fill={color} />
  </Svg>
);

export const TrafficLightIcon: React.FC<IconProps> = ({
  size = 13,
  color = '#059669',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 3H17C18.1 3 19 3.9 19 5V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V5C5 3.9 5.9 3 7 3Z"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Circle cx="12" cy="7" r="1.5" fill={color} />
    <Circle cx="12" cy="12" r="1.5" fill={color} />
    <Circle cx="12" cy="17" r="1.5" fill={color} />
  </Svg>
);

export const CompassHeadingIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#059669',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 11L22 2L13 21L11 13L3 11Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={color}
    />
  </Svg>
);

export const LayersIcon: React.FC<IconProps> = ({
  size = 15,
  color = '#FFFFFF',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L2 7L12 12L22 7L12 2Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 17L12 22L22 17"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 12L12 17L22 12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const FlagFinishIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#FFFFFF',
  strokeWidth = 2.2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 15S6 13 9 13S13 15 16 15S20 13 20 13V3S18 5 15 5S11 3 8 3S4 5 4 5V21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const SeatCrossIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#475569',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M7 4V13C7 14.1 7.9 15 9 15H17C18.1 15 19 14.1 19 13V10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M5 19H19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M3 3L21 21" stroke="#DC2626" strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const ListBulletIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#475569',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8 6H21M8 12H21M8 18H21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Circle cx="4" cy="6" r="1.5" fill={color} />
    <Circle cx="4" cy="12" r="1.5" fill={color} />
    <Circle cx="4" cy="18" r="1.5" fill={color} />
  </Svg>
);

export const TriangleAlertIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#475569',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.29 3.86L1.82 18C1.64537 18.3024 1.55296 18.6453 1.55199 18.9945C1.55101 19.3437 1.64151 19.6871 1.81442 19.9905C1.98733 20.2939 2.23673 20.5467 2.53771 20.7239C2.83869 20.9012 3.18081 20.9967 3.53 21H20.47C20.8192 20.9967 21.1613 20.9012 21.4623 20.7239C21.7633 20.5467 22.0127 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15449C12.6817 2.98587 12.3437 2.89746 12 2.89746C11.6563 2.89746 11.3183 2.98587 11.0188 3.15449C10.7193 3.32312 10.4683 3.56611 10.29 3.86Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M12 9V13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Circle cx="12" cy="17" r="1" fill={color} />
  </Svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({
  size = 16,
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

export const IdCardIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#2563EB',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 5H21V19H3V5Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="8" cy="11" r="2.5" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M14 9H18M14 13H18M6 16C6 14.5 7 13.5 8 13.5C9 13.5 10 14.5 10 16"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#94A3B8',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 18L15 12L9 6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#94A3B8',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const StarIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#F59E0B',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </Svg>
);

export const LogOutIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#DC2626',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 17L21 12L16 7"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 12H9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SettingsIcon: React.FC<IconProps> = ({
  size = 23,
  color = '#262626',
  strokeWidth = 2,
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

export const MoonIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#262626',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SunIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#F59E0B',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const GlobeAltIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#2563EB',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const VolumeHighIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#059669',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const BellRingIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#D97706',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const BluetoothIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#2563EB',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6.5 6.5l11 11L12 23V1l5.5 5.5-11 11"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SmartphoneIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#475569',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 2H17C18.1 2 19 2.9 19 4V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V4C5 2.9 5.9 2 7 2Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path d="M11 18H13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const Trash2Icon: React.FC<IconProps> = ({
  size = 16,
  color = '#DC2626',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const RefreshCwIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#059669',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SlidersIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#64748B',
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

export const InfoCircleIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#3B82F6',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M12 16v-4M12 8h.01" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);



