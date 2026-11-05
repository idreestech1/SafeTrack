import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Video,
  Camera as CameraIcon,
  Shield,
  ShieldAlert,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  LayoutGrid,
  Grid,
  Volume2,
  VolumeX,
  Radio,
  Phone,
  Siren,
  TriangleAlert,
  Download,
  RefreshCw,
  SlidersHorizontal,
  CircleDot,
  CheckCircle2,
  AlertCircle,
  Scan,
  Cpu,
  Lock,
  Search,
  ChevronRight,
  Filter,
  Play,
  Square,
  Crosshair,
  UserCheck,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import "./camera.css";

/* ================================================================== */
/*  Fleet Vehicle Feeds Dataset                                       */
/* ================================================================== */

const VEHICLE_FEEDS = [
  {
    id: "PK-102",
    reg: "KP-LE-4091",
    model: "Hino Metro Intercity (45-Seater)",
    driver: "Muhammad Ali (DRV-4412)",
    route: "Peshawar ⇄ Mardan (N-5 Highway)",
    status: "sos",
    sosActive: true,
    speed: 54,
    pax: 32,
    location: "GT Road KM 14 (Near Chamkani Flyover)",
    dmsAlert: "Dual Trigger: Driver Console + Row 4 Panic Lever",
    channels: [
      {
        id: "ch-1",
        name: "CAM 01 • DRIVER DMS (FACIAL AI)",
        type: "dms",
        status: "ALERT",
        statusTone: "red",
        aiTag: "Distress Signal Active",
        fps: 30,
        bitrate: "2.8 Mbps",
        codec: "H.265 / 1080p",
      },
      {
        id: "ch-2",
        name: "CAM 02 • PASSENGER SALOON CABIN",
        type: "cabin",
        status: "LIVE",
        statusTone: "green",
        aiTag: "Occupancy: 32/45 (71%)",
        fps: 30,
        bitrate: "2.4 Mbps",
        codec: "H.265 / 1080p",
      },
      {
        id: "ch-3",
        name: "CAM 03 • FORWARD ADAS ROAD CAM",
        type: "road",
        status: "LIVE",
        statusTone: "green",
        aiTag: "Lane Track: Locked • 54 km/h",
        fps: 60,
        bitrate: "3.4 Mbps",
        codec: "H.265 / 1080p",
      },
      {
        id: "ch-4",
        name: "CAM 04 • REAR PASSENGER EXIT GATE",
        type: "door",
        status: "LIVE",
        statusTone: "green",
        aiTag: "Doors Closed & Secured",
        fps: 25,
        bitrate: "1.8 Mbps",
        codec: "H.265 / 720p",
      },
    ],
  },
  {
    id: "PK-101",
    reg: "KP-LE-2180",
    model: "Isuzu Journey Dual Axle (36-Seater)",
    driver: "Arshad Khan (DRV-3810)",
    route: "Peshawar ⇄ Nowshera Cantt",
    status: "active",
    sosActive: false,
    speed: 62,
    pax: 28,
    location: "GT Road Eastern Bypass",
    dmsAlert: null,
    channels: [
      {
        id: "ch-1",
        name: "CAM 01 • DRIVER DMS (FACIAL AI)",
        type: "dms",
        status: "NORMAL",
        statusTone: "green",
        aiTag: "Gaze: Forward 99% • Attention OK",
        fps: 30,
        bitrate: "2.5 Mbps",
        codec: "H.265 / 1080p",
      },
      {
        id: "ch-2",
        name: "CAM 02 • PASSENGER SALOON CABIN",
        type: "cabin",
        status: "LIVE",
        statusTone: "green",
        aiTag: "Occupancy: 28/36 (77%)",
        fps: 30,
        bitrate: "2.2 Mbps",
        codec: "H.265 / 1080p",
      },
      {
        id: "ch-3",
        name: "CAM 03 • FORWARD ADAS ROAD CAM",
        type: "road",
        status: "LIVE",
        statusTone: "green",
        aiTag: "Lane Track: Locked • 62 km/h",
        fps: 60,
        bitrate: "3.1 Mbps",
        codec: "H.265 / 1080p",
      },
      {
        id: "ch-4",
        name: "CAM 04 • REAR PASSENGER EXIT GATE",
        type: "door",
        status: "LIVE",
        statusTone: "green",
        aiTag: "Doors Closed",
        fps: 25,
        bitrate: "1.7 Mbps",
        codec: "H.265 / 720p",
      },
    ],
  },
  {
    id: "PK-221",
    reg: "KP-MN-9921",
    model: "Hino Metro AC Coach (45-Seater)",
    driver: "Bilal Ahmad (DRV-5012)",
    route: "Ring Road Circular Expressway",
    status: "warning",
    sosActive: false,
    speed: 78,
    pax: 45,
    location: "Ring Road Gulbahar Flyover",
    dmsAlert: "Driver Yawning / Micro-Sleep Risk Detected (DMS Level 1)",
    channels: [
      {
        id: "ch-1",
        name: "CAM 01 • DRIVER DMS (FACIAL AI)",
        type: "dms",
        status: "WARNING",
        statusTone: "amber",
        aiTag: "Yawning Frequency > 3/min",
        fps: 30,
        bitrate: "2.6 Mbps",
        codec: "H.265 / 1080p",
      },
      {
        id: "ch-2",
        name: "CAM 02 • PASSENGER SALOON CABIN",
        type: "cabin",
        status: "LIVE",
        statusTone: "amber",
        aiTag: "Capacity: 100% Full (45/45)",
        fps: 30,
        bitrate: "2.3 Mbps",
        codec: "H.265 / 1080p",
      },
      {
        id: "ch-3",
        name: "CAM 03 • FORWARD ADAS ROAD CAM",
        type: "road",
        status: "LIVE",
        statusTone: "amber",
        aiTag: "Speed: 78 km/h (Limit 65)",
        fps: 60,
        bitrate: "3.2 Mbps",
        codec: "H.265 / 1080p",
      },
      {
        id: "ch-4",
        name: "CAM 04 • REAR PASSENGER EXIT GATE",
        type: "door",
        status: "LIVE",
        statusTone: "green",
        aiTag: "Doors Closed",
        fps: 25,
        bitrate: "1.8 Mbps",
        codec: "H.265 / 720p",
      },
    ],
  },
  {
    id: "PK-145",
    reg: "KP-CD-3301",
    model: "Toyota Coaster Fast Mini (29-Seater)",
    driver: "Zubair Shah (DRV-1982)",
    route: "Peshawar ⇄ Charsadda Northern Rd",
    status: "active",
    sosActive: false,
    speed: 48,
    pax: 19,
    location: "Naguman River Bypass",
    dmsAlert: null,
    channels: [
      {
        id: "ch-1",
        name: "CAM 01 • DRIVER DMS (FACIAL AI)",
        type: "dms",
        status: "NORMAL",
        statusTone: "green",
        aiTag: "Eyes Open: 97% • Gaze OK",
        fps: 30,
        bitrate: "2.4 Mbps",
        codec: "H.265 / 1080p",
      },
      {
        id: "ch-2",
        name: "CAM 02 • PASSENGER SALOON CABIN",
        type: "cabin",
        status: "LIVE",
        statusTone: "green",
        aiTag: "Occupancy: 19/29 (65%)",
        fps: 30,
        bitrate: "2.1 Mbps",
        codec: "H.265 / 1080p",
      },
      {
        id: "ch-3",
        name: "CAM 03 • FORWARD ADAS ROAD CAM",
        type: "road",
        status: "LIVE",
        statusTone: "green",
        aiTag: "Lane Track: Locked • 48 km/h",
        fps: 60,
        bitrate: "3.0 Mbps",
        codec: "H.265 / 1080p",
      },
      {
        id: "ch-4",
        name: "CAM 04 • REAR PASSENGER EXIT GATE",
        type: "door",
        status: "LIVE",
        statusTone: "green",
        aiTag: "Doors Closed",
        fps: 25,
        bitrate: "1.6 Mbps",
        codec: "H.265 / 720p",
      },
    ],
  },
  {
    id: "PK-108",
    reg: "KP-LE-1144",
    model: "Daewoo Low-Floor City Bus (50-Seater)",
    driver: "Naveed Qureshi (DRV-6120)",
    route: "BRT Feeder Line 2 (Chamkani Link)",
    status: "active",
    sosActive: false,
    speed: 42,
    pax: 38,
    location: "BRT Feeder Corridor Sector 3",
    dmsAlert: null,
    channels: [
      {
        id: "ch-1",
        name: "CAM 01 • DRIVER DMS (FACIAL AI)",
        type: "dms",
        status: "NORMAL",
        statusTone: "green",
        aiTag: "Seatbelt: Fastened • Attention OK",
        fps: 30,
        bitrate: "2.7 Mbps",
        codec: "H.265 / 1080p",
      },
      {
        id: "ch-2",
        name: "CAM 02 • PASSENGER SALOON CABIN",
        type: "cabin",
        status: "LIVE",
        statusTone: "green",
        aiTag: "Occupancy: 38/50 (76%)",
        fps: 30,
        bitrate: "2.5 Mbps",
        codec: "H.265 / 1080p",
      },
      {
        id: "ch-3",
        name: "CAM 03 • FORWARD ADAS ROAD CAM",
        type: "road",
        status: "LIVE",
        statusTone: "green",
        aiTag: "Dedicated BRT Lane Clear",
        fps: 60,
        bitrate: "3.5 Mbps",
        codec: "H.265 / 1080p",
      },
      {
        id: "ch-4",
        name: "CAM 04 • REAR PASSENGER EXIT GATE",
        type: "door",
        status: "LIVE",
        statusTone: "green",
        aiTag: "Station Approach Doors Armed",
        fps: 25,
        bitrate: "1.9 Mbps",
        codec: "H.265 / 720p",
      },
    ],
  },
];

