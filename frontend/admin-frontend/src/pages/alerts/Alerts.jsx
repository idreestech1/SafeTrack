import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  TriangleAlert,
  ShieldAlert,
  Siren,
  Bell,
  BellRing,
  CheckCircle2,
  Clock,
  Download,
  SlidersHorizontal,
  Search,
  Filter,
  Phone,
  Video,
  Send,
  User,
  Radio,
  ExternalLink,
  ChevronRight,
  Shield,
  Zap,
  Activity,
  AlertOctagon,
  Eye,
  Gauge,
  MapPin,
  X,
  Plus,
  CircleDot,
  Check,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import "./alerts.css";

/* ================================================================== */
/*  Static Incidents & Alerts Dataset (SafeTrack Telematics Core)     */
/* ================================================================== */

const INITIAL_ALERTS = [
  {
    id: "ALT-9041",
    severity: "critical",
    category: "SOS / Emergency",
    title: "Silent SOS Panic Switch Triggered",
    vehicleId: "PK-102",
    vehicleReg: "KP-LE-4091",
    driver: "Muhammad Ali",
    driverCode: "DRV-4412",
    driverPhone: "+92 300 5541920",
    route: "Peshawar ⇄ Mardan (N-5 Highway)",
    location: "GT Road KM 14 (Chamkani Interchange)",
    pos: [34.0152, 71.5812],
    speed: 54,
    speedLimit: 65,
    pax: 32,
    paxMax: 45,
    dmsAttention: "98% (Alert)",
    status: "active",
    triggeredAt: "2 mins ago",
    timestamp: "21:58:14",
    detail: "Dual silent emergency alarm activated from driver console and passenger row 04 panic lever.",
    recommendedAction: "Dispatch Police Patrol Interceptor Unit 04 immediately.",
    logs: [
      { time: "21:58:14", text: "Panic lever pulled in Passenger Row 04.", tone: "red" },
      { time: "21:58:16", text: "Dual GPS broadcast packet received at Central Dispatch.", tone: "blue" },
      { time: "21:58:45", text: "Cmdr. Tariq Rehman acknowledged critical alert.", tone: "green" },
    ],
  },
  {
    id: "ALT-9038",
    severity: "warning",
    category: "Speeding / ADAS",
    title: "Telematics Speed Threshold Exceeded",
    vehicleId: "PK-221",
    vehicleReg: "KP-MN-9921",
    driver: "Bilal Ahmad",
    driverCode: "DRV-5012",
    driverPhone: "+92 301 9845210",
    route: "Ring Road Circular Expressway",
    location: "Ring Road East (Near Gulbahar Flyover)",
    pos: [34.0180, 71.6150],
    speed: 78,
    speedLimit: 60,
    pax: 45,
    paxMax: 45,
    dmsAttention: "82% (Mild Fatigue)",
    status: "active",
    triggeredAt: "8 mins ago",
    timestamp: "21:52:10",
    detail: "Vehicle sustained 78 km/h in designated 60 km/h municipal corridor for over 45 seconds.",
    recommendedAction: "Transmit automatic cabin deceleration audio alert.",
    logs: [
      { time: "21:52:10", text: "Speed exceeded 60 km/h threshold.", tone: "amber" },
      { time: "21:52:15", text: "Cabin audio speed chime triggered automatically.", tone: "blue" },
    ],
  },
  {
    id: "ALT-9035",
    severity: "warning",
    category: "Route Deviation",
    title: "Corridor Geofence Breach (450m Off-Path)",
    vehicleId: "PK-145",
    vehicleReg: "KP-CD-3301",
    driver: "Zubair Shah",
    driverCode: "DRV-1982",
    driverPhone: "+92 312 4455667",
    route: "Peshawar ⇄ Charsadda Road",
    location: "Naguman River Bypass (Off Route)",
    pos: [34.0950, 71.6350],
    speed: 48,
    speedLimit: 65,
    pax: 19,
    paxMax: 29,
    dmsAttention: "95% (Normal)",
    status: "active",
    triggeredAt: "14 mins ago",
    timestamp: "21:46:22",
    detail: "Vehicle departed assigned Charsadda corridor by 450m near Naguman bypass towards rural service road.",
    recommendedAction: "Request driver route justification via VHF radio.",
    logs: [
      { time: "21:46:22", text: "Geofence corridor boundary breach detected.", tone: "amber" },
    ],
  },
  {
    id: "ALT-9031",
    severity: "warning",
    category: "Driver Safety (DMS)",
    title: "Driver Drowsiness Risk Flagged (DMS L1)",
    vehicleId: "PK-331",
    vehicleReg: "KP-PE-8812",
    driver: "Kamran Jan",
    driverCode: "DRV-7719",
    driverPhone: "+92 333 1122334",
    route: "City Terminal Shuttles",
    location: "City Terminal Hub Area",
    pos: [34.0080, 71.5420],
    speed: 38,
    speedLimit: 50,
    pax: 42,
    paxMax: 45,
    dmsAttention: "71% (Drowsy)",
    status: "active",
    triggeredAt: "21 mins ago",
    timestamp: "21:39:05",
    detail: "Driver Monitoring System camera registered 4 prolonged blink/yawn cycles in 90 seconds.",
    recommendedAction: "Advise driver relief swap at next depot stop.",
    logs: [
      { time: "21:39:05", text: "AI DMS flagged repetitive eye closure.", tone: "amber" },
      { time: "21:39:10", text: "Cabin haptic seat vibrator triggered.", tone: "blue" },
    ],
  },
  {
    id: "ALT-9027",
    severity: "advisory",
    category: "Capacity / Load",
    title: "Full Passenger Capacity Risk",
    vehicleId: "PK-108",
    vehicleReg: "KP-LE-1144",
    driver: "Naveed Qureshi",
    driverCode: "DRV-6120",
    driverPhone: "+92 345 6677889",
    route: "BRT Feeder Line 2",
    location: "BRT Feeder Sector 4",
    pos: [34.0110, 71.5310],
    speed: 42,
    speedLimit: 50,
    pax: 50,
    paxMax: 50,
    dmsAttention: "99% (Attentive)",
    status: "active",
    triggeredAt: "32 mins ago",
    timestamp: "21:28:44",
    detail: "Onboard passenger counter registered 50 passengers (100% capacity). Next stop boarding bypassed.",
    recommendedAction: "Dispatch trailing relief feeder bus.",
    logs: [
      { time: "21:28:44", text: "100% capacity threshold reached.", tone: "blue" },
    ],
  },
  {
    id: "ALT-9019",
    severity: "advisory",
    category: "Hardware / Telematics",
    title: "OBD-II Stream Packet Jitter",
    vehicleId: "PK-118",
    vehicleReg: "KP-PE-7723",
    driver: "Farhan Malik",
    driverCode: "DRV-2290",
    driverPhone: "+92 300 7788990",
    route: "Hayatabad Sector Route",
    location: "Phase 3 Commercial Market",
    pos: [33.9850, 71.4250],
    speed: 24,
    speedLimit: 40,
    pax: 22,
    paxMax: 45,
    dmsAttention: "96% (Normal)",
    status: "resolved",
    triggeredAt: "1 hr ago",
    timestamp: "20:55:12",
    detail: "Minor cellular telemetry handshake delay (3.2s). Stream re-synchronized automatically.",
    recommendedAction: "Resolved automatically by secondary GSM channel.",
    logs: [
      { time: "20:55:12", text: "Packet jitter > 2000ms logged.", tone: "blue" },
      { time: "20:56:01", text: "Switched to secondary Zong SIM. Connection healthy.", tone: "green" },
    ],
  },
];

