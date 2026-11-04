import React, { useMemo, useState } from "react";
import {
  Activity,
  Award,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Phone,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  TriangleAlert,
  User,
  Video,
  Zap,
  TrendingUp,
  TrendingDown,
  Gauge,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Bus,
  Check,
  Calendar,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

import "./driver_behavior.css";

/* ================================================================== */
/*  Driver Behavior & Telematics Dataset                              */
/* ================================================================== */

const DRIVERS_DATA = [
  {
    id: "DRV-4412",
    name: "Muhammad Ali",
    license: "KPK-68910-HTV",
    cnic: "17301-4491029-1",
    phone: "+92 300 5541920",
    vehicleId: "PK-102",
    vehicleReg: "KP-LE-4091",
    route: "Peshawar ⇄ Mardan (N-5)",
    safetyScore: 96.4,
    grade: "Grade A Platinum",
    tier: "platinum",
    dmsAttention: 99.1,
    speedCompliance: 98.2,
    harshBrakingToday: 0,
    harshAccelToday: 1,
    fatigueAlertsToday: 0,
    phoneUseCount: 0,
    totalKmToday: 148,
    incidentsCount: 0,
    weeklyScores: [95, 96, 94, 97, 96, 98, 96],
    events: [
      { time: "08:15", type: "info", text: "Pre-trip vehicle safety inspection completed 100%." },
      { time: "11:42", type: "warn", text: "Minor acceleration surge (0.34G) entering N-5 toll plaza." },
      { time: "16:10", type: "good", text: "Defensive braking maneuver safely avoided erratic pedestrian." },
    ],
  },
  {
    id: "DRV-3810",
    name: "Arshad Khan",
    license: "KPK-71201-HTV",
    cnic: "17301-6629103-3",
    phone: "+92 301 9922334",
    vehicleId: "PK-101",
    vehicleReg: "KP-LE-2180",
    route: "Peshawar ⇄ Nowshera Cantt",
    safetyScore: 97.8,
    grade: "Grade A Platinum",
    tier: "platinum",
    dmsAttention: 98.5,
    speedCompliance: 99.4,
    harshBrakingToday: 0,
    harshAccelToday: 0,
    fatigueAlertsToday: 0,
    phoneUseCount: 0,
    totalKmToday: 162,
    incidentsCount: 0,
    weeklyScores: [97, 98, 96, 98, 97, 99, 98],
    events: [
      { time: "07:30", type: "info", text: "Duty shift commenced on GT Road eastern feeder." },
      { time: "14:20", type: "good", text: "100% adherence to posted 65 km/h corridor speed limits." },
    ],
  },
  {
    id: "DRV-5012",
    name: "Bilal Ahmad",
    license: "KPK-99412-HTV",
    cnic: "17301-3391820-7",
    phone: "+92 312 8844221",
    vehicleId: "PK-221",
    vehicleReg: "KP-MN-9921",
    route: "Ring Road Circular",
    safetyScore: 82.5,
    grade: "Grade C Caution",
    tier: "caution",
    dmsAttention: 84.0,
    speedCompliance: 86.1,
    harshBrakingToday: 4,
    harshAccelToday: 3,
    fatigueAlertsToday: 2,
    phoneUseCount: 1,
    totalKmToday: 124,
    incidentsCount: 3,
    weeklyScores: [88, 86, 85, 84, 83, 81, 82],
    events: [
      { time: "10:14", type: "warn", text: "Harsh braking event (0.46G) near Gulbahar flyover." },
      { time: "13:28", type: "crit", text: "DMS micro-sleep / fatigue yawn frequency exceeded threshold." },
      { time: "15:45", type: "warn", text: "Speed exceeded: 78 km/h sustained in 60 km/h corridor." },
    ],
  },
  {
    id: "DRV-1982",
    name: "Zubair Shah",
    license: "KPK-45129-LTV",
    cnic: "17301-1192837-5",
    phone: "+92 333 4455667",
    vehicleId: "PK-145",
    vehicleReg: "KP-CD-3301",
    route: "Peshawar ⇄ Charsadda Road",
    safetyScore: 91.2,
    grade: "Grade B Gold",
    tier: "gold",
    dmsAttention: 94.2,
    speedCompliance: 92.8,
    harshBrakingToday: 1,
    harshAccelToday: 2,
    fatigueAlertsToday: 0,
    phoneUseCount: 0,
    totalKmToday: 110,
    incidentsCount: 1,
    weeklyScores: [92, 90, 93, 91, 89, 92, 91],
    events: [
      { time: "09:05", type: "info", text: "Departed Shama Chowk terminal on schedule." },
      { time: "12:50", type: "warn", text: "Corridor boundary deviation (450m) logged near Naguman." },
    ],
  },
  {
    id: "DRV-7719",
    name: "Kamran Jan",
    license: "KPK-66190-HTV",
    cnic: "17101-7729102-9",
    phone: "+92 345 1199887",
    vehicleId: "PK-331",
    vehicleReg: "KP-PE-8812",
    route: "City Terminal Shuttles",
    safetyScore: 88.6,
    grade: "Grade B Gold",
    tier: "gold",
    dmsAttention: 89.0,
    speedCompliance: 94.0,
    harshBrakingToday: 2,
    harshAccelToday: 1,
    fatigueAlertsToday: 1,
    phoneUseCount: 0,
    totalKmToday: 95,
    incidentsCount: 1,
    weeklyScores: [89, 87, 88, 90, 89, 88, 88],
    events: [
      { time: "11:15", type: "warn", text: "Cabin DMS haptic alert: Prolonged blink duration." },
      { time: "14:02", type: "info", text: "Depot rest break logged (25 mins)." },
    ],
  },
  {
    id: "DRV-6120",
    name: "Naveed Qureshi",
    license: "KPK-33019-HTV",
    cnic: "17301-5501928-1",
    phone: "+92 302 7766554",
    vehicleId: "PK-108",
    vehicleReg: "KP-LE-1144",
    route: "BRT Feeder Line 2",
    safetyScore: 98.4,
    grade: "Grade A Platinum",
    tier: "platinum",
    dmsAttention: 99.6,
    speedCompliance: 99.8,
    harshBrakingToday: 0,
    harshAccelToday: 0,
    fatigueAlertsToday: 0,
    phoneUseCount: 0,
    totalKmToday: 155,
    incidentsCount: 0,
    weeklyScores: [98, 99, 98, 97, 99, 98, 98],
    events: [
      { time: "06:00", type: "info", text: "Commenced BRT Feeder Line 2 service on-time." },
      { time: "16:30", type: "good", text: "Zero speed or braking anomalies across 155 km." },
    ],
  },
];

/* Helper for initials */
const initials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

const DriverBehavior = () => {
  const [drivers, setDrivers] = useState(DRIVERS_DATA);
  const [selectedId, setSelectedId] = useState("DRV-4412");
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [routeFilter, setRouteFilter] = useState("all");
  const [triageFilter, setTriageFilter] = useState("all");

  // Selected Driver
  const selectedDriver = useMemo(
    () => drivers.find((d) => d.id === selectedId) || drivers[0],
    [drivers, selectedId]
  );

  // Filters
  const filteredDrivers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return drivers.filter((d) => {
      const matchSearch =
        !q ||
        d.id.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q) ||
        d.license.toLowerCase().includes(q) ||
        d.vehicleId.toLowerCase().includes(q) ||
        d.route.toLowerCase().includes(q);

      const matchTier = tierFilter === "all" || d.tier === tierFilter;
      const matchRoute = routeFilter === "all" || d.route.includes(routeFilter);

      const matchTriage =
        triageFilter === "all" ||
        (triageFilter === "platinum" && d.tier === "platinum") ||
        (triageFilter === "caution" && d.tier === "caution") ||
        (triageFilter === "fatigue" && d.fatigueAlertsToday > 0) ||
        (triageFilter === "braking" && d.harshBrakingToday > 0);

      return matchSearch && matchTier && matchRoute && matchTriage;
    });
  }, [drivers, searchQuery, tierFilter, routeFilter, triageFilter]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Badge ID",
      "Driver Name",
      "License",
      "Assigned Vehicle",
      "Route",
      "Safety Score",
      "Grade Tier",
      "DMS Attention (%)",
      "Speed Compliance (%)",
      "Harsh Braking Today",
      "Fatigue Alerts Today",
    ];
    const lines = filteredDrivers.map((d) => [
      d.id,
      `"${d.name}"`,
      d.license,
      d.vehicleId,
      `"${d.route}"`,
      d.safetyScore,
      `"${d.grade}"`,
      d.dmsAttention,
      d.speedCompliance,
      d.harshBrakingToday,
      d.fatigueAlertsToday,
    ]);
    const csvContent = [headers.join(","), ...lines.map((l) => l.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `driver-safety-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 4 Top KPI Cards
  const kpis = [
    {
      id: "avgScore",
      label: "FLEET AVG SAFETY SCORE",
      icon: Award,
      value: "94.2",
      unit: "/ 100",
      chip: "+1.4% vs last week",
      foot: "Benchmark target > 90.0 SLA",
      dot: "blue",
      accent: "blue",
    },
    {
      id: "braking",
      label: "HARSH BRAKING & ACCEL",
      icon: Gauge,
      value: "18",
      unit: "events today",
      chip: "-6.2% vs yesterday",
      foot: "0.4 events per 100 km fleet rate",
      dot: "green",
      accent: "emerald",
    },
    {
      id: "dms",
      label: "DMS FATIGUE & DISTRACTION",
      icon: Eye,
      value: "04",
      unit: "flagged events",
      chip: "2 Drowsy, 2 Phone",
      foot: "Continuous facial attention AI",
      dot: "amber",
      accent: "amber",
    },
    {
      id: "speeding",
      label: "OVER-SPEEDING VIOLATIONS",
      icon: TriangleAlert,
      value: "03",
      unit: "breaches",
      chip: "> 65 km/h zone",
      foot: "All drivers warned via cabin display",
      dot: "red",
      accent: "red",
    },
  ];

  return (
    <div className="dbv-page">
      {/* ---------- Header ---------- */}
      <header className="dbv-header">
        <div className="dbv-header__text">
          <div className="dbv-kicker">
            <Activity size={12} /> TELEMETRICS &amp; OPERATOR COMPLIANCE • DRIVER BEHAVIOR SCORING (DMS)
          </div>
          <div className="dbv-header__title-row">
            <h1>Driver Behavior &amp; Safety Analytics</h1>
            <span className="dbv-header__sep">•</span>
            <p className="dbv-header__sub">
              Continuous telematics profiling, AI facial attentiveness (DMS), harsh braking, speed compliance, and safety scorecard
            </p>
          </div>
        </div>

        <div className="dbv-header__actions">
          <Button
            variant="outline"
            size="sm"
            className="dbv-btn-soft"
            onClick={handleExportCSV}
          >
            <Download size={13} /> Export Safety Audit (CSV)
          </Button>
          <Button
            size="sm"
            className="dbv-btn-primary"
            onClick={() => alert("Defensive driving safety refresher scheduled for all Grade C drivers.")}
          >
            <Calendar size={13} /> Schedule Briefing
          </Button>
        </div>
      </header>

      {/* ---------- 4 KPI Cards ---------- */}
      <section className="dbv-kpis">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.id} className="dbv-card dbv-kpi">
              <div className="dbv-kpi__top">
                <span className="dbv-kpi__label">{k.label}</span>
                <span className={`dbv-kpi__icon dbv-kpi__icon--${k.accent}`}>
                  <Icon size={12} strokeWidth={2.2} />
                </span>
              </div>

              <div className="dbv-kpi__value">
                <strong>{k.value}</strong>
                {k.unit && <span>{k.unit}</span>}
                {k.chip && <em className={`dbv-kpi__chip dbv-kpi__chip--${k.accent}`}>{k.chip}</em>}
              </div>

              <p className="dbv-kpi__foot">
                <i className={`dbv-dot dbv-dot--${k.dot}`} />
                {k.foot}
              </p>

              <div className="dbv-kpi__bar">
                <div className={`dbv-kpi__bar-fill dbv-kpi__bar-fill--${k.accent}`} />
              </div>
            </Card>
          );
        })}
      </section>

      {/* ---------- Filters Control Bar ---------- */}
      <Card className="dbv-card dbv-filters">
        <div className="dbv-filters__row">
          <div className="dbv-search">
            <Search size={13} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search driver name, badge ID, license, or vehicle…"
              className="dbv-search__input"
            />
          </div>

          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="dbv-select">
              <SelectValue placeholder="All Safety Tiers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tier: All Safety Grades</SelectItem>
              <SelectItem value="platinum">Grade A Platinum (&gt; 95)</SelectItem>
              <SelectItem value="gold">Grade B Gold (85 – 94)</SelectItem>
              <SelectItem value="caution">Grade C Caution (&lt; 85)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={routeFilter} onValueChange={setRouteFilter}>
            <SelectTrigger className="dbv-select">
              <SelectValue placeholder="All Corridors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Corridor: All Routes</SelectItem>
              <SelectItem value="Mardan">Peshawar ⇄ Mardan</SelectItem>
              <SelectItem value="Nowshera">Peshawar ⇄ Nowshera</SelectItem>
              <SelectItem value="Charsadda">Peshawar ⇄ Charsadda</SelectItem>
              <SelectItem value="Ring Road">Ring Road Circular</SelectItem>
              <SelectItem value="BRT">BRT Feeder Line 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="dbv-filters__subrow">
          <div className="dbv-triage">
            <span className="dbv-triage__label">QUICK FILTERS:</span>
            <button
              type="button"
              className={"dbv-triage__chip" + (triageFilter === "all" ? " is-active" : "")}
              onClick={() => setTriageFilter("all")}
            >
              All Drivers ({drivers.length})
            </button>
            <button
              type="button"
              className={"dbv-triage__chip" + (triageFilter === "platinum" ? " is-active" : "")}
              onClick={() => setTriageFilter("platinum")}
            >
              Platinum Grade A ({drivers.filter((d) => d.tier === "platinum").length})
            </button>
            <button
              type="button"
              className={"dbv-triage__chip" + (triageFilter === "caution" ? " is-active" : "")}
              onClick={() => setTriageFilter("caution")}
            >
              Caution / Remedial ({drivers.filter((d) => d.tier === "caution").length})
            </button>
            <button
              type="button"
              className={"dbv-triage__chip" + (triageFilter === "fatigue" ? " is-active" : "")}
              onClick={() => setTriageFilter("fatigue")}
            >
              DMS Fatigue Alert ({drivers.filter((d) => d.fatigueAlertsToday > 0).length})
            </button>
            <button
              type="button"
              className={"dbv-triage__chip" + (triageFilter === "braking" ? " is-active" : "")}
              onClick={() => setTriageFilter("braking")}
            >
              Harsh Braking ({drivers.filter((d) => d.harshBrakingToday > 0).length})
            </button>
          </div>

          <div className="dbv-record-count">
            Showing <strong>{filteredDrivers.length}</strong> of <strong>{drivers.length}</strong> operators
          </div>
        </div>
      </Card>

      {/* ---------- Main Split Grid: Drivers Table (Left) + Selected Profile Dossier (Right) ---------- */}
      <div className="dbv-grid">
        {/* ===== Left: Table Column ===== */}
        <div className="dbv-col-main">
          <Card className="dbv-card dbv-tablecard">
            <div className="dbv-tablewrap">
              <Table className="dbv-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>OPERATOR</TableHead>
                    <TableHead>VEHICLE &amp; ROUTE</TableHead>
                    <TableHead>SAFETY SCORE</TableHead>
                    <TableHead>DMS ATTENTION</TableHead>
                    <TableHead>BRAKING / ACCEL</TableHead>
                    <TableHead>SPEED SLA</TableHead>
                    <TableHead>STATUS TIER</TableHead>
                    <TableHead className="dbv-th-act" />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredDrivers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="dbv-empty">
                        No operators match your filter criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDrivers.map((d) => {
                      const isSelected = selectedDriver.id === d.id;
                      const isCaution = d.tier === "caution";
                      const isGold = d.tier === "gold";

                      return (
                        <TableRow
                          key={d.id}
                          className={
                            "dbv-row" +
                            (isSelected ? " dbv-row--selected" : "") +
                            (isCaution ? " dbv-row--caution" : "")
                          }
                          onClick={() => setSelectedId(d.id)}
                        >
                          <TableCell>
                            <div className="dbv-driver-cell">
                              <Avatar className="dbv-avatar">
                                <AvatarFallback>{initials(d.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <strong>{d.name}</strong>
                                <span>{d.id} • {d.license}</span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="dbv-route-cell">
                              <span className="dbv-veh-badge">{d.vehicleId}</span>
                              <small>{d.route}</small>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="dbv-score-cell">
                              <strong className={isCaution ? "alt-red" : isGold ? "alt-amber" : "alt-green"}>
                                {d.safetyScore}
                              </strong>
                              <div className="dbv-score-bar">
                                <div
                                  className={`dbv-score-fill dbv-score-fill--${d.tier}`}
                                  style={{ width: `${d.safetyScore}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className="dbv-dms-tag">
                              <Eye size={11} /> {d.dmsAttention}%
                            </span>
                          </TableCell>

                          <TableCell>
                            <span className="dbv-stat-num">
                              {d.harshBrakingToday} brake / {d.harshAccelToday} accel
                            </span>
                          </TableCell>

                          <TableCell>
                            <span className="dbv-speed-sla">
                              {d.speedCompliance}% Compliant
                            </span>
                          </TableCell>

                          <TableCell>
                            <span className={`dbv-tier-pill dbv-tier-pill--${d.tier}`}>
                              <i className={`dbv-dot dbv-dot--${d.tier === "platinum" ? "blue" : d.tier === "gold" ? "green" : "red"}`} />
                              {d.grade.split(" ")[1]}
                            </span>
                          </TableCell>

                          <TableCell className="dbv-th-act" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="dbv-btn-arrow"
                              onClick={() => setSelectedId(d.id)}
                            >
                              <ChevronRight size={14} />
                            </Button>
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

        {/* ===== Right: Selected Driver Dossier & Telematics Profile ===== */}
        <div className="dbv-col-side">
          <Card className="dbv-card dbv-dossier">
            {/* Header */}
            <div className="dbv-dossier__head">
              <div className="dbv-dossier__top-row">
                <Avatar className="dbv-dossier__avatar">
                  <AvatarFallback>{initials(selectedDriver.name)}</AvatarFallback>
                </Avatar>
                <div className="dbv-dossier__name-box">
                  <div className="dbv-dossier__badge-row">
                    <span className="dbv-code-badge">{selectedDriver.id}</span>
                    <span className={`dbv-tier-pill dbv-tier-pill--${selectedDriver.tier}`}>
                      {selectedDriver.grade}
                    </span>
                  </div>
                  <h3>{selectedDriver.name}</h3>
                  <p>License: {selectedDriver.license} • CNIC: {selectedDriver.cnic}</p>
                </div>
              </div>
            </div>

            {/* Quick 4 Metrics Strip */}
            <div className="dbv-telemetry-grid">
              <div className="dbv-telemetry-item">
                <span className="dbv-tel-lbl">SAFETY SCORE</span>
                <strong className={selectedDriver.tier === "caution" ? "alt-red" : "alt-green"}>
                  {selectedDriver.safetyScore} <small>/100</small>
                </strong>
              </div>
              <div className="dbv-telemetry-item">
                <span className="dbv-tel-lbl">DMS ATTENTION</span>
                <strong>{selectedDriver.dmsAttention}%</strong>
              </div>
              <div className="dbv-telemetry-item">
                <span className="dbv-tel-lbl">SPEED SLA</span>
                <strong>{selectedDriver.speedCompliance}%</strong>
              </div>
              <div className="dbv-telemetry-item">
                <span className="dbv-tel-lbl">KM LOGGED</span>
                <strong>{selectedDriver.totalKmToday} <small>km</small></strong>
              </div>
            </div>

            {/* Assigned Vehicle & Route Card */}
            <div className="dbv-assign-card">
              <div className="dbv-assign-title">
                <Bus size={12} />
                <span>CURRENT VEHICLE &amp; CORRIDOR DISPATCH</span>
              </div>
              <div className="dbv-assign-grid">
                <div>
                  <span className="dbv-lbl">VEHICLE ID</span>
                  <strong>{selectedDriver.vehicleId} ({selectedDriver.vehicleReg})</strong>
                </div>
                <div>
                  <span className="dbv-lbl">MOBILE CONTACT</span>
                  <a href={`tel:${selectedDriver.phone.replace(/\s/g, "")}`}>
                    {selectedDriver.phone}
                  </a>
                </div>
                <div>
                  <span className="dbv-lbl">ASSIGNED CORRIDOR</span>
                  <span>{selectedDriver.route}</span>
                </div>
                <div>
                  <span className="dbv-lbl">BRAKE EVENTS TODAY</span>
                  <span>{selectedDriver.harshBrakingToday} Harsh Decels</span>
                </div>
              </div>
            </div>

            {/* 7-Day Performance Trend Chart */}
            <div className="dbv-trend-card">
              <div className="dbv-trend-head">
                <span className="dbv-trend-title">
                  <TrendingUp size={12} /> 7-DAY SAFETY SCORE TREND
                </span>
                <span className="dbv-trend-avg">7-Day Avg: {(selectedDriver.weeklyScores.reduce((a, b) => a + b, 0) / 7).toFixed(1)}%</span>
              </div>
              <div className="dbv-trend-bars">
                {selectedDriver.weeklyScores.map((score, idx) => {
                  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"];
                  return (
                    <div key={idx} className="dbv-bar-col">
                      <div className="dbv-bar-track">
                        <div
                          className="dbv-bar-fill"
                          style={{
                            height: `${score - 70 > 0 ? (score - 70) * 3.3 : 10}%`,
                            background: score >= 95 ? "#2563eb" : score >= 88 ? "#10b981" : "#f59e0b",
                          }}
                        />
                      </div>
                      <span className="dbv-bar-lbl">{days[idx]}</span>
                      <small className="dbv-bar-val">{score}</small>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Telemetry Events Log */}
            <div className="dbv-events-card">
              <span className="dbv-events-title">TODAY'S DRIVING TELEMETRY LOG</span>
              <ul className="dbv-events-list">
                {selectedDriver.events.map((ev, i) => (
                  <li key={i} className="dbv-event-item">
                    <time>{ev.time}</time>
                    <i
                      className={`dbv-dot dbv-dot--${
                        ev.type === "crit" ? "red" : ev.type === "warn" ? "amber" : "green"
                      }`}
                    />
                    <span>{ev.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Operational Actions */}
            <div className="dbv-dossier-actions">
              <Button
                variant="outline"
                size="sm"
                className="dbv-btn-act"
                onClick={() => (window.location.href = `tel:${selectedDriver.phone.replace(/\s/g, "")}`)}
              >
                <Phone size={12} /> Call Cabin
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="dbv-btn-act"
                onClick={() => alert(`Redirecting to live DMS Camera feed for ${selectedDriver.vehicleId}`)}
              >
                <Video size={12} /> DMS Feed
              </Button>
              <Button
                size="sm"
                className="dbv-btn-commend"
                onClick={() => alert(`Commendation & Safety Bonus logged for ${selectedDriver.name}`)}
              >
                <Award size={12} /> Commend
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DriverBehavior;