/* ================================================================== */
/*  Tactical Canvas Stream Component (Simulates Real Live CCTV)       */
/* ================================================================== */

const LiveCctvCanvas = ({ channel, vehicle, isNightVision, showAiMesh }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    let frame = 0;

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // Base background (dark tactical CCTV atmosphere)
      if (isNightVision) {
        ctx.fillStyle = "#021207"; // Dark night-vision green
      } else {
        ctx.fillStyle = "#0a0e17"; // Dark slate CCTV
      }
      ctx.fillRect(0, 0, w, h);

      // Draw subtle grid / scanning lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = isNightVision ? "rgba(34, 197, 94, 0.08)" : "rgba(59, 130, 246, 0.06)";
      for (let y = 0; y < h; y += 12) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Channel-specific simulated imagery
      if (channel.type === "dms") {
        // Driver Cockpit DMS View
        // Draw steering wheel arc
        ctx.lineWidth = 6;
        ctx.strokeStyle = isNightVision ? "#15803d" : "#1e293b";
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.95, w * 0.35, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();

        // Draw driver silhouette
        ctx.fillStyle = isNightVision ? "rgba(34, 197, 94, 0.25)" : "rgba(30, 41, 59, 0.7)";
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.42, 42, 0, Math.PI * 2);
        ctx.fill();

        // Shoulders
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.72, 85, 45, 0, 0, Math.PI * 2);
        ctx.fill();

        // AI Face Tracking Bounding Box
        if (showAiMesh) {
          const boxSize = 75;
          const jitterX = Math.sin(frame * 0.05) * 1.5;
          const jitterY = Math.cos(frame * 0.04) * 1.2;
          const boxX = w * 0.5 - boxSize / 2 + jitterX;
          const boxY = h * 0.38 - boxSize / 2 + jitterY;

          ctx.lineWidth = 1.5;
          ctx.strokeStyle = vehicle.sosActive
            ? "#ef4444"
            : channel.statusTone === "amber"
            ? "#f59e0b"
            : "#10b981";

          // Target brackets
          const len = 10;
          ctx.beginPath();
          // Top Left
          ctx.moveTo(boxX, boxY + len);
          ctx.lineTo(boxX, boxY);
          ctx.lineTo(boxX + len, boxY);
          // Top Right
          ctx.moveTo(boxX + boxSize - len, boxY);
          ctx.lineTo(boxX + boxSize, boxY);
          ctx.lineTo(boxX + boxSize, boxY + len);
          // Bottom Left
          ctx.moveTo(boxX, boxY + boxSize - len);
          ctx.lineTo(boxX, boxY + boxSize);
          ctx.lineTo(boxX + len, boxY + boxSize);
          // Bottom Right
          ctx.moveTo(boxX + boxSize - len, boxY + boxSize);
          ctx.lineTo(boxX + boxSize, boxY + boxSize);
          ctx.lineTo(boxX + boxSize, boxY + boxSize - len);
          ctx.stroke();

          // AI Landmark Dots on Eyes
          ctx.fillStyle = ctx.strokeStyle;
          ctx.fillRect(boxX + 22, boxY + 28, 4, 4);
          ctx.fillRect(boxX + 48, boxY + 28, 4, 4);
          // Mouth
          ctx.fillRect(boxX + 33, boxY + 52, 9, 3);

          // HUD Label over face
          ctx.font = "9px monospace";
          ctx.fillText(
            vehicle.sosActive
              ? "SOS PANIC DETECTED"
              : channel.statusTone === "amber"
              ? "DMS: DROWSINESS ALERT"
              : "DMS: 99.4% ATTENTIVE",
            boxX - 8,
            boxY - 6
          );
        }
      } else if (channel.type === "cabin") {
        // Passenger Saloon Cabin
        // Interior perspective lines (ceiling and floor rows)
        ctx.strokeStyle = isNightVision ? "#15803d" : "#334155";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, h * 0.15);
        ctx.lineTo(w * 0.5, h * 0.4);
        ctx.lineTo(w, h * 0.15);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, h * 0.95);
        ctx.lineTo(w * 0.4, h * 0.6);
        ctx.lineTo(w * 0.6, h * 0.6);
        ctx.lineTo(w, h * 0.95);
        ctx.stroke();

        // Seats silhouettes and passenger heads
        for (let i = 0; i < 6; i++) {
          const depth = 0.5 + i * 0.08;
          const pxLeft = w * (0.28 - i * 0.03);
          const pxRight = w * (0.72 + i * 0.03);
          const py = h * (0.42 + i * 0.09);

          ctx.fillStyle = isNightVision ? "rgba(34, 197, 94, 0.3)" : "rgba(71, 85, 105, 0.6)";
          ctx.beginPath();
          ctx.arc(pxLeft, py, 14 * depth, 0, Math.PI * 2);
          ctx.arc(pxRight, py, 14 * depth, 0, Math.PI * 2);
          ctx.fill();
        }

        // Passenger Count HUD
        ctx.font = "10px monospace";
        ctx.fillStyle = isNightVision ? "#4ade80" : "#93c5fd";
        ctx.fillText(`AI CABIN LOAD: ${vehicle.pax} PASSENGERS (71%)`, 12, h - 35);
      } else if (channel.type === "road") {
        // Forward ADAS Road Cam
        // Horizon line
        const horizon = h * 0.45;
        ctx.strokeStyle = isNightVision ? "#166534" : "#1e293b";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, horizon);
        ctx.lineTo(w, horizon);
        ctx.stroke();

        // Road perspective lanes
        ctx.strokeStyle = isNightVision ? "#22c55e" : "#64748b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Left lane
        ctx.moveTo(w * 0.45, horizon);
        ctx.lineTo(w * 0.05, h);
        // Right lane
        ctx.moveTo(w * 0.55, horizon);
        ctx.lineTo(w * 0.95, h);
        ctx.stroke();

        // Center dashed lines
        ctx.setLineDash([12, 10]);
        ctx.lineDashOffset = -frame * 3;
        ctx.beginPath();
        ctx.moveTo(w * 0.5, horizon);
        ctx.lineTo(w * 0.5, h);
        ctx.stroke();
        ctx.setLineDash([]); // Reset

        // Forward Vehicle Bounding Box
        const leadX = w * 0.46;
        const leadY = horizon + 22;
        const leadW = 44;
        const leadH = 34;

        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(leadX, leadY, leadW, leadH);

        ctx.fillStyle = "#38bdf8";
        ctx.font = "9px monospace";
        ctx.fillText("LEAD: 38m • 52 km/h", leadX - 8, leadY - 5);
      } else {
        // Rear Gate / Door Cam
        ctx.strokeStyle = isNightVision ? "#15803d" : "#334155";
        ctx.lineWidth = 2;
        // Door frame
        ctx.strokeRect(w * 0.25, h * 0.15, w * 0.5, h * 0.75);

        ctx.font = "10px monospace";
        ctx.fillStyle = "#10b981";
        ctx.fillText("DOOR SENSORS: LOCKED & SEALED", w * 0.22, h * 0.5);
      }

      // Live Timestamp Overlay
      const now = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
        now.getDate()
      )} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${String(
        Math.floor(now.getMilliseconds() / 10)
      ).padStart(2, "0")} PKT`;

      ctx.fillStyle = isNightVision ? "#86efac" : "#f8fafc";
      ctx.font = "10.5px monospace";
      ctx.fillText(timeStr, 12, 22);

      // Channel Watermark
      ctx.fillStyle = isNightVision ? "rgba(134, 239, 172, 0.7)" : "rgba(248, 250, 252, 0.7)";
      ctx.font = "9.5px monospace";
      ctx.fillText(`${vehicle.id} • ${channel.name}`, 12, 38);
      ctx.fillText(`GPS: ${vehicle.location}`, 12, h - 14);

      // Blinking REC Indicator
      if (Math.floor(frame / 25) % 2 === 0) {
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(w - 60, 18, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "10px monospace";
        ctx.fillText("LIVE REC", w - 50, 21);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [channel, vehicle, isNightVision, showAiMesh]);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={300}
      className={`rt-canvas ${isNightVision ? "is-night" : ""}`}
    />
  );
};

/* ================================================================== */
/*  Main Camera Monitoring Component                                  */
/* ================================================================== */

const Camera = () => {
  const [selectedVehicleId, setSelectedVehicleId] = useState("PK-102");
  const [selectedFeedType, setSelectedFeedType] = useState("all");
  const [viewLayout, setViewLayout] = useState("quad"); // 'quad' | 'solo' | 'grid'
  const [soloChannelId, setSoloChannelId] = useState("ch-1");
  const [isNightVision, setIsNightVision] = useState(false);
  const [showAiMesh, setShowAiMesh] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [triageFilter, setTriageFilter] = useState("all");

  // Selected Vehicle
  const vehicle = useMemo(
    () => VEHICLE_FEEDS.find((v) => v.id === selectedVehicleId) || VEHICLE_FEEDS[0],
    [selectedVehicleId]
  );

  // Channels to render
  const visibleChannels = useMemo(() => {
    if (selectedFeedType !== "all") {
      return vehicle.channels.filter((c) => c.type === selectedFeedType);
    }
    return vehicle.channels;
  }, [vehicle, selectedFeedType]);

  // Snapshot Capture
  const handleTakeSnapshot = (channelName) => {
    alert(`Evidence Snapshot Captured: [${vehicle.id}] ${channelName} saved to Police Vault.`);
  };

  // Two-way Radio Cabin Call
  const handleCabinCall = () => {
    alert(`Calling Driver Cabin in ${vehicle.id} (${vehicle.driver}). Intercom opened.`);
  };

  // 4 Top KPI Cards
  const kpis = [
    {
      id: "active",
      label: "ACTIVE CAMERAS ONLINE",
      icon: Video,
      value: "486/492",
      unit: "online streams",
      chip: "98.8% Health",
      foot: "100% KPK Fleet Geo-snapped",
      dot: "blue",
      accent: "blue",
    },
    {
      id: "dms",
      label: "DMS AI DRIVER ALERTS",
      icon: Eye,
      value: "02",
      unit: "flagged units",
      chip: "Drowsiness Risk",
      foot: "Driver attention monitoring active",
      dot: "amber",
      accent: "amber",
    },
    {
      id: "sos",
      label: "PRIORITY DISTRESS FEED",
      icon: Siren,
      value: "01",
      unit: "CRITICAL STREAM",
      chip: "PK-102 (N-5)",
      foot: "Police interceptors dispatched",
      dot: "red",
      accent: "red",
    },
    {
      id: "storage",
      label: "LEGAL EVIDENCE ARCHIVE",
      icon: Shield,
      value: "14.2 TB",
      unit: "30-day vault",
      chip: "TLS 1.3 Encrypted",
      foot: "Continuous encrypted circular write",
      dot: "green",
      accent: "emerald",
    },
  ];

  return (
    <div className="cam-page">
      {/* ---------- Header ---------- */}
      <header className="cam-header">
        <div className="cam-header__text">
          <div className="cam-kicker">
            <ShieldAlert size={12} /> POLICE TACTICAL CCTV • LAW ENFORCEMENT LEVEL 3
            RESTRICTED
          </div>
          <div className="cam-header__title-row">
            <h1>CCTV &amp; AI Camera Monitoring</h1>
            <span className="cam-header__sep">•</span>
            <p className="cam-header__sub">
              Live multi-channel onboard transit video streams, Driver DMS facial attention AI, and cabin security telemetry
            </p>
          </div>
        </div>

        <div className="cam-header__actions">
          <Button
            variant="outline"
            size="sm"
            className={"cam-btn-soft" + (isNightVision ? " is-active" : "")}
            onClick={() => setIsNightVision(!isNightVision)}
          >
            <Eye size={13} /> {isNightVision ? "IR Night Vision: ON" : "Daylight Mode"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className={"cam-btn-soft" + (showAiMesh ? " is-active" : "")}
            onClick={() => setShowAiMesh(!showAiMesh)}
          >
            <Scan size={13} /> AI HUD Telemetry: {showAiMesh ? "ON" : "OFF"}
          </Button>

          <Button
            size="sm"
            className="cam-btn-call"
            onClick={handleCabinCall}
          >
            <Phone size={13} /> Call Cabin Intercom
          </Button>
        </div>
      </header>

      {/* ---------- 4 KPI Cards ---------- */}
      <section className="cam-kpis">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.id} className="cam-card cam-kpi">
              <div className="cam-kpi__top">
                <span className="cam-kpi__label">{k.label}</span>
                <span className={`cam-kpi__icon cam-kpi__icon--${k.accent}`}>
                  <Icon size={12} strokeWidth={2.2} />
                </span>
              </div>

              <div className="cam-kpi__value">
                <strong>{k.value}</strong>
                {k.unit && <span>{k.unit}</span>}
                {k.chip && <em className={`cam-kpi__chip cam-kpi__chip--${k.accent}`}>{k.chip}</em>}
              </div>

              <p className="cam-kpi__foot">
                <i className={`cam-dot cam-dot--${k.dot}`} />
                {k.foot}
              </p>

              <div className="cam-kpi__bar">
                <div className={`cam-kpi__bar-fill cam-kpi__bar-fill--${k.accent}`} />
              </div>
            </Card>
          );
        })}
      </section>

      {/* ---------- Control & Stream Switcher Bar ---------- */}
      <Card className="cam-card cam-filters">
        <div className="cam-filters__row">
          <div className="cam-select-wrap">
            <span className="cam-select-lbl">TARGET VEHICLE:</span>
            <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
              <SelectTrigger className="cam-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_FEEDS.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.id} • {v.driver.split(" (")[0]} {v.sosActive ? "• [SOS ACTIVE]" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="cam-select-wrap">
            <span className="cam-select-lbl">CHANNEL FILTER:</span>
            <Select value={selectedFeedType} onValueChange={setSelectedFeedType}>
              <SelectTrigger className="cam-select">
                <SelectValue placeholder="All Channels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels (Quad 4-Up)</SelectItem>
                <SelectItem value="dms">CAM 01 • Driver DMS (Facial AI)</SelectItem>
                <SelectItem value="cabin">CAM 02 • Passenger Cabin</SelectItem>
                <SelectItem value="road">CAM 03 • Forward ADAS Road</SelectItem>
                <SelectItem value="door">CAM 04 • Rear Exit Gate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Layout buttons */}
          <div className="cam-layout-toggle">
            <span className="cam-select-lbl">DISPLAY GRID:</span>
            <div className="cam-btn-group">
              <Button
                variant="outline"
                size="sm"
                className={"cam-btn-grid" + (viewLayout === "quad" ? " is-active" : "")}
                onClick={() => setViewLayout("quad")}
              >
                <LayoutGrid size={12} /> Quad 2x2
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={"cam-btn-grid" + (viewLayout === "solo" ? " is-active" : "")}
                onClick={() => setViewLayout("solo")}
              >
                <Square size={12} /> Focus Solo
              </Button>
            </div>
          </div>
        </div>

        {/* Priority Alert Banner if Vehicle has Active SOS or DMS Warning */}
        {vehicle.sosActive && (
          <div className="cam-incident-alert" role="alert">
            <i className="cam-incident__pulse" />
            <div className="cam-incident__text">
              <strong>CRITICAL SOS FEED ENGAGED:</strong> Vehicle{" "}
              <strong>{vehicle.id}</strong> ({vehicle.reg}) has broadcast an active panic switch
              near Chamkani. Video streams locked to Central Tactical Dispatch.
            </div>
            <Button
              size="sm"
              className="cam-incident__btn"
              onClick={() => alert(`Patrol Interceptors routed to GPS: ${vehicle.location}`)}
            >
              Route Police Interceptor
            </Button>
          </div>
        )}

        {vehicle.dmsAlert && !vehicle.sosActive && (
          <div className="cam-warning-alert">
            <TriangleAlert size={14} />
            <div className="cam-warning__text">
              <strong>AI DRIVER SAFETY WARNING:</strong> {vehicle.dmsAlert} in vehicle{" "}
              <strong>{vehicle.id}</strong>.
            </div>
            <Button size="sm" className="cam-btn-warn" onClick={handleCabinCall}>
              Radio Cabin
            </Button>
          </div>
        )}
      </Card>

      {/* ---------- Main CCTV Video Grid & HUD Panel ---------- */}
      <div className="cam-main-grid">
        {/* Left: Video Streams */}
        <div className="cam-streams-col">
          <div className={`cam-streams-grid cam-streams-grid--${viewLayout}`}>
            {viewLayout === "solo" ? (
              // Solo View
              (() => {
                const soloCh =
                  vehicle.channels.find((c) => c.id === soloChannelId) || vehicle.channels[0];
                return (
                  <Card key={soloCh.id} className="cam-card cam-stream-box cam-stream-box--solo">
                    <div className="cam-stream__hud-head">
                      <div className="cam-stream__title">
                        <span className={`cam-stream__led cam-stream__led--${soloCh.statusTone}`} />
                        <strong>{soloCh.name}</strong>
                      </div>
                      <div className="cam-stream__meta">
                        <span className="cam-tag">{soloCh.codec}</span>
                        <span className="cam-tag">{soloCh.fps} FPS</span>
                        <span className="cam-tag">{soloCh.bitrate}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cam-action-icon"
                          onClick={() => handleTakeSnapshot(soloCh.name)}
                          title="Evidence Snapshot"
                        >
                          <CameraIcon size={13} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cam-action-icon"
                          onClick={() => setViewLayout("quad")}
                          title="Back to Quad View"
                        >
                          <Minimize2 size={13} />
                        </Button>
                      </div>
                    </div>

                    <div className="cam-canvas-holder">
                      <LiveCctvCanvas
                        channel={soloCh}
                        vehicle={vehicle}
                        isNightVision={isNightVision}
                        showAiMesh={showAiMesh}
                      />
                    </div>

                    <div className="cam-stream__hud-foot">
                      <div className="cam-hud-badge">
                        <Cpu size={12} /> AI Status: <strong>{soloCh.aiTag}</strong>
                      </div>
                      <div className="cam-hud-actions">
                        {vehicle.channels.map((c) => (
                          <Button
                            key={c.id}
                            variant="outline"
                            size="sm"
                            className={
                              "cam-ch-btn" + (c.id === soloChannelId ? " is-active" : "")
                            }
                            onClick={() => setSoloChannelId(c.id)}
                          >
                            {c.id.toUpperCase()}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </Card>
                );
              })()
            ) : (
              // Quad View (2x2)
              visibleChannels.map((ch) => (
                <Card key={ch.id} className="cam-card cam-stream-box">
                  <div className="cam-stream__hud-head">
                    <div className="cam-stream__title">
                      <span className={`cam-stream__led cam-stream__led--${ch.statusTone}`} />
                      <strong>{ch.name}</strong>
                    </div>
                    <div className="cam-stream__meta">
                      <span className="cam-tag">{ch.codec}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cam-action-icon"
                        onClick={() => handleTakeSnapshot(ch.name)}
                        title="Snapshot"
                      >
                        <CameraIcon size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cam-action-icon"
                        onClick={() => {
                          setSoloChannelId(ch.id);
                          setViewLayout("solo");
                        }}
                        title="Maximize"
                      >
                        <Maximize2 size={12} />
                      </Button>
                    </div>
                  </div>

                  <div className="cam-canvas-holder">
                    <LiveCctvCanvas
                      channel={ch}
                      vehicle={vehicle}
                      isNightVision={isNightVision}
                      showAiMesh={showAiMesh}
                    />
                  </div>

                  <div className="cam-stream__hud-foot">
                    <div className="cam-hud-badge">
                      <Cpu size={11} /> <span>{ch.aiTag}</span>
                    </div>
                    <span className="cam-hud-bitrate">{ch.bitrate}</span>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right: Telemetry & Vehicle Safety Dossier */}
        <div className="cam-side-col">
          <Card className="cam-card cam-dossier">
            <div className="cam-dossier__head">
              <div className="cam-dossier__tag-row">
                <span className="cam-code-badge">{vehicle.id}</span>
                <span className="cam-reg-badge">{vehicle.reg}</span>
                {vehicle.sosActive && (
                  <span className="cam-badge-sos">
                    <i className="cam-dot cam-dot--red" /> SOS ACTIVE
                  </span>
                )}
              </div>
              <h3>{vehicle.model}</h3>
              <p>{vehicle.route}</p>
            </div>

            {/* Telemetry Strip */}
            <div className="cam-telemetry-grid">
              <div className="cam-telemetry-item">
                <span className="cam-tel-lbl">LIVE SPEED</span>
                <strong>{vehicle.speed} <small>km/h</small></strong>
              </div>
              <div className="cam-telemetry-item">
                <span className="cam-tel-lbl">OCCUPANCY</span>
                <strong>{vehicle.pax} <small>onboard</small></strong>
              </div>
              <div className="cam-telemetry-item">
                <span className="cam-tel-lbl">AUDIO CABIN</span>
                <strong>{isAudioMuted ? "MUTED" : "OPEN"}</strong>
              </div>
              <div className="cam-telemetry-item">
                <span className="cam-tel-lbl">ENCRYPTION</span>
                <strong className="es-green">AES-256</strong>
              </div>
            </div>

            {/* Driver Profile */}
            <div className="cam-driver-box">
              <div className="cam-driver-head">
                <UserCheck size={13} />
                <span>ASSIGNED OPERATOR</span>
              </div>
              <div className="cam-driver-info">
                <strong>{vehicle.driver}</strong>
                <span>License: KPK-88910-HTV (Valid)</span>
                <code>GPS: {vehicle.location}</code>
              </div>
            </div>

            {/* AI Real-time Event Stream */}
            <div className="cam-events-box">
              <div className="cam-events-head">
                <Zap size={12} />
                <span>REAL-TIME AI EDGE DETECTIONS</span>
              </div>

              <div className="cam-events-list">
                <div className="cam-event-item">
                  <span className="cam-ev-time">21:56:14</span>
                  <span className="cam-ev-dot is-green" />
                  <p>
                    <strong>DMS Facial Tracking:</strong> Driver eyes open 98%, head pitch normal.
                  </p>
                </div>
                {vehicle.sosActive && (
                  <div className="cam-event-item is-critical">
                    <span className="cam-ev-time">21:54:02</span>
                    <span className="cam-ev-dot is-red" />
                    <p>
                      <strong>EMERGENCY PANIC TRIGGER:</strong> Silent switch pressed near Chamkani.
                    </p>
                  </div>
                )}
                {vehicle.dmsAlert && (
                  <div className="cam-event-item is-warn">
                    <span className="cam-ev-time">21:52:18</span>
                    <span className="cam-ev-dot is-amber" />
                    <p>
                      <strong>AI Alert:</strong> Yawning frequency exceeding safety threshold.
                    </p>
                  </div>
                )}
                <div className="cam-event-item">
                  <span className="cam-ev-time">21:48:30</span>
                  <span className="cam-ev-dot is-blue" />
                  <p>
                    <strong>ADAS Forward Vision:</strong> Safe following distance 38m maintained.
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Action Buttons */}
            <div className="cam-dossier-actions">
              <Button
                variant="outline"
                size="sm"
                className="cam-btn-act"
                onClick={() => setIsAudioMuted(!isAudioMuted)}
              >
                {isAudioMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                {isAudioMuted ? "Unmute Cabin" : "Mute Cabin"}
              </Button>
              <Button
                size="sm"
                className="cam-btn-intercept"
                onClick={() =>
                  alert(`Tactical dispatch sent: Patrol units converging on ${vehicle.id}`)
                }
              >
                <Siren size={13} /> Police Intercept
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Camera;