/* Custom Map Marker Icon for Alert Point */
const createAlertIcon = (severity) => {
  const isCrit = severity === "critical";
  const bg = isCrit ? "#dc2626" : severity === "warning" ? "#d97706" : "#2563eb";
  const size = isCrit ? 16 : 12;

  return L.divIcon({
    className: "alt-divicon",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${bg};
      border: 2px solid #ffffff;
      box-shadow: 0 0 10px ${bg};
    "></div>`,
  });
};

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

const Alerts = () => {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [selectedId, setSelectedId] = useState("ALT-9041");
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [triageFilter, setTriageFilter] = useState("active");

  // Selected Alert
  const selectedAlert = useMemo(
    () => alerts.find((a) => a.id === selectedId) || alerts[0],
    [alerts, selectedId]
  );

  // Filtered Alerts
  const filteredAlerts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return alerts.filter((a) => {
      const matchSearch =
        !q ||
        a.id.toLowerCase().includes(q) ||
        a.vehicleId.toLowerCase().includes(q) ||
        a.vehicleReg.toLowerCase().includes(q) ||
        a.driver.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q);

      const matchSev = severityFilter === "all" || a.severity === severityFilter;
      const matchCat = categoryFilter === "all" || a.category.includes(categoryFilter);

      const matchTriage =
        triageFilter === "all" ||
        (triageFilter === "active" && a.status === "active") ||
        (triageFilter === "critical" && a.severity === "critical") ||
        (triageFilter === "speed" && a.category.includes("Speeding")) ||
        (triageFilter === "deviation" && a.category.includes("Route")) ||
        (triageFilter === "resolved" && a.status === "resolved");

      return matchSearch && matchSev && matchCat && matchTriage;
    });
  }, [alerts, searchQuery, severityFilter, categoryFilter, triageFilter]);

  // Actions
  const handleAcknowledge = (id, e) => {
    e?.stopPropagation();
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              logs: [
                ...a.logs,
                { time: new Date().toLocaleTimeString(), text: "Incident acknowledged by dispatcher.", tone: "blue" },
              ],
            }
          : a
      )
    );
    alert(`Incident ${id} acknowledged.`);
  };

  const handleResolve = (id, e) => {
    e?.stopPropagation();
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "resolved",
              logs: [
                ...a.logs,
                { time: new Date().toLocaleTimeString(), text: "Incident resolved and cleared.", tone: "green" },
              ],
            }
          : a
      )
    );
    alert(`Incident ${id} marked as RESOLVED.`);
  };

  const handleAcknowledgeAll = () => {
    setAlerts((prev) =>
      prev.map((a) => ({
        ...a,
        logs: [
          ...a.logs,
          { time: new Date().toLocaleTimeString(), text: "Bulk batch acknowledgement logged.", tone: "blue" },
        ],
      }))
    );
    alert("All active alerts acknowledged.");
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Incident ID",
      "Severity",
      "Category",
      "Title",
      "Vehicle ID",
      "Driver",
      "Location",
      "Speed (km/h)",
      "Status",
      "Timestamp",
    ];
    const lines = filteredAlerts.map((a) => [
      a.id,
      a.severity,
      `"${a.category}"`,
      `"${a.title}"`,
      a.vehicleId,
      `"${a.driver}"`,
      `"${a.location}"`,
      a.speed,
      a.status,
      a.timestamp,
    ]);
    const csv = [headers.join(","), ...lines.map((l) => l.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `safetrack-alerts-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 4 Top KPI Cards
  const kpis = useMemo(() => {
    const totalToday = 28;
    const activeCount = alerts.filter((a) => a.status === "active").length;
    const criticalCount = alerts.filter((a) => a.severity === "critical" && a.status === "active").length;
    const violationsCount = alerts.filter((a) => a.severity === "warning").length;

    return [
      {
        id: "total",
        label: "TOTAL INCIDENTS TODAY",
        icon: BellRing,
        value: `${totalToday}`,
        unit: "logged events",
        chip: `${activeCount} Active`,
        foot: "Real-time automated telematics capture",
        dot: "blue",
        accent: "blue",
      },
      {
        id: "critical",
        label: "CRITICAL SOS TRIGGERS",
        icon: Siren,
        value: String(criticalCount).padStart(2, "0"),
        unit: "active emergency",
        chip: "Priority 1",
        foot: "Police interceptors coordinated",
        dot: "red",
        accent: "red",
      },
      {
        id: "violations",
        label: "SAFETY & SPEED VIOLATIONS",
        icon: TriangleAlert,
        value: String(violationsCount).padStart(2, "0"),
        unit: "anomalies",
        chip: "ADAS & DMS",
        foot: "Driver drowsiness & speed alerts",
        dot: "amber",
        accent: "amber",
      },
      {
        id: "resolution",
        label: "AVG RESOLUTION TIME",
        icon: Clock,
        value: "4.2",
        unit: "minutes",
        chip: "SLA < 8.0 min",
        foot: "Target clearance SLA maintained",
        dot: "green",
        accent: "emerald",
      },
    ];
  }, [alerts]);

  return (
    <div className="alt-page">
      {/* ---------- Header ---------- */}
      <header className="alt-header">
        <div className="alt-header__text">
          <div className="alt-kicker">
            <TriangleAlert size={12} /> TELEMETRY &amp; SAFETY INCIDENTS • FLEET MONITORING DIVISION
          </div>
          <div className="alt-header__title-row">
            <h1>Alerts &amp; Telemetry Incidents</h1>
            <span className="alt-header__sep">•</span>
            <p className="alt-header__sub">
              Real-time public transport telemetry anomalies, driver safety violations, panic SOS triggers, and geofence breaches
            </p>
          </div>
        </div>

        <div className="alt-header__actions">
          <Button
            variant="outline"
            size="sm"
            className="alt-btn-soft"
            onClick={handleAcknowledgeAll}
          >
            <CheckCircle2 size={13} /> Acknowledge All ({alerts.filter((a) => a.status === "active").length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="alt-btn-soft"
            onClick={handleExportCSV}
          >
            <Download size={13} /> Export Incident Log (CSV)
          </Button>
          <Button
            size="sm"
            className="alt-btn-primary"
            onClick={() => alert("Alert configuration panel: speed thresholds set to 65km/h, geofence radius set to 300m.")}
          >
            <SlidersHorizontal size={13} /> Rule Thresholds
          </Button>
        </div>
      </header>

      {/* ---------- 4 KPI Cards ---------- */}
      <section className="alt-kpis">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.id} className="alt-card alt-kpi">
              <div className="alt-kpi__top">
                <span className="alt-kpi__label">{k.label}</span>
                <span className={`alt-kpi__icon alt-kpi__icon--${k.accent}`}>
                  <Icon size={12} strokeWidth={2.2} />
                </span>
              </div>

              <div className="alt-kpi__value">
                <strong className={k.accent === "red" ? "alt-red" : ""}>{k.value}</strong>
                {k.unit && <span>{k.unit}</span>}
                {k.chip && <em className={`alt-kpi__chip alt-kpi__chip--${k.accent}`}>{k.chip}</em>}
              </div>

              <p className="alt-kpi__foot">
                <i className={`alt-dot alt-dot--${k.dot}`} />
                {k.foot}
              </p>

              <div className="alt-kpi__bar">
                <div className={`alt-kpi__bar-fill alt-kpi__bar-fill--${k.accent}`} />
              </div>
            </Card>
          );
        })}
      </section>

      {/* ---------- Filters & Control Bar ---------- */}
      <Card className="alt-card alt-filters">
        <div className="alt-filters__row">
          <div className="alt-search">
            <Search size={13} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search incident ID, vehicle reg, driver name, or landmark…"
              className="alt-search__input"
            />
          </div>

          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="alt-select">
              <SelectValue placeholder="All Severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Severity: All Incidents</SelectItem>
              <SelectItem value="critical">Critical (SOS &amp; Panic)</SelectItem>
              <SelectItem value="warning">Warning (Speeding / DMS)</SelectItem>
              <SelectItem value="advisory">Advisory (Load / Hardware)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="alt-select">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Category: All Types</SelectItem>
              <SelectItem value="SOS">SOS / Emergency</SelectItem>
              <SelectItem value="Speeding">Speeding / ADAS</SelectItem>
              <SelectItem value="Route">Route Deviation</SelectItem>
              <SelectItem value="Driver">Driver Safety (DMS)</SelectItem>
              <SelectItem value="Capacity">Capacity / Load</SelectItem>
              <SelectItem value="Hardware">Hardware / Telematics</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="alt-filters__subrow">
          <div className="alt-triage">
            <span className="alt-triage__label">QUICK TRIAGE:</span>
            <button
              type="button"
              className={"alt-triage__chip" + (triageFilter === "active" ? " is-active" : "")}
              onClick={() => setTriageFilter("active")}
            >
              Active Pending ({alerts.filter((a) => a.status === "active").length})
            </button>
            <button
              type="button"
              className={"alt-triage__chip" + (triageFilter === "critical" ? " is-active" : "")}
              onClick={() => setTriageFilter("critical")}
            >
              Critical SOS ({alerts.filter((a) => a.severity === "critical").length})
            </button>
            <button
              type="button"
              className={"alt-triage__chip" + (triageFilter === "speed" ? " is-active" : "")}
              onClick={() => setTriageFilter("speed")}
            >
              Speeding ({alerts.filter((a) => a.category.includes("Speeding")).length})
            </button>
            <button
              type="button"
              className={"alt-triage__chip" + (triageFilter === "deviation" ? " is-active" : "")}
              onClick={() => setTriageFilter("deviation")}
            >
              Route Deviations ({alerts.filter((a) => a.category.includes("Route")).length})
            </button>
            <button
              type="button"
              className={"alt-triage__chip" + (triageFilter === "resolved" ? " is-active" : "")}
              onClick={() => setTriageFilter("resolved")}
            >
              Resolved ({alerts.filter((a) => a.status === "resolved").length})
            </button>
            <button
              type="button"
              className={"alt-triage__chip" + (triageFilter === "all" ? " is-active" : "")}
              onClick={() => setTriageFilter("all")}
            >
              All Events ({alerts.length})
            </button>
          </div>

          <div className="alt-record-count">
            Showing <strong>{filteredAlerts.length}</strong> of <strong>{alerts.length}</strong> incidents
          </div>
        </div>
      </Card>

      {/* ---------- Main Split Layout: Incidents Table (Left) + Selected Dossier (Right) ---------- */}
      <div className="alt-grid">
        {/* ===== Left: Alerts Registry Table ===== */}
        <div className="alt-col-main">
          <Card className="alt-card alt-tablecard">
            <div className="alt-tablewrap">
              <Table className="alt-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="alt-th-id">INCIDENT ID</TableHead>
                    <TableHead>SEVERITY</TableHead>
                    <TableHead>EVENT / VEHICLE</TableHead>
                    <TableHead>ASSIGNED OPERATOR</TableHead>
                    <TableHead>CORRIDOR LOCATION</TableHead>
                    <TableHead>TRIGGERED</TableHead>
                    <TableHead className="alt-th-act">ACTION</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredAlerts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="alt-empty">
                        No telemetry alerts match your current filter criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAlerts.map((a) => {
                      const isSelected = selectedAlert.id === a.id;
                      const isCrit = a.severity === "critical";
                      const isWarn = a.severity === "warning";

                      return (
                        <TableRow
                          key={a.id}
                          className={
                            "alt-row" +
                            (isSelected ? " alt-row--selected" : "") +
                            (isCrit ? " alt-row--critical" : "")
                          }
                          onClick={() => setSelectedId(a.id)}
                        >
                          <TableCell>
                            <span className="alt-code-badge">{a.id}</span>
                          </TableCell>

                          <TableCell>
                            <span
                              className={`alt-sev-pill alt-sev-pill--${
                                isCrit ? "red" : isWarn ? "amber" : "blue"
                              }`}
                            >
                              <i
                                className={`alt-dot alt-dot--${
                                  isCrit ? "red" : isWarn ? "amber" : "blue"
                                }`}
                              />
                              {a.severity.toUpperCase()}
                            </span>
                          </TableCell>

                          <TableCell>
                            <div className="alt-event-desc">
                              <strong>{a.title}</strong>
                              <span>
                                {a.vehicleId} • {a.vehicleReg}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="alt-driver-cell">
                              <strong>{a.driver}</strong>
                              <small>{a.driverCode}</small>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="alt-loc-cell">
                              <span>{a.location}</span>
                              <small>{a.route}</small>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="alt-time-cell">
                              <strong>{a.triggeredAt}</strong>
                              <small>{a.timestamp}</small>
                            </div>
                          </TableCell>

                          <TableCell className="alt-th-act" onClick={(e) => e.stopPropagation()}>
                            {a.status === "active" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="alt-btn-ack"
                                onClick={(e) => handleResolve(a.id, e)}
                              >
                                Resolve
                              </Button>
                            ) : (
                              <span className="alt-badge-cleared">
                                <Check size={11} /> Cleared
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* ===== Right: Incident Dossier & Response Action Panel ===== */}
        <div className="alt-col-side">
          <Card className="alt-card alt-dossier">
            {/* Dossier Header */}
            <div className="alt-dossier__head">
              <div className="alt-dossier__tag-row">
                <span className="alt-code-badge alt-code-badge--lg">{selectedAlert.id}</span>
                <span
                  className={`alt-sev-pill alt-sev-pill--${
                    selectedAlert.severity === "critical"
                      ? "red"
                      : selectedAlert.severity === "warning"
                      ? "amber"
                      : "blue"
                  }`}
                >
                  {selectedAlert.severity.toUpperCase()} • {selectedAlert.category}
                </span>
                <span className="alt-time-badge">{selectedAlert.triggeredAt}</span>
              </div>
              <h3>{selectedAlert.title}</h3>
              <p>{selectedAlert.detail}</p>
            </div>

            {/* Tactical Incident Map Preview */}
            <div className="alt-map-container">
              <MapContainer
                key={selectedAlert.id}
                center={selectedAlert.pos}
                zoom={13}
                scrollWheelZoom={false}
                className="alt-map__canvas"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                />
                <Marker position={selectedAlert.pos} icon={createAlertIcon(selectedAlert.severity)}>
                  <Popup className="alt-popup">
                    <strong>{selectedAlert.id}</strong>
                    <div>{selectedAlert.title}</div>
                    <div>Vehicle: {selectedAlert.vehicleId}</div>
                  </Popup>
                </Marker>
                <Circle
                  center={selectedAlert.pos}
                  radius={selectedAlert.severity === "critical" ? 800 : 400}
                  pathOptions={{
                    color: selectedAlert.severity === "critical" ? "#dc2626" : "#f59e0b",
                    fillColor: selectedAlert.severity === "critical" ? "#dc2626" : "#f59e0b",
                    fillOpacity: 0.15,
                  }}
                />
              </MapContainer>

              <div className="alt-map-overlay">
                <MapPin size={11} /> {selectedAlert.location}
              </div>
            </div>

            {/* Telematics Metrics Strip */}
            <div className="alt-telemetry-grid">
              <div className="alt-telemetry-item">
                <span className="alt-tel-lbl">SPEED / LIMIT</span>
                <strong>
                  {selectedAlert.speed}{" "}
                  <small>
                    / {selectedAlert.speedLimit} km/h
                  </small>
                </strong>
              </div>
              <div className="alt-telemetry-item">
                <span className="alt-tel-lbl">OCCUPANCY</span>
                <strong>
                  {selectedAlert.pax} <small>/ {selectedAlert.paxMax}</small>
                </strong>
              </div>
              <div className="alt-telemetry-item">
                <span className="alt-tel-lbl">DMS ATTENTION</span>
                <strong
                  className={
                    selectedAlert.dmsAttention.includes("Drowsy")
                      ? "alt-amber"
                      : "alt-green"
                  }
                >
                  {selectedAlert.dmsAttention}
                </strong>
              </div>
              <div className="alt-telemetry-item">
                <span className="alt-tel-lbl">STATUS</span>
                <strong
                  className={
                    selectedAlert.status === "active" ? "alt-red" : "alt-green"
                  }
                >
                  {selectedAlert.status.toUpperCase()}
                </strong>
              </div>
            </div>

            {/* Vehicle & Assigned Driver Details */}
            <div className="alt-driver-card">
              <div className="alt-driver-top">
                <User size={13} />
                <span>OPERATOR IN COMMAND: {selectedAlert.driver}</span>
              </div>
              <div className="alt-driver-grid">
                <div>
                  <span className="alt-lbl">VEHICLE</span>
                  <strong>{selectedAlert.vehicleId} ({selectedAlert.vehicleReg})</strong>
                </div>
                <div>
                  <span className="alt-lbl">DRIVER PHONE</span>
                  <a href={`tel:${selectedAlert.driverPhone.replace(/\s/g, "")}`}>
                    {selectedAlert.driverPhone}
                  </a>
                </div>
                <div>
                  <span className="alt-lbl">CORRIDOR</span>
                  <span>{selectedAlert.route}</span>
                </div>
                <div>
                  <span className="alt-lbl">CREDENTIALS</span>
                  <span>Badge {selectedAlert.driverCode} • HTV</span>
                </div>
              </div>
            </div>

            {/* Recommended Protocol Box */}
            <div className="alt-protocol-box">
              <div className="alt-protocol-title">
                <ShieldAlert size={12} />
                <span>RECOMMENDED PROTOCOL DISPATCH</span>
              </div>
              <p>{selectedAlert.recommendedAction}</p>
            </div>

            {/* Incident Audit Log */}
            <div className="alt-logs-section">
              <span className="alt-logs-title">REAL-TIME INCIDENT AUDIT TRAIL</span>
              <ul className="alt-logs-list">
                {selectedAlert.logs.map((l, i) => (
                  <li key={i} className="alt-log-item">
                    <time>{l.time}</time>
                    <i className={`alt-dot alt-dot--${l.tone}`} />
                    <span>{l.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Operational Direct Actions */}
            <div className="alt-dossier-actions">
              <Button
                variant="outline"
                size="sm"
                className="alt-btn-act"
                onClick={() => (window.location.href = `tel:${selectedAlert.driverPhone.replace(/\s/g, "")}`)}
              >
                <Phone size={12} /> Call Driver
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="alt-btn-act"
                onClick={() => alert(`Redirecting to CCTV live stream for ${selectedAlert.vehicleId}`)}
              >
                <Video size={12} /> CCTV Feed
              </Button>
              {selectedAlert.status === "active" ? (
                <Button
                  size="sm"
                  className="alt-btn-resolve"
                  onClick={(e) => handleResolve(selectedAlert.id, e)}
                >
                  <CheckCircle2 size={12} /> Resolve &amp; Clear
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="alt-btn-act"
                  disabled
                >
                  Incident Cleared
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
